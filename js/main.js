// =============================================
// GOOGLE SHEETS RSVP INTEGRATION (Apps Script Web App)
// =============================================
// The form POSTs a JSON body to a Google Apps Script Web App, which writes
// a row to your Sheet (see the doPost() code shared in the repo / README).
//
// SETUP:
//  1. In your Sheet → Erweiterungen → Apps Script, paste the doPost() code.
//  2. Bereitstellen → Neue Bereitstellung → Typ: Web-App
//     • Ausführen als: Ich
//     • Zugriff: Jeder (anonym)  ← wichtig, sonst wird die Anfrage blockiert
//  3. Copy the Web-App URL (ends with /exec) and paste it below.
//
// Note: cross-origin requests to Apps Script can't read the response
// (no CORS headers), so we POST as text/plain in no-cors mode and show
// success optimistically — the row is still written.
// =============================================

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyWroKr8O5B4-KSIdanQfs-jDgV_J4nh6NvcBaH6ci3OwP-9EcE6vyHz2CaYUGGbutj/exec';

// =============================================
// MUSIC — file: audio/wedding-music.mp3
// =============================================
const MUSIC_SRC = 'audio/wedding-music.mp3?v=20270715';
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

function spawnPetals(layer) {
  layer = layer || document.getElementById('petal-layer');
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
// FAREWELL — full-screen closing page after RSVP submit
// =============================================
const RSVP_FLAG = 'vs_rsvp_done';

// Apple devices (incl. iPadOS, which reports as "Macintosh") open a real
// .ics directly in Apple Calendar. Everyone else gets a Google Calendar
// link that opens the calendar app/site with the event pre-filled — no
// file download on either path.
function isAppleDevice() {
  return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}

function googleCalendarUrl() {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Hochzeit von Vithu & Saru',
    dates: '20270529T140000Z/20270529T210000Z', // 16:00–23:00 Europe/Zurich
    details: 'Wir feiern im Saalbau Kirchberg! Empfang ab 16:00 Uhr.',
    // Venue name kept out of `location` so the calendar geocodes the street
    // address correctly (the "Saalbau Kirchberg, " prefix sent it to the wrong
    // Industriestrasse); the venue name lives in `details` above instead.
    location: 'Neuhofstrasse 33, 3422 Kirchberg',
  });
  return 'https://calendar.google.com/calendar/render?' + p.toString();
}

// Point the calendar button at the best target for this device
function setupCalendarButton(btn) {
  if (!btn) return;
  if (isAppleDevice()) {
    btn.href = 'wedding.ics?v=20270716'; // opens Apple Calendar directly (cache-bust on updates)
    btn.removeAttribute('target');
  } else {
    btn.href = googleCalendarUrl();     // opens Google Calendar app/site
    btn.target = '_blank';
    btn.rel = 'noopener';
  }
}

function showFarewell(attendance) {
  const screen = document.getElementById('farewell-screen');
  if (!screen) return;
  const isYes = attendance === 'Ja';

  const titleEl = document.getElementById('farewell-title');
  const textEl  = document.getElementById('farewell-text');
  const calBtn  = document.getElementById('farewell-cal');

  if (titleEl) titleEl.textContent = isYes ? 'Vielen Dank!' : 'Danke für deine Rückmeldung';
  if (textEl) {
    textEl.textContent = isYes
      ? 'Wir können es kaum erwarten, mit dir zu feiern. Bis bald auf der Tanzfläche!'
      : 'Schade, dass du nicht dabei sein kannst — danke, dass du uns Bescheid gegeben hast. Du wirst uns fehlen.';
  }
  if (calBtn) {
    if (isYes) { setupCalendarButton(calBtn); calBtn.hidden = false; }
    else { calBtn.hidden = true; }
  }

  screen.classList.add('open');
  screen.setAttribute('aria-hidden', 'false');
  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';

  const petalLayer = screen.querySelector('.farewell-petals');
  spawnPetals(petalLayer);
  setTimeout(() => spawnPetals(petalLayer), 1500);
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

  const items = Array.from(document.querySelectorAll('.gallery-item:not([data-clone])'));
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
// DECORATIVE EXPAND-MAP (3D tilt + click-to-expand)
// =============================================
function initExpandMaps() {
  const maps = document.querySelectorAll('.expand-map');
  if (!maps.length) return;

  // 3D tilt only on desktop with a fine pointer & motion allowed
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const tiltOK = !prefersReducedMotion && finePointer;

  maps.forEach((map) => {
    const card = map.querySelector('.expand-map-card');
    const locationCard = map.closest('.location-card');

    function resetTilt() {
      if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    function toggle() {
      const expanded = map.classList.toggle('expanded');
      map.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      map.setAttribute('aria-label', expanded ? 'Karte & Details einklappen' : 'Karte & Details aufklappen');
      // Reveal / hide the details of this interactive location card together
      if (locationCard) locationCard.classList.toggle('expanded', expanded);
      if (!expanded) resetTilt();
    }

    // Tap / keyboard toggles expand
    map.addEventListener('click', toggle);
    map.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    if (!tiltOK || !card) return;
    map.addEventListener('mousemove', (e) => {
      const rect = map.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const rotateY = Math.max(-8, Math.min(8, (dx / 50) * 8));
      const rotateX = Math.max(-8, Math.min(8, (-dy / 50) * 8));
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    map.addEventListener('mouseleave', resetTilt);
  });
}

// =============================================
// MAIN
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrap   = document.querySelector('.cover');
  const mainContent    = document.getElementById('main-content');

  // Give the hero video a head start buffering while the guest reads the cover,
  // so it's far more likely to be ready to play the instant the envelope opens.
  const heroVidPreload = document.querySelector('.hero-video');
  if (heroVidPreload) { try { heroVidPreload.load(); } catch (e) {} }

  setupMusicToggle();
  initSmoothScroll();
  initHeroMotion();
  initReveals();
  initNav();
  initLightbox();
  initExpandMaps();
  setupAnchorLinks();

  function openEnvelope() {
    if (!envelopeWrap || envelopeWrap.classList.contains('opening')) return;
    envelopeWrap.classList.add('opening');

    // Music starts with the click (counts as user interaction → autoplay allowed)
    startMusic();

    // Hero video starts with the click too (no autoplay on load). We track when
    // it is *actually rendering frames* ('playing') and reveal the site only once
    // BOTH the cover fade/zoom choreography has run AND the video is up — the guest
    // never sees the hero before the video plays. play() runs here, so the clip
    // also keeps buffering and starts on its own the moment enough data arrives.
    // A hard MAX_WAIT_MS cap guarantees the page still reveals if the video is
    // slow, blocked or missing, so the cover can never get stuck.
    const CHOREO_MS = 900;       // content fade + lift finished ≈ here
    const MAX_WAIT_MS = 10000;   // safety cap → always reveal eventually
    const heroVid = document.querySelector('.hero-video');
    let videoReady = !heroVid;   // no video element → nothing to wait for
    let choreoDone = false;
    let revealStarted = false;

    function doReveal() {
      if (revealStarted) return;
      revealStarted = true;
      envelopeScreen.classList.add('closing');    // 0.7s screen fade …
      setTimeout(() => {                           // … then swap to the site
        envelopeScreen.style.display = 'none';
        mainContent.classList.add('visible');
        if (lenis) lenis.start();
        if (hasGSAP) ScrollTrigger.refresh();
      }, 700);
    }
    // Reveal once the choreography is done AND the video is playing.
    function tryReveal() { if (videoReady && choreoDone) doReveal(); }

    if (heroVid) {
      heroVid.addEventListener('playing', () => { videoReady = true; tryReveal(); }, { once: true });
      // A failed/missing video (bad path, unsupported codec) → stop waiting for it
      // so the reveal falls back to the choreography time instead of MAX_WAIT. A
      // dead <source> fires 'error' on the <source> (not the <video>), so cover both.
      heroVid.addEventListener('error', () => { videoReady = true; tryReveal(); }, { once: true });
      const heroSource = heroVid.querySelector('source');
      if (heroSource) heroSource.addEventListener('error', () => { videoReady = true; tryReveal(); }, { once: true });
      const playPromise = heroVid.play();
      if (playPromise && playPromise.then) {
        playPromise
          .then(() => { videoReady = true; tryReveal(); })
          .catch(() => { videoReady = true; tryReveal(); }); // blocked/missing → don't hang
      }
    }

    // Petals drift out as the content fades away
    setTimeout(spawnPetals, 250);

    // Choreography timer: in the common case the video is ready by now, so the
    // content fade/lift (~0.9s) runs, then the 0.7s screen fade reveals the site.
    setTimeout(() => { choreoDone = true; tryReveal(); }, CHOREO_MS);
    // Safety cap: reveal no matter what once MAX_WAIT_MS has passed.
    setTimeout(doReveal, MAX_WAIT_MS);
  }

  // Open on tap/click. The gold Enter button is the clear affordance (a native
  // <button>, so keyboard Enter/Space work for free and bubble a click here), but
  // a tap anywhere on the ivory screen opens too. Listen via pointerup (covers
  // mouse + touch + pen reliably; some mobile setups + smooth-scroll libs
  // swallow the synthetic `click`, so don't depend on it alone).
  if (envelopeScreen && envelopeWrap) {
    envelopeScreen.addEventListener('pointerup', openEnvelope);
    envelopeScreen.addEventListener('click', openEnvelope); // fallback for no-pointer browsers
  }

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

  // Already answered in this browser? Replace the form with a calm notice
  // so the same person can't submit twice (avoids duplicate sheet rows).
  let alreadyDone = false;
  try { alreadyDone = !!localStorage.getItem(RSVP_FLAG); } catch (_) {}
  if (alreadyDone) {
    formWrap.style.display = 'none';
    successMsg.classList.add('visible');
  }

  const nameInput = form.querySelector('[name="fullname"]');
  const attendanceGroup = form.querySelector('.attendance-group');
  // Clear error highlight as soon as the user fixes the field
  nameInput.addEventListener('input', () => nameInput.classList.remove('input-error'));
  attendanceBtns.forEach((b) =>
    b.addEventListener('click', () => attendanceGroup.classList.remove('input-error'))
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Required: Status (Ja/Nein)
    if (!selectedAttendance) {
      attendanceGroup.classList.add('input-error');
      document.querySelector('.attendance-btn').focus();
      return;
    }

    // Required: Name (non-empty)
    if (!nameInput.value.trim()) {
      nameInput.classList.add('input-error');
      nameInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';

    const payload = {
      attendance:  selectedAttendance, // "Ja" | "Nein"
      name:        nameInput.value.trim(),
      guests:      guestInput.value,
      dietary:     form.querySelector('[name="dietary"]').value,
      songRequest: form.querySelector('[name="song"]').value,
      message:     form.querySelector('[name="message"]').value,
    };

    try {
      // text/plain avoids a CORS preflight; Apps Script reads e.postData.contents
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
    } catch (_) { /* no-cors hides the response; the row is still written */ }

    try { localStorage.setItem(RSVP_FLAG, selectedAttendance); } catch (_) {}

    formWrap.style.display = 'none';
    showFarewell(selectedAttendance);
  });
});
