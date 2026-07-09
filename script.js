/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 4: + Cake & Candles
===================================================== */

'use strict';

/* -----------------------------------------------------
   1. CONFIG — Personalize the celebration here
----------------------------------------------------- */
const CONFIG = {
  name: 'Beautiful',
  subtitle: "Today the world gets a little brighter — because it's your day. 🎂",
  particleCount: 22, // scales down automatically on small screens, see initParticles()

  card: {
    message:
      "Wishing you a day filled with warm light, soft laughter, and every " +
      "little thing that makes you smile. May this new year of your life " +
      "be as radiant and wonderful as you are.",
    signature: 'With all my love 💛',
  },

  // Version 4 — Cake & Candles
  cake: {
    candleCount: 5, // Set this to the birthday person's age, or leave as a decorative number
    wishPrompt: 'Close your eyes and make a wish… then tap again to blow out the candles.',
    wishGrantedMessage: "Wish sent — here's to a beautiful year ahead! 🎉",
  },

  // Shared / utility settings
  confettiPiecesPerBurst: 40,
};

/* -----------------------------------------------------
   2. DOM REFERENCES
----------------------------------------------------- */
const dom = {
  landing: document.getElementById('landing'),
  experience: document.getElementById('experience'),
  startBtn: document.getElementById('startBtn'),
  nameEl: document.getElementById('birthdayName'),
  subtitleEl: document.getElementById('birthdaySubtitle'),
  particlesContainer: document.getElementById('particles'),

  experienceNameEl: document.getElementById('experienceName'),
  greetingCard: document.getElementById('greetingCard'),
  cardNameEl: document.getElementById('cardName'),
  cardMessageEl: document.getElementById('cardMessage'),
  cardSignatureEl: document.getElementById('cardSignature'),
  closeCardBtn: document.getElementById('closeCardBtn'),
  cardStatusHint: document.getElementById('cardStatusHint'),

  giftRow: document.getElementById('giftRow'),
  confettiLayer: document.getElementById('confettiLayer'),

  // Version 4
  birthdayCake: document.getElementById('birthdayCake'),
  cakeCandles: document.getElementById('cakeCandles'),
  cakeMessage: document.getElementById('cakeMessage'),
  cakeStatusHint: document.getElementById('cakeStatusHint'),
};

/* -----------------------------------------------------
   3. PERSONALIZATION
----------------------------------------------------- */
function applyPersonalization() {
  if (dom.nameEl) dom.nameEl.textContent = CONFIG.name;
  if (dom.subtitleEl) dom.subtitleEl.textContent = CONFIG.subtitle;

  if (dom.experienceNameEl) dom.experienceNameEl.textContent = CONFIG.name;
  if (dom.cardNameEl) dom.cardNameEl.textContent = CONFIG.name;
  if (dom.cardMessageEl) dom.cardMessageEl.textContent = CONFIG.card.message;
  if (dom.cardSignatureEl) dom.cardSignatureEl.textContent = CONFIG.card.signature;
}

/* -----------------------------------------------------
   4. FLOATING PARTICLES
----------------------------------------------------- */
function initParticles() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !dom.particlesContainer) return;

  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen
    ? Math.round(CONFIG.particleCount * 0.5)
    : CONFIG.particleCount;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';

    const size = Math.random() * 6 + 3;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 12;
    const drift = Math.random() * 80 - 40;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.setProperty('--drift', `${drift}px`);

    fragment.appendChild(particle);
  }

  dom.particlesContainer.appendChild(fragment);
}

/* -----------------------------------------------------
   5. START CELEBRATION TRANSITION
----------------------------------------------------- */
function startCelebration() {
  if (!dom.landing || !dom.experience) return;

  dom.landing.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  dom.landing.style.opacity = '0';
  dom.landing.style.transform = 'scale(0.98)';

  window.setTimeout(() => {
    dom.landing.classList.add('is-hidden');
    dom.experience.classList.add('is-active');
    dom.experience.setAttribute('aria-hidden', 'false');

    dom.experience.setAttribute('tabindex', '-1');
    dom.experience.focus({ preventScroll: true });

    console.log('🎉 Celebration started!');
  }, 600);
}

/* -----------------------------------------------------
   6. BIRTHDAY CARD — Open/Close Interaction
----------------------------------------------------- */
function initBirthdayCard() {
  const card = dom.greetingCard;
  const closeBtn = dom.closeCardBtn;
  if (!card) return;

  function setCardOpen(isOpen) {
    card.classList.toggle('is-open', isOpen);
    card.setAttribute('aria-pressed', String(isOpen));
    card.setAttribute(
      'aria-label',
      isOpen
        ? 'Birthday card, open. Press the close button to close it.'
        : 'Birthday card, closed. Press to open and read your message.'
    );

    if (dom.cardStatusHint) {
      dom.cardStatusHint.textContent = isOpen
        ? 'tap the ✕ to close the card'
        : 'tap the card to open it';
    }

    if (closeBtn) {
      if (isOpen) {
        closeBtn.removeAttribute('tabindex');
      } else {
        closeBtn.setAttribute('tabindex', '-1');
      }
    }
  }

  card.addEventListener('click', () => {
    if (!card.classList.contains('is-open')) {
      setCardOpen(true);
    }
  });

  card.addEventListener('keydown', (event) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey && !card.classList.contains('is-open')) {
      event.preventDefault();
      setCardOpen(true);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      setCardOpen(false);
    });
  }

  setCardOpen(false);
}

/* -----------------------------------------------------
   7. CONFETTI BURST — Reusable Celebration Utility
----------------------------------------------------- */
const CONFETTI_COLORS = ['#ff8fab', '#f5c66b', '#b98be0', '#c9e4ff', '#ffc2d1'];

function triggerConfetti(originXPercent = 50) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !dom.confettiLayer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.confettiPiecesPerBurst; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.min(100, Math.max(0, originXPercent + (Math.random() * 40 - 20)));
    const duration = Math.random() * 1.5 + 2;
    const delay = Math.random() * 0.3;
    const drift = Math.random() * 160 - 80;
    const spin = Math.random() * 720 - 360;
    const size = Math.random() * 4 + 6;

    piece.style.left = `${left}%`;
    piece.style.background = color;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty('--confetti-drift', `${drift}px`);
    piece.style.setProperty('--confetti-spin', `${spin}deg`);

    const totalLifetime = (duration + delay) * 1000 + 100;
    window.setTimeout(() => piece.remove(), totalLifetime);

    fragment.appendChild(piece);
  }

  dom.confettiLayer.appendChild(fragment);
}

/* -----------------------------------------------------
   8. GIFT BOXES — Open Interaction
----------------------------------------------------- */
function initGiftBoxes() {
  const gifts = document.querySelectorAll('.gift');
  if (!gifts.length) return;

  gifts.forEach((gift) => {
    const giftId = gift.dataset.giftId || '';

    function setGiftOpen(isOpen) {
      gift.classList.toggle('is-open', isOpen);
      gift.setAttribute('aria-pressed', String(isOpen));
      gift.setAttribute(
        'aria-label',
        isOpen
          ? `Gift box ${giftId}, open.`
          : `Gift box ${giftId}, closed. Press to open.`
      );

      if (isOpen) {
        const rect = gift.getBoundingClientRect();
        const originXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        triggerConfetti(originXPercent);
      }
    }

    gift.addEventListener('click', () => {
      if (!gift.classList.contains('is-open')) {
        setGiftOpen(true);
      }
    });

    gift.addEventListener('keydown', (event) => {
      const isActivationKey = event.key === 'Enter' || event.key === ' ';
      if (isActivationKey && !gift.classList.contains('is-open')) {
        event.preventDefault();
        setGiftOpen(true);
      }
    });
  });
}

/* -----------------------------------------------------
   9. CAKE & CANDLES — Rendering + Interaction
   -----------------------------------------------------
   renderCakeCandles() builds the candle elements from
   CONFIG.cake.candleCount (kept separate from initCake()
   so the candle count could be re-rendered independently
   in a future version, e.g. if an age input is added).

   initCake() runs a simple two-state cycle on the .cake
   button: unlit → lit ("make a wish") → unlit-with-wish
   ("wish granted" + confetti) → lit again, and so on.
   This is intentionally repeatable, unlike the gift boxes.
----------------------------------------------------- */
const CANDLE_COLORS = ['#ff8fab', '#f5c66b', '#b98be0', '#ffb997'];

function renderCakeCandles() {
  if (!dom.cakeCandles) return;

  dom.cakeCandles.innerHTML = ''; // safe: this container only ever holds generated candles

  const count = Math.max(1, CONFIG.cake.candleCount);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const candle = document.createElement('span');
    candle.className = 'candle';

    const color = CANDLE_COLORS[i % CANDLE_COLORS.length];
    // Gentle height variance so a row of candles doesn't look robotically uniform
    const scale = i % 3 === 1 ? 1.15 : i % 3 === 2 ? 0.9 : 1;

    candle.style.setProperty('--candle-color', color);
    candle.style.setProperty('--candle-scale', String(scale));

    candle.innerHTML =
      '<span class="candle__flame"></span>' +
      '<span class="candle__wick"></span>' +
      '<span class="candle__stick"></span>';

    fragment.appendChild(candle);
  }

  dom.cakeCandles.appendChild(fragment);
}

function initCake() {
  const cake = dom.birthdayCake;
  if (!cake) return;

  renderCakeCandles();

  let isLit = false;
  let hasWished = false;

  // Keeps the message, the small hint line, and the button's own
  // aria-label all in sync with the current state.
  function refreshCakeState() {
    if (isLit) {
      cake.setAttribute('aria-pressed', 'true');
      cake.setAttribute(
        'aria-label',
        'Birthday cake, candles lit. Press to blow them out and make your wish come true.'
      );
      if (dom.cakeMessage) dom.cakeMessage.textContent = CONFIG.cake.wishPrompt;
      if (dom.cakeStatusHint) dom.cakeStatusHint.textContent = 'tap again to blow out the candles';
    } else {
      cake.setAttribute('aria-pressed', 'false');
      cake.setAttribute(
        'aria-label',
        hasWished
          ? 'Birthday cake, candles blown out. Press to light them again and make another wish.'
          : 'Birthday cake, candles unlit. Press to light them and make a wish.'
      );
      if (dom.cakeMessage) {
        dom.cakeMessage.textContent = hasWished ? CONFIG.cake.wishGrantedMessage : '';
      }
      if (dom.cakeStatusHint) {
        dom.cakeStatusHint.textContent = hasWished
          ? 'tap to light them again'
          : 'tap the cake to light the candles';
      }
    }
  }

  function handleCakeActivate() {
    if (!isLit) {
      // Light the candles
      isLit = true;
      cake.classList.add('is-lit');
      refreshCakeState();
      return;
    }

    // Blow the candles out: play the puff animation, then settle into
    // the "wish made" unlit state and celebrate with confetti.
    isLit = false;
    hasWished = true;
    cake.classList.remove('is-lit');
    cake.classList.add('is-puffing');

    window.setTimeout(() => {
      cake.classList.remove('is-puffing');
    }, 500);

    refreshCakeState();

    // Confetti centered on the cake's actual position on screen
    const rect = cake.getBoundingClientRect();
    const originXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    triggerConfetti(originXPercent);
  }

  cake.addEventListener('click', handleCakeActivate);

  cake.addEventListener('keydown', (event) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey) {
      event.preventDefault(); // stop Space from scrolling the page
      handleCakeActivate();
    }
  });

  refreshCakeState(); // sets the initial "tap to light" hint
}

/* -----------------------------------------------------
   10. EVENT LISTENERS
----------------------------------------------------- */
function bindEvents() {
  if (dom.startBtn) {
    dom.startBtn.addEventListener('click', startCelebration);

    dom.startBtn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        startCelebration();
      }
    });
  }
}

/* -----------------------------------------------------
   11. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard();
  initGiftBoxes();
  initCake(); // Version 4
}

document.addEventListener('DOMContentLoaded', init);
