/* ===================================================
   TikTok Strategy — app.js
   Scroll animations, interactions, live clock
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. SCROLL-REVEAL (Intersection Observer)
  -------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.stat-card, .freq-card, .day-card, .timeline-item, .tz-card, ' +
    '.dz-card, .live-stat-card, .axioma-card, .cta-box, .dz-warning-banner, ' +
    '.tz-formula, .crisis-card, .freq-insight, .slot-legend'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // stagger children inside grids
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));

  /* --------------------------------------------------
     2. STAGGER DELAYS for grid cards
  -------------------------------------------------- */
  function addStagger(parentSelector, childSelector, delayStep) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delayStep}ms`;
    });
  }

  addStagger('.hero-stats', '.stat-card', 100);
  addStagger('.freq-grid', '.freq-card', 80);
  addStagger('.days-grid', '.day-card', 80);
  addStagger('.timezone-grid', '.tz-card', 100);
  addStagger('.deadzone-grid', '.dz-card', 100);
  addStagger('.live-grid', '.live-stat-card', 100);
  addStagger('.axioma-grid', '.axioma-card', 100);

  /* --------------------------------------------------
     3. NAVBAR — active highlight on scroll
  -------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNavActive() {
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--tt-cyan)';
      }
    });
  }

  window.addEventListener('scroll', updateNavActive, { passive: true });

  /* --------------------------------------------------
     4. NAVBAR — shrink on scroll
  -------------------------------------------------- */
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.padding = '8px 40px';
    } else {
      navbar.style.padding = '14px 40px';
    }
  }, { passive: true });

  /* --------------------------------------------------
     5. LIVE CLOCK — current WIB time indicator
  -------------------------------------------------- */
  function getCurrentWIBInfo() {
    const now = new Date();
    // WIB = UTC+7
    const wibOffset = 7 * 60;
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const wibDate = new Date(utcMs + wibOffset * 60000);

    const h = wibDate.getHours();
    const m = wibDate.getMinutes().toString().padStart(2, '0');
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const day = wibDate.getDay();

    return { h, m, day, dayName: dayNames[day], timeStr: `${h.toString().padStart(2,'0')}:${m}` };
  }

  function getBestSlotNow(h) {
    if (h >= 6 && h < 10)   return { zone: '🌅 Jendela Pagi', tip: 'Post konten edukatif, spiritual, motivasi!' };
    if (h >= 10 && h < 13)  return { zone: '☀️ Jendela Siang', tip: 'Post travel vlog, tips ringan, micro-learning.' };
    if (h >= 13 && h < 16)  return { zone: '💀 Dead Zone', tip: 'HINDARI posting sekarang. Simpan energi!' };
    if (h >= 16 && h < 19)  return { zone: '🏃 Jendela Sore', tip: 'Post fitness, dance challenge, vlog harian.' };
    if (h >= 19 && h < 21)  return { zone: '⚡ Prime Time', tip: 'POST SEKARANG! Maksimal engagement.' };
    if (h >= 21 && h < 23)  return { zone: '🌙 Golden Hour', tip: 'Ideal untuk LIVE Streaming & skincare review.' };
    return { zone: '😴 Zona Tidur', tip: 'Istirahat. Jadwalkan otomatis untuk pagi.' };
  }

  // Inject live clock widget into hero
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    const clockWidget = document.createElement('div');
    clockWidget.id = 'live-clock-widget';
    clockWidget.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
      background: var(--gray-900, #111);
      border: 2px solid var(--tt-cyan, #00F2EA);
      box-shadow: 5px 5px 0px #000;
      padding: 14px 18px;
      font-family: 'DM Mono', monospace;
      min-width: 220px;
      cursor: pointer;
      transition: transform 0.15s;
    `;
    clockWidget.innerHTML = `
      <div style="font-size:0.6rem;letter-spacing:3px;color:var(--tt-cyan,#00F2EA);margin-bottom:4px;text-transform:uppercase">⏰ WAKTU WIB SEKARANG</div>
      <div id="clock-time" style="font-size:1.6rem;font-weight:700;color:#fff;line-height:1;margin-bottom:4px">--:--</div>
      <div id="clock-day"  style="font-size:0.7rem;color:#aaa;margin-bottom:8px">---</div>
      <div id="clock-zone" style="font-size:0.7rem;font-weight:700;color:var(--tt-pink,#FF0050);margin-bottom:4px">---</div>
      <div id="clock-tip"  style="font-size:0.65rem;color:#ccc;line-height:1.4">---</div>
    `;
    clockWidget.addEventListener('mouseenter', () => {
      clockWidget.style.transform = 'translate(-3px, -3px)';
      clockWidget.style.boxShadow = '8px 8px 0px #000';
    });
    clockWidget.addEventListener('mouseleave', () => {
      clockWidget.style.transform = '';
      clockWidget.style.boxShadow = '5px 5px 0px #000';
    });
    document.body.appendChild(clockWidget);

    function updateClock() {
      const { h, m, day, dayName, timeStr } = getCurrentWIBInfo();
      const { zone, tip } = getBestSlotNow(h);

      document.getElementById('clock-time').textContent = timeStr;
      document.getElementById('clock-day').textContent = `${dayName} · WIB (GMT+7)`;
      document.getElementById('clock-zone').textContent = zone;
      document.getElementById('clock-tip').textContent = tip;

      // Highlight dead zone in red
      if (zone.includes('Dead Zone') || zone.includes('Tidur')) {
        clockWidget.style.borderColor = 'var(--tt-red, #FE2C55)';
        document.getElementById('clock-zone').style.color = 'var(--tt-red, #FE2C55)';
      } else if (zone.includes('Prime')) {
        clockWidget.style.borderColor = 'var(--tt-pink, #FF0050)';
        document.getElementById('clock-zone').style.color = 'var(--tt-pink, #FF0050)';
      } else {
        clockWidget.style.borderColor = 'var(--tt-cyan, #00F2EA)';
        document.getElementById('clock-zone').style.color = 'var(--tt-cyan, #00F2EA)';
      }
    }

    updateClock();
    setInterval(updateClock, 30000); // update every 30s
  }

  /* --------------------------------------------------
     6. DAY CARDS — highlight today
  -------------------------------------------------- */
  const { day } = getCurrentWIBInfo();
  const dayCard = document.querySelector(`[data-day="${day}"]`);
  if (dayCard) {
    // day 0 = Minggu, 1 = Senin, ..., 6 = Sabtu
    // data-day stored as: Senin=0, Selasa=1, Rabu=2, Kamis=3, Jumat=4, Sabtu=5, Minggu=6
    // We mapped Senin->0 in HTML, JS day is 0=Sunday, so compensate:
    // Actually data-day in HTML: Senin=0,Selasa=1,...,Minggu=6
    // JS day: 0=Sun,1=Mon,...,6=Sat → Senin=1,Selasa=2,...,Sabtu=6,Minggu=0
    // Mapping JS day to HTML data-day:
    const jsToHtmlDay = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 };
    const todayHtmlDay = jsToHtmlDay[day];
    const todayCard = document.querySelector(`[data-day="${todayHtmlDay}"]`);
    if (todayCard) {
      const todayBadge = document.createElement('div');
      todayBadge.textContent = '📍 HARI INI';
      todayBadge.style.cssText = `
        position: absolute;
        top: -14px;
        right: 16px;
        background: var(--nb-green, #00FF87);
        color: var(--tt-black, #010101);
        font-size: 0.65rem;
        font-weight: 900;
        padding: 3px 12px;
        border: 2px solid #000;
        letter-spacing: 2px;
        font-family: 'DM Mono', monospace;
      `;
      todayCard.style.position = 'relative';
      todayCard.appendChild(todayBadge);
    }
  }

  /* --------------------------------------------------
     7. SMOOTH anchor scroll offset (for fixed nav)
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------
     8. CURSOR TRAIL EFFECT (subtle)
  -------------------------------------------------- */
  let lastX = 0, lastY = 0;
  let trailTimeout;

  document.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - lastX) < 10 && Math.abs(e.clientY - lastY) < 10) return;
    lastX = e.clientX;
    lastY = e.clientY;

    clearTimeout(trailTimeout);
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 6px;
      height: 6px;
      background: var(--tt-cyan, #00F2EA);
      pointer-events: none;
      z-index: 9999;
      opacity: 0.6;
      transform: translate(-50%, -50%);
      transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    document.body.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    trailTimeout = setTimeout(() => dot.remove(), 520);
  });

  /* --------------------------------------------------
     9. SCORE BARS — animate on visibility
  -------------------------------------------------- */
  const scoreBars = document.querySelectorAll('.score-bar');
  const scoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.style.getPropertyValue('--score');
        bar.style.setProperty('--score', '0%');
        setTimeout(() => {
          bar.style.setProperty('--score', targetWidth);
        }, 100);
        scoreObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  scoreBars.forEach(bar => scoreObserver.observe(bar));

  /* --------------------------------------------------
     10. Counter animation for stat numbers
  -------------------------------------------------- */
  function animateCount(el, target, suffix = '', duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + (target - start) * eased;
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('id-ID');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('id-ID');
    }

    requestAnimationFrame(update);
  }

  const statCounters = [
    { selector: '.hero-stats .stat-card:nth-child(1) .stat-num', target: 108, suffix: 'JT' },
    { selector: '.hero-stats .stat-card:nth-child(3) .stat-num', target: 3.7, suffix: '%' },
    { selector: '.hero-stats .stat-card:nth-child(4) .stat-num', target: 62.9, suffix: '%' },
  ];

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const match = statCounters.find(s => entry.target.matches(s.selector));
        if (match) {
          const numEl = entry.target.querySelector ? entry.target : entry.target;
          // Only animate the text node (preserve span)
          const firstChild = numEl.childNodes[0];
          if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
            const orig = firstChild.textContent;
            animateCount({ set textContent(v) { firstChild.textContent = v; } }, match.target, match.suffix);
          }
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCounters.forEach(({ selector }) => {
    const el = document.querySelector(selector);
    if (el) counterObserver.observe(el);
  });

  console.log(`
  ╔══════════════════════════════════════╗
  ║  TikTok Strategy Indonesia 2026      ║
  ║  Neo Brutalism · by AntiGravity      ║
  ║  Data: 2B+ interaksi global          ║
  ╚══════════════════════════════════════╝
  `);

  /* --------------------------------------------------
     11. FLOATING HUB BUTTON — show on scroll
  -------------------------------------------------- */
  const hubFloat = document.getElementById('hub-float');
  if (hubFloat) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        hubFloat.classList.add('hub-float--visible');
      } else {
        hubFloat.classList.remove('hub-float--visible');
      }
    }, { passive: true });
  }

});

