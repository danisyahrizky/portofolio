export interface ParticleData {
  initialX: number;
  initialY: number;
  initialZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  phaseX: number;
  phaseY: number;
  phaseZ: number;
  scale: number;
}

// Mengisolasi logika inisialisasi buffer
export function generateParticles(count: number): ParticleData[] {
  const temp: ParticleData[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.5) * 10;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const speedX = Math.random() * 2.0 + 0.5;
    const speedY = Math.random() * 2.0 + 0.5;
    const speedZ = Math.random() * 2.0 + 0.5;
    const scale = Math.random() * 0.15 + 0.02;

    const phaseX = Math.random() * Math.PI * 2;
    const phaseY = Math.random() * Math.PI * 2;
    const phaseZ = Math.random() * Math.PI * 2;

    temp.push({ 
      initialX: x, initialY: y, initialZ: z, 
      speedX, speedY, speedZ, 
      phaseX, phaseY, phaseZ, 
      scale 
    });
  }
  return temp;
}

// Mengisolasi algoritma matriks dinamis
export function getParticlePosition(
  shape: string, 
  i: number, 
  particle: ParticleData, 
  t: number, 
  cycleId: number
) {
  const { initialX, initialY, initialZ, speedX, speedY, speedZ, phaseX, phaseY, phaseZ, scale } = particle;
  
  if (shape === 'bouncy') {
    const angleOffset = cycleId * Math.PI / 2.5;
    const cosA = Math.cos(angleOffset);
    const sinA = Math.sin(angleOffset);
    const spreadFactor = 3.5;
    const rotX = (initialX * spreadFactor) * cosA - (initialZ * spreadFactor) * sinA;
    const rotZ = (initialX * spreadFactor) * sinA + (initialZ * spreadFactor) * cosA;

    const bx = rotX + Math.sin(t * speedX * 0.3 + phaseX) * 5.0;
    const bz = rotZ + Math.cos(t * speedZ * 0.3 + phaseZ) * 5.0;
    const floorY = -12;
    const bounceHeight = 5 + scale * 80; 
    const bounceSpeed = speedY * 0.6 + 0.2;
    const bounceY = floorY + Math.abs(Math.sin(t * bounceSpeed + phaseY)) * bounceHeight;

    return { x: bx, y: bounceY, z: bz };
  } 
  
  if (shape === 'soundwave') {
    const numBars = 40;
    const particlesPerBar = 20; 
    const barIndex = Math.floor(i / particlesPerBar);
    const particleInBar = i % particlesPerBar;
    
    const waveX = (barIndex / numBars - 0.5) * 35;
    const waveZ = Math.sin(phaseZ) * 2.0; 
    
    const amp = Math.sin(waveX * 0.4 + t * 3.0) * 3.0 + Math.cos(waveX * 0.7 - t * 2.0) * 2.0 + 3.0; 
    const barY = (particleInBar / (particlesPerBar - 1) - 0.5) * amp * 3.0; 
    
    return { x: waveX, y: barY, z: waveZ };
  } 
  
  if (shape === 'dna') {
    const numRungs = 40;
    const particlesPerRung = 20;
    const rungIndex = Math.floor(i / particlesPerRung);
    const particleInRung = i % particlesPerRung;
    
    const dnaX = (rungIndex / numRungs - 0.5) * 35; 
    const angle = dnaX * 0.8 + t * 2.0;
    const radius = 3.5;
    
    if (particleInRung < 8) {
      return {
        x: dnaX + Math.sin(phaseX * 2.0) * 0.4,
        y: Math.sin(angle) * radius + Math.cos(phaseY * 2.0) * 0.4 + Math.sin(t * speedY) * 0.2,
        z: Math.cos(angle) * radius + Math.sin(phaseZ * 2.0) * 0.4 + Math.cos(t * speedZ) * 0.2
      };
    } else if (particleInRung < 16) {
      return {
        x: dnaX + Math.sin(phaseX * 2.0) * 0.4,
        y: Math.sin(angle + Math.PI) * radius + Math.cos(phaseY * 2.0) * 0.4 + Math.sin(t * speedY) * 0.2,
        z: Math.cos(angle + Math.PI) * radius + Math.sin(phaseZ * 2.0) * 0.4 + Math.cos(t * speedZ) * 0.2
      };
    } else {
      const t_rung = (particleInRung - 16) / 3 * 2 - 1; 
      return {
        x: dnaX,
        y: Math.sin(angle) * radius * t_rung,
        z: Math.cos(angle) * radius * t_rung
      };
    }
  }

  if (shape === 'matrix') {
    const numCols = 40;
    const particlesPerCol = 20;
    const colIndex = Math.floor(i / particlesPerCol);
    const particleInCol = i % particlesPerCol;

    const mx = (colIndex / numCols - 0.5) * 40;
    const mz = Math.sin(colIndex * 13.3) * 10; 
    
    const fallSpeed = 3.0 + (colIndex % 3);
    const fallY = 15 - ((t * fallSpeed + particleInCol * 1.5 + phaseY) % 30);
    
    return { x: mx, y: fallY, z: mz };
  }

  if (shape === 'wave_water') {
    const count = 800; // Dikunci secara statis untuk operasi akar kuadrat
    const gridSize = Math.ceil(Math.sqrt(count));
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;

    const wx = (col / gridSize - 0.5) * 40;
    const wz = (row / gridSize - 0.5) * 40;
    
    const dist = Math.sqrt(wx * wx + wz * wz);
    const wy = Math.sin(wx * 0.3 + t * 1.5) * 1.5 
             + Math.cos(wz * 0.2 + t * 1.2) * 1.5 
             + Math.sin(dist * 0.5 - t * 2.0) * 1.0 
             - 5;
             
    return { x: wx, y: wy, z: wz };
  }

  if (shape === 'akar_pohon') {
    const depth = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (Math.pow(2, depth) - 1);
    const maxInLevel = Math.pow(2, depth);

    let angle = (indexInLevel / maxInLevel) * Math.PI * 2;
    angle += Math.sin(depth * 0.8 + t * 0.2) * 1.0; 
    
    const radiusSpread = depth * 1.2 + Math.sin(t * 0.5 + phaseX) * 0.5;

    const rootX = Math.cos(angle) * radiusSpread;
    const rootZ = Math.sin(angle) * radiusSpread;
    const rootY = 15 - depth * 2.5 + Math.sin(t * 1.0 + phaseY) * 0.5;

    return { 
      x: rootX + Math.sin(t * speedX * 0.3 + phaseX) * 0.8, 
      y: rootY, 
      z: rootZ + Math.sin(t * speedZ * 0.3 + phaseZ) * 0.8 
    };
  }
  
  return { x: 0, y: 0, z: 0 };
}