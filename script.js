/**
 * Cinematic Environment Engine (Version 1.3 Atmospheric Sky)
 * Namespace structure to manage lifecycle, states, and render threads.
 */

const GardenEngine = (() => {
  'use strict';

  // 1. Core Configuration Parameters
  const Config = {
    fpsLimit: 60,
    resizeDebounceDelay: 150,
  };

  // 2. Global State Engine
  const State = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    isInitialized: false,
    isActive: true,
    lastFrameTime: 0,
    deltaTime: 0,
  };

  // 3. Module Registry (To easily mount future visual sub-systems)
  const ActiveSystems = new Set();

  /**
   * Performance-optimized window resizing utility.
   * Debounces callback execution to protect GPU performance.
   */
  const ResizeManager = {
    timer: null,

    init() {
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.handleResize.bind(this), { passive: true });
      this.updateViewportDimensions();
    },

    updateViewportDimensions() {
      State.width = window.innerWidth;
      State.height = window.innerHeight;
      State.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      // Trigger resize handlers on all mounted dynamic modules
      ActiveSystems.forEach(system => {
        if (typeof system.onResize === 'function') {
          system.onResize(State.width, State.height, State.pixelRatio);
        }
      });
    },

    handleResize() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateViewportDimensions();
      }, Config.resizeDebounceDelay);
    }
  };

  /**
   * Centralized Animation Loop Manager.
   * Computes delta-time independently of screen refresh-rates.
   */
  const AnimationManager = {
    frameId: null,

    start() {
      State.lastFrameTime = performance.now();
      this.loop(State.lastFrameTime);
    },

    loop(currentTime) {
      if (!State.isActive) return;

      this.frameId = requestAnimationFrame(this.loop.bind(this));

      State.deltaTime = (currentTime - State.lastFrameTime) / 1000;
      State.lastFrameTime = currentTime;

      // Update state and render all registered sub-systems
      ActiveSystems.forEach(system => {
        if (typeof system.update === 'function') {
          system.update(State.deltaTime);
        }
        if (typeof system.render === 'function') {
          system.render();
        }
      });
    },

    stop() {
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
    }
  };

  /**
   * Environment System (Version 1.3 Sub-System)
   * Renders a highly performance-optimized, slowly breathing atmospheric evening sky
   * using offscreen bilinear scaling calculations to avoid color banding.
   */
  const EnvironmentSystem = {
    name: 'EnvironmentSystem',
    canvas: null,
    ctx: null,
    
    // Low-resolution rendering grid to achieve smooth gradient integration & avoid pixel painting overhead
    bufferWidth: 512,
    bufferHeight: 512,

    // Time phase variables to cycle atmospheric drift
    ambientTime: 0,
    ambientSpeed: 0.04, // Extremely slow speed (approx. 2.5 min cycles)

    init(width, height, dpr) {
      this.canvas = document.getElementById('environment-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      
      // Preserve canvas back-buffer resolution at fixed performance constraints
      // This allows hardware scales on the GPU while maintaining fluid 60fps
      this.canvas.width = this.bufferWidth;
      this.canvas.height = this.bufferHeight;
    },

    update(dt) {
      // Accumulate slow-time cycles for continuous movement
      this.ambientTime += this.ambientSpeed * dt;
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const w = this.bufferWidth;
      const h = this.bufferHeight;

      ctx.clearRect(0, 0, w, h);

      // Base: Midnight Blue to Lavender-Purple twilight base gradient
      const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
      baseGradient.addColorStop(0, 'hsla(230, 25%, 12%, 1)'); // Deep Midnight Blue
      baseGradient.addColorStop(0.5, 'hsla(260, 20%, 18%, 1)'); // Soft Lavender Shadow
      baseGradient.addColorStop(1, 'hsla(265, 30%, 25%, 1)'); // Warm Lavender Haze
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, w, h);

      // Calculate smooth oscillating vectors using trigonometric curves
      const driftX = Math.sin(this.ambientTime) * (w * 0.15);
      const driftY = Math.cos(this.ambientTime * 0.8) * (h * 0.08);

      // Gradient 2: Glowing Soft Golden twilight center representing the warm horizon
      const horizonGlow = ctx.createRadialGradient(
        w * 0.5 + driftX,      // Slow x-drift
        h * 0.85 + driftY,     // Slow y-drift
        0, 
        w * 0.5 + driftX, 
        h * 0.85 + driftY, 
        w * 0.6
      );
      horizonGlow.addColorStop(0, 'hsla(43, 40%, 75%, 0.15)'); // Soft Gold
      horizonGlow.addColorStop(0.5, 'hsla(350, 40%, 88%, 0.08)'); // Blush Pink
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fades out completely
      
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      // Gradient 3: Cool, ambient atmospheric light casting down from upper elements
      const upperAtmosphereGlow = ctx.createRadialGradient(
        w * 0.35 - driftX * 0.5, 
        h * 0.2 + driftY * 0.5, 
        w * 0.1, 
        w * 0.35 - driftX * 0.5, 
        h * 0.2 + driftY * 0.5, 
        w * 0.8
      );
      upperAtmosphereGlow.addColorStop(0, 'hsla(205, 35%, 84%, 0.12)'); // Soft Baby Blue
      upperAtmosphereGlow.addColorStop(0.6, 'hsla(265, 30%, 82%, 0.04)'); // Soft Lavender Haze
      upperAtmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = upperAtmosphereGlow;
      ctx.fillRect(0, 0, w, h);
    }
  };

  /**
   * Loading Screen System (Version 1.2 Sub-System - Preserved)
   * Manages SVG Calligraphy strokes, magical dust canvas updates, and transitions.
   */
  const LoadingSystem = {
    name: 'LoadingSystem',
    canvas: null,
    ctx: null,
    particles: [],
    maxParticles: 45,
    isRunning: true,

    init(width, height, dpr) {
      this.canvas = document.getElementById('loading-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.onResize(width, height, dpr);
      this.generateParticles();
      this.triggerMonogramTimeline();
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);
    },

    generateParticles() {
      this.particles = [];
      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push({
          x: utils.randomRange(0, State.width),
          y: utils.randomRange(0, State.height),
          radius: utils.randomRange(1, 2.8),
          opacity: utils.randomRange(0.1, 0.6),
          baseOpacity: utils.randomRange(0.1, 0.5),
          vx: utils.randomRange(-8, 8),
          vy: utils.randomRange(-15, -5),
          pulseSpeed: utils.randomRange(1, 3),
          pulsePhase: utils.randomRange(0, Math.PI * 2)
        });
      }
    },

    update(dt) {
      if (!this.isRunning) return;

      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.x += (p.vx * dt);
        p.y += (p.vy * dt);

        p.pulsePhase += p.pulseSpeed * dt;
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.15;
        p.opacity = utils.clamp(p.opacity, 0.05, 0.85);

        if (p.y < -10) {
          p.y = State.height + 10;
          p.x = utils.randomRange(0, State.width);
        }
        if (p.x < -10 || p.x > State.width + 10) {
          p.x = utils.randomRange(0, State.width);
        }
      }
    },

    render() {
      if (!this.isRunning || !this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 60%, 75%, ${p.opacity})`;
        ctx.shadowColor = 'hsla(43, 60%, 75%, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    },

    triggerMonogramTimeline() {
      const paths = document.querySelectorAll('.draw-path');
      const monogramSvg = document.querySelector('.monogram-svg');
      const message = document.querySelector('.loading-message');

      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });

      setTimeout(() => {
        paths.forEach(path => {
          path.style.strokeDashoffset = '0';
        });
      }, 400);

      setTimeout(() => {
        if (monogramSvg) monogramSvg.classList.add('glowing');
      }, 2100);

      setTimeout(() => {
        if (message) message.classList.add('visible');
      }, 3000);

      setTimeout(() => {
        SceneManager.revealWorld();
      }, 4500);
    },

    destroy() {
      this.isRunning = false;
      this.particles = [];
      if (this.canvas) {
        this.canvas.style.display = 'none';
      }
    }
  };

  /**
   * Scene Manager to handle initialization lifecycle steps,
   * mount scene layers, and control transition states. (Preserved)
   */
  const SceneManager = {
    dom: {},

    init() {
      this.dom = {
        loading: document.getElementById('layer-loading'),
        world: document.getElementById('layer-world'),
      };
    },

    revealWorld() {
      if (this.dom.loading) {
        this.dom.loading.style.opacity = '0';
        this.dom.loading.style.pointerEvents = 'none';

        setTimeout(() => {
          this.dom.loading.style.display = 'none';
          LoadingSystem.destroy();
          GardenEngine.unregisterSystem(LoadingSystem);
        }, 1200);
      }
    }
  };

  /**
   * Mathematical and functional utility helpers. (Preserved)
   */
  const Utils = {
    randomRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
  };

  // Public API exposure (Preserved & Enhanced)
  return {
    init() {
      if (State.isInitialized) return;

      ResizeManager.init();
      SceneManager.init();
      
      // Register global systems
      this.registerSystem(LoadingSystem);
      this.registerSystem(EnvironmentSystem); // Version 1.3 Active
      
      AnimationManager.start();

      State.isInitialized = true;
      console.log('Garden Engine initialized.');
    },

    registerSystem(system) {
      if (system && typeof system.init === 'function') {
        system.init(State.width, State.height, State.pixelRatio);
        ActiveSystems.add(system);
        console.log(`System mounted successfully: ${system.name || 'Anonymous'}`);
      }
    },

    unregisterSystem(system) {
      if (ActiveSystems.has(system)) {
        ActiveSystems.delete(system);
      }
    },

    getUtils() {
      return Utils;
    }
  };
})();

// Boot engine once DOM loads completely
document.addEventListener('DOMContentLoaded', () => {
  GardenEngine.init();
});
