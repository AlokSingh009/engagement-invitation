/**
 * Engagement Invitation — Alok & Shephali
 */
const INVITATION = {
  groomName: 'Alok',
  brideName: 'Shephali',
  groomParents: 'S/o Mr. Brijesh Singh & Mrs. Kiran Singh',
  brideParents: 'D/o Mr. Bhupendra Singh & Mrs. Manju Singh',
  date: 'Saturday, 11th July 2026',
  time: '6:00 PM to 11:00 PM',
  eventDateISO: '2026-07-11T18:00:00',
  venueName: 'De Grandeur Hotel And Banquets',
  venue: 'Royal Plaza Anand Nagar, Near Bhakti Park Ghodbunder Road, Thane West, Thane, Mumbai',
  mapUrl: 'https://maps.app.goo.gl/orNarWzCHPnuG1hs6',
  audioSrc: 'assets/invitation-video.mp4',
  musicVolume: 0.85,
};

// Content
document.getElementById('groom-name').textContent = INVITATION.groomName;
document.getElementById('bride-name').textContent = INVITATION.brideName;
document.getElementById('groom-parents').textContent = INVITATION.groomParents;
document.getElementById('bride-parents').textContent = INVITATION.brideParents;
document.getElementById('revealed-date').textContent = INVITATION.date;
document.getElementById('revealed-time').textContent = INVITATION.time;
document.getElementById('venue-name').textContent = INVITATION.venueName;
document.getElementById('event-venue').textContent = INVITATION.venue;
document.getElementById('event-map').href = INVITATION.mapUrl;

const progressBar = document.querySelector('.scroll-progress');
const envelopeScene = document.getElementById('envelope-scene');
const envelopeFlap = document.getElementById('envelope-flap');
const envelopeSeal = document.getElementById('envelope-seal');
const envelopeLetter = document.getElementById('envelope-letter');
const scrollHint = document.querySelector('.scroll-hint');
const revealItems = document.querySelectorAll('.reveal-item');
const bgAudio = document.getElementById('bg-audio');
const musicToggle = document.getElementById('music-toggle');
const celebrationLayer = document.getElementById('celebration-layer');
const petalsLayer = document.getElementById('petals-layer');

bgAudio.volume = INVITATION.musicVolume;
bgAudio.src = INVITATION.audioSrc;

let envelopeCelebrationFired = false;
let dateRevealed = false;

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ===== Celebration particles =====
const PETAL_COLORS = ['#c45c6a', '#e8a0a8', '#f5c842', '#e8842c', '#f0a0a8', '#ff6b6b', '#ffd700'];
const CRACKER_EMOJIS = ['🎉', '✨', '🎊', '💥', '🪅', '⭐', '🌟', '🎆'];

function spawnParticle(layer, opts) {
  const el = document.createElement('span');
  el.className = 'particle';
  el.textContent = opts.emoji || '';
  el.style.left = `${opts.x}%`;
  el.style.top = `${opts.y}%`;
  el.style.fontSize = `${opts.size || 14}px`;
  if (opts.color) {
    el.style.width = `${opts.size || 10}px`;
    el.style.height = `${opts.size || 10}px`;
    el.style.background = opts.color;
    el.style.borderRadius = '50% 0 50% 50%';
    el.textContent = '';
  }
  layer.appendChild(el);

  const angle = opts.angle ?? Math.random() * Math.PI * 2;
  const velocity = opts.velocity ?? 4 + Math.random() * 8;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity - 2;
  let x = opts.x;
  let y = opts.y;
  let life = 0;
  const maxLife = opts.duration ?? 80;

  function tick() {
    life++;
    x += vx * 0.35;
    y += vy * 0.35 + life * 0.04;
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.opacity = `${1 - life / maxLife}`;
    el.style.transform = `rotate(${life * 8}deg) scale(${1 - life / maxLife * 0.5})`;
    if (life < maxLife) {
      requestAnimationFrame(tick);
    } else {
      el.remove();
    }
  }
  requestAnimationFrame(tick);
}

function petalShower(intensity = 'normal') {
  const count = intensity === 'burst' ? 80 : 35;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnParticle(petalsLayer, {
        x: Math.random() * 100,
        y: -5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        size: 6 + Math.random() * 10,
        velocity: 2 + Math.random() * 5,
        angle: Math.PI / 2 + (Math.random() - 0.5) * 0.8,
        duration: 100 + Math.random() * 60,
      });
    }, i * (intensity === 'burst' ? 15 : 40));
  }
}

function crackerBurst() {
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const fromCenter = Math.random() > 0.4;
      spawnParticle(celebrationLayer, {
        x: fromCenter ? 40 + Math.random() * 20 : Math.random() * 100,
        y: fromCenter ? 35 + Math.random() * 20 : Math.random() * 30,
        emoji: CRACKER_EMOJIS[Math.floor(Math.random() * CRACKER_EMOJIS.length)],
        size: 14 + Math.random() * 20,
        velocity: 6 + Math.random() * 14,
        angle: Math.random() * Math.PI * 2,
        duration: 70 + Math.random() * 50,
      });
    }, i * 20);
  }
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      spawnParticle(celebrationLayer, {
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 30,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        size: 8 + Math.random() * 12,
        velocity: 5 + Math.random() * 12,
        angle: Math.random() * Math.PI * 2,
        duration: 90 + Math.random() * 40,
      });
    }, i * 25);
  }
}

function megaCelebration() {
  crackerBurst();
  petalShower('burst');
  setTimeout(() => petalShower('burst'), 400);
  setTimeout(() => crackerBurst(), 600);
}

// Ambient light petals
function startAmbientPetals() {
  setInterval(() => {
    if (document.hidden) return;
    spawnParticle(petalsLayer, {
      x: Math.random() * 100,
      y: -3,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      size: 5 + Math.random() * 6,
      velocity: 1.5 + Math.random() * 2,
      angle: Math.PI / 2 + (Math.random() - 0.5) * 0.4,
      duration: 120,
    });
  }, 900);
}

// ===== Envelope scroll =====
function handleScroll() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0}%`;

  const rect = envelopeScene.getBoundingClientRect();
  const height = envelopeScene.offsetHeight;
  const scrolled = clamp(-rect.top, 0, height);
  const progress = clamp(scrolled / (height * 0.6), 0, 1);

  envelopeFlap.style.transform = `rotateX(${lerp(0, 165, progress)}deg)`;

  const sealFade = clamp(1 - progress * 2.5, 0, 1);
  envelopeSeal.style.opacity = sealFade;
  envelopeSeal.style.transform = `translate(-50%, -50%) scale(${lerp(1, 0.3, progress)})`;

  envelopeLetter.style.opacity = clamp((progress - 0.35) * 2.5, 0, 1);
  envelopeLetter.style.transform = `translateY(${lerp(16, 0, clamp((progress - 0.35) * 2.5, 0, 1))}px)`;

  if (scrollHint) scrollHint.style.opacity = clamp(1 - progress * 3, 0, 1);
  envelopeScene.style.opacity = clamp(1 - progress * 0.45, 0.55, 1);

  if (progress > 0.55 && !envelopeCelebrationFired) {
    envelopeCelebrationFired = true;
    petalShower('normal');
    setTimeout(() => petalShower('normal'), 300);
  }
}

// ===== Scratch card =====
const scratchCard = document.getElementById('scratch-card');
const scratchCanvas = document.getElementById('scratch-canvas');
const scratchHint = document.getElementById('scratch-hint');
const countdownBlock = document.getElementById('countdown-block');
const venueBottom = document.querySelector('.venue-bottom');
const venueDateNote = document.getElementById('venue-date-note');
const ctx = scratchCanvas.getContext('2d');
let isScratching = false;
let scratchedPixels = 0;
let totalPixels = 0;

function initScratchCanvas() {
  const rect = scratchCard.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  scratchCanvas.width = rect.width * dpr;
  scratchCanvas.height = rect.height * dpr;
  scratchCanvas.style.width = `${rect.width}px`;
  scratchCanvas.style.height = `${rect.height}px`;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#e8c878');
  grad.addColorStop(0.3, '#f5e6c0');
  grad.addColorStop(0.5, '#d4b060');
  grad.addColorStop(0.7, '#f0dfa8');
  grad.addColorStop(1, '#c9a050');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = '600 14px Playfair Display, serif';
  ctx.fillStyle = 'rgba(122,45,58,0.5)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Scratch Here', w / 2, h / 2);

  totalPixels = w * h;
  scratchedPixels = 0;
}

function scratchAt(clientX, clientY) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fill();

  if (!scratchCard.classList.contains('scratching')) {
    scratchCard.classList.add('scratching');
  }

  checkScratchProgress();
}

let scratchCheckScheduled = false;

function checkScratchProgress() {
  if (dateRevealed || scratchCheckScheduled) return;
  scratchCheckScheduled = true;
  requestAnimationFrame(() => {
    scratchCheckScheduled = false;
    if (dateRevealed) return;

    const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    let transparent = 0;
    const step = 16;
    for (let i = 3; i < imageData.data.length; i += 4 * step) {
      if (imageData.data[i] < 128) transparent++;
    }
    const ratio = transparent / (imageData.data.length / 4 / step);

    if (ratio > 0.38) revealDate();
  });
}

function revealDate() {
  if (dateRevealed) return;
  dateRevealed = true;
  scratchCard.classList.add('revealed');
  countdownBlock.classList.add('visible');
  venueBottom.classList.add('revealed');
  venueDateNote.textContent = `${INVITATION.date} · ${INVITATION.time}`;
  megaCelebration();
}

function getTouchPos(e) {
  const t = e.touches ? e.touches[0] : e;
  return { x: t.clientX, y: t.clientY };
}

scratchCanvas.addEventListener('mousedown', (e) => {
  isScratching = true;
  scratchAt(e.clientX, e.clientY);
});

scratchCanvas.addEventListener('mousemove', (e) => {
  if (isScratching) scratchAt(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => { isScratching = false; });

scratchCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isScratching = true;
  const p = getTouchPos(e);
  scratchAt(p.x, p.y);
}, { passive: false });

scratchCanvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isScratching) return;
  const p = getTouchPos(e);
  scratchAt(p.x, p.y);
}, { passive: false });

scratchCanvas.addEventListener('touchend', () => { isScratching = false; });

// ===== Countdown =====
function updateCountdown() {
  if (!dateRevealed) return;
  const target = new Date(INVITATION.eventDateISO);
  const diff = Math.max(0, target - new Date());
  document.getElementById('cd-days').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}

setInterval(updateCountdown, 1000);

// ===== Reveal observer =====
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add('visible');
  }),
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
revealItems.forEach((el) => revealObserver.observe(el));

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
  handleScroll();
  if (!dateRevealed) initScratchCanvas();
});
handleScroll();

// Init scratch after layout
requestAnimationFrame(() => {
  setTimeout(initScratchCanvas, 100);
});

startAmbientPetals();

// ===== Audio =====
let musicStarted = false;

musicToggle.addEventListener('click', async () => {
  if (bgAudio.paused) {
    try {
      bgAudio.muted = false;
      await bgAudio.play();
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('pulse');
      musicStarted = true;
    } catch { /* ignore */ }
  } else {
    bgAudio.pause();
    musicToggle.classList.remove('playing');
  }
});

function tryAutoPlay() {
  if (musicStarted) return;
  bgAudio.muted = false;
  bgAudio.play().then(() => {
    musicToggle.classList.add('playing');
    musicToggle.classList.remove('pulse');
    musicStarted = true;
  }).catch(() => {});
}

window.addEventListener('scroll', tryAutoPlay, { once: true, passive: true });
document.addEventListener('touchstart', tryAutoPlay, { once: true, passive: true });
