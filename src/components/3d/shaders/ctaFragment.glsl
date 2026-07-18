uniform float uTime;
uniform float uFill;
uniform float uDrain;
uniform vec3 uColor;
varying vec2 vUv;

float hash(vec2 p) { 
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); 
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  float dropNoise = noise(vec2(vUv.x * 4.5, -uTime * 1.5));
  float longDrops = pow(dropNoise, 2.2) * 0.55;
  float wave = sin(vUv.x * 10.0 + uTime * 4.0) * 0.035;
  
  float idleBottom = 0.78 - longDrops - wave;
  float bottomEdge = mix(idleBottom, -0.2, uFill);
  float topEdge = mix(1.5, -0.2, uDrain);

  float isLiquidBottom = smoothstep(bottomEdge, bottomEdge + 0.04, vUv.y);
  float isLiquidTop = smoothstep(vUv.y, vUv.y + 0.04, topEdge);
  float liquidAlpha = isLiquidBottom * isLiquidTop;
  vec3 colorTop = uColor; 
  vec3 colorBottom = uColor * 0.3; 
  vec3 finalGradient = mix(colorBottom, colorTop, vUv.y);
  gl_FragColor = vec4(finalGradient, liquidAlpha);
}