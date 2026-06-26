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
// SMOOTH SCROLL (Lenis) + GSAP ScrollTrigger
// =============================================
const hasGSAP  = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const hasLenis = typeof window.Lenis !== 'undefined';
let lenis = null;

function initSmoothScroll() {
  if (prefersReducedMotion || !hasLenis) return;

  lenis = new Lenis({
    duration: 1.15,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // Locked until the envelope is opened
  lenis.stop();
}

// Smooth, offset-aware anchor scrolling
function scrollToTarget(target) {
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
  if (lenis) {
    lenis.scrollTo(target, { offset: -navH + 10, duration: 1.2 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - navH + 10;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function setupAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#' || id === '#hero') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      closeMobileMenu();
    });
  });
}

// =============================================
// HERO PARALLAX + KEN BURNS (GSAP when available)
// =============================================
function initHeroMotion() {
  const heroBg    = document.querySelector('.hero-bg');
  const heroVideo = document.querySelector('.hero-video');
  if (prefersReducedMotion) return;

  if (hasGSAP && window.matchMedia('(min-width: 768px)').matches) {
    // GSAP owns the hero-bg transform → mark so CSS Ken Burns steps aside
    document.documentElement.classList.add('gsap-hero');

    // Slow cinematic zoom (Ken Burns) once the content is revealed
    gsap.fromTo('.hero-bg',
      { scale: 1.08 },
      { scale: 1.2, duration: 22, ease: 'power1.out', delay: 0.2 }
    );

    // Scroll parallax — background drifts slower than foreground
    [heroBg, heroVideo].forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // Gentle fade of hero content as you scroll away
    gsap.to('.hero-content', {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'center top', end: 'bottom top', scrub: true },
    });
    return;
  }

  // Fallback: lightweight rAF parallax (no GSAP)
  if (window.matchMedia('(min-width: 768px)').matches) {
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
}

// =============================================
// SCROLL REVEAL
// =============================================
function initReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// =============================================
// STICKY NAV — show, frost, active section, mobile menu
// =============================================
let closeMobileMenu = () => {};

function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  const toggle = nav.querySelector('.nav-toggle');
  const links  = nav.querySelector('.nav-links');
  const hero   = document.getElementById('hero');

  // Mobile menu
  closeMobileMenu = () => {
    links.classList.remove('mobile-open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('mobile-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // Show / frost nav based on scroll position
  const updateNav = () => {
    const threshold = (hero ? hero.offsetHeight : window.innerHeight) * 0.62;
    if (window.scrollY > threshold) {
      nav.classList.add('nav-visible', 'nav-scrolled');
    } else {
      nav.classList.remove('nav-visible', 'nav-scrolled');
      closeMobileMenu();
    }
  };
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Active-section highlight
  const navLinks = Array.from(nav.querySelectorAll('.nav-links a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle('is-active', a.getAttribute('href') === id)
          );
        }
      });
    }, { threshold: 0.3, rootMargin: '-30% 0px -55% 0px' });
    sections.forEach((s) => sectionObserver.observe(s));
  }
}

// =============================================
// GALLERY LIGHTBOX
// =============================================
function initLightbox() {
  const box   = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-img');
  if (!box || !imgEl) return;

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const sources = items.map((fig) => {
    const img = fig.querySelector('img');
    return { src: img.currentSrc || img.src, alt: img.alt || '' };
  });
  let current = 0;

  const show = (i) => {
    current = (i + sources.length) % sources.length;
    // refresh src in case the fallback (onerror) swapped it after load
    const img = items[current].querySelector('img');
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt || '';
  };

  const open = (i) => {
    show(i);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  };

  items.forEach((fig, i) => {
    fig.addEventListener('click', () => open(i));
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(current + 1); });
  box.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(current - 1); });
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft')  show(current - 1);
  });
}

// =============================================
// MAIN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrap   = document.querySelector('.cover');
  const mainContent    = document.getElementById('main-content');

  setupMusicToggle();
  initSmoothScroll();
  initHeroMotion();
  initReveals();
  initNav();
  initLightbox();
  setupAnchorLinks();

  function openEnvelope() {
    if (envelopeWrap.classList.contains('opening')) return;
    envelopeWrap.classList.add('opening');

    // Music starts with the click (counts as user interaction → autoplay allowed)
    startMusic();

    // Petals burst out as the flap lifts
    setTimeout(spawnPetals, 600);

    // Screen exit
    setTimeout(() => envelopeScreen.classList.add('closing'), 700);

    // Reveal main content + unlock scrolling
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      mainContent.classList.add('visible');
      if (lenis) lenis.start();
      if (hasGSAP) ScrollTrigger.refresh();
    }, 1700);
  }

  envelopeWrap.addEventListener('click', openEnvelope);
  envelopeWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  // =============================================
  // ATTENDANCE TOGGLE
  // =============================================
  const attendanceBtns = document.querySelectorAll('.attendance-btn');
  let selectedAttendance = '';

  attendanceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      attendanceBtns.forEach((b) => b.classList.remove('active'));
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
      firstBtn.style.borderColor = '#DE93A4';
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
    if (hasGSAP) ScrollTrigger.refresh();
    spawnPetals();
  });
});
