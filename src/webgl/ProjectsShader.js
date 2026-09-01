// src/webgl/ProjectsShader.js
// Optimized high-performance Three.js WebGL distortion shader.
// Features:
// - Global texture cache (instant 0ms re-mounts)
// - Hardware-accelerated async off-thread decoding via createImageBitmap
// - Non-blocking progressive rendering (renders frame 1 immediately, streams remaining textures)
// - Lenis smooth scroll + GSAP ScrollTrigger

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import vertexShader from '../shaders/projects/vertex.glsl';
import fragmentShader from '../shaders/projects/fragment.glsl';

gsap.registerPlugin(ScrollTrigger);

// ── CUSTOMIZABLE CONSTANTS ────────────────────────────────────
const DISPLACEMENT_STRENGTH = 0.8;
const RGB_SHIFT             = 0.05;
const SCALE_EFFECT          = 0.15;
const TRANSITION_DURATION   = 0.8;
const TRANSITION_EASE       = 'power3.inOut';
const PIXEL_RATIO_CAP       = 2;
const DISPLACEMENT_PATH     = '/displacement-13.jpg';

// Global cache for instant re-mounts and cross-page prefetching
const globalTextureCache = new Map();
const pendingLoads = new Map();

/**
 * Loads a texture asynchronously with off-thread decoding using createImageBitmap when available.
 */
export async function loadAsyncTexture(url) {
  if (globalTextureCache.has(url)) {
    return globalTextureCache.get(url);
  }
  if (pendingLoads.has(url)) {
    return pendingLoads.get(url);
  }

  const promise = (async () => {
    try {
      if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        let bitmap;
        try {
          bitmap = await createImageBitmap(blob, { imageOrientation: 'flipY' });
        } catch {
          bitmap = await createImageBitmap(blob);
        }
        const tex = new THREE.Texture(bitmap);
        tex.flipY = false;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
        globalTextureCache.set(url, tex);
        return tex;
      }
    } catch {
      // Fallback to THREE.TextureLoader
    }

    const loader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          globalTextureCache.set(url, tex);
          resolve(tex);
        },
        undefined,
        reject
      );
    });
  })();

  pendingLoads.set(url, promise);
  try {
    const tex = await promise;
    return tex;
  } finally {
    pendingLoads.delete(url);
  }
}

/**
 * Preload an array of textures in the background (non-blocking).
 */
export function preloadProjectTextures(imageUrls) {
  const allUrls = [...imageUrls, DISPLACEMENT_PATH];
  allUrls.forEach((url) => {
    if (!globalTextureCache.has(url) && !pendingLoads.has(url)) {
      loadAsyncTexture(url).catch(() => {});
    }
  });
}

function createPlaceholderTexture() {
  const data = new Uint8Array([18, 18, 22, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export default class ProjectsShader {
  /**
   * @param {HTMLElement} containerEl  — DOM element to append canvas to
   * @param {HTMLElement} scrollEl     — the scrollable wrapper (trigger for ScrollTrigger)
   * @param {string[]}   imageUrls    — image paths in public/Projects/
   * @param {Function}   [onReady]    — called after initial render is live
   */
  constructor(containerEl, scrollEl, imageUrls, onReady) {
    this.container = containerEl;
    this.scrollEl  = scrollEl;
    this.imageUrls = imageUrls;
    this.onReady   = onReady;

    this.placeholder     = createPlaceholderTexture();
    this.textures        = new Array(imageUrls.length).fill(this.placeholder);
    this.displacement    = this.placeholder;
    this.currentIndex    = 0;
    this.targetIndex     = 0;
    this.isTransitioning = false;
    this._destroyed      = false;

    // Reduced motion support
    this._reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._init();
  }

  // ── Init ───────────────────────────────────────────────────
  async _init() {
    try {
      this._initRenderer();
      this._initScene();
      this._initMesh();
      this._initScrollTrigger();
      this._initResize();
      this._startRenderLoop();

      // Progressive Async Loading:
      // Load Texture 0 & Displacement map first, stream the rest in background
      this._loadProgressiveTextures();
    } catch (err) {
      console.warn('[ProjectsShader] Init failed:', err);
      this.container.classList.add('webgl-fallback');
    }
  }

  async _loadProgressiveTextures() {
    try {
      // Step 1: Load Texture 0 and Displacement map concurrently
      const [firstTex, dispTex] = await Promise.all([
        loadAsyncTexture(this.imageUrls[0]),
        loadAsyncTexture(DISPLACEMENT_PATH)
      ]);

      if (this._destroyed) return;

      this.textures[0] = firstTex;
      this.displacement = dispTex;

      // Update shader uniforms for Texture 0 immediately
      this.uniforms.u_texture0.value = firstTex;
      this.uniforms.u_texture1.value = firstTex;
      this.uniforms.u_displacement.value = dispTex;
      this._setTextureResolution(0, firstTex);
      this._setTextureResolution(1, firstTex);

      if (this.onReady) this.onReady();

      // Step 2: Stream load the rest in parallel in background
      this.imageUrls.slice(1).forEach(async (url, idx) => {
        const realIndex = idx + 1;
        try {
          const tex = await loadAsyncTexture(url);
          if (this._destroyed) return;
          this.textures[realIndex] = tex;

          // If the user already scrolled to this section while it was loading
          if (this.targetIndex === realIndex && !this.isTransitioning) {
            this._transitionTo(realIndex);
          }
        } catch (e) {
          console.warn(`[ProjectsShader] Failed loading texture: ${url}`, e);
        }
      });
    } catch (err) {
      console.warn('[ProjectsShader] Progressive load error:', err);
    }
  }

  _initRenderer() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    this.container.appendChild(this.renderer.domElement);
  }

  _initScene() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.scene  = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -1, 1);
  }

  // ── Mesh ──────────────────────────────────────────────────
  _initMesh() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.geometry = new THREE.PlaneGeometry(w, h);

    this.uniforms = {
      u_texture0:           { value: this.textures[0] },
      u_texture1:           { value: this.textures[0] },
      u_displacement:       { value: this.displacement },
      u_progress:           { value: 0 },
      u_resolution:         { value: new THREE.Vector2(w, h) },
      u_textureResolution0: { value: new THREE.Vector2(1, 1) },
      u_textureResolution1: { value: new THREE.Vector2(1, 1) },
      u_strength:           { value: this._reducedMotion ? 0 : DISPLACEMENT_STRENGTH },
      u_rgbShift:           { value: this._reducedMotion ? 0 : RGB_SHIFT },
      u_scale:              { value: this._reducedMotion ? 0 : SCALE_EFFECT },
    };

    this._setTextureResolution(0, this.textures[0]);
    this._setTextureResolution(1, this.textures[0]);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  _setTextureResolution(index, texture) {
    const img = texture?.image;
    if (img?.width && img?.height) {
      this.uniforms[`u_textureResolution${index}`].value.set(
        img.width,
        img.height
      );
    }
  }

  // ── ScrollTrigger + Lenis ─────────────────────────────────
  _initScrollTrigger() {
    this.lenis = new Lenis();
    this.lenis.scrollTo(0, { immediate: true });
    this.lenis.on('scroll', ScrollTrigger.update);

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.scrollEl,
      start:   'top top',
      end:     `+=${(this.imageUrls.length - 1) * 200}%`,
      scrub:   1.2,
      onUpdate: (self) => {
        const newIndex = Math.round(self.progress * (this.imageUrls.length - 1));
        this._transitionTo(newIndex);
      },
    });
  }

  // ── Transition logic ──────────────────────────────────────
  _transitionTo(index) {
    if (
      index < 0 ||
      index >= this.imageUrls.length ||
      index === this.currentIndex ||
      this.isTransitioning
    ) {
      this.targetIndex = index;
      return;
    }

    const nextTexture = this.textures[index];
    // If texture is still loading placeholder, save targetIndex and transition when loaded
    if (!nextTexture || nextTexture === this.placeholder) {
      this.targetIndex = index;
      return;
    }

    this.targetIndex     = index;
    this.isTransitioning = true;

    this.uniforms.u_texture1.value = nextTexture;
    this._setTextureResolution(1, nextTexture);

    gsap.to(this.uniforms.u_progress, {
      value:    1,
      duration: TRANSITION_DURATION,
      ease:     TRANSITION_EASE,
      overwrite: true,
      onComplete: () => {
        this.uniforms.u_texture0.value  = nextTexture;
        this._setTextureResolution(0, nextTexture);
        this.uniforms.u_progress.value  = 0;
        this.currentIndex               = index;
        this.isTransitioning            = false;

        // Chain transitions if target changed during animation
        if (this.targetIndex !== this.currentIndex) {
          this._transitionTo(this.targetIndex);
        }
      },
    });
  }

  // ── Render loop ───────────────────────────────────────────
  _startRenderLoop() {
    this._renderBound = (time) => {
      if (this._destroyed) return;
      this.lenis?.raf(time);
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      this._rafId = requestAnimationFrame(this._renderBound);
    };
    this._rafId = requestAnimationFrame(this._renderBound);
  }

  // ── Resize ────────────────────────────────────────────────
  _initResize() {
    this._resizeTimeout = null;
    this._onResize = () => {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = setTimeout(() => {
        if (this._destroyed) return;
        const { clientWidth: w, clientHeight: h } = this.container;

        this.renderer.setSize(w, h);

        this.camera.left   = -w / 2;
        this.camera.right  =  w / 2;
        this.camera.top    =  h / 2;
        this.camera.bottom = -h / 2;
        this.camera.updateProjectionMatrix();

        this.mesh.geometry.dispose();
        this.mesh.geometry = new THREE.PlaneGeometry(w, h);
        this.uniforms.u_resolution.value.set(w, h);

        ScrollTrigger.update();
      }, 100);
    };
    window.addEventListener('resize', this._onResize);
  }

  // ── Destroy ───────────────────────────────────────────────
  destroy() {
    this._destroyed = true;

    // Cancel render loop
    if (this._rafId) cancelAnimationFrame(this._rafId);

    // Lenis
    if (this.lenis) this.lenis.destroy();

    // ScrollTrigger
    if (this.scrollTrigger) this.scrollTrigger.kill();

    // Resize
    clearTimeout(this._resizeTimeout);
    window.removeEventListener('resize', this._onResize);

    // Three.js cleanup
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.placeholder) this.placeholder.dispose();
  }
}
