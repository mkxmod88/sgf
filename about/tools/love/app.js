(function () {
  'use strict';

  var $ = function (id) {
    return document.getElementById(id);
  };

  var K_PROFILE = 'lovevanz-profile';
  var K_REASONS = 'lovevanz-reasons';
  var K_LETTER = 'lovevanz-letter';
  var K_SEALED = 'lovevanz-sealed';

  var DEFAULT_REASONS = [
    'Caramu tersenyum membuat hariku langsung cerah.',
    'Kamu selalu tahu cara menenangkanku saat aku panik.',
    'Rambutmu yang sedikit berantakan tetap terlihat indah.',
    'Kamu sabar dengan semua kekurangan dan kebiasaanku.',
    'Suaramu seperti lagu favorit yang tak pernah bosan kuputar.',
    'Cara kamu bilang "sayang" membuat hatiku meleleh.',
    'Kamu bisa membuat hal yang biasa jadi terasa istimewa.',
    'Pelukanmu adalah tempat pulang yang paling aman.',
    'Kamu percaya padaku bahkan saat aku belum percaya pada diriku sendiri.',
    'Caramu menatapku ketika aku sedang bercerita.',
    'Kamu membuatku ingin terus menjadi versi terbaik dari diriku.',
    'Tawamu menular dan selalu membuatku ikut tertawa.',
    'Kamu memilihku setiap hari, dan itu artinya segalanya.',
    'Bau parfummu menenangkan dan terasa seperti rumah.',
    'Kamu mengingat hal-hal kecil tentangku yang orang lain lupakan.',
    'Cara kamu memelukku saat aku tidak baik-baik saja.',
    'Kamu tetap di sini meskipun aku sedang tidak mudah dicintai.',
    'Senyum kecilmu ketika kita berpandangan tanpa alasan.'
  ];

  var SIGNALS = [
    'Aku tidak perlu memilih antara semesta dan kamu, karena kamu adalah semestaku, {them}.',
    'Kalau hidup adalah novel, kamu selalu jadi bab yang paling aku tunggu.',
    'Aku jatuh cinta bukan karena kamu sempurna, tapi karena kamu membuat semua terasa cukup.',
    'Di antara jutaan kata di kamus, nama kamu tetap yang paling indah untuk kuucap.',
    'Kalau boleh minta satu hal selamanya, aku ingin kamu tetap di sisiku.',
    'Kamu tidak hanya membuat hariku baik, kamu membuatku ingin jadi orang yang baik.',
    'Semoga kita selalu pulang ke pelukan yang sama, {them}.',
    'Aku menyimpan setiap momen kita seperti menyimpan harta paling berharga.',
    'Sekalipun dunia berhenti berputar, cintaku padamu tidak akan berhenti berdetak.',
    'Terima kasih sudah memilihku setiap hari, {them}.',
    'Kamu adalah bukti bahwa doa-doa kecilku selama ini dijawab.',
    'Kalau cinta adalah soal kesabaran, maka aku paling sabar menunggu pesan darimu.',
    'Aku ingin menjadi alasan senyummu, seperti kamu yang selalu menjadi alasan senyumku.',
    'Di dunia yang sibuk ini, kamu adalah istirahatku.',
    'Jangan pernah ragu, karena aku akan selalu memilih kamu.',
    'Bersamamu, sebentar saja terasa seperti selamanya.',
    'Kamu membuat "rumah" bukan soal tempat, tapi soal siapa yang ada di dalamnya.',
    'Cintaku padamu tidak butuh alasan, tapi aku akan selalu bisa menemukannya.'
  ];

  var DATES = [
    'Nonton bintang di atap sambil bawa selimut dan camilan.',
    'Masak resep sederhana bareng, bebekan siapa yang lebih jago.',
    'Naik transportasi umum sampai halte terakhir, tanpa tujuan.',
    'Bikin kapsul waktu berisi surat kecil untuk dibuka setahun lagi.',
    'Kencan di toko buku, masing-masing pilih satu buku untuk yang lain.',
    'Tebak film dari cuplikan, yang kalah traktir eskrim.',
    'Piknik pagi di taman, bawa bekal buatan tangan sendiri.',
    'Ulangi "tanggal pertama" kalian persis seperti dulu.',
    'Belajar hal baru bareng sampai sama-sama jago (atau sama-sama gagal).',
    'Jalan sore sambil mendengarkan playlist lagu kenangan kalian.',
    'Mengubah mie instan jadi hidangan "restoran" dengan hiasan mewah.',
    'Bikin vlog perjalanan sehari penuh sebagai kenangan.',
    'Menulis surat untuk masa depan lalu membacanya dengan suara pelan.',
    'Malam menari di kamar, tanpa musik — hanya suara kalian berdua.',
    'Menanam satu pot bunga kecil dan menamainya dengan nama kalian.'
  ];

  var CLAUSES = [
    'Setiap hari tanpa libur, Pihak Pertama dan Pihak Kedua wajib saling menyayangi dengan sepenuh hati.',
    'Pihak yang satu dilarang tidur dalam keadaan marah kepada pihak lainnya.',
    'Pelan-pelan marahnya, cepat-cepat baikan. Pelukan wajib minimal satu kali sehari.',
    'Setiap cerita kecil harimu harus dibagikan, karena bahagia lebih indah diceritakan berdua.',
    'Kedua pihak wajib saling mengingatkan untuk makan, minum, dan beristirahat.',
    'Kata "sayang" wajib diucapkan setiap hari, boleh diganti dengan pelukan diam-diam.',
    'Dilarang menyerah. Selalu ingat alasan kalian memilih satu sama lain di hari pertama.',
    'Kontrak ini berlaku selamanya dan diperpanjang otomatis tanpa perlu tanda tangan ulang.'
  ];

  var profile = load(K_PROFILE) || null;
  var reasons = load(K_REASONS) || DEFAULT_REASONS.slice();
  var toastTimer = null;
  var sealedTimer = null;

  /* ============ helpers ============ */

  function load(key) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  }

  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 2400);
  }

  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function fill(msg) {
    var me = profile ? profile.me : '';
    var them = profile ? profile.them : '';
    return msg.replace(/\{me\}/g, me).replace(/\{them\}/g, them);
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ============ hati melayang ============ */

  function initHearts() {
    var wrap = $('hearts');
    var emojis = ['❤', '🤍', '💖', '💕', '💘'];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 16; i++) {
      var s = document.createElement('span');
      s.className = 'heart-float';
      s.textContent = emojis[i % emojis.length];
      s.style.left = (Math.random() * 100).toFixed(2) + '%';
      s.style.fontSize = (12 + Math.random() * 22).toFixed(1) + 'px';
      s.style.setProperty('--dur', (9 + Math.random() * 12).toFixed(1) + 's');
      s.style.setProperty('--delay', (-Math.random() * 18).toFixed(1) + 's');
      s.style.setProperty('--sway', ((Math.random() - 0.5) * 90).toFixed(0) + 'px');
      s.style.setProperty('--sc', (0.8 + Math.random() * 0.6).toFixed(2));
      frag.appendChild(s);
    }
    wrap.appendChild(frag);
  }

  /* ============ musik pelan ============ */

  var music = null;

  function initMusic() {
    $('musicBtn').addEventListener('click', function () {
      if (music && music.playing) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  function startMusic() {
    if (!music) {
      music = {
        ctx: null,
        master: null,
        timer: null,
        step: 0,
        playing: false
      };
    }
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      toast('Browser kamu tidak mendukung audio.');
      return;
    }
    if (!music.ctx) {
      music.ctx = new Ctx();
      music.master = music.ctx.createGain();
      music.master.gain.value = 0.9;
      var filt = music.ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 2400;
      music.master.connect(filt);
      filt.connect(music.ctx.destination);
    }
    music.ctx.resume && music.ctx.resume();
    var notes = [261.63, 329.63, 392.0, 440.0, 392.0, 493.88, 440.0, 329.63, 261.63, 392.0, 329.63, 493.88];
    music.timer = setInterval(function () {
      var f = notes[music.step % notes.length];
      playNote(f, 0.05);
      if (music.step % 6 === 3) playNote(f / 2, 0.035);
      music.step++;
    }, 390);
    music.playing = true;
    $('musicBtn').classList.add('on');
    toast('Musik pelan diputar. ❤');
  }

  function stopMusic() {
    if (!music) return;
    clearInterval(music.timer);
    music.playing = false;
    $('musicBtn').classList.remove('on');
    toast('Musik dihentikan.');
  }

  function playNote(freq, vol) {
    var t = music.ctx.currentTime;
    var o = music.ctx.createOscillator();
    var g = music.ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g);
    g.connect(music.master);
    o.start(t);
    o.stop(t + 0.6);
  }

  /* ============ setup profil ============ */

  function initSetup() {
    $('btnSetup').addEventListener('click', function () {
      var me = $('inMe').value.trim();
      var them = $('inThem').value.trim();
      var date = $('inDate').value;
      if (!me || !them || !date) {
        toast('Lengkapi nama dan tanggalnya dulu ya.');
        return;
      }
      profile = { me: me, them: them, date: date };
      save(K_PROFILE, profile);
      enterApp();
      toast('Selamat datang, ' + me + ' ❤ ' + them);
    });

    $('editBtn').addEventListener('click', function () {
      if (profile) {
        $('inMe').value = profile.me;
        $('inThem').value = profile.them;
        $('inDate').value = profile.date;
      }
      showSetup();
    });
  }

  function showSetup() {
    $('setupWrap').classList.remove('hide');
    $('app').hidden = true;
  }

  function enterApp() {
    $('setupWrap').classList.add('hide');
    $('app').hidden = false;
    renderApp();
  }

  /* ============ render awal ============ */

  function renderApp() {
    $('heroMe').textContent = profile.me;
    $('heroThem').textContent = profile.them;
    $('heroDate').textContent = 'dari ' + fmtDate(profile.date) + ' sampai selamanya';

    $('ctMe').value = profile.me;
    $('ctThem').value = profile.them;
    $('ctDate').value = profile.date;
    $('ctSign').value = todayISO();

    renderReasons();
    $('letterText').value = (load(K_LETTER) || {}).text || '';
    renderSealed();
    tick();
    if (!sealedTimer) {
      sealedTimer = setInterval(function () {
        tick();
        renderSealed();
      }, 1000);
    }
  }

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }

  /* ============ timer ============ */

  function diff(start) {
    var now = new Date();
    var y = now.getFullYear() - start.getFullYear();
    var mo = now.getMonth() - start.getMonth();
    var d = now.getDate() - start.getDate();
    if (d < 0) {
      mo--;
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (mo < 0) {
      y--;
      mo += 12;
    }
    var dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var sec = Math.floor((now - dayStart) / 1000);
    var h = Math.floor(sec / 3600);
    var mi = Math.floor((sec % 3600) / 60);
    var s = sec % 60;
    return { y: y, mo: mo, d: d, h: h, mi: mi, s: s, total: Math.floor((now - start) / 86400000) };
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tick() {
    if (!profile) return;
    var start = new Date(profile.date + 'T00:00:00');
    var r = diff(start);
    $('tYears').textContent = r.y;
    $('tMonths').textContent = r.mo;
    $('tDays').textContent = r.d;
    $('timerClock').textContent = pad(r.h) + ' : ' + pad(r.mi) + ' : ' + pad(r.s);
    $('timerTotal').textContent =
      r.total + ' hari bersama, dan setiap harinya masih terasa seperti hari pertama.';
    var pct = Math.min(100, Math.round((r.total / 1000) * 100));
    $('meterFill').style.width = pct + '%';
  }

  /* ============ alasan sayang ============ */

  function initReasons() {
    $('btnReason').addEventListener('click', function () {
      var box = $('randomReason');
      $('randomReasonText').textContent = '"' + pick(reasons) + '"';
      box.classList.remove('pop');
      void box.offsetWidth;
      box.classList.add('pop');
    });

    $('btnAddReason').addEventListener('click', addReason);
    $('reasonInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') addReason();
    });
  }

  function addReason() {
    var v = $('reasonInput').value.trim();
    if (!v) return;
    reasons.push(v);
    save(K_REASONS, reasons);
    $('reasonInput').value = '';
    renderReasons();
    toast('Alasan baru disimpan. ❤');
  }

  function renderReasons() {
    var list = $('reasonsList');
    list.innerHTML = '';
    reasons.forEach(function (r, i) {
      var item = document.createElement('div');
      item.className = 'reason-item';

      var lead = document.createElement('i');
      lead.className = 'bx bxs-heart lead';

      var p = document.createElement('p');
      p.textContent = r;

      var del = document.createElement('button');
      del.type = 'button';
      del.title = 'Hapus alasan';
      del.setAttribute('aria-label', 'Hapus alasan');
      var icon = document.createElement('i');
      icon.className = 'bx bx-x';
      del.appendChild(icon);
      del.addEventListener('click', function () {
        reasons.splice(i, 1);
        save(K_REASONS, reasons);
        renderReasons();
      });

      item.appendChild(lead);
      item.appendChild(p);
      item.appendChild(del);
      list.appendChild(item);
    });
  }

  /* ============ surat cinta ============ */

  var letterDebounce = null;

  function initLetter() {
    $('letterText').addEventListener('input', function () {
      clearTimeout(letterDebounce);
      var v = this.value;
      letterDebounce = setTimeout(function () {
        save(K_LETTER, { text: v, updated: Date.now() });
      }, 400);
    });

    $('btnLetterTxt').addEventListener('click', function () {
      var text = $('letterText').value;
      if (!text.trim()) {
        toast('Suratnya masih kosong.');
        return;
      }
      var who = profile ? profile.me + ' - ' : '';
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'surat-cinta-' + (profile ? profile.me : 'sayangku') + '.txt';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      toast('Surat cinta diunduh.');
    });

    $('btnLetterCopy').addEventListener('click', function () {
      var text = $('letterText').value;
      if (!text.trim()) {
        toast('Suratnya masih kosong.');
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          toast('Surat disalin. Sekarang kirimkan ke dia. ❤');
        }, function () {
          toast('Gagal menyalin.');
        });
      } else {
        toast('Browser kamu tidak mendukung salin otomatis.');
      }
    });
  }

  /* ============ surat terkunci ============ */

  function encode(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return str;
    }
  }

  function decode(str) {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      return str;
    }
  }

  function renderSealed() {
    var view = $('sealedView');
    var data = load(K_SEALED);

    if (!data) {
      var form = document.createElement('div');
      form.innerHTML =
        '<div class="grid-2">' +
        '<label class="field"><span>Dari</span><input type="text" id="slFrom" maxlength="24" autocomplete="off" /></label>' +
        '<label class="field"><span>Untuk</span><input type="text" id="slTo" maxlength="24" autocomplete="off" /></label>' +
        '</div>' +
        '<label class="field"><span>Tanggal dibuka</span><input type="date" id="slDate" /></label>' +
        '<textarea id="slText" class="letter-box" style="min-height:150px;" placeholder="Tulis isi suratmu di sini..."></textarea>' +
        '<div class="btn-row"><button type="button" class="btn-love" id="btnSeal"><i class="bx bx-lock-alt"></i> Kunci Suratku</button></div>';
      view.innerHTML = '';
      view.appendChild(form);

      $('slFrom').value = profile ? profile.me : '';
      $('slTo').value = profile ? profile.them : '';
      $('slDate').value = todayISO();
      $('slDate').min = todayISO();

      $('btnSeal').addEventListener('click', function () {
        var text = $('slText').value.trim();
        var from = $('slFrom').value.trim() || (profile ? profile.me : '');
        var to = $('slTo').value.trim() || (profile ? profile.them : '');
        var date = $('slDate').value;
        if (!text) {
          toast('Isi dulu isi suratnya.');
          return;
        }
        if (!date) {
          toast('Pilih tanggal dibukanya.');
          return;
        }
        save(K_SEALED, { content: encode(text), from: from, to: to, openDate: date, created: Date.now() });
        toast('Surat terkunci. 🤍');
        renderSealed();
      });
      return;
    }

    var now = new Date();
    var open = new Date(data.openDate + 'T00:00:00');
    var unlocked = now >= open;

    view.innerHTML = '';

    if (unlocked) {
      var box = document.createElement('div');
      box.innerHTML = '<div class="lock-box">' +
        '<span class="lock-icon">💌</span>' +
        '<h4 class="lock-title">Suratmu Terbuka</h4>' +
        '<p class="lock-info">Sesuai janji, surat ini baru bisa dibaca di <b>' + esc(fmtDate(data.openDate)) + '</b>. Dan sekarang waktunya tiba.</p>' +
        '</div>' +
        '<div class="sealed-paper" id="sealedContent"></div>' +
        '<p class="sealed-meta">— dari ' + esc(data.from) + ' untuk ' + esc(data.to) + '</p>' +
        '<div class="btn-row"><button type="button" class="btn-soft" id="btnSealDel"><i class="bx bx-trash"></i> Hapus Surat</button></div>';
      view.appendChild(box);
      $('sealedContent').textContent = decode(data.content);
    } else {
      var daysLeft = Math.max(0, Math.ceil((open - now) / 86400000));
      var locked = document.createElement('div');
      locked.innerHTML = '<div class="lock-box">' +
        '<span class="lock-icon">🔒</span>' +
        '<h4 class="lock-title">Ada Surat Untukmu</h4>' +
        '<p class="lock-info">Surat dari <b>' + esc(data.from) + '</b> untuk <b>' + esc(data.to) + '</b>.<br />' +
        'Terkunci sampai <b>' + esc(fmtDate(data.openDate)) + '</b>.</p>' +
        '<p class="lock-count">tinggal ' + daysLeft + ' hari lagi</p>' +
        '</div>' +
        '<div class="btn-row">' +
        '<button type="button" class="btn-soft" id="btnSealForce"><i class="bx bx-unlock"></i> Buka Sekarang</button>' +
        '<button type="button" class="btn-soft" id="btnSealDel"><i class="bx bx-trash"></i> Hapus</button>' +
        '</div>';
      view.appendChild(locked);

      $('btnSealForce').addEventListener('click', function () {
        if (confirm('Benar mau dibuka sebelum waktunya? Katanya kan mau kejutan...')) {
          save(K_SEALED, Object.assign({}, data, { openDate: todayISO() }));
          renderSealed();
          toast('Kejutan dibongkar. Semoga tetap manis. ❤');
        }
      });
    }

    var delBtn = $('btnSealDel');
    if (delBtn) {
      delBtn.addEventListener('click', function () {
        if (confirm('Hapus surat ini selamanya?')) {
          localStorage.removeItem(K_SEALED);
          renderSealed();
          toast('Surat dihapus.');
        }
      });
    }
  }

  /* ============ kontrak cinta ============ */

  function initContract() {
    $('btnContract').addEventListener('click', function () {
      var me = $('ctMe').value.trim() || (profile ? profile.me : '');
      var them = $('ctThem').value.trim() || (profile ? profile.them : '');
      var date = $('ctDate').value || profile.date;
      var sign = $('ctSign').value || todayISO();
      if (!me || !them) {
        toast('Lengkapi kedua nama dulu.');
        return;
      }
      $('cMe').textContent = me;
      $('cThem').textContent = them;
      $('cMeSign').textContent = me;
      $('cThemSign').textContent = them;
      $('cDate').textContent = fmtDate(date);
      $('cSignDate').textContent = fmtDate(sign);
      var ol = $('cClauses');
      ol.innerHTML = '';
      CLAUSES.forEach(function (c) {
        var li = document.createElement('li');
        li.textContent = c;
        ol.appendChild(li);
      });
      $('contractPreview').hidden = false;
      $('contractPreview').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      toast('Kontrak cinta jadi. 🤍');
    });

    $('btnContractPng').addEventListener('click', function () {
      var el = $('contractPaper');
      if (typeof html2canvas === 'undefined') {
        toast('Komponen gambar belum termuat. Coba lagi.');
        return;
      }
      html2canvas(el, { scale: 2, backgroundColor: '#fffdf7' }).then(function (canvas) {
        var a = document.createElement('a');
        a.download = 'kontrak-cinta.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
        toast('Kontrak diunduh sebagai gambar.');
      });
    });

    $('btnContractPrint').addEventListener('click', function () {
      document.body.classList.add('print-contract');
      window.print();
      setTimeout(function () {
        document.body.classList.remove('print-contract');
      }, 600);
    });
  }

  /* ============ sinyal cinta ============ */

  function initSignals() {
    $('btnSignal').addEventListener('click', function () {
      showSignal('💌 ' + fill(pick(SIGNALS)));
    });
    $('btnDate').addEventListener('click', function () {
      showSignal('📅 Ide kencan: ' + pick(DATES), true);
    });
  }

  function showSignal(text, small) {
    var out = $('signalOut');
    var span = document.createElement('span');
    span.innerHTML = esc(text) + (small ? '<span class="small">dipilihkan semesta untuk kalian</span>' : '');
    out.innerHTML = '';
    out.appendChild(span);
  }

  /* ============ init ============ */

  function init() {
    initHearts();
    initMusic();
    initSetup();
    initReasons();
    initLetter();
    initContract();
    initSignals();

    if (profile) {
      enterApp();
    } else {
      showSetup();
      $('inDate').value = todayISO();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
