---
name: threejs-3d-graphics
description: Guidelines and best practices for using Three.js and React Three Fiber in the Batik Kita project.
---

# Three.js & 3D Graphics Guidelines

This skill provides guidelines for implementing 3D graphics in the Batik Kita project using Three.js.

## Core Libraries
- **Three.js**: The underlying 3D WebGL engine.
- **@react-three/fiber (R3F)**: A React reconciler for Three.js, allowing you to build 3D scenes using reusable React components.
- **@react-three/drei**: A growing collection of useful helpers and fully functional, ready-made abstractions for @react-three/fiber.

## Implementation Guidelines

### 1. Scene Setup
- Always use `Canvas` from `@react-three/fiber` as the entry point for your 3D scene.
- Ensure the parent container of the `Canvas` has a defined width and height (e.g., `w-full h-full` or absolute positioning), as the canvas will expand to fill it.

### 2. Loading Assets
- Use `useGLTF` from `@react-three/drei` to load 3D models (GLTF/GLB format).
- Preload models using `useGLTF.preload(path)` outside the component to prevent UI freezes.
- Always wrap components that load external assets in a `Suspense` boundary.

### 3. Performance Optimization
- **Geometry**: Reuse geometries and materials whenever possible.
- **Shadows**: Only enable shadows (`castShadow`, `receiveShadow`) on objects that actually need them.
- **Drei Helpers**: Use `<BakeShadows />` or `<ContactShadows />` for static scenes to improve performance.
- **Instancing**: If rendering many identical objects, use `InstancedMesh`.

### 4. Interactions
- Use pointer events (`onPointerOver`, `onPointerOut`, `onClick`) directly on the 3D meshes in R3F.
- Use `@react-spring/three` for smooth animations and transitions of 3D object properties (position, scale, rotation).

### 5. Integration with Next.js (App Router)
- 3D components must be client components. Always add `"use client";` at the top of the file containing the `Canvas` or any R3F hooks.
- If encountering hydration issues with Next.js, consider loading the 3D component dynamically with `next/dynamic` and `ssr: false`.

## Example: Basic 3D Batik Model Viewer

```tsx
"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

function BatikModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function BatikViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-[500px] bg-[#f5f3ef] rounded-2xl overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <BatikModel url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
}
```
