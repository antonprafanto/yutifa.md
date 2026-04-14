/* ===================================================
   SosmedHub — app.js
   Live Clock · Real-time Platform Status · Schedule
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     HELPER: Get current WIB time
  -------------------------------------------------- */
  function getWIB() {
    const now = new Date();
    const ms = now.getTime() + now.getTimezoneOffset() * 60000;
    const wib = new Date(ms + 7 * 3600000);
    const h   = wib.getHours();
    const m   = wib.getMinutes();
    const s   = wib.getSeconds();
    const day = wib.getDay(); // 0=Sun…6=Sat
    const date = wib.getDate();
    const month = wib.getMonth();
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    return { h, m, s, day, date, month, months, days,
      dayName: days[day],
      monthName: months[month],
      pad: (n) => String(n).padStart(2,'0')
    };
  }

  /* --------------------------------------------------
     MEGA CLOCK — Updates every second
  -------------------------------------------------- */
  function updateMegaClock() {
    const w = getWIB();
    document.getElementById('mc-digits').textContent  = `${w.pad(w.h)}:${w.pad(w.m)}`;
    document.getElementById('mc-seconds').textContent = w.pad(w.s);
    document.getElementById('mc-day').textContent     = w.dayName.toUpperCase();
    document.getElementById('mc-date').textContent    = `${w.date} ${w.monthName} 2026`;
    document.getElementById('nav-time-mini').textContent = `${w.pad(w.h)}:${w.pad(w.m)}`;

    // Color the clock based on prime time
    const digits = document.getElementById('mc-digits');
    if (w.h >= 19 && w.h < 22) {
      digits.style.color = '#FFDD00';
    } else if ((w.h >= 16 && w.h < 19) || (w.h >= 11 && w.h < 14)) {
      digits.style.color = '#FFB300';
    } else {
      digits.style.color = '#FFFFFF';
    }
  }

  /* --------------------------------------------------
     WINDOW STATUS (hero section)
  -------------------------------------------------- */
  const WINDOWS = [
    { start: 0,  end: 6,  name: 'JAM TIDUR',          desc: 'Bukan waktu aktif. Gunakan untuk riset dan produksi konten.', color: '#3A3B3C' },
    { start: 6,  end: 9,  name: '💼 B2B MORNING',       desc: 'Waktu optimal untuk konten edukatif, teknologi, dan B2B. Facebook Reels & YouTube terbaik.', color: '#4dda8b' },
    { start: 9,  end: 11, name: '🌅 PAGI TERLAMBAT',    desc: 'TikTok masih aktif untuk konten edukatif. YouTube mulai terima traffic. Upload konten ringan.', color: '#8A8D91' },
    { start: 11, end: 14, name: '☀️ SIANG — ESKAPISME', desc: 'Puncak impuls beli! E-commerce dan ritel siang meledak. Share ke kolega meningkat drastis.', color: '#FFB300' },
    { start: 14, end: 16, name: '📱 JAM SEKOLAH PULANG', desc: 'Traffic Gen-Z mulai masuk. Gaming, hiburan, dan konten ringan bekerja baik.', color: '#4599F5' },
    { start: 16, end: 19, name: '📤 WAKTU UPLOAD IDEAL', desc: 'UPLOAD SEKARANG! Beri waktu metadata indexing agar konten matang tepat saat prime time pukul 19:00!', color: '#FF6D00' },
    { start: 19, end: 22, name: '🔥 UNIVERSAL PRIME TIME', desc: 'Semua 3 platform di puncak. Retensi tertinggi, distribusi meledak. Konten terbaik Anda harus ada di sini!', color: '#FFDD00' },
    { start: 22, end: 24, name: '🌙 MALAM AKTIF',        desc: 'TikTok Live aktif. Facebook anomali Jumat→Sabtu. Kreator berpengalaman mengeksploitasi jendela ini.', color: '#b06aff' },
  ];

  function updateWindowStatus() {
    const { h } = getWIB();
    const win = WINDOWS.find(w => h >= w.start && h < w.end) || WINDOWS[0];
    document.getElementById('ws-name').textContent  = win.name;
    document.getElementById('ws-desc').textContent  = win.desc;
    document.getElementById('ws-name').style.color   = win.color;
    document.querySelector('.window-status').style.borderColor      = win.color;
    document.querySelector('.window-status').style.boxShadow        = `6px 6px 0 ${win.color}40`;
    document.querySelector('.window-status').style.background       = `${win.color}08`;
  }

  /* --------------------------------------------------
     PLATFORM STATUS DATA
  -------------------------------------------------- */

  // TikTok
  const TT_DATA = {
    getDayInsight(day) {
      const insights = {
        1: 'Senin — Jendela Transisi. Upload konten ringan, hindari hero content.',
        2: 'Selasa 🏆 — HARI TERKUAT! Simpan konten terbaik untuk hari ini.',
        3: 'Rabu 🔥 — Puncak kedua. Engagement optimal. Keluarkan konten berkualitas.',
        4: 'Kamis — Stabil. Cocok untuk tutorial dan edukatif.',
        5: 'Jumat — Menurun sore. Tapi upload jam 21:00 mengeksploitasi anomali malam!',
        6: 'Sabtu 🎉 — Kekuatan weekend! Konten hiburan, gaming, outdoor bekerja baik.',
        0: 'Minggu 😴 — Engagament lemah. Fokus produksi, hindari konten komersial.',
      };
      return insights[day] || '–';
    },
    getTimesForDay(day) {
      if ([2,3].includes(day)) return '09:00–12:00 · 19:00–22:00 WIB';
      if (day === 6) return '10:00–14:00 · 19:00–22:00 WIB';
      if (day === 0) return '19:00–21:00 WIB (satu-satunya slot)';
      return '11:00–13:00 · 16:00–18:00 · 19:00–22:00 WIB';
    },
    getNowStatus(h) {
      if (h >= 19 && h < 22)  return { txt: '🔥 GOLDEN HOUR', dot: '#FF0050', active: true, rec: 'Upload SEKARANG! Ini puncak absolut TikTok Indonesia. Konten yang diupload jam ini viral dalam 1–2 jam.' };
      if (h >= 16 && h < 19)  return { txt: '📤 PRE-PRIME', dot: '#FFB300', active: true, rec: 'Upload sekarang agar konten matang tepat pukul 19:00. Jangan tunggu lebih lama!' };
      if (h >= 11 && h < 14)  return { txt: '☀️ JENDELA SIANG', dot: '#FFB300', active: false, rec: 'Slot sekunder yang baik. Upload konten hiburan dan lip-sync ringan sekarang.' };
      if (h >= 9 && h < 11)   return { txt: '🌅 PAGI AKHIR', dot: '#4dda8b', active: false, rec: 'Konten edukatif dan spiritual bekerja baik di jam ini. Atensi masih segar.' };
      if (h >= 21 && h < 24)  return { txt: '🌙 LIVE MODE', dot: '#b06aff', active: true, rec: 'Jam TikTok Live. Pertimbangkan live streaming untuk membangun komunitas malam.' };
      return { txt: '😴 Siapkan Konten', dot: '#3A3B3C', active: false, rec: 'Di luar jam aktif. Gunakan waktu ini untuk editing, riset tren, dan planning konten.' };
    }
  };

  // YouTube Shorts
  const YT_DATA = {
    getDayInsight(day) {
      const insights = {
        1: 'Senin — Atensi terpecah pasca-weekend. Upload lebih efektif Selasa.',
        2: 'Selasa 🏆 — Puncak distribusi VVSA tertinggi. Upload hero content.',
        3: 'Rabu ⭐ — Stabil kuat. Hari terbaik kedua untuk YouTube Shorts.',
        4: 'Kamis — Solid. Konten tutorial dan gaming bekerja baik.',
        5: 'Jumat 🌟 — Hari terkuat global! Distribusi internasional optimal di hari ini.',
        6: 'Sabtu 🎯 — Anomali unik YouTube: upload konten gaming jam 14:00!',
        0: 'Minggu 😴 — Lemah. Fokus pada konten kuliner/meditasi ringan jika perlu upload.',
      };
      return insights[day] || '–';
    },
    getTimesForDay(day) {
      if (day === 5) return '11:00 WIB · 19:00–22:00 WIB (Terkuat)';
      if (day === 6) return '11:00 WIB · 14:00 WIB (Anomali Weekend)';
      return '11:00 WIB · 19:00–22:00 WIB';
    },
    getNowStatus(h) {
      if (h >= 19 && h < 22)  return { txt: '🔥 PRIME TIME', dot: '#1877F2', active: true, rec: 'Watch Time dan VVSA tertinggi sekarang. Upload konten long-form dan tutorial detail.' };
      if (h >= 16 && h < 19)  return { txt: '📤 PRE-INDEXING', dot: '#FFB300', active: true, rec: 'Upload 16:00–17:00 untuk distribusi matang jam 19:00. Metadata indexing butuh 2 jam.' };
      if (h >= 11 && h < 13)  return { txt: '☀️ RESES SIANG', dot: '#4dda8b', active: false, rec: 'Slot siang YouTube Shorts. Konten edukatif dan tutorial berdurasi 60 detik bekerja baik.' };
      if (h >= 14 && h < 16)  return { txt: '📱 PULANG SEKOLAH', dot: '#4599F5', active: false, rec: 'Traffic remaja mulai masuk. Gaming, hiburan, dan konten react bekerja optimal.' };
      return { txt: '😴 Tidak Aktif', dot: '#3A3B3C', active: false, rec: 'YouTube Shorts tidak aktif di jam ini. Fokus editing dan optimization caption/hashtag.' };
    }
  };

  // Facebook Reels
  const FB_DATA = {
    getDayInsight(day) {
      const insights = {
        1: 'Senin — Masih transisi dari weekend. Belum optimal untuk hero content.',
        2: 'Selasa 👑 — HERO DAY! Konsentrasikan anggaran dan konten terbaik di sini.',
        3: 'Rabu 🔥 — Puncak kedua Facebook. Engagement B2B tertinggi.',
        4: 'Kamis — Stabil. Baik untuk announcement dan review konsumen.',
        5: 'Jumat — Sore menurun. TAPI: exploit anomali upload jam 00:00 malam ini!',
        6: 'Sabtu ⚠️ — Lemah. Dekompresi mental pengguna. Hindari konten komersial.',
        0: 'Minggu 💀 — HINDARI! Engagement terendah. Bisa merusak skor profil minggu depan.',
      };
      return insights[day] || '–';
    },
    getTimesForDay(day) {
      if ([2,3].includes(day)) return '07:00–09:00 · 11:00–14:00 · 19:00–21:00 WIB';
      if (day === 5) return '07:00–09:00 · 19:00–21:00 · 00:00 (Anomali!)';
      if ([6,0].includes(day)) return 'Hindari konten komersial di hari ini';
      return '07:00–09:00 · 11:00–14:00 · 19:00–21:00 WIB';
    },
    getNowStatus(h, day) {
      if (h >= 19 && h < 21)  return { txt: '🔥 PRIME TIME', dot: '#42b72a', active: true, rec: 'Zona Relaksasi Sosial aktif. Upload konten lifestyle, kuliner, travel, dan hiburan sekarang!' };
      if (h >= 11 && h < 15)  return { txt: '🛒 E-COM PEAK', dot: '#FFB300', active: true, rec: 'Puncak impuls beli. Demo produk di jam ini punya konversi keranjang belanja tertinggi!' };
      if (h >= 6 && h < 9)    return { txt: '💼 B2B WINDOW', dot: '#4dda8b', active: false, rec: 'Waktu optimal untuk konten B2B, teknologi, dan edukasi. Ruang kognitif profesional masih bersih.' };
      if (h >= 16 && h < 19)  return { txt: '⏳ Siapkan Upload', dot: '#8A8D91', active: false, rec: 'Siapkan konten untuk window malam 19:00–21:00 WIB. Jadwalkan sekarang.' };
      if (day === 5 && h >= 23) return { txt: '🌙 ANOMALI!', dot: '#b06aff', active: true, rec: 'Jumat malam! Kompetisi upload mendekati nol. Upload sekarang untuk exploit traffic Sabtu pagi.' };
      return { txt: '😴 Waktu Produksi', dot: '#3A3B3C', active: false, rec: 'Di luar window aktif. Gunakan waktu ini untuk memproduksi konten berkualitas tinggi.' };
    }
  };

  /* --------------------------------------------------
     Update all 3 platform cards
  -------------------------------------------------- */
  function updatePlatformCards() {
    const { h, day } = getWIB();

    // TikTok
    const ttS = TT_DATA.getNowStatus(h);
    document.getElementById('tt-status-text').textContent  = ttS.txt;
    document.getElementById('tt-dot').style.background     = ttS.dot;
    if (ttS.active) { document.getElementById('tt-dot').classList.add('active'); }
    else { document.getElementById('tt-dot').classList.remove('active'); }
    document.getElementById('tt-window-status').textContent = ttS.active ? '🟢 AKTIF' : '⚪ STANDBY';
    document.getElementById('tt-now-text').textContent      = ttS.rec;
    document.getElementById('tt-best-times').textContent    = TT_DATA.getTimesForDay(day);
    document.getElementById('tt-day-insight').textContent   = TT_DATA.getDayInsight(day);

    // YouTube
    const ytS = YT_DATA.getNowStatus(h);
    document.getElementById('yt-status-text').textContent  = ytS.txt;
    document.getElementById('yt-dot').style.background     = ytS.dot;
    if (ytS.active) { document.getElementById('yt-dot').classList.add('active'); }
    else { document.getElementById('yt-dot').classList.remove('active'); }
    document.getElementById('yt-window-status').textContent = ytS.active ? '🟢 AKTIF' : '⚪ STANDBY';
    document.getElementById('yt-now-text').textContent      = ytS.rec;
    document.getElementById('yt-best-times').textContent    = YT_DATA.getTimesForDay(day);
    document.getElementById('yt-day-insight').textContent   = YT_DATA.getDayInsight(day);

    // Facebook
    const fbS = FB_DATA.getNowStatus(h, day);
    document.getElementById('fb-status-text').textContent  = fbS.txt;
    document.getElementById('fb-dot').style.background     = fbS.dot;
    if (fbS.active) { document.getElementById('fb-dot').classList.add('active'); }
    else { document.getElementById('fb-dot').classList.remove('active'); }
    document.getElementById('fb-window-status').textContent = fbS.active ? '🟢 AKTIF' : '⚪ STANDBY';
    document.getElementById('fb-now-text').textContent      = fbS.rec;
    document.getElementById('fb-best-times').textContent    = FB_DATA.getTimesForDay(day);
    document.getElementById('fb-day-insight').textContent   = FB_DATA.getDayInsight(day);
  }

  /* --------------------------------------------------
     SCHEDULE TABLE — Highlight current row
  -------------------------------------------------- */
  function highlightCurrentRow() {
    const { h } = getWIB();
    document.querySelectorAll('.tg-row').forEach(row => {
      row.classList.remove('row-active');
      const hs = parseInt(row.dataset.hourStart);
      const he = parseInt(row.dataset.hourEnd);
      if (h >= hs && h < he) row.classList.add('row-active');
      // handle midnight
      if (he === 24 && h >= hs) row.classList.add('row-active');
    });
  }

  /* --------------------------------------------------
     SCHEDULE name for today
  -------------------------------------------------- */
  function updateSchedTitle() {
    const { dayName } = getWIB();
    document.getElementById('sched-today').textContent = dayName.toUpperCase();
  }

  /* --------------------------------------------------
     ph-sub update
  -------------------------------------------------- */
  function updatePhSub() {
    const { h, m, pad } = getWIB();
    document.getElementById('ph-sub').textContent =
      `Terakhir diperbarui: ${pad(h)}:${pad(m)} WIB · Update otomatis setiap 30 detik`;
  }

  /* --------------------------------------------------
     SCROLL REVEAL
  -------------------------------------------------- */
  const reveals = document.querySelectorAll('.pcard, .axiom-card, .tg-row, .mega-clock, .window-status');
  reveals.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  reveals.forEach(el => obs.observe(el));

  // Stagger platform cards
  document.querySelectorAll('.pcard').forEach((el, i) => { el.style.transitionDelay = `${i * 90}ms`; });
  document.querySelectorAll('.axiom-card').forEach((el, i) => { el.style.transitionDelay = `${i * 70}ms`; });
  document.querySelectorAll('.tg-row').forEach((el, i) => { el.style.transitionDelay = `${i * 50}ms`; });

  /* --------------------------------------------------
     SMOOTH SCROLL
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });

  /* --------------------------------------------------
     CURSOR TRAIL — tri-color
  -------------------------------------------------- */
  const colors = ['#FF0050','#1877F2','#FFDD00','#00F2EA','#42b72a'];
  let ci = 0, lx = 0, ly = 0, ct;
  document.addEventListener('mousemove', e => {
    if (Math.abs(e.clientX - lx) < 10 && Math.abs(e.clientY - ly) < 10) return;
    lx = e.clientX; ly = e.clientY;
    clearTimeout(ct);
    const d = document.createElement('div');
    const c = colors[ci++ % colors.length];
    d.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:8px;height:8px;background:${c};
      pointer-events:none;z-index:9999;opacity:0.6;
      transform:translate(-50%,-50%);
      transition:opacity 0.5s,transform 0.5s;
    `;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = '0'; d.style.transform = 'translate(-50%,-50%) scale(3)'; });
    ct = setTimeout(() => d.remove(), 530);
  });

  /* --------------------------------------------------
     INIT & INTERVALS
  -------------------------------------------------- */
  // Instant update
  updateMegaClock();
  updateWindowStatus();
  updatePlatformCards();
  highlightCurrentRow();
  updateSchedTitle();
  updatePhSub();

  // Every second (clock)
  setInterval(updateMegaClock, 1000);

  // Every 30 seconds (platform status)
  setInterval(() => {
    updateWindowStatus();
    updatePlatformCards();
    highlightCurrentRow();
    updatePhSub();
  }, 30000);

  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║  SosmedHub — Social Media Strategy Dashboard  ║
  ║  TikTok · YouTube Shorts · Facebook Reels     ║
  ║  Indonesia 2026 · Neo Brutalism Design        ║
  ╚═══════════════════════════════════════════════╝
  `);
});
