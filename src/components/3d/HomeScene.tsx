import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShaderLogic = `
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
  float r1 = aParams.x;
  float r2 = aParams.y;
  float r3 = aParams.z;
  float idx = aParams.w;

  // 1. Matrix Grid (DIpertahankan)
  float gx = mod(idx, 10.0) - 4.5;
  float gy = mod(floor(idx / 10.0), 10.0) - 4.5;
  float gz = floor(idx / 100.0) - 3.5;
  vec3 p1 = vec3(gx * 12.0, gy * 12.0 + sin(uTime * 1.5 + gx) * 2.0, gz * 12.0);

  // 2. Terrain Wave (Dipertahankan)
  float sx = (mod(idx, 30.0) - 15.0) * 4.5;
  float sz = (floor(idx / 30.0) - 13.0) * 4.5;
  float sy = sin(sx * 0.3 + uTime * 2.0) * 4.0 + cos(sz * 0.2 + uTime * 1.5) * 4.0 - 15.0;
  vec3 p2 = vec3(sx, sy, sz);

  // 3. DNA HORIZONTAL WAVE (Pembaruan Presisi)
  float dType = mod(idx, 10.0);
  float strandX = (idx / 800.0 - 0.5) * 160.0;
  float rungId = floor(idx / 10.0);
  float rungX = (rungId / 80.0 - 0.5) * 160.0;
  
  float finalDX = mix(strandX, rungX, step(6.0, dType)); 
  float dPhase = finalDX * 0.08 + uTime * 1.5; 
  
  vec3 dS1 = vec3(finalDX, sin(dPhase) * 16.0, cos(dPhase) * 16.0);
  vec3 dS2 = vec3(finalDX, sin(dPhase + 3.1415) * 16.0, cos(dPhase + 3.1415) * 16.0);
  
  vec3 p3 = vec3(0.0);
  if (dType < 3.0) p3 = dS1; 
  else if (dType < 6.0) p3 = dS2; 
  else p3 = mix(dS1, dS2, fract(r1 * 13.0 + r2 * 7.0));

  // 4. Slow Rain (Dipertahankan)
  float rainX = (r1 - 0.5) * 160.0;
  float rainZ = (r2 - 0.5) * 160.0;
  float rainSpeed = 2.0 + r3 * 3.5; 
  float rainDropY = uTime * rainSpeed + (idx * 0.5);
  float rainY = 60.0 - mod(rainDropY, 90.0);
  vec3 p4 = vec3(rainX, rainY, rainZ);

  // 5. Neural Network (Dipertahankan)
  float n1 = r1 * 6.28 + uTime * 0.2;
  float n2 = r2 * 3.14;
  float nRad = r3 * 55.0 + sin(uTime * 1.5 + idx) * 5.0;
  vec3 p5 = vec3(sin(n2)*cos(n1)*nRad, cos(n2)*nRad, sin(n2)*sin(n1)*nRad);

  // 6. CHAOS BOUNCE (Pembaruan Balistik: Terlempar Acak ke Segala Arah)
  float bSpeed = 1.0 + r1 * 1.0; 
  float tB = uTime * bSpeed + r2 * 6.28;
  
  // Gravitasi Y
  float rawB = pow(abs(sin(tB)), 1.5);
  float floorY = -25.0; 
  float bY = floorY + rawB * (45.0 + r3 * 35.0);

  // Kecepatan & Momentum X dan Z (Kiri, Kanan, Depan, Belakang)
  float velX = (r2 - 0.5) * 60.0; 
  float velZ = (r1 - 0.5) * 60.0; 
  
  float startX = (r1 - 0.5) * 200.0;
  float startZ = (r2 - 0.5) * 200.0;
  
  // Modulo batas ruang agar bola yang terlempar jauh mereset posisinya
  float bX = mod(startX + uTime * velX + 100.0, 200.0) - 100.0;
  float bZ = mod(startZ + uTime * velZ + 100.0, 200.0) - 100.0;
  
  vec3 pBounce = vec3(bX, bY, bZ);

  float squash = 1.0;
  float stretch = 1.0;

  // Mesin Transisi Waktu
  float cycle = mod(uTime, 40.0);
  float stateIdx = floor(cycle / 8.0);
  float localT = mod(cycle, 8.0);

  vec3 shapePos = vec3(0.0);
  if (stateIdx < 0.5) shapePos = p1;
  else if (stateIdx < 1.5) shapePos = p2;
  else if (stateIdx < 2.5) shapePos = p3;
  else if (stateIdx < 3.5) shapePos = p4;
  else shapePos = p5;

  vec3 nextShapePos = vec3(0.0);
  float nextIdx = mod(stateIdx + 1.0, 5.0);
  if (nextIdx < 0.5) nextShapePos = p1;
  else if (nextIdx < 1.5) nextShapePos = p2;
  else if (nextIdx < 2.5) nextShapePos = p3;
  else if (nextIdx < 3.5) nextShapePos = p4;
  else nextShapePos = p5;

  vec3 finalPos = vec3(0.0);
  float sF = 1.0;
  float stF = 1.0;

  if (localT < 3.0) {
    finalPos = shapePos;
  } else if (localT < 4.0) {
    float w = smoothstep(3.0, 4.0, localT);
    finalPos = mix(shapePos, pBounce, w);
    sF = mix(1.0, squash, w);
    stF = mix(1.0, stretch, w);
  } else if (localT < 7.0) {
    finalPos = pBounce;
    sF = squash;
    stF = stretch;
  } else {
    float w = smoothstep(7.0, 8.0, localT);
    finalPos = mix(pBounce, nextShapePos, w);
    sF = mix(squash, 1.0, w);
    stF = mix(stretch, 1.0, w);
  }

  mvPosition.x *= stF;
  mvPosition.z *= stF;
  mvPosition.y *= sF;
  mvPosition.y -= (1.0 - sF) * 1.3;

  // Rotasi Ruang (Dipertahankan dari aslinya)
  float gRot = uTime * 0.05;
  mat3 rotGlobal = mat3(
    cos(gRot), 0.0, sin(gRot),
    0.0, 1.0, 0.0,
    -sin(gRot), 0.0, cos(gRot)
  );
  finalPos = rotGlobal * finalPos;

  mat4 customInstMat = instanceMatrix;
  customInstMat[3] = vec4(finalPos, 1.0);
  mvPosition = customInstMat * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;

function ParticleSystem() {
  const count = 800;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const paramsArray = useMemo(() => {
    const arr = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      arr[i * 4 + 0] = Math.random(); 
      arr[i * 4 + 1] = Math.random(); 
      arr[i * 4 + 2] = Math.random(); 
      arr[i * 4 + 3] = i;             
    }
    return arr;
  }, []);

  const customMaterial = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#FF2400',
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        attribute vec4 aParams; 
        uniform float uTime;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        vertexShaderLogic
      );

      mat.userData.shader = shader;
    };
    return mat;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (customMaterial.userData.shader) {
      customMaterial.userData.shader.uniforms.uTime.value = t;
    }

    // KAMERA REALISTIS: Melakukan putaran orbit secara pelan
    const camRadius = 70; 
    const camSpeed = 0.08; 
    
    state.camera.position.x = Math.sin(t * camSpeed) * camRadius;
    state.camera.position.z = Math.cos(t * camSpeed) * camRadius;
    state.camera.position.y = Math.sin(t * camSpeed * 0.5) * 15;
    
    // Memaksa fokus lensa selalu menatap pusat formasi
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[1.3, 32, 32]}>
        <instancedBufferAttribute attach="attributes-aParams" args={[paramsArray, 4]} />
      </sphereGeometry>
      <primitive object={customMaterial} attach="material" />
    </instancedMesh>
  );
}

export default function HomeScene() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 70], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          <pointLight position={[-10, 10, -10]} intensity={0.8} color="#cc0000" />
          <ParticleSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}