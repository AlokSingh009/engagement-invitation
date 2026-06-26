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
  // Kithe Reh Gaya - Neeti Mohan
  audioSrc: 'assets/background-music.mp3',
  musicTitle: 'Kithe Reh Gaya - Neeti Mohan',
  musicStart: 0.12, // 0.12 seconds
  musicEnd: 76, // 1 minute 16 seconds
  musicVolume: 0.85,
};

function formatCoupleName(name) {
  if (!name) return '';
  return `<span class="name-flow">${name}</span>`;
}

function fitStageArchContent() {
  const frame = document.querySelector('.stage-frame');
  const arch = document.querySelector('.arch-content');
  const inner = document.getElementById('arch-content-inner');
  if (!frame || !arch || !inner) return;

  inner.style.setProperty('--arch-fit', '1');

  const frameH = frame.clientHeight;
  if (frameH < 80) return;

  const archStyle = getComputedStyle(arch);
  const topPx = parseFloat(archStyle.top) || 0;
  const bottomPx = parseFloat(archStyle.bottom) || 0;
  const availH = frameH - topPx - bottomPx;
  const availW = arch.clientWidth;

  if (availH <= 0 || availW <= 0) return;

  const naturalH = inner.scrollHeight;
  const naturalW = inner.scrollWidth;
  if (naturalH <= 0 || naturalW <= 0) return;

  const scale = Math.min(1, availH / naturalH, availW / naturalW);
  if (scale < 1) {
    inner.style.setProperty('--arch-fit', Math.max(0.72, scale).toFixed(4));
  }
}

// Content
document.getElementById('groom-name').innerHTML = formatCoupleName(INVITATION.groomName);
document.getElementById('bride-name').innerHTML = formatCoupleName(INVITATION.brideName);
const venueCoupleNames = document.getElementById('venue-couple-names');
if (venueCoupleNames) {
  venueCoupleNames.innerHTML =
    `${formatCoupleName(INVITATION.groomName)}<span class="name-join">&</span>${formatCoupleName(INVITATION.brideName)}`;
}
document.getElementById('groom-parents').textContent = INVITATION.groomParents;
document.getElementById('bride-parents').textContent = INVITATION.brideParents;
document.getElementById('revealed-date').textContent = INVITATION.date;
document.getElementById('revealed-time').textContent = INVITATION.time;
document.getElementById('venue-name').textContent = INVITATION.venueName;
document.getElementById('event-venue').textContent = INVITATION.venue;
document.getElementById('event-map').href = INVITATION.mapUrl;

const progressBar = document.querySelector('.scroll-progress');
const envelopeScene = document.getElementById('envelope-scene');
const envelopeEl = document.getElementById('envelope');
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
bgAudio.loop = false;
bgAudio.preload = 'auto';

const musicSources = [INVITATION.audioSrc];
let musicSourceIndex = 0;

function loadMusicSource(index = 0) {
  musicSourceIndex = index;
  bgAudio.src = musicSources[index];
  bgAudio.load();
}

loadMusicSource(0);

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
  const count = intensity === 'burst' ? 100 : 50;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      spawnParticle(petalsLayer, {
        x: Math.random() * 100,
        y: -5,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        size: 7 + Math.random() * 11,
        velocity: 2 + Math.random() * 5.5,
        angle: Math.PI / 2 + (Math.random() - 0.5) * 0.9,
        duration: 100 + Math.random() * 70,
      });
    }, i * (intensity === 'burst' ? 12 : 32));
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
  for (let i = 0; i < 62; i++) {
    setTimeout(() => {
      spawnParticle(celebrationLayer, {
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 30,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        size: 8 + Math.random() * 13,
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
      size: 5 + Math.random() * 7,
      velocity: 1.5 + Math.random() * 2.5,
      angle: Math.PI / 2 + (Math.random() - 0.5) * 0.45,
      duration: 120,
    });
  }, 720);
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

  if (envelopeEl) {
    envelopeEl.style.transform = `translateY(${lerp(0, -10, progress)}px) scale(${lerp(1, 1.018, progress)})`;
  }
  envelopeScene.classList.toggle('is-opening', progress > 0.06);

  const sealFade = clamp(1 - progress * 2.5, 0, 1);
  envelopeSeal.style.opacity = sealFade;
  envelopeSeal.style.transform = `translate(-50%, -50%) scale(${lerp(1, 0.3, progress)})`;

  const letterT = clamp((progress - 0.22) * 2.4, 0, 1);
  envelopeLetter.style.opacity = letterT;
  envelopeLetter.style.setProperty('--invite-open', letterT.toFixed(3));
  const letterY = lerp(-18, -42, letterT);
  envelopeLetter.style.transform = `translate(-50%, ${letterY}%)`;

  if (scrollHint) scrollHint.style.opacity = clamp(1 - progress * 3, 0, 1);
  envelopeScene.style.opacity = clamp(1 - progress * 0.45, 0.55, 1);

  if (progress > 0.01) tryStartMusicOnScroll(progress);

  if (progress > 0.55 && !envelopeCelebrationFired) {
    envelopeCelebrationFired = true;
    petalShower('normal');
    setTimeout(() => petalShower('normal'), 280);
    setTimeout(() => petalShower('normal'), 560);
  }
}

// ===== Scratch card =====
const scratchCard = document.getElementById('scratch-card');
const scratchCanvas = document.getElementById('scratch-canvas');
const scratchHint = document.getElementById('scratch-hint');
const countdownBlock = document.getElementById('countdown-block');
const ctx = scratchCanvas.getContext('2d');
let isScratching = false;
let scratchedPixels = 0;
let totalPixels = 0;
let scratchDodgeCount = 0;
let scratchUnlocked = false;
let isScratchDodging = false;

const SCRATCH_DODGE_HINTS = [
  '✨ Try again… ✨',
  '😄 Catch me if you can!',
  '🙈 One more try…',
  '✨ Scratch to Reveal ✨',
];

function updateScratchHint() {
  if (!scratchHint) return;
  if (scratchUnlocked) {
    scratchHint.textContent = SCRATCH_DODGE_HINTS[3];
    return;
  }
  if (scratchDodgeCount === 0) {
    scratchHint.textContent = '✨ Scratch to Reveal ✨';
    return;
  }
  const dodgeLabels = ['← Nice try!', '→ Almost…', '↑ One more!'];
  scratchHint.textContent = dodgeLabels[Math.min(scratchDodgeCount - 1, 2)] || SCRATCH_DODGE_HINTS[Math.min(scratchDodgeCount - 1, 2)];
}

const SCRATCH_DODGE_DIRECTIONS = [
  { x: -1, y: 0, label: 'left' },
  { x: 1, y: 0, label: 'right' },
  { x: 0, y: -1, label: 'up' },
];

function dodgeScratchCard(dodgeIndex) {
  if (isScratchDodging || !scratchCard) return;

  const dir = SCRATCH_DODGE_DIRECTIONS[dodgeIndex] || { x: 0, y: 1 };
  const moveX = Math.min(140, window.innerWidth * 0.36);
  const moveY = 62;
  const dx = dir.x * moveX;
  const dy = dir.y * moveY;

  isScratchDodging = true;
  scratchCanvas.style.pointerEvents = 'none';

  scratchCard.classList.remove('scratch-return');
  scratchCard.classList.add('scratch-dodge');
  scratchCard.style.transform = `translate(${dx}px, ${dy}px)`;

  window.setTimeout(() => {
    scratchCard.classList.remove('scratch-dodge');
    scratchCard.classList.add('scratch-return');
    scratchCard.style.transform = 'translate(0, 0)';

    window.setTimeout(() => {
      scratchCard.classList.remove('scratch-return');
      scratchCanvas.style.pointerEvents = '';
      isScratchDodging = false;
    }, 440);
  }, 550);
}

function beginScratchSession(clientX, clientY) {
  if (dateRevealed || isScratchDodging) return false;
  if (scratchUnlocked) return true;

  if (scratchDodgeCount < 3) {
    const dodgeIndex = scratchDodgeCount;
    scratchDodgeCount += 1;
    updateScratchHint();
    dodgeScratchCard(dodgeIndex);
    return false;
  }

  scratchUnlocked = true;
  scratchCard.style.transform = 'translate(0, 0)';
  updateScratchHint();
  return true;
}

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

  totalPixels = w * h;
  scratchedPixels = 0;
}

function scratchAt(clientX, clientY) {
  if (!scratchUnlocked || dateRevealed) return;

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
  megaCelebration();
}

function getTouchPos(e) {
  const t = e.touches ? e.touches[0] : e;
  return { x: t.clientX, y: t.clientY };
}

scratchCanvas.addEventListener('mousedown', (e) => {
  if (!beginScratchSession(e.clientX, e.clientY)) return;
  isScratching = true;
  scratchAt(e.clientX, e.clientY);
});

scratchCanvas.addEventListener('mousemove', (e) => {
  if (!isScratching || !scratchUnlocked) return;
  scratchAt(e.clientX, e.clientY);
});

window.addEventListener('mouseup', () => { isScratching = false; });

scratchCanvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const p = getTouchPos(e);
  if (!beginScratchSession(p.x, p.y)) return;
  isScratching = true;
  scratchAt(p.x, p.y);
}, { passive: false });

scratchCanvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isScratching || !scratchUnlocked) return;
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
  fitStageArchContent();
  if (scratchCard) {
    scratchCard.style.transform = '';
    scratchCard.classList.remove('scratch-dodge');
  }
  if (!dateRevealed) initScratchCanvas();
});
handleScroll();

const stageBgImg = document.querySelector('.stage-bg-img');
if (stageBgImg) {
  const runFit = () => requestAnimationFrame(fitStageArchContent);
  if (stageBgImg.complete) runFit();
  else stageBgImg.addEventListener('load', runFit, { once: true });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => requestAnimationFrame(fitStageArchContent));
} else {
  requestAnimationFrame(fitStageArchContent);
}

// Init scratch after layout
requestAnimationFrame(() => {
  setTimeout(initScratchCanvas, 100);
});

startAmbientPetals();

// ===== Audio: Kithe Reh Gaya — clip 0.12s → 1:16 (76s) =====
let musicLoading = false;
let musicHasStarted = false;
let userPausedMusic = false;

function seekToMusicStart() {
  if (!Number.isFinite(INVITATION.musicStart) || bgAudio.readyState < 1) return;
  if (bgAudio.currentTime < INVITATION.musicStart || bgAudio.currentTime >= INVITATION.musicEnd) {
    bgAudio.currentTime = INVITATION.musicStart;
  }
}

function loopMusicClip() {
  if (bgAudio.paused) return;
  if (bgAudio.currentTime >= INVITATION.musicEnd - 0.05) {
    seekToMusicStart();
  }
}

function syncMusicToggle() {
  musicToggle.classList.toggle('playing', !bgAudio.paused && musicHasStarted);
}

bgAudio.addEventListener('loadedmetadata', seekToMusicStart);
bgAudio.addEventListener('timeupdate', loopMusicClip);
bgAudio.addEventListener('play', syncMusicToggle);
bgAudio.addEventListener('pause', syncMusicToggle);
bgAudio.addEventListener('ended', () => {
  seekToMusicStart();
  if (musicHasStarted && !userPausedMusic) {
    bgAudio.play().catch(() => {});
  }
});
bgAudio.addEventListener('error', () => {
  if (musicSourceIndex < musicSources.length - 1) {
    loadMusicSource(musicSourceIndex + 1);
    return;
  }
  console.warn(
    `Could not load "${INVITATION.musicTitle}". Add the file as assets/background-music.mp3`
  );
});

async function ensureAudioReady() {
  if (bgAudio.readyState >= 2) return;
  await new Promise((resolve) => {
    const done = () => resolve();
    bgAudio.addEventListener('canplay', done, { once: true });
    bgAudio.addEventListener('error', done, { once: true });
    bgAudio.load();
    setTimeout(done, 2500);
  });
}

async function playMusic() {
  if (musicLoading) return;
  musicLoading = true;
  try {
    await ensureAudioReady();
    if (bgAudio.error) return;
    seekToMusicStart();
    bgAudio.muted = false;
    bgAudio.volume = INVITATION.musicVolume;
    await bgAudio.play();
    musicHasStarted = true;
    userPausedMusic = false;
    musicToggle.classList.add('playing');
    musicToggle.classList.remove('pulse');
  } catch {
    /* browser blocked — user can tap music button */
  } finally {
    musicLoading = false;
  }
}

function pauseMusic() {
  userPausedMusic = true;
  bgAudio.pause();
  musicToggle.classList.remove('playing');
}

function tryStartMusicOnScroll(progress = 0) {
  if (musicHasStarted || userPausedMusic || musicLoading) return;
  if (window.scrollY >= 1 || progress > 0.01) playMusic();
}

musicToggle.addEventListener('click', async () => {
  if (bgAudio.paused) {
    await playMusic();
  } else {
    pauseMusic();
  }
});
