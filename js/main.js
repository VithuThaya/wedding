// =============================================
// GOOGLE FORMS RSVP INTEGRATION
// =============================================
// TODO: Replace these values after creating your Google Form.
// Steps:
//  1. Go to forms.google.com → create a new form
//  2. Add fields: Attendance, Name, Email, Number of Guests,
//     Dietary Restrictions, Song Request, Message to the Couple
//  3. Click ⋮ menu → "Get pre-filled link" → fill dummy values → "Get link"
//  4. The URL contains entry.XXXXXXXXX IDs — copy each one below
//  5. The form's action URL ends with /formResponse
// =============================================

const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/u/0/d/YOUR_FORM_ID/formResponse'; // TODO
const ENTRY = {
  attendance: 'entry.000000001', // TODO
  name:       'entry.000000002', // TODO
  email:      'entry.000000003', // TODO
  guests:     'entry.000000004', // TODO
  dietary:    'entry.000000005', // TODO
  song:       'entry.000000006', // TODO
  message:    'entry.000000007', // TODO
};

// =============================================
// MUSIC — file: audio/wedding-music.mp3
// =============================================
const MUSIC_SRC = 'audio/wedding-music.mp3';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let audio = null;

function fadeAudio(target, ms) {
  if (!audio) return;
  const start = audio.volume;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / ms, 1);
    audio.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function startMusic() {
  if (prefersReducedMotion || audio) return;
  audio = new Audio(MUSIC_SRC);
  audio.loop = true;
  audio.volume = 0;

  const toggle = document.getElementById('music-toggle');

  audio.play().then(() => {
    fadeAudio(0.55, 2000);
    if (toggle) toggle.hidden = false;
  }).catch(() => {
    // Autoplay blocked — reveal the button so the user can start it manually
    if (toggle) { toggle.hidden = false; toggle.classList.add('paused'); }
  });
}

function setupMusicToggle() {
  const toggle = document.getElementById('music-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    if (!audio) { startMusic(); return; }
    if (audio.paused) {
      audio.play();
      fadeAudio(0.55, 800);
      toggle.classList.remove('paused');
    } else {
      audio.pause();
      toggle.classList.add('paused');
    }
  });
}

// =============================================
// PETAL GENERATION
// =============================================
const PETAL_COLORS = ['#F5B8C8', '#F2C4CE', '#E8A8BC', '#FAD4DC', '#F0C0CC', '#EDB0C0'];
const PETAL_COUNT  = 18;

function spawnPetals() {
  const layer = document.getElementById('petal-layer');
  if (!layer || prefersReducedMotion) return;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    const animIndex = (i % 6) + 1;
    petal.classList.add(`petal-anim-${animIndex}`);

    const size  = 14 + Math.random() * 18;
    const left  = 10 + Math.random() * 80;
    const dur   = 3.2 + Math.random() * 3;
    const delay = 0.1 + Math.random() * 2.2;
    const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];

    petal.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * 0.65}px;
      background: ${color};
      --dur: ${dur}s;
      --delay: ${delay}s;
      opacity: 0;
      border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
    `;

    layer.appendChild(petal);
    petal.addEventListener('animationend', () => petal.remove(), { once: true });
  }
}

// =============================================
// MAIN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrap   = document.querySelector('.envelope-wrap');
  const mainContent    = document.getElementById('main-content');

  setupMusicToggle();

  function openEnvelope() {
    if (envelopeWrap.classList.contains('opening')) return;
    envelopeWrap.classList.add('opening');

    // Music starts with the click (counts as user interaction → autoplay allowed)
    startMusic();

    // Petals burst out as the flap lifts
    setTimeout(spawnPetals, 600);

    // Screen exit
    setTimeout(() => envelopeScreen.classList.add('closing'), 700);

    // Reveal main content
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      mainContent.classList.add('visible');
    }, 1700);
  }

  envelopeWrap.addEventListener('click', openEnvelope);
  envelopeWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  // =============================================
  // SCROLL REVEAL
  // =============================================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // =============================================
  // HERO PARALLAX (desktop only, perf-friendly)
  // =============================================
  const heroBg    = document.querySelector('.hero-bg');
  const heroVideo = document.querySelector('.hero-video');
  if (!prefersReducedMotion && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = window.scrollY * 0.4;
        if (heroBg)    heroBg.style.transform    = `translateY(${offset}px)`;
        if (heroVideo) heroVideo.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // =============================================
  // ATTENDANCE TOGGLE
  // =============================================
  const attendanceBtns = document.querySelectorAll('.attendance-btn');
  let selectedAttendance = '';

  attendanceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      attendanceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAttendance = btn.dataset.value;
    });
  });

  // =============================================
  // GUEST STEPPER
  // =============================================
  const guestInput = document.getElementById('guest-count');
  document.getElementById('guest-minus').addEventListener('click', () => {
    const v = parseInt(guestInput.value) || 1;
    if (v > 1) guestInput.value = v - 1;
  });
  document.getElementById('guest-plus').addEventListener('click', () => {
    const v = parseInt(guestInput.value) || 1;
    if (v < 10) guestInput.value = v + 1;
  });

  // =============================================
  // RSVP FORM SUBMIT
  // =============================================
  const form       = document.getElementById('rsvp-form');
  const submitBtn  = document.getElementById('rsvp-submit');
  const formWrap   = document.getElementById('rsvp-form-wrap');
  const successMsg = document.getElementById('rsvp-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedAttendance) {
      const firstBtn = document.querySelector('.attendance-btn');
      firstBtn.focus();
      firstBtn.style.borderColor = '#9D3D58';
      setTimeout(() => firstBtn.style.borderColor = '', 1500);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';

    const fd = new FormData();
    fd.append(ENTRY.attendance, selectedAttendance);
    fd.append(ENTRY.name,       form.querySelector('[name="fullname"]').value);
    fd.append(ENTRY.email,      form.querySelector('[name="email"]').value);
    fd.append(ENTRY.guests,     guestInput.value);
    fd.append(ENTRY.dietary,    form.querySelector('[name="dietary"]').value);
    fd.append(ENTRY.song,       form.querySelector('[name="song"]').value);
    fd.append(ENTRY.message,    form.querySelector('[name="message"]').value);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, { method: 'POST', mode: 'no-cors', body: fd });
    } catch (_) { /* no-cors always throws, response is still sent */ }

    formWrap.style.display = 'none';
    successMsg.classList.add('visible');
    spawnPetals();
  });
});
