import { BATIK_DATASET_20, BatikMotif } from "@/data/batikDataset";
import classMappingData from "@/data/class_mapping.json";

export interface ClassPrediction {
  classId: number;
  key: string;
  name: string;
  confidence: number; // 0 to 100 percentage
  rawProb: number;
  motif?: BatikMotif;
}

export interface ClassificationResult {
  top1: ClassPrediction;
  top3: ClassPrediction[];
  allRanked: ClassPrediction[];
  inferenceTimeMs: number; // Waktu inferensi murni (forward-pass model neural network)
  preprocessTimeMs: number; // Waktu resize canvas & normalisasi tensor
  totalTimeMs: number; // Total end-to-end latency
  device: string;
}

// Module-level cache for singleton ONNX session
let ortModule: typeof import("onnxruntime-web") | null = null;
let inferenceSession: any = null;
let isInitializing = false;
let initPromise: Promise<any> | null = null;

// Serialized queue to guarantee single-thread re-entrancy on WebAssembly runtime
let runQueue: Promise<any> = Promise.resolve();

/**
 * Executes session.run in a strict sequential queue to prevent
 * "Session already started" and "Session mismatch" WebAssembly concurrency errors.
 */
async function runSessionSerialized(session: any, feeds: Record<string, any>): Promise<any> {
  const currentRun = runQueue.then(async () => {
    return await session.run(feeds);
  });
  // Maintain queue continuity even if an individual inference pass encounters an error
  runQueue = currentRun.catch(() => {});
  return currentRun;
}

/**
 * Initializes and warms up the ONNX Runtime WebAssembly inference session.
 * Uses single-threaded WASM to avoid SharedArrayBuffer COOP/COEP isolation requirements.
 */
export async function getInferenceSession() {
  if (inferenceSession) {
    return inferenceSession;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      if (typeof window === "undefined") {
        throw new Error("ONNX WebAssembly inference only runs in browser client.");
      }

      // Dynamic import to prevent SSR bundling issues
      if (!ortModule) {
        ortModule = await import("onnxruntime-web");
        // Use official CDN to keep git repository lightweight while ensuring browser caching
        ortModule.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
        // Single thread is standard and avoids browser SharedArrayBuffer cross-origin restriction
        ortModule.env.wasm.numThreads = 1;
      }

      const modelUrl = "/models/batik_efficientnet.onnx";
      console.log(`[Batik Lens AI] Loading ONNX model from: ${modelUrl}`);

      inferenceSession = await ortModule.InferenceSession.create(modelUrl, {
        executionProviders: ["wasm"],
        graphOptimizationLevel: "all",
      });

      // Warmup forward-pass with a dummy tensor to prime JIT & WebAssembly heap
      try {
        const dummyTensor = new ortModule.Tensor("float32", new Float32Array(1 * 3 * 224 * 224), [1, 3, 224, 224]);
        await runSessionSerialized(inferenceSession, { input: dummyTensor });
        console.log("[Batik Lens AI] ONNX Session warmed up successfully.");
      } catch (warmupErr) {
        console.warn("[Batik Lens AI] Warmup run skipped:", warmupErr);
      }

      console.log("[Batik Lens AI] ONNX Session successfully created & ready.");
      return inferenceSession;
    } catch (err) {
      console.error("[Batik Lens AI] Failed to initialize ONNX session:", err);
      throw err;
    } finally {
      isInitializing = false;
    }
  })();

  return initPromise;
}

/**
 * Preload the model in the background (e.g. on page mount) to ensure instant inference.
 */
export function preloadClassifier(): void {
  if (typeof window !== "undefined") {
    getInferenceSession().catch((err) => {
      console.warn("[Batik Lens AI] Preloading model deferred/failed:", err);
    });
  }
}

/**
 * Converts any image source (URL, File, Blob, Image element) into an HTMLImageElement.
 */
function loadImage(source: string | File | Blob | HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLImageElement) {
      if (source.complete && source.naturalWidth > 0) {
        resolve(source);
      } else {
        source.onload = () => resolve(source);
        source.onerror = (e) => reject(new Error(`Failed to load image element: ${e}`));
      }
      return;
    }

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Could not load image: ${e}`));

    if (typeof source === "string") {
      img.src = source;
    } else if (source instanceof Blob) {
      img.src = URL.createObjectURL(source);
    } else {
      reject(new Error("Unsupported image source type."));
    }
  });
}

/**
 * Preprocesses image to 224x224 RGB Float32Array in NCHW format [1, 3, 224, 224],
 * matching PyTorch torchvision transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).
 */
function preprocessToFloat32Array(img: HTMLImageElement): Float32Array {
  const targetSize = 224;
  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    throw new Error("Failed to get 2D canvas context for image preprocessing.");
  }

  // Draw and scale to 224x224
  ctx.drawImage(img, 0, 0, targetSize, targetSize);
  const imageData = ctx.getImageData(0, 0, targetSize, targetSize);
  const rgba = imageData.data;

  const pixelCount = targetSize * targetSize;
  const float32Data = new Float32Array(3 * pixelCount);

  // Normalization parameters from PyTorch / ImageNet
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];

  // Arrange into NCHW format: [1, 3, 224, 224]
  // Channel 0 (R): indices 0 to pixelCount - 1
  // Channel 1 (G): indices pixelCount to 2*pixelCount - 1
  // Channel 2 (B): indices 2*pixelCount to 3*pixelCount - 1
  for (let i = 0; i < pixelCount; i++) {
    const r = rgba[i * 4] / 255.0;
    const g = rgba[i * 4 + 1] / 255.0;
    const b = rgba[i * 4 + 2] / 255.0;

    float32Data[i] = (r - mean[0]) / std[0];
    float32Data[pixelCount + i] = (g - mean[1]) / std[1];
    float32Data[2 * pixelCount + i] = (b - mean[2]) / std[2];
  }

  return float32Data;
}

/**
 * Numerically stable Softmax function
 */
function softmax(logits: Float32Array | number[]): number[] {
  const arr = Array.from(logits);
  const max = Math.max(...arr);
  const exps = arr.map((x) => Math.exp(x - max));
  const sum = exps.reduce((acc, val) => acc + val, 0);
  return exps.map((val) => val / sum);
}

/**
 * Classifies a batik image using the trained EfficientNet-B0 ONNX model.
 */
export async function classifyBatikImage(
  source: string | File | Blob | HTMLImageElement
): Promise<ClassificationResult> {
  const overallStart = performance.now();

  const [session, img] = await Promise.all([
    getInferenceSession(),
    loadImage(source),
  ]);

  if (!ortModule) {
    throw new Error("ONNX Runtime module is not loaded.");
  }

  // Preprocess input tensor (Canvas resize 224x224 & normalization)
  const preprocessStart = performance.now();
  const float32Data = preprocessToFloat32Array(img);
  const inputTensor = new ortModule.Tensor("float32", float32Data, [1, 3, 224, 224]);
  const preprocessTimeMs = Math.round((performance.now() - preprocessStart) * 10) / 10;

  // Run model inference (Pure forward-pass execution latency via serialized queue)
  const inferenceStart = performance.now();
  const results = await runSessionSerialized(session, { input: inputTensor });
  const inferenceTimeMs = Math.round((performance.now() - inferenceStart) * 10) / 10;

  const outputTensor = results.output;
  const logits = outputTensor.data as Float32Array;

  const probs = softmax(logits);

  // Map to class list with cultural metadata
  const classList = classMappingData.classes;
  const ranked: ClassPrediction[] = classList
    .map((cls) => {
      const prob = probs[cls.id] ?? 0;
      const motifData = BATIK_DATASET_20.find(
        (m) => m.id === cls.key || m.rawId === cls.key || m.name.toLowerCase() === cls.name.toLowerCase()
      );

      return {
        classId: cls.id,
        key: cls.key,
        name: cls.name,
        rawProb: prob,
        confidence: Math.round(prob * 1000) / 10, // e.g. 97.4%
        motif: motifData,
      };
    })
    .sort((a, b) => b.rawProb - a.rawProb);

  const totalTimeMs = Math.round(performance.now() - overallStart);

  return {
    top1: ranked[0],
    top3: ranked.slice(0, 3),
    allRanked: ranked,
    inferenceTimeMs,
    preprocessTimeMs,
    totalTimeMs,
    device: "Edge AI • WebAssembly (ONNX)",
  };
}
