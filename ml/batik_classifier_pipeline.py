# %% [markdown]
# # Batik Kita: 20-Class Motif Classification Pipeline
# 
# **Author / Team:** Batik Kita (HOLOGY 9.0)  
# **Backbone Model:** EfficientNet-B0 (Transfer Learning)  
# **Dataset Path:** `/kaggle/input/datasets/raykapranandita/batik-clean/processed_dataset`  
# **Hardware Target:** Kaggle Tesla T4 (Single Dedicated GPU with FP16 Tensor Cores)

# %% [markdown]
# ## 1. Dependencies & Environment Setup

# %%
import os
import json
import time
import copy
import random
from dataclasses import dataclass

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from PIL import Image

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

print(f"PyTorch Version   : {torch.__version__}")
print(f"CUDA Available    : {torch.cuda.is_available()}")
if torch.cuda.is_available():
    device_count = torch.cuda.device_count()
    print(f"Device Count      : {device_count}")
    for i in range(device_count):
        print(f"  GPU {i}           : {torch.cuda.get_device_name(i)}")

# %% [markdown]
# ## 2. Global Configuration & Hardware Setup

# %%
@dataclass
class Config:
    # Primary Kaggle dataset path with clean local fallbacks
    DATA_DIR: str = (
        "/kaggle/input/datasets/raykapranandita/batik-clean/processed_dataset"
        if os.path.exists("/kaggle/input/datasets/raykapranandita/batik-clean/processed_dataset")
        else ("./processed_dataset" if os.path.exists("./processed_dataset") else "../dataset/processed_dataset")
    )
    
    # Hyperparameters tuned for Kaggle Tesla T4 (16GB VRAM) & Stability
    IMAGE_SIZE: int = 224
    BATCH_SIZE: int = 64  # Optimal batch size: fits in ~1.2GB VRAM on T4 with 100% GPU utilization
    NUM_CLASSES: int = 20
    NUM_WORKERS: int = 2  # 2 workers is optimal on Kaggle (prevents /dev/shm IPC OOM crashes)
    EPOCHS: int = 20
    LEARNING_RATE: float = 3e-4
    WEIGHT_DECAY: float = 1e-2
    LABEL_SMOOTHING: float = 0.1
    SEED: int = 42
    
    # Export directory
    OUTPUT_DIR: str = "/kaggle/working/output" if os.path.exists("/kaggle") else "./output"
    
    # Dedicated single GPU (cuda:0).
    # NOTE: EfficientNet-B0 has 4M params (~16MB). A single T4 (16GB) trains an epoch in ~12s.
    # We intentionally use single-GPU (cuda:0) instead of nn.DataParallel to avoid
    # Python GIL thread contention (which caused 900s/epoch) and Kaggle DeadKernelError.
    DEVICE: torch.device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

config = Config()
DATA_DIR = config.DATA_DIR

os.makedirs(config.OUTPUT_DIR, exist_ok=True)
print(f"-> Dataset Directory      : {DATA_DIR}")
print(f"-> Output Directory       : {config.OUTPUT_DIR}")
print(f"-> Batch Size             : {config.BATCH_SIZE}")
print(f"-> DataLoader Workers     : {config.NUM_WORKERS}")
print(f"-> Active Compute Device  : {config.DEVICE}")

# Set deterministic random seeds & cuDNN benchmark optimization for fixed-size CNN inputs
def seed_everything(seed=42):
    random.seed(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    # Enable cuDNN benchmark to auto-tune convolution kernels for 224x224 input
    torch.backends.cudnn.benchmark = True
    torch.backends.cudnn.deterministic = False

seed_everything(config.SEED)

# %% [markdown]
# ## 3. Exploratory Data Analysis (EDA)

# %%
train_dir = os.path.join(DATA_DIR, "train")
val_dir   = os.path.join(DATA_DIR, "val")
test_dir  = os.path.join(DATA_DIR, "test")

# Extract class names and count samples per split
if os.path.exists(train_dir):
    classes = sorted([d for d in os.listdir(train_dir) if os.path.isdir(os.path.join(train_dir, d))])
    print(f"Total Detected Classes: {len(classes)}")

    eda_records = []
    for c in classes:
        n_train = len(os.listdir(os.path.join(train_dir, c)))
        n_val   = len(os.listdir(os.path.join(val_dir, c)))
        n_test  = len(os.listdir(os.path.join(test_dir, c)))
        eda_records.append({
            "Class": c,
            "Human_Label": c.replace("batik_", "").replace("_", " ").title(),
            "Train": n_train,
            "Val": n_val,
            "Test": n_test,
            "Total": n_train + n_val + n_test
        })

    df_eda = pd.DataFrame(eda_records)
    print("\n=== Dataset Distribution Table ===")
    print(df_eda.to_string(index=False))

    # Visualizing Class Distribution
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    fig, ax = plt.subplots(figsize=(14, 7))

    x = np.arange(len(df_eda))
    width = 0.25

    ax.bar(x - width, df_eda["Train"], width, label="Train", color="#7A3E1D")
    ax.bar(x, df_eda["Val"], width, label="Validation", color="#D4AF37")
    ax.bar(x + width, df_eda["Test"], width, label="Test", color="#1E3A8A")

    ax.set_ylabel("Number of Images", fontsize=12, fontweight="bold")
    ax.set_title("Batik Kita Dataset — Distribution Across 20 Classes", fontsize=14, fontweight="bold", pad=15)
    ax.set_xticks(x)
    ax.set_xticklabels(df_eda["Human_Label"], rotation=45, ha="right", fontsize=10)
    ax.legend(frameon=True, facecolor="white")
    plt.tight_layout()
    dist_plot_path = os.path.join(config.OUTPUT_DIR, "eda_class_distribution.png")
    plt.savefig(dist_plot_path, dpi=300)
    plt.close()
    print(f"Saved distribution plot to: {dist_plot_path}")

    # Visualizing Image Samples for All 20 Classes
    fig, axes = plt.subplots(4, 5, figsize=(18, 14))
    axes = axes.flatten()

    for idx, c in enumerate(classes):
        class_path = os.path.join(train_dir, c)
        sample_images = [f for f in os.listdir(class_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        if sample_images:
            img_path = os.path.join(class_path, random.choice(sample_images))
            img = Image.open(img_path).convert("RGB")
            axes[idx].imshow(img)
            axes[idx].set_title(df_eda.loc[df_eda['Class'] == c, 'Human_Label'].values[0], fontsize=11, fontweight="bold")
        axes[idx].axis("off")

    plt.suptitle("Sample Images from 20 Batik Motif Classes", fontsize=16, fontweight="bold", y=0.98)
    plt.tight_layout()
    samples_plot_path = os.path.join(config.OUTPUT_DIR, "eda_motif_samples.png")
    plt.savefig(samples_plot_path, dpi=300)
    plt.close()
    print(f"Saved sample montage to: {samples_plot_path}")
else:
    print(f"Notice: train_dir {train_dir} not yet accessible at current execution path.")

# %% [markdown]
# ## 4. Preprocessing & DataLoaders

# %%
# Standard ImageNet normalization parameters
NORM_MEAN = [0.485, 0.456, 0.406]
NORM_STD  = [0.229, 0.224, 0.225]

data_transforms = {
    "train": transforms.Compose([
        transforms.Resize((config.IMAGE_SIZE, config.IMAGE_SIZE)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.15),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
    ]),
    "val": transforms.Compose([
        transforms.Resize((config.IMAGE_SIZE, config.IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
    ]),
    "test": transforms.Compose([
        transforms.Resize((config.IMAGE_SIZE, config.IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=NORM_MEAN, std=NORM_STD)
    ])
}

image_datasets = {
    "train": datasets.ImageFolder(train_dir, transform=data_transforms["train"]),
    "val":   datasets.ImageFolder(val_dir,   transform=data_transforms["val"]),
    "test":  datasets.ImageFolder(test_dir,  transform=data_transforms["test"]),
}

# Safe Kaggle DataLoader: 2 workers, pin_memory, persistent_workers=False to prevent IPC/shm crashes
dataloaders = {
    split: DataLoader(
        image_datasets[split],
        batch_size=config.BATCH_SIZE,
        shuffle=(split == "train"),
        num_workers=config.NUM_WORKERS,
        pin_memory=torch.cuda.is_available(),
        persistent_workers=False
    )
    for split in ["train", "val", "test"]
}

dataset_sizes = {split: len(image_datasets[split]) for split in ["train", "val", "test"]}
class_names   = image_datasets["train"].classes
idx_to_class  = {v: k for k, v in image_datasets["train"].class_to_idx.items()}

print(f"Dataset Sizes    : {dataset_sizes}")
print(f"Number of Classes: {len(class_names)}")

# %% [markdown]
# ## 5. Model Architecture (EfficientNet-B0)

# %%
def build_model(num_classes=20, pretrained=True) -> nn.Module:
    """
    Constructs an EfficientNet-B0 backbone with custom classification head.
    Standardized on torchvision for reproducible weights and stable ONNX/TorchScript export.
    """
    weights = models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
    base_model = models.efficientnet_b0(weights=weights)
    in_features = base_model.classifier[1].in_features
    base_model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, num_classes)
    )
    return base_model

# Instantiate model on dedicated primary GPU
model = build_model(num_classes=config.NUM_CLASSES, pretrained=True)
model = model.to(config.DEVICE)

total_params = sum(p.numel() for p in model.parameters())
trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"Total Parameters     : {total_params:,}")
print(f"Trainable Parameters : {trainable_params:,}")

# Loss function with label smoothing for regularization
criterion = nn.CrossEntropyLoss(label_smoothing=config.LABEL_SMOOTHING)

# Optimizer & Cosine Annealing Learning Rate Scheduler
optimizer = optim.AdamW(model.parameters(), lr=config.LEARNING_RATE, weight_decay=config.WEIGHT_DECAY)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=config.EPOCHS, eta_min=1e-6)

# Automatic Mixed Precision Scaler for fast FP16 GPU training (utilizing T4 Tensor Cores)
use_cuda = config.DEVICE.type == "cuda"
scaler = torch.amp.GradScaler('cuda', enabled=use_cuda)

# %% [markdown]
# ## 6. Training & Validation Engine

# %%
def train_model(model, criterion, optimizer, scheduler, num_epochs=20):
    since = time.time()
    best_model_wts = {k: v.cpu().clone() for k, v in model.state_dict().items()}
    best_acc = 0.0
    use_cuda = config.DEVICE.type == "cuda"
    
    history = {
        "train_loss": [], "train_acc": [],
        "val_loss": [], "val_acc": [],
        "lr": []
    }
    
    print("\n" + "=" * 65)
    print(f"{'Epoch':^7} | {'Train Loss':^11} | {'Train Acc':^10} | {'Val Loss':^10} | {'Val Acc':^9} | {'Time':^7}")
    print("=" * 65)
    
    for epoch in range(1, num_epochs + 1):
        epoch_start = time.time()
        
        # Each epoch has a training and validation phase
        for phase in ["train", "val"]:
            if phase == "train":
                model.train()
            else:
                model.eval()
                
            running_loss = 0.0
            running_corrects = 0
            
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(config.DEVICE, non_blocking=True)
                labels = labels.to(config.DEVICE, non_blocking=True)
                
                optimizer.zero_grad(set_to_none=True)
                
                # Forward pass with Automatic Mixed Precision (AMP)
                with torch.set_grad_enabled(phase == "train"):
                    with torch.amp.autocast('cuda', enabled=use_cuda):
                        outputs = model(inputs)
                        loss = criterion(outputs, labels)
                        
                    _, preds = torch.max(outputs, 1)
                    
                    if phase == "train":
                        scaler.scale(loss).backward()
                        scaler.step(optimizer)
                        scaler.update()
                            
                running_loss += loss.item() * inputs.size(0)
                running_corrects += (preds == labels).sum().item()
                
            if phase == "train" and scheduler is not None:
                scheduler.step()
                
            epoch_loss = running_loss / dataset_sizes[phase]
            epoch_acc = running_corrects / dataset_sizes[phase]
            
            history[f"{phase}_loss"].append(epoch_loss)
            history[f"{phase}_acc"].append(epoch_acc)
            
            # Save best model checkpoint (cloned to CPU to prevent GPU VRAM bloat)
            if phase == "val" and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = {k: v.cpu().clone() for k, v in model.state_dict().items()}
                torch.save(best_model_wts, os.path.join(config.OUTPUT_DIR, "batik_best_checkpoint.pth"))
                
        current_lr = optimizer.param_groups[0]["lr"]
        history["lr"].append(current_lr)
        duration = time.time() - epoch_start
        
        print(f"{epoch:^7d} | {history['train_loss'][-1]:^11.4f} | {history['train_acc'][-1]*100:^9.2f}% | "
              f"{history['val_loss'][-1]:^10.4f} | {history['val_acc'][-1]*100:^8.2f}% | {duration:^6.1f}s")
        
    time_elapsed = time.time() - since
    print("=" * 65)
    print(f"Training completed in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s")
    print(f"Best Validation Accuracy: {best_acc * 100:.2f}%")
    
    # Restore best weights into the model
    model.load_state_dict(best_model_wts)
    return model, history

# Execute training loop
trained_model, history = train_model(
    model, criterion, optimizer, scheduler, num_epochs=config.EPOCHS
)

# %% [markdown]
# ## 7. Training History Visualization

# %%
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

epochs_range = range(1, config.EPOCHS + 1)

# Loss curves
ax1.plot(epochs_range, history["train_loss"], label="Train Loss", color="#7A3E1D", lw=2)
ax1.plot(epochs_range, history["val_loss"], label="Val Loss", color="#D4AF37", lw=2, linestyle="--")
ax1.set_title("Training & Validation Loss", fontsize=13, fontweight="bold")
ax1.set_xlabel("Epoch")
ax1.set_ylabel("Loss")
ax1.legend(frameon=True, facecolor="white")

# Accuracy curves
ax2.plot(epochs_range, [a * 100 for a in history["train_acc"]], label="Train Acc", color="#7A3E1D", lw=2)
ax2.plot(epochs_range, [a * 100 for a in history["val_acc"]], label="Val Acc", color="#1E3A8A", lw=2, linestyle="--")
ax2.set_title("Training & Validation Accuracy (%)", fontsize=13, fontweight="bold")
ax2.set_xlabel("Epoch")
ax2.set_ylabel("Accuracy (%)")
ax2.legend(frameon=True, facecolor="white")

plt.tight_layout()
curves_path = os.path.join(config.OUTPUT_DIR, "training_curves.png")
plt.savefig(curves_path, dpi=300)
plt.close()
print(f"Saved training curves to: {curves_path}")

# %% [markdown]
# ## 8. Comprehensive Test Set Evaluation

# %%
def evaluate_test_set(model, dataloader):
    model.eval()
    all_preds = []
    all_labels = []
    all_probs = []
    
    with torch.inference_mode():
        for inputs, labels in dataloader:
            inputs = inputs.to(config.DEVICE, non_blocking=True)
            outputs = model(inputs)
            probs = torch.softmax(outputs, dim=1)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.numpy())
            all_probs.extend(probs.cpu().numpy())
            
    all_preds = np.array(all_preds)
    all_labels = np.array(all_labels)
    all_probs = np.array(all_probs)
    
    # Vectorized Top-1 & Top-3 accuracy metrics
    top1_acc = accuracy_score(all_labels, all_preds)
    top3_indices = np.argsort(all_probs, axis=1)[:, -3:]
    top3_acc = np.mean(np.any(top3_indices == all_labels[:, None], axis=1))
    
    return all_preds, all_labels, all_probs, top1_acc, top3_acc

test_preds, test_labels, test_probs, top1, top3 = evaluate_test_set(trained_model, dataloaders["test"])

print("\n" + "=" * 55)
print("TEST EVALUATION RESULTS (Unseen Test Set)")
print("=" * 55)
print(f"Top-1 Test Accuracy : {top1 * 100:.2f}%")
print(f"Top-3 Test Accuracy : {top3 * 100:.2f}%")
print("=" * 55)

# Classification Report
human_labels = [c.replace("batik_", "").replace("_", " ").title() for c in class_names]
cls_report = classification_report(test_labels, test_preds, target_names=human_labels, digits=4)
print("\n=== Classification Report ===")
print(cls_report)

# Save classification report to text file
report_path = os.path.join(config.OUTPUT_DIR, "classification_report.txt")
with open(report_path, "w", encoding="utf-8") as f:
    f.write(f"Top-1 Accuracy: {top1 * 100:.2f}%\nTop-3 Accuracy: {top3 * 100:.2f}%\n\n")
    f.write(cls_report)

# Confusion Matrix Heatmap (20x20)
cm = confusion_matrix(test_labels, test_preds)
cm_norm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]

fig, ax = plt.subplots(figsize=(16, 14))
sns.heatmap(
    cm_norm,
    annot=True,
    fmt=".2f",
    cmap="YlOrBr",
    xticklabels=human_labels,
    yticklabels=human_labels,
    cbar=True,
    linewidths=0.5,
    ax=ax
)
ax.set_title("Batik Kita — Test Set Confusion Matrix (Normalized)", fontsize=16, fontweight="bold", pad=20)
ax.set_xlabel("Predicted Motif", fontsize=12, fontweight="bold")
ax.set_ylabel("True Motif", fontsize=12, fontweight="bold")
plt.xticks(rotation=45, ha="right")
plt.yticks(rotation=0)
plt.tight_layout()

cm_path = os.path.join(config.OUTPUT_DIR, "confusion_matrix.png")
plt.savefig(cm_path, dpi=300)
plt.close()
print(f"Saved Confusion Matrix to: {cm_path}")

# Visualizing Test Sample Predictions
fig, axes = plt.subplots(3, 4, figsize=(16, 12))
axes = axes.flatten()

sample_indices = random.sample(range(len(test_labels)), min(12, len(test_labels)))

for i, idx in enumerate(sample_indices):
    inputs, label = image_datasets["test"][idx]
    
    # De-normalize image for plotting
    img = inputs.numpy().transpose((1, 2, 0))
    img = np.array(NORM_STD) * img + np.array(NORM_MEAN)
    img = np.clip(img, 0, 1)
    
    true_label = human_labels[test_labels[idx]]
    pred_label = human_labels[test_preds[idx]]
    prob = test_probs[idx][test_preds[idx]] * 100
    
    color = "green" if test_preds[idx] == test_labels[idx] else "red"
    
    axes[i].imshow(img)
    axes[i].set_title(f"Pred: {pred_label} ({prob:.1f}%)\nTrue: {true_label}", fontsize=10, fontweight="bold", color=color)
    axes[i].axis("off")

plt.suptitle("Sample Test Predictions (Green=Correct, Red=Incorrect)", fontsize=15, fontweight="bold", y=0.98)
plt.tight_layout()
test_sample_path = os.path.join(config.OUTPUT_DIR, "test_predictions_samples.png")
plt.savefig(test_sample_path, dpi=300)
plt.close()

# %% [markdown]
# ## 9. Multi-Format Model Export

# %%
print("\n" + "=" * 55)
print("EXPORTING MODEL ARTIFACTS")
print("=" * 55)

# Move model to CPU for universal, deployment-ready artifacts
export_model = copy.deepcopy(trained_model).cpu().eval()

# 1. Export PyTorch State Dict (.pth)
pth_path = os.path.join(config.OUTPUT_DIR, "batik_efficientnet_b0.pth")
torch.save(export_model.state_dict(), pth_path)
print(f"[OK] PyTorch Weights Saved : {pth_path} ({os.path.getsize(pth_path)/(1024*1024):.2f} MB)")

# 2. Export TorchScript (JIT) (.pt)
dummy_cpu = torch.randn(1, 3, config.IMAGE_SIZE, config.IMAGE_SIZE)
try:
    with torch.inference_mode():
        scripted_model = torch.jit.trace(export_model, dummy_cpu)
        jit_path = os.path.join(config.OUTPUT_DIR, "batik_efficientnet_jit.pt")
        scripted_model.save(jit_path)
    print(f"[OK] TorchScript Model     : {jit_path} ({os.path.getsize(jit_path)/(1024*1024):.2f} MB)")
except Exception as e:
    print(f"[ERR] TorchScript export failed: {e}")

# 3. Export ONNX (.onnx)
onnx_path = os.path.join(config.OUTPUT_DIR, "batik_efficientnet.onnx")
try:
    with torch.inference_mode():
        try:
            # PyTorch 2.x legacy TorchScript-based exporter (does not require onnxscript)
            torch.onnx.export(
                export_model,
                dummy_cpu,
                onnx_path,
                export_params=True,
                opset_version=14,
                do_constant_folding=True,
                input_names=["input"],
                output_names=["output"],
                dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
                dynamo=False
            )
        except TypeError:
            # Fallback for older PyTorch versions where dynamo argument does not exist
            torch.onnx.export(
                export_model,
                dummy_cpu,
                onnx_path,
                export_params=True,
                opset_version=14,
                do_constant_folding=True,
                input_names=["input"],
                output_names=["output"],
                dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}}
            )
    print(f"[OK] ONNX Model Saved      : {onnx_path} ({os.path.getsize(onnx_path)/(1024*1024):.2f} MB)")
except Exception as e:
    print(f"[ERR] ONNX export failed: {e}")

# 4. Export Class Mapping Metadata (JSON)
class_mapping = {
    "num_classes": config.NUM_CLASSES,
    "image_size": config.IMAGE_SIZE,
    "mean": NORM_MEAN,
    "std": NORM_STD,
    "classes": [
        {
            "id": idx,
            "key": c,
            "name": c.replace("batik_", "").replace("_", " ").title()
        }
        for idx, c in enumerate(class_names)
    ]
}

mapping_path = os.path.join(config.OUTPUT_DIR, "class_mapping.json")
with open(mapping_path, "w", encoding="utf-8") as f:
    json.dump(class_mapping, f, indent=2)
print(f"[OK] Class Mapping JSON    : {mapping_path}")

print("\n" + "=" * 55)
print("ALL TASKS FINISHED SUCCESSFULLY!")
print(f"Artifacts available in: {config.OUTPUT_DIR}")
print("=" * 55)
