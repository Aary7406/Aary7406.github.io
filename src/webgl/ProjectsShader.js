// src/webgl/ProjectsShader.js
// Faithful port of agentPritam47/image-distortion main.js
// Plain Three.js class — React-lifecycle-safe (init on mount, destroy on unmount).
// Uses Lenis smooth scroll + GSAP ScrollTrigger for scroll-driven transitions.

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import vertexShader from '../shaders/projects/vertex.glsl';
import fragmentShader from '../shaders/projects/fragment.glsl';

gsap.registerPlugin(ScrollTrigger);

// ── CUSTOMIZABLE CONSTANTS ────────────────────────────────────
// DISPLACEMENT_STRENGTH: how much the displacement map distorts UVs. Range: 0.2 → 1.2
// RGB_SHIFT:             per-channel color separation. Range: 0.01 → 0.1
// SCALE_EFFECT:          zoom at transition midpoint. Range: 0.05 → 0.3
// TRANSITION_DURATION:   seconds per transition. Range: 0.4 → 1.5
// TRANSITION_EASE:       GSAP easing function
// PIXEL_RATIO_CAP:       caps DPR to avoid GPU overload. Range: 1 → 2
// DISPLACEMENT_PATH:     path to displacement map in public/
// ─────────────────────────────────────────────────────────────
const DISPLACEMENT_STRENGTH = 0.8;
const RGB_SHIFT             = 0.05;
const SCALE_EFFECT          = 0.15;
const TRANSITION_DURATION   = 0.8;
const TRANSITION_EASE       = 'power3.inOut';
const PIXEL_RATIO_CAP       = 2;
const DISPLACEMENT_PATH     = '/displacement-13.jpg';

export default class ProjectsShader {
  /**
   * @param {HTMLElement} containerEl  — DOM element to append canvas to
   * @param {HTMLElement} scrollEl     — the scrollable wrapper (trigger for ScrollTrigger)
   * @param {string[]}   imageUrls    — image paths in public/Projects/
   * @param {Function}   [onReady]    — called after all textures are loaded and ScrollTrigger is created
   */
  constructor(containerEl, scrollEl, imageUrls, onReady) {
    this.container = containerEl;
    this.scrollEl  = scrollEl;
    this.imageUrls = imageUrls;
    this.onReady   = onReady;

    this.textures        = [];
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
      await this._loadTextures();
      if (this._destroyed) return;
      this._initMesh();
      this._initScrollTrigger();
      this._initResize();
      this._startRenderLoop();
      if (this.onReady) this.onReady();
    } catch (err) {
      console.warn('[ProjectsShader] Init failed:', err);
      this.container.classList.add('webgl-fallback');
    }
  }

  _initRenderer() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    this.container.appendChild(this.renderer.domElement);
  }

  _initScene() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.scene  = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, -1, 1);
  }

  // ── Texture loading ────────────────────────────────────────
  async _loadTextures() {
    const loader = new THREE.TextureLoader();

    const loadOne = (url) =>
      new Promise((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            resolve(tex);
          },
          undefined,
          reject
        );
      });

    const [loadedTextures, displacement] = await Promise.all([
      Promise.all(this.imageUrls.map((url) => loadOne(url))),
      loadOne(DISPLACEMENT_PATH),
    ]);

    this.textures     = loadedTextures;
    this.displacement = displacement;
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

    // Set initial texture resolutions
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
    if (texture.image?.width) {
      this.uniforms[`u_textureResolution${index}`].value.set(
        texture.image.width,
        texture.image.height
      );
    }
  }

  // ── ScrollTrigger + Lenis ─────────────────────────────────
  _initScrollTrigger() {
    // Lenis smooth scroll
    this.lenis = new Lenis();
    this.lenis.scrollTo(0, { immediate: true });
    this.lenis.on('scroll', ScrollTrigger.update);

    // ScrollTrigger driving transitions
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.scrollEl,
      start:   'top top',
      // 200 matches the 200vh min-height of each project section —
      // ensures every transition fires at the same relative scroll point
      // (halfway through its section). Change 200 to adjust scroll distance.
      end:     `+=${(this.textures.length - 1) * 200}%`,
      // scrub lag in seconds — higher = more cinematic weighted feel. Range: 0.5 → 2.5
      scrub:   1.2,
      onUpdate: (self) => {
        const newIndex = Math.round(self.progress * (this.textures.length - 1));
        this._transitionTo(newIndex);
      },
    });
  }

  // ── Transition logic (direct port from reference) ─────────
  _transitionTo(index) {
    if (
      index < 0 ||
      index >= this.textures.length ||
      index === this.currentIndex ||
      this.isTransitioning
    ) {
      this.targetIndex = index;
      return;
    }

    this.targetIndex     = index;
    this.isTransitioning = true;

    this.uniforms.u_texture1.value = this.textures[index];
    this._setTextureResolution(1, this.textures[index]);

    gsap.to(this.uniforms.u_progress, {
      value:    1,
      duration: TRANSITION_DURATION,
      ease:     TRANSITION_EASE,
      overwrite: true,
      onComplete: () => {
        this.uniforms.u_texture0.value  = this.textures[index];
        this._setTextureResolution(0, this.textures[index]);
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
      this.lenis.raf(time);
      this.renderer.render(this.scene, this.camera);
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
    if (this.textures) this.textures.forEach((t) => t?.dispose());
    if (this.displacement) this.displacement.dispose();
  }
}
