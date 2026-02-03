// src/components/PixelDistortionText.jsx
import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

/**
 * Pixel Distortion Text Effect
 * Renders text to a canvas texture, passes to WebGL shader for GPU-powered effects
 * Mouse-reactive pixelated distortion with RGB shift
 */
const PixelDistortionText = ({ text = 'Aary.Hinge' }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const textTextureRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Preload custom font
  useEffect(() => {
    const font = new FontFace('Kisthe', 'url(/Fonts/Kisthe-BF69030b51234d0.otf)');
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      setFontLoaded(true);
    }).catch(() => {
      // Fallback if font fails to load
      setFontLoaded(true);
    });
  }, []);

  // Create text texture from 2D canvas
  const createTextTexture = useCallback((text, width, height) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // High DPI for crisp text
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Transparent background
    ctx.clearRect(0, 0, width, height);
    
    // Calculate responsive font size - bigger for visibility
    const fontSize = Math.min(width * 0.18, 200);
    ctx.font = `${fontSize}px "Kisthe", "Space Grotesk", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create gradient for text
    const gradient = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7);
    gradient.addColorStop(0, '#7dd3fc');    // Cyan
    gradient.addColorStop(0.5, '#f0abfc');  // Magenta
    gradient.addColorStop(1, '#bef264');    // Lime
    
    ctx.fillStyle = gradient;
    ctx.fillText(text, width / 2, height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    
    return texture;
  }, []);

  // Vertex shader - fullscreen quad
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Fragment shader with pixelated distortion
  const fragmentShader = `
    precision highp float;
    
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uPixelSize;
    uniform float uDistortionStrength;
    
    varying vec2 vUv;
    
    // Hash function for noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    // 2D noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Aspect ratio correction
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      
      // Mouse influence calculation
      vec2 mousePos = uMouse;
      vec2 toMouse = (uv - mousePos) * aspect;
      float dist = length(toMouse);
      float influence = smoothstep(0.25, 0.0, dist);
      
      // Dynamic pixel grid - gets coarser near mouse
      float basePixelSize = uPixelSize;
      float dynamicPixelSize = basePixelSize * (1.0 + influence * 2.0);
      vec2 pixelGrid = uResolution / dynamicPixelSize;
      vec2 pixelatedUv = floor(uv * pixelGrid) / pixelGrid;
      
      // Wave distortion radiating from mouse
      float wave = sin(dist * 25.0 - uTime * 3.0) * 0.5 + 0.5;
      float distortionAmount = influence * uDistortionStrength * wave;
      
      // Direction-based displacement
      vec2 dir = normalize(toMouse + 0.001);
      vec2 displacement = dir * distortionAmount * 0.04;
      
      // Add noise-based jitter for organic feel
      float n = noise(pixelatedUv * 50.0 + uTime * 0.5);
      displacement += (vec2(n) - 0.5) * influence * 0.015;
      
      // Final UV with pixelation + displacement
      vec2 finalUv = mix(uv, pixelatedUv, influence * 0.7) + displacement;
      
      // RGB chromatic aberration - shifts based on distortion
      float rgbShift = distortionAmount * 0.008;
      float r = texture2D(uTexture, finalUv + vec2(rgbShift, 0.0)).r;
      float g = texture2D(uTexture, finalUv).g;
      float b = texture2D(uTexture, finalUv - vec2(rgbShift, 0.0)).b;
      float a = texture2D(uTexture, finalUv).a;
      
      // Sample original alpha for visibility
      float originalAlpha = texture2D(uTexture, uv).a;
      float finalAlpha = max(a, originalAlpha * 0.5);
      
      // Glitch line effect near mouse
      float glitchLine = step(0.98, fract(uv.y * 50.0 + uTime * 2.0)) * influence * 0.3;
      
      // Color output with glitch
      vec3 color = vec3(r, g, b);
      color += glitchLine * vec3(0.5, 0.8, 1.0);
      
      // Ensure we have visible alpha
      gl_FragColor = vec4(color, finalAlpha);
    }
  `;

  const handleMouseMove = useCallback((event) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetMouseRef.current = {
      x: (event.clientX - rect.left) / rect.width,
      y: 1.0 - (event.clientY - rect.top) / rect.height,
    };
  }, []);

  const handleResize = useCallback(() => {
    if (!rendererRef.current || !materialRef.current || !containerRef.current) return;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    rendererRef.current.setSize(width, height);
    materialRef.current.uniforms.uResolution.value.set(width, height);
    
    // Recreate text texture on resize
    if (textTextureRef.current) {
      textTextureRef.current.dispose();
    }
    textTextureRef.current = createTextTexture(text, width, height);
    materialRef.current.uniforms.uTexture.value = textTextureRef.current;
  }, [text, createTextTexture]);

  useEffect(() => {
    if (!containerRef.current || !fontLoaded) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer - transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create text texture
    textTextureRef.current = createTextTexture(text, width, height);

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: textTextureRef.current },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uPixelSize: { value: 8.0 },
        uDistortionStrength: { value: 1.0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    materialRef.current = material;

    // Fullscreen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const startTime = Date.now();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.1;

      // Update uniforms
      material.uniforms.uTime.value = (Date.now() - startTime) * 0.001;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.render(scene, camera);
    };
    animate();

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      geometry.dispose();
      material.dispose();
      if (textTextureRef.current) textTextureRef.current.dispose();
      renderer.dispose();
      
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [text, fontLoaded, createTextTexture, handleMouseMove, handleResize, vertexShader, fragmentShader]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-64 md:h-80 lg:h-96 relative"
      style={{ minHeight: '280px' }}
      aria-label={text}
      role="heading"
      aria-level="1"
    />
  );
};

export default PixelDistortionText;
