"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Suppress upstream Three.js r185 THREE.Clock deprecation notice emitted by @react-three/fiber internal loop
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particles
  const [positions, scales] = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread across a wide area to fill the screen
      pos[i * 3] = (Math.random() - 0.5) * 20;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      scale[i] = Math.random() * 1.5;
    }
    return [pos, scale];
  }, []);

  // Subtle rotation animation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
      
      // Slight parallax based on mouse
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      pointsRef.current.rotation.y += 0.05 * (targetX - pointsRef.current.rotation.y);
      pointsRef.current.rotation.x += 0.05 * (targetY - pointsRef.current.rotation.x);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={scales.length}
          array={scales}
          itemSize={1}
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#D4AF37"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <DustParticles />
      </Canvas>
    </div>
  );
}
