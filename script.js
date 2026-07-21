/**
 * Application Foundation Script
 * Developed using Vanilla JS. Keeps core utilities separate from global scope.
 */

'use strict';

// IIFE to contain variable scoping and secure architecture
(function() {
  
  // Reusable DOM Utility Helper Functions
  const DOM = {
    /**
     * Find element inside DOM context
     * @param {string} selector - CSS Selector string
     * @param {HTMLElement} [context=document] - Parent element constraint
     * @returns {HTMLElement|null}
     */
    find: (selector, context = document) => context.querySelector(selector),

    /**
     * Find all elements inside DOM context
     * @param {string} selector - CSS Selector string
     * @param {HTMLElement} [context=document] - Parent element constraint
     * @returns {NodeList}
     */
    findAll: (selector, context = document) => context.querySelectorAll(selector),

    /**
     * Safe event binding mechanism
     * @param {HTMLElement} target - DOM Element
     * @param {string} type - Event action string
     * @param {Function} handler - Event handler callback
     */
    on: (target, type, handler) => {
      if (target) target.addEventListener(type, handler);
    }
  };

  /**
   * Utility helper to throttle function executions
   * @param {Function} func - Function to execute
   * @param {number} limit - Execution limit threshold in milliseconds
   * @returns {Function}
   */
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Canvas Loader Floating Particles Controller
  const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,
    running: false,
    
    // Configurable Particle Options
    config: {
      count: 45,
      minSize: 1,
      maxSize: 3.5,
      minSpeed: 0.1,
      maxSpeed: 0.55,
      color: 'rgba(251, 191, 36, 0.4)' // Soft amber gold
    },

    /**
     * Start animation container
     * @param {HTMLCanvasElement} canvasElement 
     */
    init: function(canvasElement) {
      if (!canvasElement) return;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.running = true;

      this.resizeCanvas();
      this.createParticles();
      this.animate();

      DOM.on(window, 'resize', () => this.resizeCanvas());
    },

    resizeCanvas: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles: function() {
      this.particles = [];
      for (let i = 0; i < this.config.count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
          speedY: -(Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed),
          speedX: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.5 + 0.2,
          fadeSpeed: Math.random() * 0.005 + 0.002,
          oscillating: Math.random() > 0.5
        });
      }
    },

    animate: function() {
      if (!this.running) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // Draw Soft Glowing Particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Add subtle radial bloom to particles
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, `rgba(251, 191, 36, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(251, 191, 36, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Update Position
        p.y += p.speedY;
        p.x += p.speedX;

        // Subtly oscillate alpha to mimic embers/fireflies
        if (p.oscillating) {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.15) {
            p.oscillating = false;
          }
        } else {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 0.75) {
            p.oscillating = true;
          }
        }

        // Wrap around boundary logic
        if (p.y < -p.radius * 2) {
          p.y = this.canvas.height + p.radius * 2;
          p.x = Math.random() * this.canvas.width;
        }
        if (p.x < -p.radius * 2 || p.x > this.canvas.width + p.radius * 2) {
          p.x = Math.random() * this.canvas.width;
        }
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    /**
     * Clean resources, detach animation updates to prevent background execution
     */
    stop: function() {
      this.running = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  };

  // Canvas Garden Ambient Effects Controller (Organically Clustered Twinkling Stars, Petals, Fireflies)
  const GardenEffects = {
    canvas: null,
    ctx: null,
    stars: [],
    fireflies: [],
    petals: [],
    animationFrameId: null,
    active: false,

    init: function(canvasElement) {
      if (!canvasElement) return;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.active = true;

      this.resizeCanvas();
      this.setupFXLayers();
      this.loop();

      DOM.on(window, 'resize', () => {
        this.resizeCanvas();
        this.setupFXLayers(); // Dynamic density re-calculation on screen scaling
      });
    },

    resizeCanvas: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    setupFXLayers: function() {
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Estimate the exact absolute pixel center of the upper-right centerpiece Moon
      const moonSize = Math.max(260, Math.min(w * 0.24, 420));
      const moonRadius = moonSize / 2;
      const moonX = w - (w * 0.08) - moonRadius;
      const moonY = (h * 0.06) + moonRadius;

      // 1. Organic Countryside Star Field Layer
      this.stars = [];
      
      // Seed positions to form realistic galaxy/dust-cloud clustering
      const clusterSeeds = [
        { x: w * 0.15, y: h * 0.25 },
        { x: w * 0.35, y: h * 0.15 },
        { x: w * 0.50, y: h * 0.45 },
        { x: w * 0.70, y: h * 0.20 }
      ];

      // Responsive quantity distribution (e.g. ~240 stars on desktop viewports)
      const starDensityFactor = Math.floor((w * h) / 5500);
      const starCount = Math.max(120, Math.min(starDensityFactor, 320));

      for (let i = 0; i < starCount; i++) {
        let x, y;

        // 60% of stars cluster around seeds (Milky Way simulation); 40% are scattered randomly
        if (Math.random() < 0.60) {
          const seed = clusterSeeds[Math.floor(Math.random() * clusterSeeds.length)];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.pow(Math.random(), 2.5) * 320; // Concentrated center density distribution
          x = seed.x + Math.cos(angle) * distance;
          y = seed.y + Math.sin(angle) * distance;
        } else {
          x = Math.random() * w;
          y = Math.random() * h;
        }

        // Keep bounds aligned
        if (x < 0) x = w + (x % w);
        if (x > w) x = x % w;
        if (y < 0) y = h + (y % h);
        if (y > h) y = y % h;

        // Calculate distance relative to center of moon body
        const dx = x - moonX;
        const dy = y - moonY;
        const distToMoon = Math.sqrt(dx * dx + dy * dy);

        // Cull stars placed directly over the solid physical sphere of the moon
        if (distToMoon < moonRadius) continue;

        // Faint ambient light washout factor (moonlit atmospheric fade out)
        let lunarWashout = 1.0;
        const washoutStartRadius = moonRadius + 20;
        const washoutEndRadius = moonRadius + 280;

        if (distToMoon < washoutEndRadius) {
          lunarWashout = (distToMoon - washoutStartRadius) / (washoutEndRadius - washoutStartRadius);
          if (lunarWashout < 0) lunarWashout = 0; // Completely blank directly beside lunar rim
        }

        // Color profiles (90% soft warm off-white, 5% cool ice-blue, 5% warm yellow/amber)
        let rgbString = '254, 253, 246'; // Soft Country White
        const randColor = Math.random();
        if (randColor < 0.05) {
          rgbString = '147, 197, 253'; // Ice Blue Tint
        } else if (randColor < 0.10) {
          rgbString = '251, 191, 36'; // Golden Amber Tint
        }

        // Layering depth properties (Distant faint stars vs foreground bright stars)
        const isDistantBg = Math.random() < 0.45;
        const size = isDistantBg 
          ? (Math.random() * 0.35 + 0.15) // Deep distant particles
          : (Math.random() * 1.0 + 0.4);   // Closer prominent stars

        const maxAlpha = (isDistantBg 
          ? (Math.random() * 0.18 + 0.05) 
          : (Math.random() * 0.65 + 0.25)) * lunarWashout;

        this.stars.push({
          x: x,
          y: y,
          size: size,
          maxAlpha: maxAlpha,
          rgb: rgbString,
          // Independent astronomical twinkling speeds & starting oscillation phases
          twinkleSpeed: Math.random() * 0.012 + 0.003,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }

      // 2. Wandering Ambient Fireflies
      this.fireflies = [];
      for (let i = 0; i < 24; i++) {
        this.fireflies.push({
          x: Math.random() * w,
          y: h * 0.4 + Math.random() * (h * 0.55), // Ground focused
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.7 + 0.1,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
          wobble: Math.random() * 0.02 + 0.01
        });
      }

      // 3. Floating Blush Pink Petals
      this.petals = [];
      for (let i = 0; i < 18; i++) {
        this.petals.push({
          x: Math.random() * w,
          y: -20 - (Math.random() * h),
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 0.7 + 0.4,
          speedX: Math.random() * 0.3 - 0.15,
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 1.5 - 0.75,
          swingAngle: Math.random() * Math.PI,
          swingSpeed: Math.random() * 0.01 + 0.005
        });
      }
    },

    loop: function() {
      if (!this.active) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Render Layer 1: Independently Twinkling Countryside Stars
      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        
        // Cycle twinkle phase smoothly over time
        s.twinklePhase += s.twinkleSpeed;
        
        // Soft atmospheric shimmer (oscillates between 30% and 100% of maximum alpha)
        const twinkleScale = 0.35 + 0.65 * (Math.sin(s.twinklePhase) * 0.5 + 0.5);
        const currentAlpha = s.maxAlpha * twinkleScale;

        ctx.fillStyle = `rgba(${s.rgb}, ${Math.max(0.01, Math.min(s.maxAlpha, currentAlpha))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Layer 2: Glowing Soft Gold Fireflies
      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        
        // Organic random walk drift updates
        f.angle += f.wobble;
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * (f.speed * 0.8) - 0.05; // Gentle upward float bias
        
        f.alpha += f.pulseSpeed;
        if (f.alpha > 0.85 || f.alpha < 0.1) {
          f.pulseSpeed = -f.pulseSpeed;
        }

        // Screen boundary looping
        if (f.x < -20) f.x = w + 20;
        if (f.x > w + 20) f.x = -20;
        if (f.y < h * 0.25) f.y = h + 20;
        if (f.y > h + 20) f.y = h * 0.4;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 2.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 2.5);
        glow.addColorStop(0, `rgba(243, 210, 122, ${Math.max(0.1, f.alpha)})`);
        glow.addColorStop(0.4, `rgba(251, 191, 36, ${f.alpha * 0.3})`);
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Render Layer 3: Drifting Blush Pink Petals
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.y += p.speedY;
        p.swingAngle += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swingAngle) * 0.25;
        p.rotation += p.rotSpeed;

        if (p.y > h + 20 || p.x < -20 || p.x > w + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        
        ctx.beginPath();
        // Handcrafted soft organic petal paths using bezier paths
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size, p.size / 2, -p.size, 0, 0);
        ctx.fillStyle = 'rgba(250, 225, 230, 0.7)'; // Blush pink base
        ctx.fill();
        
        // Add subtle petal inner highlight shading
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 4, -p.size * 0.8, p.size / 4, -p.size * 0.8, 0, 0);
        ctx.fillStyle = 'rgba(251, 207, 232, 0.85)'; // Slightly darker rose petal spine
        ctx.fill();

        ctx.restore();
      }

      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
  };

  // Application Logic Module
  const App = {
    init: function() {
      this.initLoader();
      this.initMobileMenu();
      this.initDynamicYear();
      this.setupResponsiveListeners();
      this.initSceneControllers();
    },

    /**
     * Initializes Loader overlay, binds Canvas Particle generation, 
     * and schedules elegant transition out after 4 seconds
     */
    initLoader: function() {
      const loaderOverlay = DOM.find('#premium-loader');
      const loaderCanvas = DOM.find('#loader-particles');

      if (!loaderOverlay) return;

      // Start floating glow particles inside canvas
      if (loaderCanvas) {
        ParticleSystem.init(loaderCanvas);
      }

      // Schedule Fade Out (Approx. 4 Seconds cinematic hold)
      setTimeout(() => {
        loaderOverlay.classList.add('loader-fade-out');
        loaderOverlay.setAttribute('aria-busy', 'false');

        // Start immersive garden background canvas layers once overlay fades
        const gardenCanvas = DOM.find('#garden-interactive-canvas');
        if (gardenCanvas) {
          GardenEffects.init(gardenCanvas);
        }

        // Cleanup loader resources once transition completes
        setTimeout(() => {
          ParticleSystem.stop();
          loaderOverlay.remove(); // Safely remove element from dynamic DOM structure
        }, 800); // Synchronized with --transition-cinematic timeline

      }, 4200);
    },

    /**
     * Set up UI controls to toggle interface layers to allow full screen focus
     */
    initSceneControllers: function() {
      const viewToggle = DOM.find('#ui-visibility-toggle');
      if (!viewToggle) return;

      DOM.on(viewToggle, 'click', () => {
        const body = document.body;
        body.classList.toggle('dashboard-hidden');
        
        // Update textual/visual details inside toggle button
        const isHidden = body.classList.contains('dashboard-hidden');
        const txt = DOM.find('.toggle-text', viewToggle);
        if (txt) {
          txt.textContent = isHidden ? 'Show Interface' : 'Toggle View';
        }
      });
    },

    /**
     * Initializes responsive toggle settings and accessibility properties for site header
     */
    initMobileMenu: function() {
      const toggleBtn = DOM.find('.mobile-nav-toggle');
      const navigation = DOM.find('.primary-navigation');

      if (!toggleBtn || !navigation) return;

      DOM.on(toggleBtn, 'click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        navigation.classList.toggle('open', !isOpen);
      });

      // Close navigation automatically if background wrapper is selected or window resize happens
      DOM.on(document, 'click', (e) => {
        if (!toggleBtn.contains(e.target) && !navigation.contains(e.target)) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          navigation.classList.remove('open');
        }
      });
    },

    /**
     * Updates copyright year tags within HTML elements automatically
     */
    initDynamicYear: function() {
      const yearContainer = DOM.find('#current-year');
      if (yearContainer) {
        yearContainer.textContent = new Date().getFullYear();
      }
    },

    /**
     * Listens to interface layout properties to reset state context changes
     */
    setupResponsiveListeners: function() {
      const toggleBtn = DOM.find('.mobile-nav-toggle');
      const navigation = DOM.find('.primary-navigation');

      if (!toggleBtn || !navigation) return;

      const handleResize = throttle(() => {
        if (window.innerWidth >= 768) {
          // Revert ARIA states if returning to viewport structures without dynamic dropdowns
          toggleBtn.setAttribute('aria-expanded', 'false');
          navigation.classList.remove('open');
        }
      }, 200);

      DOM.on(window, 'resize', handleResize);
    }
  };

  // Initialize once DOM tree completes processing
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });

})();
