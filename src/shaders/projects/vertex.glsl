// Vertex shader — simple UV passthrough (matches reference repo exactly)
// All distortion is handled in the fragment shader via displacement maps.

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
