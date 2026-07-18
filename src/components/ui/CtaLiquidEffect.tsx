import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import vertexShader from '../3d/shaders/ctaVertex.glsl?raw';
import fragmentShader from '../3d/shaders/ctaFragment.glsl?raw';

function LiquidMaterial({ isHovered, isClicked }: { isHovered: boolean, isClicked: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uFill: { value: 0 },
    uDrain: { value: 0 },
    uColor: { value: new THREE.Color('#CC0000') } 
  }), []);

  useFrame((state) => {
    if (!materialRef.current) return;
    
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    const targetFill = (isHovered || isClicked) ? 1.0 : 0.0;
    const targetDrain = isClicked ? 1.0 : 0.0;

    materialRef.current.uniforms.uFill.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uFill.value,
      targetFill,
      0.1
    );
    
    materialRef.current.uniforms.uDrain.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uDrain.value,
      targetDrain,
      0.08
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}

export default function CtaLiquidEffect({ isHovered, isClicked }: { isHovered: boolean, isClicked: boolean }) {
  return (
    <Canvas 
      orthographic 
      camera={{ position: [0, 0, 1], left: -1, right: 1, top: 1, bottom: -1, near: 0.1, far: 10 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <LiquidMaterial isHovered={isHovered} isClicked={isClicked} />
    </Canvas>
  );
}