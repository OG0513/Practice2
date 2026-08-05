/**
 * A Little World Made Just for Her - Version 3.0 Memory Lane Scrapbook Foundation
 * Cinematic, Interactive Web Experience
 *
 * Logical Systems:
 * - Config: Dynamic palette definitions, stroke vectors, species configurations, fluid timing sequence.
 * - Utils: Math, easing, DOM, and debounced window resize utilities.
 * - ResponsiveSystem: Adaptive viewport layout, meadow proportions (28-36%),
 *   safe-area inset handlers, and dynamic object scaling.
 * - ParticleSystem: Canvas engine for stars, shooting stars, ultra-slow dust & fireflies.
 * - GrassSystem: Planting Zone flower & grass engine (adaptive grass counts 320-650, flower counts 45-135).
 * - HandwritingSystem: SVG stroke handwriting animation & active pen tip tracker.
 * - SceneManager: Scene mounting, paper roll arrival, vertical unfurling, letter reveal, Continue interaction,
 *   Memory Lane environment transition & Horizontal Scrapbook Scroll controller.
 * - TimelineManager: Story narrative sequence controller.
 */

/* ==================================================
   1. CONFIGURATION SYSTEM
   ================================================== */
const Config = {
  initials: {
    viewBox: "0 0 600 240",
    strokes: [
      {
        id: "stroke-1",
        // Cursive 'A' main loop & flourish stem
        d: "M 65,160 C 45,140 45,95 75,70 C 100,50 135,50 138,95 C 142,140 135,185 130,200 C 128,205 120,195 125,165 C 135,115 155,110 175,135 C 185,148 195,160 210,158",
        duration: 1800,
        strokeWidth: 3.5,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-2",
        // Cursive 'A' crossbar
        d: "M 100,128 C 120,120 150,118 175,125",
        duration: 600,
        strokeWidth: 3.0,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-3",
        // Elegant Ampersand '&'
        d: "M 300,135 C 315,118 318,100 302,88 C 285,75 265,95 282,122 C 298,150 315,172 278,178 C 258,181 248,162 262,148 C 282,128 308,118 328,152 C 335,165 342,175 348,173",
        duration: 1400,
        strokeWidth: 3.0,
        color: "var(--color-soft-gold)"
      },
      {
        id: "stroke-4",
        // Cursive 'M' flourish arches & tail
        d: "M 385,150 C 375,138 372,118 388,95 C 402,72 418,72 418,118 C 418,148 412,185 412,195 C 412,200 418,192 428,165 C 442,125 458,92 468,112 C 475,128 468,178 468,192 C 468,198 474,190 484,165 C 498,125 512,95 522,115 C 528,130 525,165 538,160 C 548,155 558,145 565,140",
        duration: 2200,
        strokeWidth: 3.5,
        color: "var(--color-cream)"
      }
    ]
  },
  particles: {
    colors: [
      "rgba(252, 248, 242, 0.75)", // Cream
      "rgba(230, 202, 133, 0.8)",  // Soft Gold
      "rgba(247, 214, 208, 0.65)", // Blush Pink
      "rgba(200, 221, 242, 0.65)", // Baby Blue
      "rgba(226, 216, 238, 0.65)"  // Lavender
    ],
    stardustColor: "rgba(252, 232, 158, 0.9)"
  },
  sky: {
    starCount: 130,
    starColors: [
      "rgba(252, 248, 242, 0.9)",  // Cream
      "rgba(230, 202, 133, 0.95)", // Soft Gold
      "rgba(247, 214, 208, 0.85)", // Blush Pink
      "rgba(200, 221, 242, 0.85)", // Baby Blue
      "rgba(226, 216, 238, 0.85)"  // Lavender
    ]
  },
  grass: {
    palette: {
      back: ["#162a24", "#1a332b", "#1f3a32"],
      mid: ["#234338", "#2a4f43", "#315b4d"],
      front: ["#345e52", "#3e6f61", "#487e70"]
    },
    moonlightTip: "rgba(230, 202, 133, 0.4)"
  },
  flowers: {
    species: ["daisy", "lavender", "cosmos", "bluebell", "buttercup", "violet"],
    palette: {
      daisy: { petal: "#fcf8f2", center: "#e6ca85" },
      lavender: { floret: "#c5b2db", stem: "#2a4a3e" },
      cosmos: { petal: "#f3b1aa", center: "#fce89e" },
      bluebell: { petal: "#b3d1ee", stem: "#28483c" },
      buttercup: { petal: "#fce89e", center: "#385d52" },
      violet: { petal: "#b590d6", center: "#fcf8f2" }
    }
  },
  fireflies: {
    color: "rgba(252, 232, 158, 0.95)",
    glowColor: "rgba(230, 202, 133, 0.28)"
  },
  timings: {
    initialPause: 1000,            // Fast loading pause
    interStrokeDelay: 120,         // Faster stroke transition
    glowDelay: 350,                // Delay after writing before glow
    subtitleDelay: 600,            // Subtitle fade in delay
    subtitleHold: 3000,            // Subtitle reading pause
    fadeSceneDuration: 1800,       // Fluid scene fade duration
    gardenAdmirePause: 1200,       // Garden visible for ~1.2s before scroll slides in
    rollPauseBeforeUnfurl: 500,    // Pause ~0.5s at center before opening
    unfurlDuration: 2200,          // Parchment opens smoothly in ~2.2s
    pauseBeforeLetterReveal: 400,  // Pause ~0.4s before text reveals
    lineRevealInterval: 750,       // Line reveal pacing ~0.75s per line
    pauseBeforeContinue: 500       // Wait ~0.5s after last line before "Continue →" appears
  }
};

/* ==================================================
   2. UTILITY HELPERS
   ================================================== */
const Utils = {
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },
  randomRange(min, max) {
    return Math.random() * (max - min) + min;
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

/* ==================================================
   3. RESPONSIVE ENVIRONMENT ENGINE
   ================================================== */
class ResponsiveSystem {
  constructor(particleCanvas, grassCanvas, particleSystem, grassSystem) {
    this.particleCanvas = particleCanvas;
    this.grassCanvas = grassCanvas;
    this.particleSystem = particleSystem;
    this.grassSystem = grassSystem;

    this.debouncedResize = Utils.debounce(() => this.handleResize(), 100);
    this.init();
  }

  getViewportCategory() {
    const w = window.innerWidth;
    if (w < 380) return 'small-phone';
    if (w < 600) return 'medium-phone';
    if (w < 1024) return 'tablet';
    if (w < 1440) return 'laptop';
    return 'desktop';
  }

  getMeadowHeightPct() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone':
      case 'medium-phone':
        return 0.35; // 35% on Mobile
      case 'tablet':
        return 0.32; // 32% on Tablet
      case 'laptop':
        return 0.30; // 30% on Laptop
      case 'desktop':
      default:
        return 0.28; // 28% on Desktop
    }
  }

  getGrassCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 350;
      case 'medium-phone': return 420;
      case 'tablet': return 490;
      case 'laptop': return 560;
      case 'desktop': default: return 650;
    }
  }

  getFlowerCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 52;
      case 'medium-phone': return 72;
      case 'tablet': return 92;
      case 'laptop': return 112;
      case 'desktop': default: return 135;
    }
  }

  getFlowerScale() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 0.78;
      case 'medium-phone': return 0.82;
      case 'tablet': return 0.90;
      case 'laptop': return 0.95;
      case 'desktop': default: return 1.0;
    }
  }

  getFireflyCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 14;
      case 'medium-phone': return 17;
      case 'tablet': return 21;
      case 'laptop': return 25;
      case 'desktop': default: return 28;
    }
  }

  getPollenCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 16;
      case 'medium-phone': return 20;
      case 'tablet': return 22;
      case 'laptop': return 26;
      case 'desktop': default: return 30;
    }
  }

  getSafeBottomInset() {
    const div = document.createElement('div');
    div.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
    document.body.appendChild(div);
    const inset = parseFloat(window.getComputedStyle(div).paddingBottom) || 0;
    document.body.removeChild(div);
    return inset;
  }

  init() {
    this.updateDimensions();
    window.addEventListener('resize', this.debouncedResize);
  }

  updateDimensions() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const meadowPct = this.getMeadowHeightPct();
    const grassCanvasHeight = this.height * meadowPct;

    document.documentElement.style.setProperty('--meadow-height', `${grassCanvasHeight}px`);

    if (this.particleCanvas) {
      this.particleCanvas.width = this.width * this.dpr;
      this.particleCanvas.height = this.height * this.dpr;
      this.particleCanvas.style.width = `${this.width}px`;
      this.particleCanvas.style.height = `${this.height}px`;

      const ctx = this.particleCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }

    if (this.grassCanvas) {
      this.grassCanvas.width = this.width * this.dpr;
      this.grassCanvas.height = grassCanvasHeight * this.dpr;
      this.grassCanvas.style.width = `${this.width}px`;
      this.grassCanvas.style.height = `${grassCanvasHeight}px`;

      const ctx = this.grassCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }
  }

  handleResize() {
    this.updateDimensions();
    if (this.particleSystem) {
      this.particleSystem.resize(this.width, this.height, this.getFireflyCount(), this.getPollenCount());
    }
    if (this.grassSystem) {
      this.grassSystem.resize(
        this.width,
        this.height * this.getMeadowHeightPct(),
        this.getGrassCount(),
        this.getFlowerCount(),
        this.getFlowerScale(),
        this.getSafeBottomInset()
      );
    }
  }
}

/* ==================================================
   4. OPTIMIZED PARTICLE & ATMOSPHERE ENGINE
   ================================================== */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.stars = [];
    this.stardustSparks = [];
    this.shootingStars = [];
    this.fireflies = [];
    this.pollen = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = false;
    this.animFrameId = null;
    this.lastShootingStarTime = performance.now();

    this.fireflyCount = 28;
    this.pollenCount = 30;

    this.initParticles();
    this.initStars();
    this.initFireflies();
    this.initPollen();
  }

  initParticles() {
    this.particles = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(1.2, 2.8),
        vx: Utils.randomRange(-0.015, 0.015),
        vy: Utils.randomRange(-0.03, -0.005),
        baseAlpha: Utils.randomRange(0.2, 0.7),
        alpha: Utils.randomRange(0.2, 0.7),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.002, 0.006),
        color: Config.particles.colors[Math.floor(Math.random() * Config.particles.colors.length)]
      });
    }
  }

  initStars() {
    this.stars = [];
    const count = Config.sky.starCount;

    for (let i = 0; i < count; i++) {
      const isSparkle = Math.random() < 0.12;
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: isSparkle ? Utils.randomRange(1.8, 2.8) : Utils.randomRange(0.7, 1.6),
        baseAlpha: Utils.randomRange(0.3, 0.9),
        alpha: Utils.randomRange(0.3, 0.9),
        twinkleSpeed: Utils.randomRange(0.01, 0.03),
        phase: Math.random() * Math.PI * 2,
        isSparkle: isSparkle,
        color: Config.sky.starColors[Math.floor(Math.random() * Config.sky.starColors.length)]
      });
    }
  }

  initFireflies() {
    this.fireflies = [];

    for (let i = 0; i < this.fireflyCount; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Utils.randomRange(this.height * 0.35, this.height * 0.88),
        radius: Utils.randomRange(1.8, 2.8),
        glowRadius: Utils.randomRange(14, 24),
        vx: Utils.randomRange(-0.25, 0.25),
        vy: Utils.randomRange(-0.2, 0.2),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.01, 0.025),
        alpha: Utils.randomRange(0.2, 0.85),
        wanderTimer: 0
      });
    }
  }

  initPollen() {
    this.pollen = [];

    for (let i = 0; i < this.pollenCount; i++) {
      this.pollen.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(0.8, 1.8),
        vx: Utils.randomRange(-0.02, 0.02),
        vy: Utils.randomRange(-0.02, 0.01),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.002, 0.006),
        alpha: Utils.randomRange(0.15, 0.55),
        color: Config.particles.colors[Math.floor(Math.random() * Config.particles.colors.length)]
      });
    }
  }

  addStardustSpark(x, y) {
    if (Utils.prefersReducedMotion()) return;
    for (let i = 0; i < 2; i++) {
      this.stardustSparks.push({
        x: x + Utils.randomRange(-2, 2),
        y: y + Utils.randomRange(-2, 2),
        radius: Utils.randomRange(1.2, 3.0),
        vx: Utils.randomRange(-0.5, 0.5),
        vy: Utils.randomRange(-0.5, 0.5),
        alpha: 0.95,
        decay: Utils.randomRange(0.02, 0.04),
        color: Config.particles.stardustColor
      });
    }
  }

  triggerShootingStar() {
    if (Utils.prefersReducedMotion()) return;
    const startX = Utils.randomRange(this.width * 0.1, this.width * 0.7);
    const startY = Utils.randomRange(this.height * 0.05, this.height * 0.35);
    const length = Utils.randomRange(80, 140);
    const speed = Utils.randomRange(3.5, 5.5);

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      vx: speed,
      vy: speed * 0.55,
      alpha: 1.0,
      decay: Utils.randomRange(0.014, 0.024),
      width: Utils.randomRange(1.4, 2.2)
    });
  }

  resize(width, height, fireflyCount, pollenCount) {
    this.width = width;
    this.height = height;
    if (fireflyCount) this.fireflyCount = fireflyCount;
    if (pollenCount) this.pollenCount = pollenCount;

    this.initStars();
    this.initFireflies();
    this.initPollen();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  drawSparkleStar(x, y, radius, alpha, color) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 0.75;

    const size = radius * 2.8;
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.stroke();

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  loop(now = performance.now()) {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const isReduced = Utils.prefersReducedMotion();

    // 1. Render Twinkling Night Stars
    for (let s of this.stars) {
      if (!isReduced) {
        s.phase += s.twinkleSpeed;
        s.alpha = s.baseAlpha + Math.sin(s.phase) * 0.35;
        s.alpha = Utils.clamp(s.alpha, 0.15, 0.95);
      }

      if (s.isSparkle) {
        this.drawSparkleStar(s.x, s.y, s.radius, s.alpha, s.color);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = s.alpha;
        this.ctx.fillStyle = s.color;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    // 2. Render Atmospheric Pollen (Stationary Micro-Drift)
    for (let pol of this.pollen) {
      if (!isReduced) {
        pol.x += pol.vx;
        pol.y += pol.vy;
        pol.phase += pol.pulseSpeed;
        pol.alpha = 0.15 + (Math.sin(pol.phase) * 0.5 + 0.5) * 0.4;

        if (pol.y < -10) pol.y = this.height + 10;
        if (pol.x < -10) pol.x = this.width + 10;
        if (pol.x > this.width + 10) pol.x = -10;
      }

      this.ctx.save();
      this.ctx.globalAlpha = pol.alpha;
      this.ctx.fillStyle = pol.color;
      this.ctx.beginPath();
      this.ctx.arc(pol.x, pol.y, pol.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 3. Render Ambient Floating Particles
    for (let p of this.particles) {
      if (!isReduced) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.15;
        p.alpha = Utils.clamp(p.alpha, 0.1, 0.85);

        if (p.y < -10) p.y = this.height + 10;
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
      }

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.2);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Render Fireflies with Soft Spatial Illumination
    for (let ff of this.fireflies) {
      if (!isReduced) {
        ff.phase += ff.pulseSpeed;
        ff.alpha = 0.25 + (Math.sin(ff.phase) * 0.5 + 0.5) * 0.65;

        ff.x += ff.vx + Math.sin(ff.phase * 0.8) * 0.25;
        ff.y += ff.vy + Math.cos(ff.phase * 0.6) * 0.18;

        ff.wanderTimer += 0.016;
        if (ff.wanderTimer > 3.5) {
          ff.vx = Utils.randomRange(-0.25, 0.25);
          ff.vy = Utils.randomRange(-0.2, 0.2);
          ff.wanderTimer = 0;
        }

        if (ff.y < this.height * 0.25) ff.vy += 0.04;
        if (ff.y > this.height * 0.90) ff.vy -= 0.04;
        if (ff.x < 10) ff.vx += 0.04;
        if (ff.x > this.width - 10) ff.vx -= 0.04;
      }

      const fireflyGrad = this.ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.glowRadius);
      fireflyGrad.addColorStop(0, Config.fireflies.color);
      fireflyGrad.addColorStop(0.35, Config.fireflies.glowColor);
      fireflyGrad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.save();
      this.ctx.globalAlpha = ff.alpha;
      this.ctx.fillStyle = fireflyGrad;
      this.ctx.beginPath();
      this.ctx.arc(ff.x, ff.y, ff.glowRadius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(ff.x, ff.y, ff.radius * 0.75, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 5. Render Trailing Pen Stardust Sparks
    for (let i = this.stardustSparks.length - 1; i >= 0; i--) {
      const sp = this.stardustSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        this.stardustSparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = sp.alpha;
      this.ctx.fillStyle = sp.color;
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 6. Trigger & Render Shooting Stars
    if (!isReduced && now - this.lastShootingStarTime > 8500) {
      this.triggerShootingStar();
      this.lastShootingStarTime = now + Utils.randomRange(-2000, 3000);
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const st = this.shootingStars[i];
      st.x += st.vx;
      st.y += st.vy;
      st.alpha -= st.decay;

      if (st.alpha <= 0) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = st.x - (st.vx / Math.hypot(st.vx, st.vy)) * st.length;
      const tailY = st.y - (st.vy / Math.hypot(st.vx, st.vy)) * st.length;

      const grad = this.ctx.createLinearGradient(st.x, st.y, tailX, tailY);
      grad.addColorStop(0, `rgba(252, 248, 242, ${st.alpha})`);
      grad.addColorStop(0.3, `rgba(230, 202, 133, ${st.alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      this.ctx.save();
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = st.width;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(st.x, st.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();
      this.ctx.restore();
    }

    this.animFrameId = requestAnimationFrame((timestamp) => this.loop(timestamp));
  }
}

/* ==================================================
   5. PLANTING ZONE GARDEN ENGINE (ADAPTIVE GRASS & FLOWERS)
   ================================================== */
class GrassSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.30;
    this.grassCount = 520;
    this.flowerCount = 95;
    this.flowerScaleGlobal = 0.92;
    this.safeBottomInset = 0;

    this.blades = [];
    this.flowers = [];
    this.isRunning = false;
    this.animFrameId = null;

    this.initGarden();
  }

  initGarden() {
    this.initGrass();
    this.initFlowers();
  }

  initGrass() {
    this.blades = [];

    for (let i = 0; i < this.grassCount; i++) {
      let layer = 0; // 0 = Back, 1 = Mid, 2 = Front
      const layerRoll = Math.random();
      if (layerRoll > 0.6) layer = 2;
      else if (layerRoll > 0.28) layer = 1;

      const x = Math.random() * this.width;
      let height = Utils.randomRange(22, 38);
      let baseWidth = Utils.randomRange(1.2, 1.8);
      let colorArray = Config.grass.palette.back;

      if (layer === 1) {
        height = Utils.randomRange(36, 58);
        baseWidth = Utils.randomRange(1.8, 2.6);
        colorArray = Config.grass.palette.mid;
      } else if (layer === 2) {
        height = Utils.randomRange(50, 78);
        baseWidth = Utils.randomRange(2.4, 3.4);
        colorArray = Config.grass.palette.front;
      }

      this.blades.push({
        x: x,
        layer: layer,
        height: height,
        baseWidth: baseWidth,
        naturalCurve: Utils.randomRange(-8, 8),
        flexibility: Utils.randomRange(0.6, 1.3),
        freq: Utils.randomRange(0.0012, 0.0025),
        phase: Math.random() * Math.PI * 2,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        hasHighlight: layer === 2 && Math.random() < 0.65
      });
    }

    this.blades.sort((a, b) => a.layer - b.layer);
  }

  initFlowers() {
    this.flowers = [];

    for (let i = 0; i < this.flowerCount; i++) {
      const species = Config.flowers.species[Math.floor(Math.random() * Config.flowers.species.length)];
      let layer = Math.floor(Math.random() * 3);
      const x = Math.random() * this.width;

      let layerScale = Utils.randomRange(0.65, 0.85);
      if (layer === 1) layerScale = Utils.randomRange(0.85, 1.05);
      if (layer === 2) layerScale = Utils.randomRange(1.05, 1.25);

      const combinedScale = layerScale * this.flowerScaleGlobal;
      const plantZoneOffset = Utils.randomRange(18, 48);

      this.flowers.push({
        x: x,
        layer: layer,
        species: species,
        plantZoneOffset: plantZoneOffset,
        stemHeight: Utils.randomRange(28, 58) * combinedScale,
        stemCurve: Utils.randomRange(-8, 8),
        scale: combinedScale,
        windFactor: species === 'lavender' || species === 'cosmos' ? 0.45 : 0.32,
        freq: Utils.randomRange(0.001, 0.002),
        phase: Math.random() * Math.PI * 2,
        color: Config.flowers.palette[species]
      });
    }

    this.flowers.sort((a, b) => a.layer - b.layer);
  }

  resize(width, height, grassCount, flowerCount, flowerScaleGlobal, safeBottomInset) {
    this.width = width;
    this.height = height;
    if (grassCount) this.grassCount = grassCount;
    if (flowerCount) this.flowerCount = flowerCount;
    if (flowerScaleGlobal) this.flowerScaleGlobal = flowerScaleGlobal;
    if (safeBottomInset !== undefined) this.safeBottomInset = safeBottomInset;

    this.initGarden();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  drawFlower(flower, tipX, tipY) {
    const ctx = this.ctx;
    const s = flower.scale;

    ctx.save();
    ctx.translate(tipX, tipY);

    switch (flower.species) {
      case 'daisy': {
        const petalCount = 10;
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -8 * s, 2.6 * s, 7 * s, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(230, 202, 133, 0.35)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 3.8 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'lavender': {
        ctx.fillStyle = flower.color.floret;
        for (let i = 0; i < 6; i++) {
          const yOff = -i * 4.5 * s;
          ctx.beginPath();
          ctx.ellipse(-2.5 * s, yOff, 3 * s, 2 * s, -0.2, 0, Math.PI * 2);
          ctx.ellipse(2.5 * s, yOff, 3 * s, 2 * s, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'cosmos': {
        ctx.fillStyle = flower.color.petal;
        const petals = 8;
        for (let i = 0; i < petals; i++) {
          const angle = (i * Math.PI * 2) / petals;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -8.5 * s, 4 * s, 7.5 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 3.5 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'bluebell': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(-i * 2.5 * s, i * 5 * s);
          ctx.beginPath();
          ctx.arc(0, 0, 4 * s, 0, Math.PI);
          ctx.fill();
          ctx.restore();
        }
        break;
      }

      case 'buttercup': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -5 * s, 3.5 * s, 5 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 2.5 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'violet': {
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -4.5 * s, 2.8 * s, 4.8 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 1.6 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }

    ctx.restore();
  }

  loop(now = performance.now()) {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const isReduced = Utils.prefersReducedMotion();

    const globalWind = isReduced ? 0 : Math.sin(now * 0.0008) * 9 + Math.cos(now * 0.0018) * 4;
    const basePadding = Math.max(10, this.safeBottomInset + 6);
    const grassBaseY = this.height - basePadding;

    // Render Layer 0 -> Layer 1 -> Layer 2
    for (let layer = 0; layer < 3; layer++) {
      // 1. Render Grass Blades in Layer
      const layerBlades = this.blades.filter(b => b.layer === layer);
      for (let blade of layerBlades) {
        const gustWave = isReduced ? 0 : Math.sin(now * 0.0012 - blade.x * 0.0025) * 7;
        const bladeSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * blade.freq + blade.phase) * 3) * blade.flexibility;

        const totalOffset = blade.naturalCurve + bladeSway;
        const tipX = blade.x + totalOffset;
        const tipY = grassBaseY - blade.height;
        const ctrlX = blade.x + totalOffset * 0.5;
        const ctrlY = grassBaseY - blade.height * 0.55;
        const halfWidth = blade.baseWidth * 0.5;

        this.ctx.save();
        this.ctx.fillStyle = blade.color;
        this.ctx.beginPath();
        this.ctx.moveTo(blade.x - halfWidth, grassBaseY);
        this.ctx.quadraticCurveTo(ctrlX - halfWidth * 0.3, ctrlY, tipX, tipY);
        this.ctx.quadraticCurveTo(ctrlX + halfWidth * 0.3, ctrlY, blade.x + halfWidth, grassBaseY);
        this.ctx.closePath();
        this.ctx.fill();

        if (blade.hasHighlight) {
          this.ctx.strokeStyle = Config.grass.moonlightTip;
          this.ctx.lineWidth = 0.75;
          this.ctx.beginPath();
          this.ctx.moveTo(ctrlX, ctrlY);
          this.ctx.quadraticCurveTo(ctrlX + totalOffset * 0.2, tipY + blade.height * 0.15, tipX, tipY);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      // 2. Render Flowers in Planting Zone (Middle & Upper Meadow)
      const layerFlowers = this.flowers.filter(f => f.layer === layer);
      for (let flower of layerFlowers) {
        const flowerBaseY = grassBaseY - flower.plantZoneOffset;
        const gustWave = isReduced ? 0 : Math.sin(now * 0.001 - flower.x * 0.002) * 5;
        const flowerSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * flower.freq + flower.phase) * 2) * flower.windFactor;

        const totalOffset = flower.stemCurve + flowerSway;
        const tipX = flower.x + totalOffset;
        const tipY = flowerBaseY - flower.stemHeight;
        const ctrlX = flower.x + totalOffset * 0.5;
        const ctrlY = flowerBaseY - flower.stemHeight * 0.5;

        // Draw Stem
        this.ctx.save();
        this.ctx.strokeStyle = "#254238";
        this.ctx.lineWidth = 1.4 * flower.scale;
        this.ctx.beginPath();
        this.ctx.moveTo(flower.x, flowerBaseY);
        this.ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        this.ctx.stroke();
        this.ctx.restore();

        // Draw Blossom Head
        this.drawFlower(flower, tipX, tipY);
      }
    }

    this.animFrameId = requestAnimationFrame((timestamp) => this.loop(timestamp));
  }
}

/* ==================================================
   6. HANDWRITING ANIMATION SYSTEM
   ================================================== */
class HandwritingSystem {
  constructor(svgElement, penTipElement, particleSystem) {
    this.svg = svgElement;
    this.penTip = penTipElement;
    this.strokeGroup = svgElement.querySelector('#stroke-group');
    this.particleSystem = particleSystem;
    this.paths = [];
    this.isWriting = false;

    this.buildPaths();
  }

  buildPaths() {
    this.strokeGroup.innerHTML = '';
    this.paths = [];

    Config.initials.strokes.forEach(strokeConfig => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', strokeConfig.id);
      path.setAttribute('d', strokeConfig.d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', strokeConfig.color);
      path.setAttribute('stroke-width', strokeConfig.strokeWidth);
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.classList.add('handwritten-path');

      this.strokeGroup.appendChild(path);

      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = `${length}`;

      this.paths.push({
        element: path,
        length: length,
        duration: strokeConfig.duration,
        config: strokeConfig
      });
    });

    if (this.penTip) {
      this.penTip.style.opacity = '0';
    }
  }

  async animateAll() {
    this.isWriting = true;
    const isReduced = Utils.prefersReducedMotion();

    if (isReduced) {
      this.paths.forEach(p => {
        p.element.style.strokeDashoffset = '0';
      });
      if (this.penTip) this.penTip.style.opacity = '0';
      this.isWriting = false;
      return;
    }

    if (this.penTip) {
      this.penTip.style.opacity = '1';
    }

    for (let i = 0; i < this.paths.length; i++) {
      const pathData = this.paths[i];
      await this.animateStroke(pathData);
      if (i < this.paths.length - 1) {
        await Utils.wait(Config.timings.interStrokeDelay);
      }
    }

    if (this.penTip) {
      this.penTip.style.opacity = '0';
    }
    this.isWriting = false;
  }

  animateStroke(pathData) {
    return new Promise(resolve => {
      const path = pathData.element;
      const totalLength = pathData.length;
      const duration = pathData.duration;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Utils.clamp(elapsed / duration, 0, 1);
        const eased = Utils.easeInOutCubic(progress);

        const currentOffset = totalLength * (1 - eased);
        path.style.strokeDashoffset = `${currentOffset}`;

        const pointLength = totalLength * eased;
        if (pointLength >= 0 && pointLength <= totalLength) {
          const point = path.getPointAtLength(pointLength);
          this.updatePenTipPosition(point);
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          path.style.strokeDashoffset = '0';
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }

  updatePenTipPosition(point) {
    if (!this.penTip) return;

    this.penTip.setAttribute('cx', point.x);
    this.penTip.setAttribute('cy', point.y);

    const ctm = this.svg.getScreenCTM();
    if (ctm && this.particleSystem) {
      const svgPoint = this.svg.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;
      const clientPoint = svgPoint.matrixTransform(ctm);

      this.particleSystem.addStardustSpark(clientPoint.x, clientPoint.y);
    }
  }

  applySoftGlow() {
    this.svg.classList.add('has-soft-glow');
  }

  reset() {
    this.svg.classList.remove('has-soft-glow');
    this.buildPaths();
  }
}

/* ==================================================
   7. SCENE MANAGER & TRANSITION CONTROLLER
   ================================================== */
class SceneManager {
  constructor() {
    this.loadingScene = document.getElementById('loading-scene');
    this.moonlitSkyScene = document.getElementById('moonlit-sky-scene');
    this.paperContainer = document.getElementById('paper-container');
    this.focusOverlay = document.getElementById('scroll-focus-overlay');
    this.moonContainer = document.getElementById('moon-container');
    this.memoryLaneFoundation = document.getElementById('memory-lane-foundation');
    this.memoryLaneScrapbook = document.getElementById('memory-lane-scrapbook');
    this.scrapbookTrack = document.getElementById('scrapbook-track');
    this.memoryCards = document.querySelectorAll('.memory-card');
    this.letterLines = document.querySelectorAll('.letter-line, .letter-divider');
    this.continueContainer = document.getElementById('continue-container');
    this.continueBtn = document.getElementById('continue-btn');
    this.activeScene = 'loading';
    this.isTransitioning = false;

    this.initEvents();
    this.initScrapbookScroll();
  }

  initEvents() {
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', (e) => this.handleContinueClick(e));
    }
  }

  initScrapbookScroll() {
    if (!this.memoryLaneScrapbook) return;

    // Convert vertical mouse wheel / trackpad scrolling into smooth horizontal scrolling
    this.memoryLaneScrapbook.addEventListener('wheel', (e) => {
      if (this.memoryLaneScrapbook.classList.contains('active')) {
        e.preventDefault();
        this.memoryLaneScrapbook.scrollLeft += e.deltaY + e.deltaX;
      }
    }, { passive: false });

    // IntersectionObserver to animate memory cards entering viewport (500-700ms entrance)
    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, {
        root: this.memoryLaneScrapbook,
        threshold: 0.2
      });

      this.memoryCards.forEach(card => cardObserver.observe(card));
    } else {
      // Fallback if IntersectionObserver is unsupported
      this.memoryCards.forEach(card => card.classList.add('in-view'));
    }
  }

  async fadeOutLoadingScene() {
    if (!this.loadingScene) return;

    if (this.moonlitSkyScene) {
      this.moonlitSkyScene.classList.add('active');
    }

    this.loadingScene.classList.add('dissolving');
    await Utils.wait(Config.timings.fadeSceneDuration);

    this.loadingScene.style.display = 'none';
    this.loadingScene.classList.remove('dissolving');
    this.activeScene = 'moonlit-sky';
  }

  async bringInPaperRoll() {
    if (!this.paperContainer) return;

    if (this.focusOverlay) {
      this.focusOverlay.classList.add('active');
    }

    this.paperContainer.classList.add('arrived');
  }

  async unfurlPaper() {
    if (!this.paperContainer) return;

    this.paperContainer.classList.add('unfurled');
    await Utils.wait(Config.timings.unfurlDuration);
  }

  async revealLetterLineByLine() {
    if (!this.letterLines || this.letterLines.length === 0) return;

    const isReduced = Utils.prefersReducedMotion();

    for (let el of this.letterLines) {
      if (isReduced) {
        el.classList.add('visible');
      } else {
        el.classList.add('visible');
        await Utils.wait(Config.timings.lineRevealInterval);
      }
    }
  }

  async showContinueInteraction() {
    if (!this.continueContainer) return;
    this.continueContainer.classList.add('visible');
  }

  async handleContinueClick(e) {
    if (e) e.preventDefault();
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Disable Further Clicks & Remove Hover Effects
    if (this.continueBtn) {
      this.continueBtn.style.pointerEvents = 'none';
    }

    // 2. Continue text & letter lines slowly fade away
    if (this.paperContainer) {
      this.paperContainer.classList.add('rolling-up');
    }

    // 3. Wait for parchment to curl back up into cylinder (~2.2s)
    await Utils.wait(2200);

    // 4. Parchment slowly ascends/floats upward into night sky while rotating ~2.8 degrees
    if (this.paperContainer) {
      this.paperContainer.classList.add('ascending');
    }

    // 5. Wait for parchment to float above top viewport and fade (~2.0s)
    await Utils.wait(2000);

    // 6. Camera / Lighting feel: Slightly dim background (~6%) & enhance moon glow
    if (this.focusOverlay) {
      this.focusOverlay.style.opacity = '0.14';
    }
    if (this.moonContainer) {
      this.moonContainer.style.filter = 'drop-shadow(0 0 22px rgba(230, 202, 133, 0.65))';
    }

    // 7. Slowly introduce Memory Lane Foundation Environment
    if (this.memoryLaneFoundation) {
      this.memoryLaneFoundation.classList.add('active');
    }

    await Utils.wait(1200);

    // 8. Reveal Horizontally Scrollable Memory Lane Scrapbook
    if (this.memoryLaneScrapbook) {
      this.memoryLaneScrapbook.classList.add('active');
    }

    this.isTransitioning = false;
  }

  resetToLoading() {
    this.isTransitioning = false;
    if (this.continueBtn) {
      this.continueBtn.style.pointerEvents = 'auto';
    }
    if (this.continueContainer) {
      this.continueContainer.classList.remove('visible');
    }
    if (this.letterLines) {
      this.letterLines.forEach(el => el.classList.remove('visible'));
    }
    if (this.paperContainer) {
      this.paperContainer.classList.remove('arrived');
      this.paperContainer.classList.remove('unfurled');
      this.paperContainer.classList.remove('rolling-up');
      this.paperContainer.classList.remove('ascending');
    }
    if (this.memoryLaneFoundation) {
      this.memoryLaneFoundation.classList.remove('active');
    }
    if (this.memoryLaneScrapbook) {
      this.memoryLaneScrapbook.classList.remove('active');
      this.memoryLaneScrapbook.scrollLeft = 0;
    }
    if (this.memoryCards) {
      this.memoryCards.forEach(card => card.classList.remove('in-view'));
    }
    if (this.focusOverlay) {
      this.focusOverlay.style.opacity = '';
      this.focusOverlay.classList.remove('active');
    }
    if (this.moonContainer) {
      this.moonContainer.style.filter = '';
    }
    if (this.moonlitSkyScene) {
      this.moonlitSkyScene.classList.remove('active');
    }
    if (this.loadingScene) {
      this.loadingScene.style.display = 'flex';
      this.loadingScene.style.opacity = '1';
    }
    this.activeScene = 'loading';
  }
}

/* ==================================================
   8. TIMELINE NARRATIVE MANAGER
   ================================================== */
class TimelineManager {
  constructor(handwritingSystem, sceneManager) {
    this.handwriting = handwritingSystem;
    this.sceneManager = sceneManager;
    this.subtitleContainer = document.getElementById('subtitle-container');
    this.replayBtn = document.getElementById('replay-btn');
    this.isExecuting = false;

    this.initEvents();
  }

  initEvents() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => this.replay());
    }
  }

  async runSequence() {
    if (this.isExecuting) return;
    this.isExecuting = true;

    // Step 1 & 2: Loading screen & moving particles active
    await Utils.wait(Config.timings.initialPause);

    // Step 3 & 4: Invisible pen draws initials sequentially
    await this.handwriting.animateAll();

    // Step 5: Soft glow appears over completed initials
    await Utils.wait(Config.timings.glowDelay);
    this.handwriting.applySoftGlow();

    // Step 6: Subtitle fades in below initials
    await Utils.wait(Config.timings.subtitleDelay);
    if (this.subtitleContainer) {
      this.subtitleContainer.classList.add('visible');
    }

    // Step 7: Contemplative brief pause
    await Utils.wait(Config.timings.subtitleHold);

    // Step 8: Smoothly fade into the Moonlit Garden
    await this.sceneManager.fadeOutLoadingScene();

    // Step 9: Allow visitor to admire garden atmosphere quiet moment (~1.2s)
    await Utils.wait(Config.timings.gardenAdmirePause);

    // Step 10: Parchment with Wooden Rollers slides into center
    await this.sceneManager.bringInPaperRoll();

    // Step 11: Brief 0.5s pause at center
    await Utils.wait(Config.timings.rollPauseBeforeUnfurl);

    // Step 12: Parchment unfurls vertically from both ends
    await this.sceneManager.unfurlPaper();

    // Step 13: Pause 0.4s after opening
    await Utils.wait(Config.timings.pauseBeforeLetterReveal);

    // Step 14: Birthday letter reveals line by line with fluid pacing
    await this.sceneManager.revealLetterLineByLine();

    // Step 15: Pause 0.5s after final line reveals
    await Utils.wait(Config.timings.pauseBeforeContinue);

    // Step 16: Interactive "Continue →" fades in, glows & pulses
    await this.sceneManager.showContinueInteraction();

    this.isExecuting = false;
  }

  async replay() {
    if (this.isExecuting) return;

    if (this.subtitleContainer) {
      this.subtitleContainer.classList.remove('visible');
    }

    this.handwriting.reset();
    this.sceneManager.resetToLoading();

    await Utils.wait(300);
    this.runSequence();
  }
}

/* ==================================================
   9. MAIN LIFESTYLE INITIALIZATION
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const particleCanvas = document.getElementById('particle-canvas');
  const grassCanvas = document.getElementById('grass-canvas');
  const svg = document.getElementById('initials-svg');
  const penTip = document.getElementById('pen-tip');

  // Instantiate Logical Systems
  const particleSystem = new ParticleSystem(particleCanvas);
  const grassSystem = new GrassSystem(grassCanvas);
  const responsiveSystem = new ResponsiveSystem(particleCanvas, grassCanvas, particleSystem, grassSystem);
  const handwritingSystem = new HandwritingSystem(svg, penTip, particleSystem);
  const sceneManager = new SceneManager();
  const timelineManager = new TimelineManager(handwritingSystem, sceneManager);

  // Trigger initial dimensions setup
  responsiveSystem.handleResize();

  // Start Canvas Engine Loops
  particleSystem.start();
  grassSystem.start();

  // Execute Narrative Sequence
  timelineManager.runSequence();
});
