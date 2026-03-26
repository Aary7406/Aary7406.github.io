// Fragment shader — exact port of reference repo (agentPritam47/image-distortion)
// Displacement-based crossfade with RGB shift, cover UVs, and scale effect.

uniform sampler2D u_texture0;          // outgoing (current) image
uniform sampler2D u_texture1;          // incoming (next) image
uniform sampler2D u_displacement;      // displacement map texture (13.jpg)
uniform float u_progress;              // 0 → 1, GSAP-animated per transition
uniform float u_strength;              // displacement distortion strength. Range: 0.2 → 1.2
uniform float u_rgbShift;              // RGB channel separation. Range: 0.01 → 0.1
uniform float u_scale;                 // zoom at transition midpoint. Range: 0.05 → 0.3
uniform vec2 u_resolution;             // viewport size (px)
uniform vec2 u_textureResolution0;     // current texture natural dimensions (px)
uniform vec2 u_textureResolution1;     // next texture natural dimensions (px)

varying vec2 vUv;

// ── background-size: cover UV calculation ────────────────────
// Scales UVs so the image fills the plane without stretching.
vec2 coverUV(vec2 uv, vec2 planeRes, vec2 texRes) {
  float scale = max(planeRes.x / texRes.x, planeRes.y / texRes.y);
  vec2 newSize = texRes * scale;
  return uv * (planeRes / newSize) + (newSize - planeRes) / 2.0 / newSize;
}

void main() {
  // ── Displacement with animated wave effect ─────────────────
  float disp = texture2D(u_displacement, vUv).r;
  disp = mix(disp, disp * (sin(vUv.y * 10.0 + u_progress * 6.28) * 0.5 + 0.5), 0.3);

  // ── Calculate cover UVs for both textures ─────────────────
  vec2 uv0 = coverUV(vUv, u_resolution, u_textureResolution0);
  vec2 uv1 = coverUV(vUv, u_resolution, u_textureResolution1);

  // ── Scale effect during transition ─────────────────────────
  // Peaks at midpoint (progress=0.5), zero at start/end
  float scaleEffect = 1.0 + u_progress * (1.0 - u_progress) * u_scale;
  vec2 center = vec2(0.5);

  // ── Distorted UVs with displacement ────────────────────────
  vec2 distortedUV0 = (uv0 - center) / scaleEffect + center + u_progress * disp * u_strength * vec2(1.0, 0.5);
  vec2 distortedUV1 = (uv1 - center) * scaleEffect + center - (1.0 - u_progress) * disp * u_strength * vec2(1.0, 0.5);

  // ── RGB shift effect ───────────────────────────────────────
  // Peaks at transition midpoint, zero at start/end
  float rgbOffset = u_progress * (1.0 - u_progress) * u_rgbShift;

  // ── Sample textures with per-channel RGB shift ─────────────
  vec4 tex0 = vec4(
    texture2D(u_texture0, distortedUV0 + vec2(rgbOffset, 0.0)).r,
    texture2D(u_texture0, distortedUV0).g,
    texture2D(u_texture0, distortedUV0 - vec2(rgbOffset, 0.0)).b,
    texture2D(u_texture0, distortedUV0).a
  );

  vec4 tex1 = vec4(
    texture2D(u_texture1, distortedUV1 + vec2(rgbOffset, 0.0)).r,
    texture2D(u_texture1, distortedUV1).g,
    texture2D(u_texture1, distortedUV1 - vec2(rgbOffset, 0.0)).b,
    texture2D(u_texture1, distortedUV1).a
  );

  // ── Blend textures ─────────────────────────────────────────
  gl_FragColor = mix(tex0, tex1, smoothstep(0.0, 1.0, u_progress));
}
