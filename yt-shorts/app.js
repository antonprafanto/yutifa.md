/* ===================================================
   YouTube Shorts Strategy — app.js
   Scroll animations · Live Clock · Interactions
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. SCROLL-REVEAL
  -------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.flow-step, .metric-card, .phase-card, .window-card, .day-row, ' +
    '.niche-card, .sb-item, .reco-card, .global-card, .cta-box, ' +
    '.attention-box, .upload-limit-box, .upload-tip-box, .algo-metrics, ' +
    '.sb-rules, .sb-signals, .global-insight, .hero-stat, .cstep'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  revealTargets.forEach(el => observer.observe(el));

  /* --------------------------------------------------
     2. STAGGER DELAYS
  -------------------------------------------------- */
  function stagger(selector, childSel, step) {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll(childSel).forEach((el, i) => {
      el.style.transitionDelay = `${i * step}ms`;
    });
  }
  stagger('.algo-flow',    '.flow-step',   80);
  stagger('.metrics-grid', '.metric-card', 70);
  stagger('.phase-grid',   '.phase-card',  80);
  stagger('.days-matrix',  '.day-row',     60);
  stagger('.niche-grid',   '.niche-card',  80);
  stagger('.global-grid',  '.global-card', 70);
  stagger('.reco-grid',    '.reco-card',   90);
  stagger('.hero-stats-row', '.hero-stat', 80);

  /* --------------------------------------------------
     3. NAVBAR scroll behavior
  -------------------------------------------------- */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // shrink
    navbar.style.padding = window.scrollY > 60 ? '9px 40px' : '14px 40px';

    // active link
    let current = '';
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) a.style.color = 'var(--fb-blue-lt)';
    });
  }, { passive: true });

  /* --------------------------------------------------
     4. LIVE WIB CLOCK widget
  -------------------------------------------------- */
  function getWIBInfo() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(utcMs + 7 * 3600000);
    const h = wib.getHours();
    const m = wib.getMinutes().toString().padStart(2, '0');
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return { h, m, day: wib.getDay(), dayName: days[wib.getDay()], time: `${String(h).padStart(2,'0')}:${m}` };
  }

  function getUploadAdvice(h, dayName) {
    // Pre-prime time advice
    if (h >= 13 && h < 16)  return { status: '⏳ Siapkan', tip: 'Jadwalkan upload untuk 16:00–19:00 nanti!', color: 'var(--nb-yellow)' };
    if (h >= 16 && h < 19)  return { status: '🚀 UPLOAD SEKARANG!', tip: 'Ini waktu terbaik untuk upload — distribusi matang saat prime time!', color: 'var(--nb-green)' };
    if (h >= 19 && h < 22)  return { status: '🔥 PRIME TIME AKTIF', tip: 'Golden hour sedang berjalan. Pantau analytics!', color: 'var(--fb-blue-lt)' };
    if (h >= 11 && h < 13)  return { status: '☀️ Lunch Window', tip: 'Slot sekunder primer. Bagus untuk konten edukatif.', color: 'var(--nb-yellow)' };
    if (dayName === 'Sabtu' && h >= 12 && h < 16) return { status: '🎯 ANOMALI SABTU', tip: 'Upload jam 14:00 — anomali traffic siang Sabtu!', color: 'var(--nb-orange)' };
    return { status: '😴 Bukan Waktu Upload', tip: 'Gunakan waktu ini untuk produksi & editing konten.', color: 'var(--gray-400)' };
  }

  const clockWidget = document.createElement('div');
  clockWidget.id = 'yt-clock-widget';
  clockWidget.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
    background: #0D1117; border: 3px solid var(--fb-blue, #1877F2);
    box-shadow: 5px 5px 0px var(--fb-blue-dk, #0a5bb5);
    padding: 14px 18px; font-family: 'DM Mono', monospace;
    min-width: 230px; cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
  `;
  clockWidget.innerHTML = `
    <div style="font-size:0.55rem;letter-spacing:3px;color:#4599F5;margin-bottom:4px;text-transform:uppercase">⏰ WAKTU WIB SEKARANG</div>
    <div id="yw-time" style="font-size:1.7rem;font-weight:700;color:#fff;line-height:1;margin-bottom:3px">--:--</div>
    <div id="yw-day"  style="font-size:0.65rem;color:#8A8D91;margin-bottom:8px">---</div>
    <div id="yw-status" style="font-size:0.68rem;font-weight:700;margin-bottom:3px;color:#4599F5">---</div>
    <div id="yw-tip"    style="font-size:0.6rem;color:#CED0D4;line-height:1.4">---</div>
  `;
  clockWidget.addEventListener('mouseenter', () => {
    clockWidget.style.transform = 'translate(-3px,-3px)';
    clockWidget.style.boxShadow = '8px 8px 0px var(--fb-blue-dk, #0a5bb5)';
  });
  clockWidget.addEventListener('mouseleave', () => {
    clockWidget.style.transform = '';
    clockWidget.style.boxShadow = '5px 5px 0px var(--fb-blue-dk, #0a5bb5)';
  });
  document.body.appendChild(clockWidget);

  function updateClock() {
    const { h, m, dayName, time } = getWIBInfo();
    const { status, tip, color } = getUploadAdvice(h, dayName);
    document.getElementById('yw-time').textContent = time;
    document.getElementById('yw-day').textContent  = `${dayName} · WIB (GMT+7)`;
    document.getElementById('yw-status').textContent = status;
    document.getElementById('yw-status').style.color = color;
    document.getElementById('yw-tip').textContent = tip;
    clockWidget.style.borderColor = color === 'var(--nb-green)' ? '#00C853' : '#1877F2';
  }
  updateClock();
  setInterval(updateClock, 30000);

  /* --------------------------------------------------
     5. HIGHLIGHT TODAY in schedule matrix
  -------------------------------------------------- */
  const { day } = getWIBInfo();
  // HTML data-htmlday: Senin=0, Selasa=1, Rabu=2, Kamis=3, Jumat=4, Sabtu=5, Minggu=6
  // JS day: 0=Sun, 1=Mon, ..., 6=Sat
  const jsToHtml = { 1:0, 2:1, 3:2, 4:3, 5:4, 6:5, 0:6 };
  const todayCard = document.querySelector(`[data-htmlday="${jsToHtml[day]}"]`);
  if (todayCard) {
    const badge = document.createElement('div');
    badge.textContent = '📍 HARI INI';
    badge.style.cssText = `
      position:absolute; top:-12px; right:20px;
      background: #00C853; color:#000;
      font-size:0.6rem; font-weight:900;
      padding:2px 10px; border:2px solid #000;
      letter-spacing:2px; font-family:'DM Mono',monospace;
    `;
    todayCard.style.position = 'relative';
    todayCard.appendChild(badge);
  }

  /* --------------------------------------------------
     6. ANCHOR SCROLL with offset
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     7. SCORE BARS animate on entry
  -------------------------------------------------- */
  const bars = document.querySelectorAll('.day-score-bar');
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        const target = bar.style.getPropertyValue('--score');
        bar.style.setProperty('--score', '0%');
        setTimeout(() => bar.style.setProperty('--score', target), 100);
        barObs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => barObs.observe(b));

  /* --------------------------------------------------
     8. TICKER double the text for seamless loop
  -------------------------------------------------- */
  const track = document.querySelector('.ticker-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* --------------------------------------------------
     9. Subtle cursor trail (blue dots)
  -------------------------------------------------- */
  let lx = 0, ly = 0, trailT;
  document.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - lx) < 12 && Math.abs(e.clientY - ly) < 12) return;
    lx = e.clientX; ly = e.clientY;
    clearTimeout(trailT);
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      width:6px; height:6px; background:#1877F2;
      pointer-events:none; z-index:9999; opacity:0.5;
      transform:translate(-50%,-50%);
      transition:opacity 0.5s, transform 0.5s;
    `;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity='0'; d.style.transform='translate(-50%,-50%) scale(2.5)'; });
    trailT = setTimeout(() => d.remove(), 520);
  });

  console.log(`
  ╔══════════════════════════════════════╗
  ║  YouTube Shorts Strategy Indonesia   ║
  ║  Neo Brutalism × Facebook Colors     ║
  ║  Data: 1.8M Video · 2026            ║
  ╚══════════════════════════════════════╝
  `);

  /* --------------------------------------------------
     10. FLOATING HUB BUTTON — show on scroll
  -------------------------------------------------- */
  const hubFloat = document.getElementById('hub-float');
  if (hubFloat) {
    window.addEventListener('scroll', () => {
      hubFloat.classList.toggle('hub-float--visible', window.scrollY > 300);
    }, { passive: true });
  }
});

