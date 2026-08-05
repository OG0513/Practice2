
/**
 * A Little World Made Just for Her - Version 4.2 Grand Firework Celebration & Environmental Realism
 * Cinematic, Interactive Web Experience
 *
 * Logical Systems:
 * - Config: Dynamic palette definitions, stroke vectors, species configurations, fluid timing sequence,
 *   and JavaScript Memory Data Array configured with 'Images/photo01.jpg' ... 'Images/photo10.jpg' paths.
 * - Utils: Math, easing, DOM, and debounced window resize utilities.
 * - ResponsiveSystem: Adaptive viewport layout, meadow proportions (28-36%),
 *   safe-area inset handlers, and dynamic object scaling.
 * - ParticleSystem & FireworkEngine: Canvas engine for stars, shooting stars, ultra-slow dust, fireflies,
 *   high-sky gathering, AND multi-shell realistic physics fireworks with dynamic ambient lighting & smoke.
 * - GrassSystem: Layered Planting Zone flower & grass engine (220-380 grass blades across 3 depth layers,
 *   32-80 enlarged flowers with moonlight bloom).
 * - HandwritingSystem: SVG stroke handwriting animation & active pen tip tracker.
 * - SceneManager: Scene mounting, paper roll arrival, vertical unfurling, letter reveal, Continue interaction,
 *   Memory Lane environment transition, 10-Card Scrapbook Scroll, and Grand Celebration Firework Trigger.
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
        duration: 1100,
        strokeWidth: 3.5,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-2",
        // Cursive 'A' crossbar
        d: "M 100,128 C 120,120 150,118 175,125",
        duration: 400,
        strokeWidth: 3.0,
        color: "var(--color-cream)"
      },
      {
        id: "stroke-3",
        // Elegant Ampersand '&'
        d: "M 300,135 C 315,118 318,100 302,88 C 285,75 265,95 282,122 C 298,150 315,172 278,178 C 258,181 248,162 262,148 C 282,128 308,118 328,152 C 335,165 342,175 348,173",
        duration: 900,
        strokeWidth: 3.0,
        color: "var(--color-soft-gold)"
      },
      {
        id: "stroke-4",
        // Cursive 'M' flourish arches & tail
        d: "M 385,150 C 375,138 372,118 388,95 C 402,72 418,72 418,118 C 418,148 412,185 412,195 C 412,200 418,192 428,165 C 442,125 458,92 468,112 C 475,128 468,178 468,192 C 468,198 474,190 484,165 C 498,125 512,95 522,115 C 528,130 525,165 538,160 C 548,155 558,145 565,140",
        duration: 1300,
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
  fireworks: {
    colors: [
      "#fce89e", // Soft Gold
      "#f7d6d0", // Blush Pink
      "#c8ddf2", // Baby Blue
      "#e2d8ee", // Lavender
      "#fcf8f2", // Cream
      "#e6ca85"  // Warm Moon
    ],
    types: ["chrysanthemum", "peony", "willow", "ring", "palm", "crackling"]
  },
  // Dynamic Memory Data Array
  memories: [
    {
      id: 1,
      image: "Images/photo01.jpg",
      caption: "A quiet night under the stars...",
      type: "polaroid",
      accent: "tape-top-right",
      number: "No. 01",
      fallbackRoman: "I",
      rotation: -2.8,
      offsetY: -16,
      scale: 1.02
    },
    {
      id: 2,
      image: "Images/photo02.jpg",
      caption: "Sweet laughter & gentle breeze",
      type: "postcard",
      accent: "postmark",
      number: "No. 02",
      fallbackRoman: "II",
      rotation: 2.2,
      offsetY: 14,
      scale: 0.98
    },
    {
      id: 3,
      image: "Images/photo03.jpg",
      caption: "Unforgettable warm moments",
      type: "polaroid",
      accent: "pressed-flower",
      number: "No. 03",
      fallbackRoman: "III",
      rotation: -1.5,
      offsetY: -8,
      scale: 1.04
    },
    {
      id: 4,
      image: "Images/photo04.jpg",
      caption: "Walking through the moonlight",
      type: "polaroid",
      accent: "tape-top-left",
      number: "No. 04",
      fallbackRoman: "IV",
      rotation: 3.2,
      offsetY: 18,
      scale: 0.96
    },
    {
      id: 5,
      image: "Images/photo05.jpg",
      caption: "A smile that brightens the day",
      type: "postcard",
      accent: "stamp-air",
      number: "No. 05",
      fallbackRoman: "V",
      rotation: -2.4,
      offsetY: -12,
      scale: 1.01
    },
    {
      id: 6,
      image: "Images/photo06.jpg",
      caption: "Forever in our hearts",
      type: "polaroid",
      accent: "pressed-leaf",
      number: "No. 06",
      fallbackRoman: "VI",
      rotation: 1.8,
      offsetY: 10,
      scale: 0.99
    },
    {
      id: 7,
      image: "Images/photo07.jpg",
      caption: "Whispers of joy and light",
      type: "postcard",
      accent: "tape-top-right",
      number: "No. 07",
      fallbackRoman: "VII",
      rotation: -3.1,
      offsetY: -15,
      scale: 1.03
    },
    {
      id: 8,
      image: "Images/photo08.jpg",
      caption: "Surrounded by nature’s grace",
      type: "postcard",
      accent: "stamp-wish",
      number: "No. 08",
      fallbackRoman: "VIII",
      rotation: 2.5,
      offsetY: 12,
      scale: 0.97
    },
    {
      id: 9,
      image: "Images/photo09.jpg",
      caption: "Moments that shine forever",
      type: "polaroid",
      accent: "pressed-flower-pink",
      number: "No. 09",
      fallbackRoman: "IX",
      rotation: -1.9,
      offsetY: -10,
      scale: 1.02
    },
    {
      id: 10,
      image: "Images/photo10.jpg",
      caption: "A story made just for her",
      type: "postcard",
      accent: "tape-top-left",
      number: "No. 10",
      fallbackRoman: "X",
      rotation: 2.9,
      offsetY: 16,
      scale: 0.98
    }
  ],
  timings: {
    initialPause: 600,             // Fast loading screen start
    interStrokeDelay: 80,          // Rapid handwriting stroke flow
    glowDelay: 200,
    subtitleDelay: 400,
    subtitleHold: 1400,            // Loading screen completes naturally in ~1.5s
    fadeSceneDuration: 1200,       // Garden transition
    gardenAdmirePause: 900,        // Garden visible ~0.9s before scroll enters
    rollPauseBeforeUnfurl: 400,    // Pause ~0.4s at center
    unfurlDuration: 1400,          // Parchment opens in ~1.4s
    pauseBeforeLetterReveal: 350,  // Pause ~0.35s before text reveals
    lineRevealInterval: 550,       // Rapid line reveal ~0.55s per line
    pauseBeforeContinue: 400       // Wait ~0.4s before "Continue →" appears
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
  },
  generateFallbackSVG(romanNumber) {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23e8dec8"/><circle cx="200" cy="130" r="45" fill="%23d4c5a9"/><path d="M80,240 Q160,170 240,240 T400,240 L400,300 L80,300 Z" fill="%23bba88a"/><text x="50%" y="270" font-family="serif" font-size="16" fill="%2378654c" text-anchor="middle" font-style="italic">Memory ${romanNumber}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
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

  // Version 4.2 Reduced Grass Density (35-45% Reduction)
  getGrassCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 210;
      case 'medium-phone': return 250;
      case 'tablet': return 300;
      case 'laptop': return 340;
      case 'desktop': default: return 380;
    }
  }

  // Version 4.2 Reduced Flower Count (30-40% Reduction)
  getFlowerCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 32;
      case 'medium-phone': return 42;
      case 'tablet': return 55;
      case 'laptop': return 68;
      case 'desktop': default: return 80;
    }
  }

  // Version 4.2 Increased Flower Scale (+35% larger blossoms)
  getFlowerScale() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone': return 1.05;
      case 'medium-phone': return 1.12;
      case 'tablet': return 1.22;
      case 'laptop': return 1.28;
      case 'desktop': default: return 1.35;
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

  // Version 4.2 Firework Burst Particle Scaling
  getFireworkParticleCount() {
    const cat = this.getViewportCategory();
    switch (cat) {
      case 'small-phone':
      case 'medium-phone':
        return 100; // 80–120
      case 'tablet':
        return 150; // 120–180
      case 'laptop':
      case 'desktop':
      default:
        return 240; // 180–300
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
   4. OPTIMIZED PARTICLE, FIREFLY & GRAND FIREWORK CELEBRATION ENGINE
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
    this.fireworks = [];
    this.smokePuffs = [];
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isRunning = false;
    this.animFrameId = null;
    this.lastShootingStarTime = performance.now();

    this.fireflyCount = 28;
    this.pollenCount = 30;
    this.isGatheringHigh = false;
    this.isCelebrationActive = false;
    this.lastFireworkLaunch = performance.now();

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

  // Version 4.2 Update 1: Stars immediately visible after loading
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

  setGatheringHigh(enabled) {
    this.isGatheringHigh = enabled;
  }

  // Version 4.2 Firework Celebration Controller
  startCelebration() {
    this.isCelebrationActive = true;
    this.lastFireworkLaunch = performance.now();
    this.launchShell(); // Launch initial shell
  }

  launchShell() {
    if (Utils.prefersReducedMotion()) return;

    const startX = Utils.randomRange(this.width * 0.15, this.width * 0.85);
    const startY = this.height + 20;
    const targetY = Utils.randomRange(this.height * 0.12, this.height * 0.42);
    const shellType = Config.fireworks.types[Math.floor(Math.random() * Config.fireworks.types.length)];
    const color = Config.fireworks.colors[Math.floor(Math.random() * Config.fireworks.colors.length)];

    this.fireworks.push({
      x: startX,
      y: startY,
      targetY: targetY,
      vy: -Utils.randomRange(7.5, 10.5),
      color: color,
      type: shellType,
      sparks: [],
      isBurst: false
    });
  }

  explodeShell(fw) {
    fw.isBurst = true;
    const count = window.appResponsive ? window.appResponsive.getFireworkParticleCount() : 180;

    // Trigger Dynamic Ambient Flash Callback
    if (window.appSceneManager) {
      window.appSceneManager.triggerDynamicLightingFlash(fw.color);
    }

    // Add Smoke Puff at apex
    for (let s = 0; s < 4; s++) {
      this.smokePuffs.push({
        x: fw.x + Utils.randomRange(-10, 10),
        y: fw.y + Utils.randomRange(-10, 10),
        radius: Utils.randomRange(15, 30),
        vx: Utils.randomRange(-0.15, 0.15),
        vy: Utils.randomRange(-0.2, -0.05),
        alpha: 0.28,
        decay: 0.003
      });
    }

    // Generate Burst Particles based on Firework Type
    for (let i = 0; i < count; i++) {
      let angle = (i * Math.PI * 2) / count;
      let speed = Utils.randomRange(2.5, 7.5);

      if (fw.type === 'ring') {
        speed = 5.5 + Utils.randomRange(-0.4, 0.4);
      } else if (fw.type === 'willow') {
        speed = Utils.randomRange(1.8, 5.0);
      } else if (fw.type === 'palm') {
        angle = (i * Math.PI * 2) / 8 + Utils.randomRange(-0.1, 0.1);
        speed = Utils.randomRange(4.0, 8.5);
      }

      this.stardustSparks.push({
        x: fw.x,
        y: fw.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Utils.randomRange(1.2, 2.8),
        color: fw.color,
        alpha: 1.0,
        decay: fw.type === 'willow' ? Utils.randomRange(0.006, 0.012) : Utils.randomRange(0.012, 0.025),
        gravity: fw.type === 'willow' ? 0.08 : 0.05,
        drag: 0.97
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
        color: Config.particles.stardustColor,
        gravity: 0,
        drag: 1.0
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

    // 1. Render Twinkling Night Stars (Immediately visible after loading)
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

    // 2. Render Atmospheric Pollen
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

        const targetMinY = this.isGatheringHigh ? this.height * 0.15 : this.height * 0.35;
        const targetMaxY = this.isGatheringHigh ? this.height * 0.65 : this.height * 0.88;

        if (ff.y > targetMaxY) ff.vy -= 0.03;
        if (ff.y < targetMinY) ff.vy += 0.03;

        ff.x += ff.vx + Math.sin(ff.phase * 0.8) * 0.25;
        ff.y += ff.vy + Math.cos(ff.phase * 0.6) * 0.18;

        ff.wanderTimer += 0.016;
        if (ff.wanderTimer > 3.5) {
          ff.vx = Utils.randomRange(-0.25, 0.25);
          ff.vy = Utils.randomRange(-0.2, 0.2);
          ff.wanderTimer = 0;
        }

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

    // 5. Render Trailing Stardust Sparks & Firework Particles
    for (let i = this.stardustSparks.length - 1; i >= 0; i--) {
      const sp = this.stardustSparks[i];
      if (sp.gravity) {
        sp.vx *= sp.drag || 0.98;
        sp.vy *= sp.drag || 0.98;
        sp.vy += sp.gravity || 0.05;
      }
      sp.x += sp.vx || 0;
      sp.y += sp.vy || 0;
      sp.alpha -= sp.decay || 0.02;

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

    // 6. Trigger & Render Sequential Firework Shells (Version 4.2)
    if (this.isCelebrationActive && !isReduced) {
      if (now - this.lastFireworkLaunch > Utils.randomRange(1200, 2200)) {
        this.launchShell();
        this.lastFireworkLaunch = now;
      }

      for (let i = this.fireworks.length - 1; i >= 0; i--) {
        const fw = this.fireworks[i];
        if (!fw.isBurst) {
          fw.y += fw.vy;
          fw.vy += 0.12; // Slow down before apex burst

          // Launch trail spark
          this.stardustSparks.push({
            x: fw.x + Utils.randomRange(-1.5, 1.5),
            y: fw.y,
            radius: Utils.randomRange(1.0, 2.2),
            vx: Utils.randomRange(-0.3, 0.3),
            vy: Utils.randomRange(0.5, 1.5),
            alpha: 0.9,
            decay: 0.03,
            color: "#fce89e"
          });

          // Burst at apex
          if (fw.vy >= -1.0 || fw.y <= fw.targetY) {
            this.explodeShell(fw);
            this.fireworks.splice(i, 1);
          }
        }
      }
    }

    // 7. Render Expanding Atmospheric Smoke Puffs
    for (let i = this.smokePuffs.length - 1; i >= 0; i--) {
      const sm = this.smokePuffs[i];
      sm.x += sm.vx;
      sm.y += sm.vy;
      sm.radius += 0.15;
      sm.alpha -= sm.decay;

      if (sm.alpha <= 0) {
        this.smokePuffs.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = sm.alpha;
      this.ctx.fillStyle = "rgba(230, 215, 185, 0.12)";
      this.ctx.beginPath();
      this.ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // 8. Trigger & Render Shooting Stars
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
   5. PLANTING ZONE GARDEN ENGINE (LAYERED GRASS & ENLARGED FLOWERS)
   ================================================== */
class GrassSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.30;
    this.grassCount = 340; // Version 4.2 Layered Grass (40% Density Reduction)
    this.flowerCount = 68; // Version 4.2 Larger Flowers (35% Count Reduction)
    this.flowerScaleGlobal = 1.28; // Version 4.2 Enlarged Blossom Scale
    this.safeBottomInset = 0;
    this.isCalmWind = false;

    this.blades = [];
    this.flowers = [];
    this.isRunning = false;
    this.animFrameId = null;

    this.initGarden();
  }

  setCalmWind(enabled) {
    this.isCalmWind = enabled;
  }

  initGarden() {
    this.initGrass();
    this.initFlowers();
  }

  // Version 4.2 Update 4: Layered Organic Grass Structure (3 Distinct Depth Layers)
  initGrass() {
    this.blades = [];

    for (let i = 0; i < this.grassCount; i++) {
      let layer = 0; // 0 = Back, 1 = Mid, 2 = Front
      const layerRoll = Math.random();
      if (layerRoll > 0.6) layer = 2;
      else if (layerRoll > 0.28) layer = 1;

      const x = Math.random() * this.width;
      let height = Utils.randomRange(24, 42);
      let baseWidth = Utils.randomRange(1.4, 2.0);
      let colorArray = Config.grass.palette.back;

      if (layer === 1) {
        height = Utils.randomRange(40, 64);
        baseWidth = Utils.randomRange(2.0, 3.0);
        colorArray = Config.grass.palette.mid;
      } else if (layer === 2) {
        height = Utils.randomRange(58, 86);
        baseWidth = Utils.randomRange(2.8, 4.0);
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

  // Version 4.2 Update 3: Reduced Count, Larger Flowers with Moonlight Bloom
  initFlowers() {
    this.flowers = [];

    for (let i = 0; i < this.flowerCount; i++) {
      const species = Config.flowers.species[Math.floor(Math.random() * Config.flowers.species.length)];
      let layer = Math.floor(Math.random() * 3);
      const x = Math.random() * this.width;

      let layerScale = Utils.randomRange(0.75, 0.95);
      if (layer === 1) layerScale = Utils.randomRange(0.95, 1.15);
      if (layer === 2) layerScale = Utils.randomRange(1.15, 1.35);

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

          ctx.strokeStyle = "rgba(230, 202, 133, 0.45)";
          ctx.lineWidth = 0.6;
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

    const windMult = this.isCalmWind ? 0.45 : 1.0;
    const globalWind = isReduced ? 0 : (Math.sin(now * 0.0008) * 9 + Math.cos(now * 0.0018) * 4) * windMult;
    const basePadding = Math.max(10, this.safeBottomInset + 6);
    const grassBaseY = this.height - basePadding;

    // Render Layer 0 -> Layer 1 -> Layer 2
    for (let layer = 0; layer < 3; layer++) {
      // 1. Render Grass Blades in Layer
      const layerBlades = this.blades.filter(b => b.layer === layer);
      for (let blade of layerBlades) {
        const gustWave = isReduced ? 0 : Math.sin(now * 0.0012 - blade.x * 0.0025) * 7 * windMult;
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
        const gustWave = isReduced ? 0 : Math.sin(now * 0.001 - flower.x * 0.002) * 5 * windMult;
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
  constructor(particleSystem, grassSystem) {
    this.particleSystem = particleSystem;
    this.grassSystem = grassSystem;

    this.loadingScene = document.getElementById('loading-scene');
    this.moonlitSkyScene = document.getElementById('moonlit-sky-scene');
    this.paperContainer = document.getElementById('paper-container');
    this.focusOverlay = document.getElementById('scroll-focus-overlay');
    this.fireworkFlashOverlay = document.getElementById('firework-flash-overlay');
    this.moonContainer = document.getElementById('moon-container');
    this.memoryLaneFoundation = document.getElementById('memory-lane-foundation');
    this.memoryLaneScrapbook = document.getElementById('memory-lane-scrapbook');
    this.scrapbookTrack = document.getElementById('scrapbook-track');
    this.letterLines = document.querySelectorAll('.letter-line, .letter-divider');
    this.continueContainer = document.getElementById('continue-container');
    this.continueBtn = document.getElementById('continue-btn');
    
    this.activeScene = 'loading';
    this.isTransitioning = false;
    this.hasReachedEndOfPath = false;
    this.isReadyForCelebration = false;

    this.initEvents();
    this.buildScrapbookDOM();
  }

  initEvents() {
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', (e) => this.handleContinueClick(e));
    }
  }

  buildScrapbookDOM() {
    if (!this.scrapbookTrack || !Config.memories) return;

    this.scrapbookTrack.innerHTML = '';

    Config.memories.forEach((mem, idx) => {
      const card = document.createElement('article');
      const isPolaroid = mem.type === 'polaroid';
      card.className = `memory-card ${isPolaroid ? 'card-polaroid' : 'card-postcard'} memory-${idx + 1}`;
      card.setAttribute('data-index', idx);

      let accentHTML = '';
      if (mem.accent === 'tape-top-right') {
        accentHTML = '<div class="masking-tape tape-top-right"></div>';
      } else if (mem.accent === 'tape-top-left') {
        accentHTML = '<div class="masking-tape tape-top-left"></div>';
      } else if (mem.accent === 'pressed-flower') {
        accentHTML = '<div class="pressed-flower-accent">✿</div>';
      } else if (mem.accent === 'pressed-flower-pink') {
        accentHTML = '<div class="pressed-flower-accent">🌸</div>';
      } else if (mem.accent === 'pressed-leaf') {
        accentHTML = '<div class="pressed-leaf-accent">🍃</div>';
      }

      let headerHTML = '';
      if (!isPolaroid) {
        headerHTML = `
          <div class="postcard-header">
            <span class="postmark-circle">✦</span>
            <span class="postcard-stamp">${mem.accent === 'stamp-air' ? 'AIR' : mem.accent === 'stamp-wish' ? 'WISH' : 'POST'}</span>
          </div>
        `;
      }

      const fallbackSrc = Utils.generateFallbackSVG(mem.fallbackRoman || 'I');

      card.innerHTML = `
        ${accentHTML}
        <div class="frame-body">
          ${headerHTML}
          <div class="photo-wrapper">
            <img class="memory-photo" src="${mem.image}" alt="Memory ${mem.id} Photo" loading="lazy" onError="this.onerror=null;this.src='${fallbackSrc}';" />
            <div class="photo-overlay-glare"></div>
          </div>
          <div class="caption-area">
            <span class="card-number">${mem.number}</span>
            <p class="caption-text">${mem.caption}</p>
          </div>
        </div>
      `;

      this.scrapbookTrack.appendChild(card);
    });

    const endSpacer = document.createElement('div');
    endSpacer.className = 'end-of-path-spacer';
    endSpacer.id = 'end-of-path-spacer';
    endSpacer.innerHTML = '<div class="path-fade-end"></div>';
    this.scrapbookTrack.appendChild(endSpacer);

    this.memoryCards = document.querySelectorAll('.memory-card');
    this.initScrapbookScroll();
  }

  initScrapbookScroll() {
    if (!this.memoryLaneScrapbook) return;

    this.memoryLaneScrapbook.addEventListener('wheel', (e) => {
      if (this.memoryLaneScrapbook.classList.contains('active')) {
        e.preventDefault();
        this.memoryLaneScrapbook.scrollLeft += (e.deltaY || e.deltaX) * 1.2;
        this.checkScrollEnd();
      }
    }, { passive: false });

    this.memoryLaneScrapbook.addEventListener('scroll', Utils.debounce(() => {
      this.checkScrollEnd();
    }, 80));

    if ('IntersectionObserver' in window) {
      const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: this.memoryLaneScrapbook,
        threshold: 0.15
      });

      this.memoryCards.forEach(card => cardObserver.observe(card));
    } else {
      this.memoryCards.forEach(card => card.classList.add('in-view'));
    }
  }

  checkScrollEnd() {
    if (!this.memoryLaneScrapbook || this.hasReachedEndOfPath || !this.memoryCards || this.memoryCards.length === 0) return;

    const maxScroll = this.memoryLaneScrapbook.scrollWidth - this.memoryLaneScrapbook.clientWidth;
    const currentScroll = this.memoryLaneScrapbook.scrollLeft;

    if (currentScroll >= maxScroll - 60) {
      this.triggerEndOfPathReaction();
    }
  }

  // Version 4.1 End-of-Path & Version 4.2 Celebration Launch Sequence
  async triggerEndOfPathReaction() {
    if (this.hasReachedEndOfPath) return;
    this.hasReachedEndOfPath = true;

    // 1. Smoothly center Card 10 in viewport
    const lastCard = this.memoryCards[this.memoryCards.length - 1];
    if (lastCard && this.memoryLaneScrapbook) {
      const targetScroll = lastCard.offsetLeft - (this.memoryLaneScrapbook.clientWidth - lastCard.clientWidth) / 2;
      this.memoryLaneScrapbook.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
    }

    // 2. Trigger Environmental Reactions (Calm Wind, Fireflies High, Moon Glow)
    if (this.moonlitSkyScene) {
      this.moonlitSkyScene.classList.add('at-end');
    }

    if (this.grassSystem) {
      this.grassSystem.setCalmWind(true);
    }

    if (this.particleSystem) {
      this.particleSystem.setGatheringHigh(true);
    }

    // 3. Peaceful Silence Pause (1.8 Seconds)
    await Utils.wait(1800);

    // 4. Version 4.2: Automatically Begin Grand Firework Celebration
    this.isReadyForCelebration = true;
    if (this.particleSystem) {
      this.particleSystem.startCelebration();
    }
  }

  // Dynamic Lighting Flash on Firework Explosions
  triggerDynamicLightingFlash(color) {
    if (!this.fireworkFlashOverlay) return;
    this.fireworkFlashOverlay.style.background = color ? `${color}18` : 'rgba(252, 232, 158, 0.12)';
    this.fireworkFlashOverlay.style.opacity = '1';
    setTimeout(() => {
      if (this.fireworkFlashOverlay) {
        this.fireworkFlashOverlay.style.opacity = '0';
      }
    }, 450);
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
    await Utils.wait(1000);
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

    if (this.continueBtn) {
      this.continueBtn.style.pointerEvents = 'none';
    }

    if (this.paperContainer) {
      this.paperContainer.classList.add('rolling-up');
    }

    await Utils.wait(1400);

    if (this.paperContainer) {
      this.paperContainer.classList.add('ascending');
    }

    await Utils.wait(1400);

    if (this.focusOverlay) {
      this.focusOverlay.style.opacity = '0.14';
    }

    if (this.memoryLaneFoundation) {
      this.memoryLaneFoundation.classList.add('active');
    }

    await Utils.wait(800);

    if (this.memoryLaneScrapbook) {
      this.memoryLaneScrapbook.classList.add('active');
    }

    this.isTransitioning = false;
  }

  resetToLoading() {
    this.isTransitioning = false;
    this.hasReachedEndOfPath = false;
    this.isReadyForCelebration = false;

    if (this.grassSystem) this.grassSystem.setCalmWind(false);
    if (this.particleSystem) {
      this.particleSystem.setGatheringHigh(false);
      this.particleSystem.isCelebrationActive = false;
    }

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
      this.moonlitSkyScene.classList.remove('at-end');
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
    this.isExecuting = false;
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

    // Step 8: Smoothly fade into the Moonlit Garden (Stars visible immediately)
    await this.sceneManager.fadeOutLoadingScene();

    // Step 9: Display garden for ~0.9s before introducing parchment
    await Utils.wait(Config.timings.gardenAdmirePause);

    // Step 10: Parchment with Wooden Rollers slides into center
    await this.sceneManager.bringInPaperRoll();

    // Step 11: Brief 0.4s pause at center
    await Utils.wait(Config.timings.rollPauseBeforeUnfurl);

    // Step 12: Parchment unfurls vertically from both ends
    await this.sceneManager.unfurlPaper();

    // Step 13: Pause 0.35s after opening
    await Utils.wait(Config.timings.pauseBeforeLetterReveal);

    // Step 14: Birthday letter reveals line by line
    await this.sceneManager.revealLetterLineByLine();

    // Step 15: Pause 0.4s after final line reveals
    await Utils.wait(Config.timings.pauseBeforeContinue);

    // Step 16: Interactive "Continue →" fades in, glows & pulses
    await this.sceneManager.showContinueInteraction();

    this.isExecuting = false;
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
  const sceneManager = new SceneManager(particleSystem, grassSystem);
  const timelineManager = new TimelineManager(handwritingSystem, sceneManager);

  // Global references for cross-system lighting callbacks
  window.appResponsive = responsiveSystem;
  window.appSceneManager = sceneManager;

  // Trigger initial dimensions setup
  responsiveSystem.handleResize();

  // Start Canvas Engine Loops
  particleSystem.start();
  grassSystem.start();

  // Execute Narrative Sequence
  timelineManager.runSequence();
});
