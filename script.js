/**
 * A Little World Made Just for Her - Version 1.3 Moonlit Garden
 * Cinematic, Interactive Web Experience
 *
 * Logical Systems:
 * - Config: Application parameters, species palettes, timing, garden settings.
 * - Utils: Math, easing, DOM, and rendering helper functions.
 * - ResponsiveSystem: High-DPI viewport scaler for all rendering canvases.
 * - ParticleSystem: Canvas engine for twinkling stars, shooting stars, and atmospheric pollen particles.
 * - FireflySystem: Dynamic firefly engine (28 fireflies with soft radial illumination and 3D flight paths).
 * - GrassSystem: Dynamic 60 FPS garden engine (550 grass blades + 120 procedural flowers across 3 depth layers).
 * - HandwritingSystem: SVG stroke handwriting animation & active pen tip tracker.
 * - SceneManager: Core scene mounting and smooth cinematic transitions.
 * - TimelineManager: Sequential story narrative controller (Steps 1 to 8).
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
    minCount: 45,
    maxCount: 60,
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
    starCount: 140,
    starColors: [
      "rgba(252, 248, 242, 0.9)",  // Cream
      "rgba(230, 202, 133, 0.95)", // Soft Gold
      "rgba(247, 214, 208, 0.85)", // Blush Pink
      "rgba(200, 221, 242, 0.85)", // Baby Blue
      "rgba(226, 216, 238, 0.85)"  // Lavender
    ]
  },
  grass: {
    bladeCount: 550,
    palette: {
      back: ["#162a24", "#1a332b", "#1f3a32"],
      mid: ["#234338", "#2a4f43", "#315b4d"],
      front: ["#345e52", "#3e6f61", "#487e70"]
    },
    moonlightTip: "rgba(230, 202, 133, 0.4)"
  },
  flowers: {
    count: 125,
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
    count: 30,
    color: "rgba(252, 232, 158, 0.95)",
    glowColor: "rgba(230, 202, 133, 0.28)"
  },
  atmosphere: {
    pollenCount: 40
  },
  timings: {
    initialPause: 1200,      // Pause after load before pen starts writing
    interStrokeDelay: 150,   // Delay between individual path strokes
    glowDelay: 400,          // Delay after writing before soft glow
    subtitleDelay: 800,      // Delay before subtitle fades in
    subtitleHold: 3500,      // Hold time for subtitle reading
    fadeSceneDuration: 2200  // Transition duration into moonlit garden
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
  }
};

/* ==================================================
   3. RESPONSIVE UTILITIES
   ================================================== */
class ResponsiveSystem {
  constructor(particleCanvas, grassCanvas, particleSystem, grassSystem) {
    this.particleCanvas = particleCanvas;
    this.grassCanvas = grassCanvas;
    this.particleSystem = particleSystem;
    this.grassSystem = grassSystem;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.updateDimensions();
    window.addEventListener('resize', () => this.handleResize());
  }

  updateDimensions() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.particleCanvas) {
      this.particleCanvas.width = this.width * this.dpr;
      this.particleCanvas.height = this.height * this.dpr;
      this.particleCanvas.style.width = `${this.width}px`;
      this.particleCanvas.style.height = `${this.height}px`;

      const ctx = this.particleCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }

    if (this.grassCanvas) {
      const grassHeight = this.height * 0.34;
      this.grassCanvas.width = this.width * this.dpr;
      this.grassCanvas.height = grassHeight * this.dpr;
      this.grassCanvas.style.width = `${this.width}px`;
      this.grassCanvas.style.height = `${grassHeight}px`;

      const ctx = this.grassCanvas.getContext('2d');
      ctx.scale(this.dpr, this.dpr);
    }
  }

  handleResize() {
    this.updateDimensions();
    if (this.particleSystem) {
      this.particleSystem.resize(this.width, this.height);
    }
    if (this.grassSystem) {
      this.grassSystem.resize(this.width, this.height * 0.34);
    }
  }
}

/* ==================================================
   4. PARTICLE, FIREFLY & ATMOSPHERE ENGINE
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

    this.initParticles();
    this.initStars();
    this.initFireflies();
    this.initPollen();
  }

  initParticles() {
    this.particles = [];
    const count = Math.floor(Utils.randomRange(Config.particles.minCount, Config.particles.maxCount));

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(1.2, 3.2),
        vx: Utils.randomRange(-0.15, 0.15),
        vy: Utils.randomRange(-0.3, -0.08),
        baseAlpha: Utils.randomRange(0.2, 0.75),
        alpha: Utils.randomRange(0.2, 0.75),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.008, 0.02),
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
        radius: isSparkle ? Utils.randomRange(1.8, 3.0) : Utils.randomRange(0.7, 1.8),
        baseAlpha: Utils.randomRange(0.3, 0.9),
        alpha: Utils.randomRange(0.3, 0.9),
        twinkleSpeed: Utils.randomRange(0.01, 0.035),
        phase: Math.random() * Math.PI * 2,
        isSparkle: isSparkle,
        color: Config.sky.starColors[Math.floor(Math.random() * Config.sky.starColors.length)]
      });
    }
  }

  initFireflies() {
    this.fireflies = [];
    const count = Config.fireflies.count;

    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Utils.randomRange(this.height * 0.35, this.height * 0.92),
        baseX: Math.random() * this.width,
        baseY: Utils.randomRange(this.height * 0.35, this.height * 0.92),
        radius: Utils.randomRange(1.8, 3.2),
        glowRadius: Utils.randomRange(16, 28),
        vx: Utils.randomRange(-0.4, 0.4),
        vy: Utils.randomRange(-0.3, 0.3),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.012, 0.03),
        alpha: Utils.randomRange(0.2, 0.9),
        wanderTimer: 0
      });
    }
  }

  initPollen() {
    this.pollen = [];
    const count = Config.atmosphere.pollenCount;

    for (let i = 0; i < count; i++) {
      this.pollen.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Utils.randomRange(0.8, 2.0),
        vx: Utils.randomRange(-0.25, 0.25),
        vy: Utils.randomRange(-0.2, 0.1),
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: Utils.randomRange(0.005, 0.015),
        alpha: Utils.randomRange(0.15, 0.65),
        color: Config.particles.colors[Math.floor(Math.random() * Config.particles.colors.length)]
      });
    }
  }

  addStardustSpark(x, y) {
    if (Utils.prefersReducedMotion()) return;
    for (let i = 0; i < 2; i++) {
      this.stardustSparks.push({
        x: x + Utils.randomRange(-3, 3),
        y: y + Utils.randomRange(-3, 3),
        radius: Utils.randomRange(1.5, 3.5),
        vx: Utils.randomRange(-0.6, 0.6),
        vy: Utils.randomRange(-0.6, 0.6),
        alpha: 0.95,
        decay: Utils.randomRange(0.018, 0.035),
        color: Config.particles.stardustColor
      });
    }
  }

  triggerShootingStar() {
    if (Utils.prefersReducedMotion()) return;
    const startX = Utils.randomRange(this.width * 0.1, this.width * 0.7);
    const startY = Utils.randomRange(this.height * 0.05, this.height * 0.35);
    const length = Utils.randomRange(90, 160);
    const speed = Utils.randomRange(3.5, 6.0);

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      vx: speed,
      vy: speed * 0.55,
      alpha: 1.0,
      decay: Utils.randomRange(0.012, 0.022),
      width: Utils.randomRange(1.5, 2.5)
    });
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
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
    this.ctx.lineWidth = 0.8;

    const size = radius * 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y);
    this.ctx.lineTo(x + size, y);
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x, y + size);
    this.ctx.stroke();

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
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

    // 2. Render Atmospheric Pollen Particles
    for (let pol of this.pollen) {
      if (!isReduced) {
        pol.x += pol.vx + Math.sin(pol.phase) * 0.15;
        pol.y += pol.vy;
        pol.phase += pol.pulseSpeed;
        pol.alpha = 0.15 + (Math.sin(pol.phase) * 0.5 + 0.5) * 0.5;

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
        p.x += p.vx + Math.sin(p.phase) * 0.12;
        p.y += p.vy;
        p.phase += p.pulseSpeed;
        p.alpha = p.baseAlpha + Math.sin(p.phase) * 0.2;
        p.alpha = Utils.clamp(p.alpha, 0.1, 0.9);

        if (p.y < -10) p.y = this.height + 10;
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;
      }

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 4. Render Fireflies with Soft Spatial Illumination
    for (let ff of this.fireflies) {
      if (!isReduced) {
        ff.phase += ff.pulseSpeed;
        ff.alpha = 0.25 + (Math.sin(ff.phase) * 0.5 + 0.5) * 0.7;

        // Smooth 3D Organic Flight Movement
        ff.x += ff.vx + Math.sin(ff.phase * 0.8) * 0.35;
        ff.y += ff.vy + Math.cos(ff.phase * 0.6) * 0.25;

        // Random directional drift shift
        ff.wanderTimer += 0.016;
        if (ff.wanderTimer > 3) {
          ff.vx = Utils.randomRange(-0.4, 0.4);
          ff.vy = Utils.randomRange(-0.3, 0.3);
          ff.wanderTimer = 0;
        }

        // Screen Boundaries
        if (ff.y < this.height * 0.2) ff.vy += 0.05;
        if (ff.y > this.height * 0.95) ff.vy -= 0.05;
        if (ff.x < 10) ff.vx += 0.05;
        if (ff.x > this.width - 10) ff.vx -= 0.05;
      }

      // Soft Spatial Radial Glow Gradient
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

      // Bright Core Dot
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(ff.x, ff.y, ff.radius * 0.8, 0, Math.PI * 2);
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

    // 6. Periodically Trigger & Render Shooting Stars
    if (!isReduced && now - this.lastShootingStarTime > 8000) {
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
   5. LIVING GARDEN ENGINE (GRASS & PROCEDURAL FLOWERS)
   ================================================== */
class GrassSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.34;
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
    const count = Config.grass.bladeCount;

    for (let i = 0; i < count; i++) {
      let layer = 0; // 0 = Back, 1 = Mid, 2 = Front
      const layerRoll = Math.random();
      if (layerRoll > 0.6) layer = 2;
      else if (layerRoll > 0.28) layer = 1;

      const x = Math.random() * this.width;
      let height = Utils.randomRange(22, 42);
      let baseWidth = Utils.randomRange(1.2, 2.0);
      let colorArray = Config.grass.palette.back;

      if (layer === 1) {
        height = Utils.randomRange(40, 68);
        baseWidth = Utils.randomRange(2.0, 3.0);
        colorArray = Config.grass.palette.mid;
      } else if (layer === 2) {
        height = Utils.randomRange(60, 95);
        baseWidth = Utils.randomRange(2.8, 3.8);
        colorArray = Config.grass.palette.front;
      }

      this.blades.push({
        x: x,
        layer: layer,
        height: height,
        baseWidth: baseWidth,
        naturalCurve: Utils.randomRange(-10, 10),
        flexibility: Utils.randomRange(0.6, 1.4),
        freq: Utils.randomRange(0.0012, 0.0028),
        phase: Math.random() * Math.PI * 2,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        hasHighlight: layer === 2 && Math.random() < 0.65
      });
    }

    this.blades.sort((a, b) => a.layer - b.layer);
  }

  initFlowers() {
    this.flowers = [];
    const count = Config.flowers.count;

    for (let i = 0; i < count; i++) {
      const species = Config.flowers.species[Math.floor(Math.random() * Config.flowers.species.length)];
      let layer = Math.floor(Math.random() * 3);
      const x = Math.random() * this.width;

      let scale = Utils.randomRange(0.6, 0.9);
      if (layer === 1) scale = Utils.randomRange(0.85, 1.15);
      if (layer === 2) scale = Utils.randomRange(1.1, 1.45);

      this.flowers.push({
        x: x,
        layer: layer,
        species: species,
        stemHeight: Utils.randomRange(30, 75) * scale,
        stemCurve: Utils.randomRange(-12, 12),
        scale: scale,
        windFactor: species === 'lavender' || species === 'cosmos' ? 0.55 : 0.38,
        freq: Utils.randomRange(0.001, 0.002),
        phase: Math.random() * Math.PI * 2,
        color: Config.flowers.palette[species]
      });
    }

    this.flowers.sort((a, b) => a.layer - b.layer);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
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

  drawFlower(flower, tipX, tipY, sway) {
    const ctx = this.ctx;
    const s = flower.scale;

    ctx.save();
    ctx.translate(tipX, tipY);

    switch (flower.species) {
      case 'daisy': {
        // Petals
        const petalCount = 10;
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -9 * s, 3 * s, 8 * s, 0, 0, Math.PI * 2);
          ctx.fill();

          // Reflected Moonlight Edge Highlight
          ctx.strokeStyle = "rgba(230, 202, 133, 0.35)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.restore();
        }
        // Center
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'lavender': {
        // Lavender Spike Florets
        ctx.fillStyle = flower.color.floret;
        for (let i = 0; i < 6; i++) {
          const yOff = -i * 5.5 * s;
          ctx.beginPath();
          ctx.ellipse(-3 * s, yOff, 3.5 * s, 2.5 * s, -0.2, 0, Math.PI * 2);
          ctx.ellipse(3 * s, yOff, 3.5 * s, 2.5 * s, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }

      case 'cosmos': {
        // Cosmos Wide Petals
        ctx.fillStyle = flower.color.petal;
        const petals = 8;
        for (let i = 0; i < petals; i++) {
          const angle = (i * Math.PI * 2) / petals;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -10 * s, 4.8 * s, 9 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 4 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'bluebell': {
        // Drooping Bluebell Florets
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(-i * 3 * s, i * 6 * s);
          ctx.beginPath();
          ctx.arc(0, 0, 5 * s, 0, Math.PI);
          ctx.fill();
          ctx.restore();
        }
        break;
      }

      case 'buttercup': {
        // Cup-shaped Petals
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -6 * s, 4 * s, 6 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'violet': {
        // Wild Violet Asymmetric Petals
        ctx.fillStyle = flower.color.petal;
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.ellipse(0, -5 * s, 3.2 * s, 5.5 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = flower.color.center;
        ctx.beginPath();
        ctx.arc(0, 0, 2 * s, 0, Math.PI * 2);
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

    const globalWind = isReduced ? 0 : Math.sin(now * 0.0008) * 12 + Math.cos(now * 0.0018) * 6;

    // Render by Depth Layer (Layer 0 -> Layer 1 -> Layer 2)
    for (let layer = 0; layer < 3; layer++) {
      // 1. Grass Blades in Layer
      const layerBlades = this.blades.filter(b => b.layer === layer);
      for (let blade of layerBlades) {
        const baseY = this.height;
        const gustWave = isReduced ? 0 : Math.sin(now * 0.0012 - blade.x * 0.0025) * 10;
        const bladeSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * blade.freq + blade.phase) * 4) * blade.flexibility;

        const totalOffset = blade.naturalCurve + bladeSway;
        const tipX = blade.x + totalOffset;
        const tipY = baseY - blade.height;
        const ctrlX = blade.x + totalOffset * 0.5;
        const ctrlY = baseY - blade.height * 0.55;
        const halfWidth = blade.baseWidth * 0.5;

        this.ctx.save();
        this.ctx.fillStyle = blade.color;
        this.ctx.beginPath();
        this.ctx.moveTo(blade.x - halfWidth, baseY);
        this.ctx.quadraticCurveTo(ctrlX - halfWidth * 0.3, ctrlY, tipX, tipY);
        this.ctx.quadraticCurveTo(ctrlX + halfWidth * 0.3, ctrlY, blade.x + halfWidth, baseY);
        this.ctx.closePath();
        this.ctx.fill();

        if (blade.hasHighlight) {
          this.ctx.strokeStyle = Config.grass.moonlightTip;
          this.ctx.lineWidth = 0.85;
          this.ctx.beginPath();
          this.ctx.moveTo(ctrlX, ctrlY);
          this.ctx.quadraticCurveTo(ctrlX + totalOffset * 0.2, tipY + blade.height * 0.15, tipX, tipY);
          this.ctx.stroke();
        }
        this.ctx.restore();
      }

      // 2. Flowers in Layer
      const layerFlowers = this.flowers.filter(f => f.layer === layer);
      for (let flower of layerFlowers) {
        const baseY = this.height;
        const gustWave = isReduced ? 0 : Math.sin(now * 0.001 - flower.x * 0.002) * 8;
        const flowerSway = isReduced ? 0 : (globalWind + gustWave + Math.sin(now * flower.freq + flower.phase) * 3) * flower.windFactor;

        const totalOffset = flower.stemCurve + flowerSway;
        const tipX = flower.x + totalOffset;
        const tipY = baseY - flower.stemHeight;
        const ctrlX = flower.x + totalOffset * 0.5;
        const ctrlY = baseY - flower.stemHeight * 0.5;

        // Draw Stem
        this.ctx.save();
        this.ctx.strokeStyle = "#254238";
        this.ctx.lineWidth = 1.6 * flower.scale;
        this.ctx.beginPath();
        this.ctx.moveTo(flower.x, baseY);
        this.ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        this.ctx.stroke();
        this.ctx.restore();

        // Draw Flower Blossom
        this.drawFlower(flower, tipX, tipY, flowerSway);
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
   7. SCENE MANAGER FOUNDATION
   ================================================== */
class SceneManager {
  constructor() {
    this.loadingScene = document.getElementById('loading-scene');
    this.moonlitSkyScene = document.getElementById('moonlit-sky-scene');
    this.activeScene = 'loading';
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

  resetToLoading() {
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

    this.isExecuting = false;
  }

  async replay() {
    if (this.isExecuting) return;

    if (this.subtitleContainer) {
      this.subtitleContainer.classList.remove('visible');
    }

    this.handwriting.reset();
    this.sceneManager.resetToLoading();

    await Utils.wait(400);
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

  // Start Canvas Engine Loops
  particleSystem.start();
  grassSystem.start();

  // Execute Narrative Sequence
  timelineManager.runSequence();
});
