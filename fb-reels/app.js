/* ===================================================
   Facebook Reels Strategy — app.js
   Interactions · Live Clock · Scroll Animations
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. SCROLL-REVEAL
  -------------------------------------------------- */
  const targets = document.querySelectorAll(
    '.hstat, .demo-card, .stage-card, .signal-card, .fw-card, ' +
    '.pt-card, .day-card, .ind-card, .amp-card, .exec-item, ' +
    '.freq-main-box, .platform-compare, .tz-matrix, .ind-table-box, ' +
    '.cta-box'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));

  /* --------------------------------------------------
     2. STAGGER DELAYS
  -------------------------------------------------- */
  function stagger(sel, childSel, step) {
    const p = document.querySelector(sel);
    if (!p) return;
    p.querySelectorAll(childSel).forEach((el, i) => {
      el.style.transitionDelay = `${i * step}ms`;
    });
  }
  stagger('.hero-stats-box', '.hstat', 80);
  stagger('.demo-grid', '.demo-card', 80);
  stagger('.algo-stages', '.stage-card', 80);
  stagger('.signals-grid', '.signal-card', 70);
  stagger('.freq-why-grid', '.fw-card', 90);
  stagger('.primetime-cards', '.pt-card', 90);
  stagger('.days-grid', '.day-card', 50);
  stagger('.industri-grid', '.ind-card', 90);
  stagger('.amp-grid', '.amp-card', 90);
  stagger('.exec-list', '.exec-item', 80);

  /* --------------------------------------------------
     3. NAVBAR scroll
  -------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.style.padding = window.scrollY > 60 ? '8px 40px' : '12px 40px';
    let cur = '';
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top <= 110 && r.bottom > 110) cur = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${cur}`) a.style.color = 'var(--fb-lt)';
    });
  }, { passive: true });

  /* --------------------------------------------------
     4. LIVE WIB CLOCK widget (Facebook-themed)
  -------------------------------------------------- */
  function wibNow() {
    const now = new Date();
    const ms = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(ms + 7 * 3600000);
    const h = wib.getHours();
    const m = wib.getMinutes().toString().padStart(2, '0');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return { h, m, day: wib.getDay(), dayName: days[wib.getDay()], time: `${String(h).padStart(2,'0')}:${m}` };
  }

  function upAdvice(h, dayName) {
    if (h >= 6 && h < 9)    return { icon: '💼', status: 'B2B WINDOW', tip: 'Waktu optimal untuk konten teknologi, edukasi, kesehatan!', color: '#4dda8b' };
    if (h >= 11 && h < 15)  return { icon: '🛒', status: 'E-COMMERCE PEAK', tip: 'Impuls beli tertinggi! Upload konten produk & promo sekarang.', color: '#FFB300' };
    if (h >= 19 && h < 21)  return { icon: '🔥 UPLOAD SEKARANG!', status: 'PRIME TIME AKTIF', tip: 'Golden hour Facebook Reels! Watch Time & Completion tertinggi.', color: '#1877F2' };
    if (h >= 15 && h < 19)  return { icon: '⏳', status: 'Siapkan Konten', tip: 'Jadwalkan upload untuk 19:00–21:00 malam ini.', color: '#FFB300' };
    if (dayName === 'Jumat' && h >= 23) return { icon: '🌙', status: 'ANOMALI AKTIF', tip: 'Jumat malam → Sabtu! Kompetisi ~0. Upload sekarang!', color: '#b06aff' };
    return { icon: '😴', status: 'Waktu Produksi', tip: 'Gunakan waktu ini untuk membuat konten berkualitas.', color: '#8A8D91' };
  }

  const widget = document.createElement('div');
  widget.id = 'fb-clock-widget';
  widget.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:999;
    background:#18191a; border:3px solid #1877F2;
    box-shadow:5px 5px 0px #0a5bb5;
    padding:14px 18px; font-family:'DM Mono',monospace;
    min-width:240px; cursor:pointer;
    transition:transform 0.15s, box-shadow 0.15s;
  `;
  widget.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
      <div style="background:#1877F2;color:white;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-family:serif;font-size:0.9rem;font-weight:900;border:1px solid #000;flex-shrink:0">f</div>
      <div style="font-size:0.55rem;letter-spacing:3px;color:#4599F5;text-transform:uppercase">Waktu WIB Sekarang</div>
    </div>
    <div id="fb-time" style="font-size:1.8rem;font-weight:700;color:#fff;line-height:1;margin-bottom:3px">--:--</div>
    <div id="fb-day"  style="font-size:0.65rem;color:#8A8D91;margin-bottom:8px">---</div>
    <div id="fb-status" style="font-size:0.68rem;font-weight:700;margin-bottom:3px">---</div>
    <div id="fb-tip"    style="font-size:0.6rem;color:#CED0D4;line-height:1.4">---</div>
  `;
  widget.addEventListener('mouseenter', () => {
    widget.style.transform = 'translate(-3px,-3px)';
    widget.style.boxShadow = '8px 8px 0px #0a5bb5';
  });
  widget.addEventListener('mouseleave', () => {
    widget.style.transform = '';
    widget.style.boxShadow = '5px 5px 0px #0a5bb5';
  });
  document.body.appendChild(widget);

  function updateClock() {
    const { h, m, dayName, time } = wibNow();
    const { icon, status, tip, color } = upAdvice(h, dayName);
    document.getElementById('fb-time').textContent = time;
    document.getElementById('fb-day').textContent  = `${dayName} · WIB (GMT+7)`;
    document.getElementById('fb-status').textContent = `${icon} ${status}`;
    document.getElementById('fb-status').style.color = color;
    document.getElementById('fb-tip').textContent = tip;
    widget.style.borderColor = color === '#1877F2' ? '#1877F2' : color;
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* --------------------------------------------------
     5. HIGHLIGHT TODAY in days grid
  -------------------------------------------------- */
  const { day } = wibNow();
  // JS: 0=Sun, 1=Mon...6=Sat
  // Grid order: Senin(1)=0, Sel(2)=1, Rab(3)=2, Kam(4)=3, Jum(5)=4, Sab(6)=5, Min(0)=6
  const jsMap = { 1:'dc-senin', 2:'dc-selasa', 3:'dc-rabu', 4:'dc-kamis', 5:'dc-jumat', 6:'dc-sabtu', 0:'dc-minggu' };
  const todayEl = document.getElementById(jsMap[day]);
  if (todayEl) {
    const badge = document.createElement('div');
    badge.textContent = '📍 HARI INI';
    badge.style.cssText = `
      position:absolute; top:-10px; left:50%; transform:translateX(-50%);
      background:#42b72a; color:#000; font-size:0.55rem; font-weight:900;
      padding:2px 8px; border:2px solid #000; letter-spacing:2px;
      white-space:nowrap; font-family:'DM Mono',monospace; z-index:10;
    `;
    todayEl.style.position = 'relative';
    todayEl.appendChild(badge);
  }

  /* --------------------------------------------------
     6. ANIMATED BARS on scroll
  -------------------------------------------------- */
  const allBars = document.querySelectorAll(
    '.demo-bar, .age-bar, .dc-bar, .signal-meter .meter-fill'
  );
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  allBars.forEach(b => barObs.observe(b));

  /* --------------------------------------------------
     7. SMOOTH SCROLL with offset
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     8. TICKER infinite loop
  -------------------------------------------------- */
  const ticker = document.querySelector('.ticker-inner');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  /* --------------------------------------------------
     9. CURSOR TRAIL — Blue Facebook dots
  -------------------------------------------------- */
  let lx = 0, ly = 0, ct;
  document.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - lx) < 14 && Math.abs(e.clientY - ly) < 14) return;
    lx = e.clientX; ly = e.clientY;
    clearTimeout(ct);
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:7px;height:7px;background:#1877F2;
      pointer-events:none;z-index:9999;opacity:0.55;
      transform:translate(-50%,-50%);border-radius:1px;
      transition:opacity 0.45s,transform 0.45s;
    `;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = '0'; d.style.transform = 'translate(-50%,-50%) scale(2.8) rotate(45deg)'; });
    ct = setTimeout(() => d.remove(), 480);
  });

  /* --------------------------------------------------
     10. HERO stripe parallax
  -------------------------------------------------- */
  const stripes = document.querySelectorAll('.hero-stripe');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    stripes.forEach((s, i) => {
      s.style.transform = `translateY(${sy * (0.1 + i * 0.05)}px)`;
    });
  }, { passive: true });

  console.log(`
  ╔══════════════════════════════════════════╗
  ║  Facebook Reels Strategy Indonesia 2026  ║
  ║  Neo Brutalism × Facebook Blue           ║
  ║  185 Juta Target Pasar · Meta Andromeda  ║
  ╚══════════════════════════════════════════╝
  `);

  /* --------------------------------------------------
     11. FLOATING HUB BUTTON — show on scroll
  -------------------------------------------------- */
  const hubFloat = document.getElementById('hub-float');
  if (hubFloat) {
    window.addEventListener('scroll', () => {
      hubFloat.classList.toggle('hub-float--visible', window.scrollY > 300);
    }, { passive: true });
  }
});

