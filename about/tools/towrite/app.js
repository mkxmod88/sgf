/* ===== VanzWrite — editor teks lengkap seperti Word ===== */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var paper = $('paper');
  var paperWrap = $('paperWrap');
  var sheet = $('sheet');
  var ruler = $('ruler');
  var pageSep = $('pageSep');
  var canvasEl = $('canvas');

  var DOC_KEY = 'vanzwrite-doc';
  var SET_KEY = 'vanzwrite-settings';
  var THEME_KEY = 'towrite-theme';
  var HISTORY_KEY = 'vanzwrite-history';

  var PAPER = {
    a5:     { w: 595,  h: 842,  name: 'A5' },
    a4:     { w: 794,  h: 1123, name: 'A4' },
    letter: { w: 816,  h: 1056, name: 'Letter' },
    a3:     { w: 1123, h: 1587, name: 'A3' }
  };

  var DEFAULT_DOC =
    '<h2 style="text-align:center;">Dokumen Baru</h2>' +
    '<p>Selamat datang di <b>VanzWrite</b>! Kamu bisa mulai menulis di kertas ini.</p>' +
    '<p>Gunakan toolbar untuk membuat teks <b>tebal</b>, <i>miring</i>, <u>garis bawah</u>, mengatur rata kiri/tengah/kanan, ' +
    'membuat daftar, kutipan, kode, <b>tabel</b>, <b>gambar</b>, <b>catatan kaki</b>, dan lainnya.</p>' +
    '<p>Geser penggaris di atas kertas untuk mengatur indent paragraf. Gunakan <b>Cari &amp; Ganti</b> (Ctrl+F), ' +
    'buka <b>Riwayat</b> untuk kembali ke versi lama, dan <b>Pengaturan</b> untuk ukuran kertas, margin, tema, dan zoom.</p>' +
    '<p>Klik <b>Unduh</b> untuk menyimpan sebagai .TXT, .HTML, .DOC, .MD, atau .PDF. Dokumen tersimpan otomatis.</p>';

  var defaults = {
    theme: 'dark',
    zoom: 100,
    paperSize: 'a4',
    paperStyle: 'polos',
    margin: 64,
    lineHeight: 1.5,
    defFontSize: 15,
    autosave: true,
    paperMode: 'sheet',
    paperColor: 'putih',
    pages: true,
    spell: true
  };

  var settings = loadSettings();

  /* elemen yang dipakai cepat */
  var btnUndo = null, btnRedo = null;

  /* ===== penyimpanan ===== */
  function loadSettings() {
    try {
      var raw = localStorage.getItem(SET_KEY);
      if (!raw) return Object.assign({}, defaults);
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch (e) { return Object.assign({}, defaults); }
  }
  function saveSettings() {
    try { localStorage.setItem(SET_KEY, JSON.stringify(settings)); } catch (e) {}
  }
  function storeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

  /* ===== toast ===== */
  var toastTimer = null;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ===== tema ===== */
  function applyTheme(theme, persist) {
    settings.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (persist !== false) { saveSettings(); storeSet(THEME_KEY, theme); }
    syncSeg('segTheme', theme);
  }

  /* ===== segmen ===== */
  function syncSeg(segId, val) {
    var seg = $(segId);
    if (!seg) return;
    var btns = seg.querySelectorAll('button');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('on', btns[i].getAttribute('data-val') === val);
    }
  }

  function paperSize() { return PAPER[settings.paperSize] || PAPER.a4; }

  /* ===== kertas ===== */
  function applyPaper() {
    var z = settings.zoom / 100;
    var size = paperSize();
    var isSheet = settings.paperMode === 'sheet';

    sheet.classList.toggle('web-mode', !isSheet);

    if (isSheet) {
      sheet.style.transform = 'scale(' + z + ')';
      sheet.style.width = size.w + 'px';
      paper.style.width = '100%';
      paper.style.minHeight = size.h + 'px';
    } else {
      sheet.style.transform = 'none';
      sheet.style.width = '100%';
      paper.style.width = '';
      paper.style.minHeight = '';
    }

    paper.style.padding = settings.margin + 'px';
    paper.style.lineHeight = settings.lineHeight;
    paper.style.fontSize = settings.defFontSize + 'px';
    paper.classList.toggle('garis', settings.paperStyle === 'garis');
    paper.classList.toggle('kotak', settings.paperStyle === 'kotak');
    paper.className = paper.className.replace(/\btheme-\w+\b/g, '').trim();
    paper.classList.add('theme-' + settings.paperColor);
    paper.spellcheck = !!settings.spell;

    syncSeg('segPaper', settings.paperStyle);
    syncSeg('segPaperColor', settings.paperColor);
    $('setPages').checked = !!settings.pages;
    $('setSpell').checked = !!settings.spell;
    $('setPaperMode').value = settings.paperMode;

    ruler.style.display = isSheet ? 'block' : 'none';
    drawRuler();
    resizeWrap();
  }

  function resizeWrap() {
    requestAnimationFrame(function () {
      var r = sheet.getBoundingClientRect();
      paperWrap.style.width = Math.max(10, Math.round(r.width)) + 'px';
      paperWrap.style.height = Math.max(10, Math.round(r.height)) + 'px';
      updatePageBreaks();
    });
  }

  function updatePageBreaks() {
    pageSep.innerHTML = '';
    if (settings.paperMode !== 'sheet' || !settings.pages) return;
    var ph = paperSize().h;
    var rulerH = 28;
    var contentH = paper.offsetHeight;
    if (!contentH || contentH <= ph) return;
    var pages = Math.floor((contentH - 1) / ph);
    for (var i = 1; i <= pages; i++) {
      var line = document.createElement('div');
      line.className = 'page-sep-line';
      line.style.top = (rulerH + i * ph) + 'px';
      var lab = document.createElement('span');
      lab.textContent = 'Halaman ' + (i + 1);
      line.appendChild(lab);
      pageSep.appendChild(line);
    }
  }

  /* ===== penggaris ===== */
  var markers = { fl: null, left: null, right: null };

  function getBlock() {
    var sel = window.getSelection();
    if (!sel.rangeCount) return null;
    var node = sel.getRangeAt(0).startContainer;
    if (node.nodeType === 3) node = node.parentNode;
    var el = node;
    while (el && el !== paper) {
      if (/^(P|DIV|H[1-6]|BLOCKQUOTE|PRE|LI)$/i.test(el.tagName)) return el;
      el = el.parentNode;
    }
    return null;
  }

  function drawRuler() {
    ruler.innerHTML = '';
    if (settings.paperMode !== 'sheet') return;
    var w = paperSize().w;
    var cm = 37.7953;
    var total = Math.max(1, Math.round(w / cm));
    var body = document.createElement('div');
    body.className = 'ruler-body';
    for (var i = 1; i <= total; i++) {
      var t = document.createElement('div');
      t.className = 'ruler-tick' + (i % 5 === 0 ? ' major' : '');
      t.style.left = (i * cm - 0.5) + 'px';
      if (i % 5 === 0) {
        var l = document.createElement('span');
        l.textContent = String(i);
        t.appendChild(l);
      }
      body.appendChild(t);
    }
    ruler.appendChild(body);
    markers.fl = makeMarker('r-hand-fl');
    markers.left = makeMarker('r-hand-left');
    markers.right = makeMarker('r-hand-right');
    syncRuler();
  }

  function makeMarker(handleClass) {
    var m = document.createElement('div');
    m.className = 'r-marker';
    var h = document.createElement('div');
    h.className = handleClass;
    m.appendChild(h);
    ruler.appendChild(m);

    var kind = handleClass === 'r-hand-fl' ? 'fl' : (handleClass === 'r-hand-left' ? 'left' : 'right');
    var dragging = false, startX = 0, startVal = 0;

    m.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      dragging = true;
      startX = e.clientX;
      startVal = parseFloat(m.style.left) || 0;
      if (m.setPointerCapture) m.setPointerCapture(e.pointerId);
    });
    m.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      applyRuler(kind, startVal + (e.clientX - startX));
    });
    m.addEventListener('pointerup', function () {
      dragging = false;
      lastKnownHtml = paper.innerHTML;
      onEdit();
    });
    m.addEventListener('pointercancel', function () { dragging = false; });
    return m;
  }

  function applyRuler(kind, px) {
    var block = getBlock();
    if (!block) return;
    var w = paperSize().w;
    var clamp = Math.max(0, Math.min(w, px));
    if (kind === 'fl') { block.style.textIndent = clamp + 'px'; markers.fl.style.left = clamp + 'px'; }
    else if (kind === 'left') { block.style.marginLeft = clamp + 'px'; markers.left.style.left = clamp + 'px'; }
    else { block.style.marginRight = Math.max(0, w - clamp) + 'px'; markers.right.style.left = clamp + 'px'; }
  }

  function syncRuler() {
    if (settings.paperMode !== 'sheet') return;
    var block = getBlock();
    var w = paperSize().w;
    var ml = 0, ti = 0, mr = 0;
    if (block) {
      var cs = getComputedStyle(block);
      ml = parseFloat(cs.marginLeft) || 0;
      ti = parseFloat(cs.textIndent) || 0;
      mr = parseFloat(cs.marginRight) || 0;
    }
    markers.fl.style.left = Math.min(w, Math.max(0, ml + ti)) + 'px';
    markers.left.style.left = Math.min(w, Math.max(0, ml)) + 'px';
    markers.right.style.left = Math.max(0, Math.min(w, w - mr)) + 'px';
  }

  /* ===== statistik ===== */
  function updateStats() {
    var text = paper.innerText || '';
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    var chars = text.length;
    var noSpaces = text.replace(/\s/g, '').length;
    var paras = paper.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, pre, li').length;
    var read = Math.max(1, Math.ceil(words / 200));
    $('statWords').textContent = words;
    $('statChars').textContent = chars;
    $('statNoSpaces').textContent = noSpaces;
    $('statParas').textContent = paras;
    $('statRead').textContent = read + ' mnt';
  }

  /* ===== simpan ===== */
  var saveTimer = null;
  function setSaveState(mode, text) {
    var box = $('saveState');
    box.className = 'save-state ' + mode;
    var ic = box.querySelector('i');
    ic.className = mode === 'saving' ? 'bx bx-loader-circle bx-spin'
      : mode === 'error' ? 'bx bxs-error-circle'
      : 'bx bxs-check-circle';
    $('saveText').textContent = text;
  }

  function cleanHtml() {
    var div = document.createElement('div');
    div.innerHTML = paper.innerHTML;
    var marks = div.querySelectorAll('mark.find-hit');
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i], p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
    }
    return div.innerHTML;
  }

  function scheduleSave() {
    if (!settings.autosave) return;
    setSaveState('saving', 'Menyimpan…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      storeSet(DOC_KEY, cleanHtml());
      setSaveState('ok', 'Tersimpan otomatis');
    }, 600);
  }

  function saveNow() {
    storeSet(DOC_KEY, cleanHtml());
    setSaveState('ok', 'Tersimpan');
    toast('Dokumen tersimpan');
  }

  /* ===== undo / redo (snapshot + label) ===== */
  var undoStack = [], redoStack = [];
  var lastKnownHtml = '';
  var lastAction = null;
  var suppressUndoCapture = false;

  function pushUndo(label) {
    undoStack.push({ html: lastKnownHtml, label: label || 'Edit' });
    if (undoStack.length > 80) undoStack.shift();
    redoStack = [];
    updateUndoUI();
  }

  function updateUndoUI() {
    btnUndo.disabled = !undoStack.length;
    btnRedo.disabled = !redoStack.length;
    btnUndo.title = undoStack.length ? 'Undo: ' + undoStack[undoStack.length - 1].label : 'Undo (Ctrl+Z)';
    btnRedo.title = redoStack.length ? 'Redo: ' + redoStack[redoStack.length - 1].label : 'Redo (Ctrl+Y)';
  }

  function applyHtml(html) {
    paper.innerHTML = html;
    lastKnownHtml = html;
    onEdit();
    updateUndoUI();
  }

  function undo() {
    if (!undoStack.length) return;
    var cur = lastKnownHtml;
    var prev = undoStack.pop();
    redoStack.push({ html: cur, label: prev.label });
    applyHtml(prev.html);
  }

  function redo() {
    if (!redoStack.length) return;
    var cur = lastKnownHtml;
    var next = redoStack.pop();
    undoStack.push({ html: cur, label: next.label });
    applyHtml(next.html);
  }

  function runCommand(label, fn) {
    paper.focus();
    pushUndo(label);
    suppressUndoCapture = true;
    try { fn(); } catch (e) {}
    suppressUndoCapture = false;
    lastKnownHtml = paper.innerHTML;
    onEdit();
    updateUndoUI();
  }

  function setHtml(html, label) {
    pushUndo(label);
    paper.innerHTML = html;
    lastKnownHtml = paper.innerHTML;
    onEdit();
    updateUndoUI();
  }

  /* ===== perintah pemformatan ===== */
  var CMD_LABELS = {
    bold: 'Tebal', italic: 'Miring', underline: 'Garis bawah', strikeThrough: 'Coret',
    justifyLeft: 'Rata kiri', justifyCenter: 'Rata tengah', justifyRight: 'Rata kanan', justifyFull: 'Justify',
    insertUnorderedList: 'Daftar titik', insertOrderedList: 'Daftar nomor',
    indent: 'Indent', outdent: 'Keluar indent', removeFormat: 'Hapus format',
    formatBlock: 'Paragraf', createLink: 'Tautan', insertText: 'Sisipkan', insertHTML: 'Sisipkan'
  };

  function exec(cmd, val) {
    runCommand(CMD_LABELS[cmd] || 'Format', function () {
      document.execCommand(cmd, false, val || null);
    });
  }

  function setFontSize(px) {
    runCommand('Ukuran huruf', function () {
      var sel = window.getSelection();
      if (!sel.rangeCount) return;
      var range = sel.getRangeAt(0);
      if (range.collapsed) {
        var span = document.createElement('span');
        span.style.fontSize = px + 'px';
        span.appendChild(document.createTextNode('\u200b'));
        range.insertNode(span);
        var r = document.createRange();
        r.setStartAfter(span);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      } else {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontSize', false, '7');
        var fonts = paper.querySelectorAll('font[size="7"]');
        for (var i = 0; i < fonts.length; i++) {
          fonts[i].removeAttribute('size');
          fonts[i].style.fontSize = px + 'px';
        }
      }
    });
  }

  function setFontFamily(family) {
    runCommand('Jenis huruf', function () {
      var sel = window.getSelection();
      if (!sel.rangeCount) return;
      var range = sel.getRangeAt(0);
      if (range.collapsed) {
        var span = document.createElement('span');
        span.style.fontFamily = '"' + family + '"';
        span.appendChild(document.createTextNode('\u200b'));
        range.insertNode(span);
        var r = document.createRange();
        r.setStartAfter(span);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      } else {
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('fontName', false, family);
      }
    });
  }

  function setLineHeight(val) {
    runCommand('Spasi baris', function () {
      var block = getBlock();
      if (block) block.style.lineHeight = val;
    });
  }

  function setColor(kind, color) {
    runCommand(kind === 'hilite' ? 'Warna stabilo' : 'Warna teks', function () {
      document.execCommand('styleWithCSS', false, true);
      document.execCommand(kind === 'hilite' ? 'hiliteColor' : 'foreColor', false, color);
    });
  }

  function addLink() {
    var url = window.prompt('Masukkan URL:', 'https://');
    if (url && url !== 'https://') exec('createLink', url);
  }

  /* ===== status toolbar ===== */
  function queryState(cmd) { try { return document.queryCommandState(cmd); } catch (e) { return false; } }
  function setActive(btnId, on) { var b = $(btnId); if (b) b.classList.toggle('active', !!on); }
  function setCmdActive(cmd, on) {
    var b = document.querySelector('.tbtn[data-cmd="' + cmd + '"]');
    if (b) b.classList.toggle('active', !!on);
  }

  function updateToolbar() {
    setActive('btnBold', queryState('bold'));
    setActive('btnItalic', queryState('italic'));
    setActive('btnUnderline', queryState('underline'));
    setActive('btnStrike', queryState('strikeThrough'));
    setCmdActive('justifyLeft', queryState('justifyLeft'));
    setCmdActive('justifyCenter', queryState('justifyCenter'));
    setCmdActive('justifyRight', queryState('justifyRight'));
    setCmdActive('justifyFull', queryState('justifyFull'));
    setCmdActive('insertUnorderedList', queryState('insertUnorderedList'));
    setCmdActive('insertOrderedList', queryState('insertOrderedList'));
    setCmdActive('indent', queryState('indent'));
    setCmdActive('outdent', queryState('outdent'));
    syncRuler();
  }

  function onEdit() {
    updateStats();
    scheduleSave();
    updateToolbar();
    if (!$('searchBar').hidden && $('searchInput').value) runSearch();
  }

  /* ===== cari & ganti ===== */
  var searchActive = -1;
  var searchTotal = 0;

  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function clearMarks() {
    var marks = paper.querySelectorAll('mark.find-hit');
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i], p = m.parentNode;
      while (m.firstChild) p.insertBefore(m.firstChild, m);
      p.removeChild(m);
    }
  }

  function runSearch() {
    clearMarks();
    var q = $('searchInput').value;
    if (!q) { searchTotal = 0; searchActive = -1; $('searchCount').textContent = '0 hasil'; return; }
    var cs = $('searchCase').checked;
    var re = new RegExp(escRe(q), 'g' + (cs ? '' : 'i'));
    var walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    var count = 0;
    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var idxs = [];
      var nodeRe = new RegExp(escRe(q), 'g' + (cs ? '' : 'i'));
      var m;
      while ((m = nodeRe.exec(node.nodeValue)) !== null) {
        idxs.push(m.index);
        if (m.index === nodeRe.lastIndex) nodeRe.lastIndex++;
      }
      for (var k = idxs.length - 1; k >= 0; k--) {
        try {
          var range = document.createRange();
          range.setStart(node, idxs[k]);
          range.setEnd(node, idxs[k] + q.length);
          var mark = document.createElement('mark');
          mark.className = 'find-hit';
          range.surroundContents(mark);
          count++;
        } catch (e) {}
      }
    }
    searchTotal = count;
    searchActive = -1;
    $('searchCount').textContent = count + ' hasil';
    if (count) gotoMatch(0);
  }

  function gotoMatch(dir) {
    var marks = paper.querySelectorAll('mark.find-hit');
    if (!marks.length) { searchActive = -1; return; }
    if (dir === 0) searchActive = 0;
    else searchActive = (searchActive + dir + marks.length) % marks.length;
    for (var i = 0; i < marks.length; i++) marks[i].classList.toggle('active', i === searchActive);
    marks[searchActive].scrollIntoView({ block: 'center', behavior: 'smooth' });
    $('searchCount').textContent = (searchActive + 1) + ' / ' + marks.length;
  }

  function openSearch() {
    $('searchBar').hidden = false;
    $('searchInput').focus();
  }
  function closeSearch() {
    $('searchBar').hidden = true;
    clearMarks();
    searchTotal = 0;
    searchActive = -1;
    $('searchCount').textContent = '0 hasil';
    paper.focus();
  }

  function replaceOne() {
    var marks = paper.querySelectorAll('mark.find-hit');
    if (!marks.length) { toast('Tidak ada kecocokan'); return; }
    var idx = searchActive >= 0 ? searchActive : 0;
    var m = marks[idx];
    var repl = $('searchReplace').value;
    pushUndo('Ganti');
    m.parentNode.replaceChild(document.createTextNode(repl), m);
    lastKnownHtml = paper.innerHTML;
    runSearch();
    onEdit();
  }

  function replaceAll() {
    var q = $('searchInput').value;
    var repl = $('searchReplace').value;
    if (!q) { toast('Isi kata yang dicari'); return; }
    var cs = $('searchCase').checked;
    clearMarks();
    var re = new RegExp(escRe(q), 'g' + (cs ? '' : 'i'));
    var walker = document.createTreeWalker(paper, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    pushUndo('Ganti semua');
    var changed = 0;
    for (var i = 0; i < nodes.length; i++) {
      var nn = nodes[i];
      var next = nn.nodeValue.replace(re, repl);
      if (next !== nn.nodeValue) { nn.nodeValue = next; changed++; }
    }
    lastKnownHtml = paper.innerHTML;
    toast(changed ? changed + ' diganti' : 'Tidak ada kecocokan');
    runSearch();
    onEdit();
  }

  /* ===== gambar ===== */
  function insertImageFile() {
    $('fileImage').value = '';
    $('fileImage').click();
  }

  function readAndInsertImage(file) {
    if (!file) return;
    if (file.type.indexOf('image') !== 0) { toast('File bukan gambar'); return; }
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var scale = Math.min(1, 1000 / img.width);
        var canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        var data = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
        exec('insertHTML', '<img src="' + data + '" alt="Gambar" />');
        toast('Gambar disisipkan');
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  /* ===== tabel ===== */
  function tableInfo() {
    var sel = window.getSelection();
    if (!sel.rangeCount) return null;
    var n = sel.getRangeAt(0).startContainer;
    if (n.nodeType === 3) n = n.parentNode;
    var cell = n.closest ? n.closest('td,th') : null;
    var table = n.closest ? n.closest('table') : null;
    return { cell: cell, table: table };
  }

  function insertTable() {
    var r = parseInt(window.prompt('Jumlah baris:', '4'), 10);
    var c = parseInt(window.prompt('Jumlah kolom:', '4'), 10);
    if (!r || !c || r > 50 || c > 20) { toast('Angka tidak valid'); return; }
    var h = '<table class="tbl"><tbody>';
    for (var i = 0; i < r; i++) {
      h += '<tr>';
      for (var j = 0; j < c; j++) h += (i === 0 ? '<th>Judul</th>' : '<td>&nbsp;</td>');
      h += '</tr>';
    }
    h += '</tbody></table><p><br></p>';
    exec('insertHTML', h);
  }

  function doTableAction(action) {
    var info = tableInfo();
    if (!info.table || !info.cell) { toast('Klik dulu di dalam tabel'); return; }
    var t = info.table, cell = info.cell;
    pushUndo('Tabel');

    switch (action) {
      case 'row-above':
      case 'row-below': {
        var curRow = cell.parentNode;
        var cols = curRow.querySelectorAll('td,th').length;
        var nr = document.createElement('tr');
        for (var j = 0; j < cols; j++) nr.appendChild(document.createElement('td'));
        if (action === 'row-above') curRow.parentNode.insertBefore(nr, curRow);
        else curRow.parentNode.insertBefore(nr, curRow.nextSibling);
        break;
      }
      case 'col-left':
      case 'col-right': {
        var sibs = cell.parentNode.children;
        var cellIdx = 0;
        for (var i = 0; i < sibs.length; i++) { if (sibs[i] === cell) { cellIdx = i; break; } }
        var rows = t.querySelectorAll('tr');
        for (var r2 = 0; r2 < rows.length; r2++) {
          var cells = rows[r2].querySelectorAll('td,th');
          var ref = cells[Math.min(cellIdx, cells.length - 1)];
          var nc = document.createElement(ref.tagName.toLowerCase());
          if (action === 'col-left') rows[r2].insertBefore(nc, ref);
          else if (ref.nextSibling) rows[r2].insertBefore(nc, ref.nextSibling);
          else rows[r2].appendChild(nc);
        }
        break;
      }
      case 'row-del': {
        var r3 = cell.parentNode;
        r3.parentNode.removeChild(r3);
        if (!t.querySelectorAll('tr').length) t.parentNode.removeChild(t);
        break;
      }
      case 'col-del': {
        var sibs2 = cell.parentNode.children;
        var cellIdx2 = 0;
        for (var i2 = 0; i2 < sibs2.length; i2++) { if (sibs2[i2] === cell) { cellIdx2 = i2; break; } }
        var rows2 = t.querySelectorAll('tr');
        for (var r4 = 0; r4 < rows2.length; r4++) {
          var cells2 = rows2[r4].querySelectorAll('td,th');
          if (cells2[cellIdx2]) rows2[r4].removeChild(cells2[cellIdx2]);
        }
        if (!t.querySelectorAll('tr').length) t.parentNode.removeChild(t);
        break;
      }
      case 'table-del': t.parentNode.removeChild(t); break;
    }
    lastKnownHtml = paper.innerHTML;
    onEdit();
  }

  /* ===== simbol ===== */
  var SYMBOLS = [
    '©','®','™','✓','✗','★','☆','❤','→','←','↑','↓',
    '⇒','⇔','·','•','…','—','–','±','×','÷','≈','≠',
    '≤','≥','½','¼','¾','€','£','¥','¢','₩','₹','°',
    '§','¶','†','‡','µ','π','∞','√','∆','∑','¹','²','³',
    '😊','❤️','🎉','⭐','🔥','✨','👍','🚀','💡','✅','📌','😎'
  ];

  function buildSymbols() {
    var grid = $('symbolGrid');
    grid.innerHTML = '';
    for (var i = 0; i < SYMBOLS.length; i++) {
      (function (sym) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = sym;
        b.addEventListener('mousedown', function (e) { e.preventDefault(); });
        b.addEventListener('click', function () {
          exec('insertText', sym);
        });
        grid.appendChild(b);
      })(SYMBOLS[i]);
    }
  }

  /* ===== catatan kaki ===== */
  function addFootnote() {
    paper.focus();
    var sel = window.getSelection();
    if (!sel.rangeCount) return;
    var n = paper.querySelectorAll('.fn-ref').length + 1;
    pushUndo('Catatan kaki');
    var sup = document.createElement('sup');
    sup.className = 'fn-ref';
    sup.textContent = n;
    sel.getRangeAt(0).insertNode(sup);
    if (!paper.querySelector('.fn-sep')) {
      var sep = document.createElement('hr');
      sep.className = 'fn-sep';
      paper.appendChild(sep);
    }
    var note = document.createElement('p');
    note.className = 'fn-note';
    var supN = document.createElement('sup');
    supN.className = 'fn-ref';
    supN.textContent = n;
    note.appendChild(supN);
    note.appendChild(document.createTextNode(' Catatan kaki ' + n));
    paper.appendChild(note);
    lastKnownHtml = paper.innerHTML;
    onEdit();
    var r2 = document.createRange();
    r2.setStart(note, note.childNodes.length);
    r2.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r2);
    paper.focus();
  }

  /* ===== dokumen baru & reset ===== */
  function newDoc() {
    if (!window.confirm('Buat dokumen baru? Perubahan saat ini akan diganti dengan teks awal.')) return;
    setHtml(DEFAULT_DOC, 'Dokumen baru');
    saveNow();
    toast('Dokumen baru dibuat');
  }

  function resetSettings() {
    if (!window.confirm('Kembalikan semua pengaturan ke awal?')) return;
    settings = Object.assign({}, defaults);
    applyTheme(settings.theme);
    applyPaper();
    syncSettingsUI();
    saveSettings();
    toast('Pengaturan direset');
  }

  /* ===== riwayat versi ===== */
  function getHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function pushHistory(label) {
    var list = getHistory();
    var words = paper.innerText.trim() ? paper.innerText.trim().split(/\s+/).length : 0;
    list.unshift({ t: Date.now(), label: label || 'Auto', html: cleanHtml(), words: words });
    if (list.length > 12) list.pop();
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function fmtTime(ts) {
    try { return new Date(ts).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }); }
    catch (e) { return ''; }
  }

  function renderHistory() {
    var list = getHistory();
    var box = $('historyList');
    box.innerHTML = '';
    if (!list.length) {
      box.innerHTML = '<p class="history-empty">Belum ada versi tersimpan.<br />Snapshot otomatis tiap 5 menit.</p>';
      return;
    }
    for (var i = 0; i < list.length; i++) {
      (function (idx) {
        var item = list[idx];
        var el = document.createElement('div');
        el.className = 'history-item';
        var time = document.createElement('div');
        time.className = 'h-time';
        time.innerHTML = '<b>' + fmtTime(item.t) + '</b>';
        var meta = document.createElement('div');
        meta.className = 'h-meta';
        meta.textContent = '~' + item.words + ' kata · ' + (item.label || 'Auto');
        var acts = document.createElement('div');
        acts.className = 'h-actions';
        var b1 = document.createElement('button');
        b1.type = 'button';
        b1.textContent = 'Buka';
        b1.addEventListener('click', function () { restoreVersion(idx); });
        var b2 = document.createElement('button');
        b2.type = 'button';
        b2.className = 'del';
        b2.textContent = 'Hapus';
        b2.addEventListener('click', function () { deleteVersion(idx); });
        acts.appendChild(b1);
        acts.appendChild(b2);
        el.appendChild(time);
        el.appendChild(meta);
        el.appendChild(acts);
        box.appendChild(el);
      })(i);
    }
  }

  function restoreVersion(idx) {
    var list = getHistory();
    var item = list[idx];
    if (!item) return;
    setHtml(item.html, 'Pulihkan versi');
    toast('Versi dipulihkan');
  }

  function deleteVersion(idx) {
    var list = getHistory();
    list.splice(idx, 1);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch (e) {}
    renderHistory();
  }

  function clearHistory() {
    if (!window.confirm('Hapus semua riwayat versi?')) return;
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
    renderHistory();
    toast('Riwayat dihapus');
  }

  /* ===== impor ===== */
  function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function textToHtml(text) {
    var lines = text.split(/\r?\n/);
    var paras = [], cur = [];
    for (var i = 0; i < lines.length; i++) {
      if (!lines[i].trim()) {
        if (cur.length) { paras.push(cur.join('<br>')); cur = []; }
      } else cur.push(escHtml(lines[i]));
    }
    if (cur.length) paras.push(cur.join('<br>'));
    return paras.map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }

  function importFile() {
    $('fileImport').value = '';
    $('fileImport').click();
  }

  function handleImport(file) {
    if (!file) return;
    var fr = new FileReader();
    fr.onload = function () {
      var text = fr.result;
      var ext = (file.name.split('.').pop() || '').toLowerCase();
      var html;
      if (ext === 'html' || ext === 'htm' || /^\s*<(?:!doctype|html)/i.test(text)) html = text;
      else html = textToHtml(text);
      setHtml(html, 'Impor file');
      toast('File diimpor');
    };
    fr.readAsText(file);
  }

  /* ===== ekspor ===== */
  function dateStamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function download(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
  }

  function buildHtmlDoc() {
    return '<!doctype html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n' +
      '<title>Dokumen VanzWrite</title>\n' +
      '<style>\n' +
      '  body { font-family: "Plus Jakarta Sans", Arial, sans-serif; font-size: ' + settings.defFontSize + 'px; ' +
      'line-height: ' + settings.lineHeight + '; color: #1f2937; max-width: 760px; margin: 24px auto; padding: 0 16px; }\n' +
      '  h1,h2,h3 { line-height: 1.3; }\n' +
      '  blockquote { margin: 0 0 1em; padding: 2px 0 2px 14px; border-left: 3px solid #a855f7; color: #4b5563; }\n' +
      '  pre { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 12px; ' +
      'font-family: "JetBrains Mono", monospace; font-size: 0.9em; white-space: pre-wrap; }\n' +
      '  table { border-collapse: collapse; width: 100%; margin: 0 0 1em; }\n' +
      '  th, td { border: 1px solid #c7ccd6; padding: 6px 10px; }\n' +
      '  th { background: #f3f4f6; }\n' +
      '  img { max-width: 100%; }\n' +
      '  a { color: #6d28d9; }\n' +
      '</style>\n</head>\n<body>\n' + cleanHtml() + '\n</body>\n</html>';
  }

  function inlineMd(node) {
    var out = '';
    for (var i = 0; i < node.childNodes.length; i++) {
      var n = node.childNodes[i];
      if (n.nodeType === 3) { out += n.nodeValue; continue; }
      var tag = n.nodeName.toLowerCase();
      if (tag === 'b' || tag === 'strong') out += '**' + inlineMd(n) + '**';
      else if (tag === 'i' || tag === 'em') out += '_' + inlineMd(n) + '_';
      else if (tag === 'del' || tag === 's' || tag === 'strike') out += '~~' + inlineMd(n) + '~~';
      else if (tag === 'a') out += '[' + inlineMd(n) + '](' + (n.getAttribute('href') || '') + ')';
      else if (tag === 'code') out += '`' + n.innerText + '`';
      else if (tag === 'img') out += '![' + (n.getAttribute('alt') || '') + '](' + (n.getAttribute('src') || '') + ')';
      else if (tag === 'br') out += '\n';
      else if (tag === 'sup') out += '^' + n.innerText;
      else out += inlineMd(n);
    }
    return out;
  }

  function htmlToMd() {
    var out = [];
    function listItems(root, bullet) {
      var lis = root.querySelectorAll(':scope > li');
      for (var i = 0; i < lis.length; i++) {
        out.push((bullet || '1. ') + inlineMd(lis[i]));
      }
    }
    for (var i = 0; i < paper.childNodes.length; i++) {
      var node = paper.childNodes[i];
      if (node.nodeType === 3) { if (node.nodeValue.trim()) out.push(node.nodeValue); continue; }
      var tag = node.nodeName.toLowerCase();
      if (tag === 'p') out.push(inlineMd(node) + '\n');
      else if (/^h[1-6]$/.test(tag)) out.push('\n' + '#'.repeat(parseInt(tag[1], 10)) + ' ' + inlineMd(node) + '\n');
      else if (tag === 'ul') listItems(node, '- ');
      else if (tag === 'ol') listItems(node, '1. ');
      else if (tag === 'blockquote') { out.push('> ' + inlineMd(node) + '\n'); }
      else if (tag === 'pre') out.push('\n```\n' + node.innerText + '\n```\n');
      else if (tag === 'hr') out.push('\n---\n');
      else if (tag === 'div') out.push(inlineMd(node) + '\n');
    }
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
  }

  function exportPdfDirect() {
    if (!window.jspdf || !window.jspdf.jsPDF) { toast('Komponen PDF belum dimuat'); return; }
    var pdf = new window.jspdf.jsPDF();
    var y = 16, x = 16, w = pdf.internal.pageSize.getWidth() - 32;
    var blocks = paper.querySelectorAll(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > blockquote, :scope > pre, :scope > ul, :scope > ol, :scope > table');
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      var tag = b.nodeName.toLowerCase();
      var text = tag === 'table' ? '(tabel disisipkan)' : b.innerText;
      if (!text.trim()) continue;
      var size = 12, style = 'normal';
      if (tag === 'h1') { size = 20; style = 'bold'; }
      else if (tag === 'h2') { size = 16; style = 'bold'; }
      else if (tag === 'h3') { size = 14; style = 'bold'; }
      else if (tag === 'blockquote') style = 'italic';
      var lines = pdf.splitTextToSize(text, w);
      var lh = size * 1.45;
      for (var j = 0; j < lines.length; j++) {
        if (y > 280) { pdf.addPage(); y = 16; }
        pdf.setFont('helvetica', style);
        pdf.setFontSize(size);
        pdf.text(lines[j], x, y);
        y += lh;
      }
      y += 5;
    }
    pdf.save('vanzwrite-' + dateStamp() + '.pdf');
    toast('File .PDF diunduh');
  }

  function exportFile(fmt) {
    var base = 'vanzwrite-' + dateStamp();
    if (fmt === 'txt') {
      download(new Blob([paper.innerText], { type: 'text/plain;charset=utf-8' }), base + '.txt');
      toast('File .TXT diunduh');
    } else if (fmt === 'html') {
      download(new Blob([buildHtmlDoc()], { type: 'text/html;charset=utf-8' }), base + '.html');
      toast('File .HTML diunduh');
    } else if (fmt === 'doc') {
      download(new Blob(['\ufeff' + buildHtmlDoc()], { type: 'application/msword' }), base + '.doc');
      toast('File .DOC diunduh');
    } else if (fmt === 'md') {
      download(new Blob([htmlToMd()], { type: 'text/markdown;charset=utf-8' }), base + '.md');
      toast('File .MD diunduh');
    } else if (fmt === 'pdf') {
      exportPdfDirect();
    } else if (fmt === 'pdfprint') {
      window.print();
    }
  }

  /* ===== panel ===== */
  function closeAllPanels() {
    $('settingsPanel').classList.remove('open');
    $('historyPanel').classList.remove('open');
    $('scrim').classList.remove('open');
  }
  function openSettings() { closeAllPanels(); $('settingsPanel').classList.add('open'); $('scrim').classList.add('open'); renderHistory(); }
  function openHistory() { closeAllPanels(); $('historyPanel').classList.add('open'); $('scrim').classList.add('open'); renderHistory(); }

  function closeAllDropdowns() {
    $('exportMenu').classList.remove('open');
    $('tableMenu').classList.remove('open');
    $('symbolPop').classList.remove('open');
  }

  /* ===== sinkron UI pengaturan ===== */
  function syncSettingsUI() {
    syncSeg('segTheme', settings.theme);
    syncSeg('segPaper', settings.paperStyle);
    syncSeg('segPaperColor', settings.paperColor);
    $('setPaperSize').value = settings.paperSize;
    $('setPaperMode').value = settings.paperMode;
    $('setMargin').value = String(settings.margin);
    $('setLineHeight').value = String(settings.lineHeight);
    $('setFontSize').value = String(settings.defFontSize);
    $('setAutosave').checked = settings.autosave;
    $('setPages').checked = !!settings.pages;
    $('setSpell').checked = !!settings.spell;
    $('zoomRange').value = settings.zoom;
    $('zoomLabel').textContent = settings.zoom + '%';
  }

  /* ===== inisialisasi ===== */
  function init() {
    btnUndo = $('btnUndo');
    btnRedo = $('btnRedo');

    applyTheme(settings.theme, false);
    paper.innerHTML = storeGet(DOC_KEY) || DEFAULT_DOC;
    lastKnownHtml = paper.innerHTML;
    applyPaper();
    syncSettingsUI();
    updateStats();
    updateUndoUI();
    buildSymbols();
    renderHistory();

    /* toolbar: perintah umum */
    var cmdBtns = document.querySelectorAll('.tbtn[data-cmd]');
    for (var i = 0; i < cmdBtns.length; i++) {
      cmdBtns[i].addEventListener('mousedown', function (e) { e.preventDefault(); });
      cmdBtns[i].addEventListener('click', function () { exec(this.getAttribute('data-cmd')); });
    }
    var allTb = document.querySelectorAll('.tbtn');
    for (var t = 0; t < allTb.length; t++) {
      allTb[t].addEventListener('mousedown', function (e) { e.preventDefault(); });
    }
    var dropBtns = document.querySelectorAll('.dropdown button');
    for (var d = 0; d < dropBtns.length; d++) {
      dropBtns[d].addEventListener('mousedown', function (e) { e.preventDefault(); });
    }

    /* bilah aplikasi */
    $('btnNew').addEventListener('click', newDoc);
    $('btnImport').addEventListener('click', importFile);
    $('btnUndo').addEventListener('click', undo);
    $('btnRedo').addEventListener('click', redo);
    $('btnPrint').addEventListener('click', function () { window.print(); });
    $('btnHistory').addEventListener('click', openHistory);
    $('btnFocus').addEventListener('click', function () {
      document.body.classList.toggle('focus-mode');
      var on = document.body.classList.contains('focus-mode');
      this.innerHTML = on ? '<i class="bx bx-hide"></i>' : '<i class="bx bx-show"></i>';
      this.title = on ? 'Keluar mode fokus' : 'Mode fokus';
    });
    $('btnSettings').addEventListener('click', openSettings);
    $('closeSettings').addEventListener('click', closeAllPanels);
    $('closeHistory').addEventListener('click', closeAllPanels);
    $('scrim').addEventListener('click', closeAllPanels);
    $('btnClearHistory').addEventListener('click', clearHistory);

    $('btnExport').addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      $('exportMenu').classList.toggle('open');
    });
    $('btnTable').addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      $('tableMenu').classList.toggle('open');
    });
    $('btnSymbol').addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllDropdowns();
      $('symbolPop').classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.menu-wrap')) closeAllDropdowns();
    });

    var expBtns = $('exportMenu').querySelectorAll('button');
    for (var e1 = 0; e1 < expBtns.length; e1++) {
      expBtns[e1].addEventListener('click', function () {
        exportFile(this.getAttribute('data-fmt'));
        closeAllDropdowns();
      });
    }
    var tblBtns = $('tableMenu').querySelectorAll('button');
    for (var e2 = 0; e2 < tblBtns.length; e2++) {
      tblBtns[e2].addEventListener('click', function () {
        var act = this.getAttribute('data-tbl');
        if (act === 'insert') insertTable();
        else doTableAction(act);
        closeAllDropdowns();
      });
    }

    /* kontrol format */
    $('ctlFont').addEventListener('change', function () { setFontFamily(this.value); });
    $('ctlSize').addEventListener('change', function () { setFontSize(parseInt(this.value, 10)); });
    $('ctlBlock').addEventListener('change', function () { exec('formatBlock', this.value); });
    $('btnColor').addEventListener('click', function () { $('colorText').click(); });
    $('colorText').addEventListener('input', function () { setColor('fore', this.value); });
    $('btnHighlight').addEventListener('click', function () { $('colorHighlight').click(); });
    $('colorHighlight').addEventListener('input', function () { setColor('hilite', this.value); });
    $('btnLink').addEventListener('click', addLink);
    $('btnImage').addEventListener('click', insertImageFile);
    $('fileImage').addEventListener('change', function () { readAndInsertImage(this.files[0]); });
    $('fileImport').addEventListener('change', function () { handleImport(this.files[0]); });
    $('btnFootnote').addEventListener('click', addFootnote);
    $('btnSearch').addEventListener('click', function () {
      if ($('searchBar').hidden) openSearch();
      else closeSearch();
    });

    /* cari & ganti */
    $('searchInput').addEventListener('input', function () { runSearch(); });
    $('searchNext').addEventListener('click', function () { gotoMatch(1); });
    $('searchPrev').addEventListener('click', function () { gotoMatch(-1); });
    $('searchCase').addEventListener('change', function () { runSearch(); });
    $('searchReplaceOne').addEventListener('click', replaceOne);
    $('searchReplaceAll').addEventListener('click', replaceAll);
    $('searchClose').addEventListener('click', closeSearch);
    $('searchInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); gotoMatch(1); }
    });
    $('searchReplace').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); replaceOne(); }
    });

    /* pengaturan */
    $('segTheme').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) applyTheme(b.getAttribute('data-val'));
    });
    $('segPaper').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      settings.paperStyle = b.getAttribute('data-val');
      applyPaper();
      saveSettings();
    });
    $('segPaperColor').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      settings.paperColor = b.getAttribute('data-val');
      applyPaper();
      saveSettings();
    });
    $('setPaperSize').addEventListener('change', function () {
      settings.paperSize = this.value;
      applyPaper();
      saveSettings();
    });
    $('setPaperMode').addEventListener('change', function () {
      settings.paperMode = this.value;
      applyPaper();
      saveSettings();
    });
    $('setMargin').addEventListener('change', function () {
      settings.margin = parseInt(this.value, 10);
      applyPaper();
      saveSettings();
    });
    $('setLineHeight').addEventListener('change', function () {
      settings.lineHeight = parseFloat(this.value);
      applyPaper();
      saveSettings();
    });
    $('setFontSize').addEventListener('change', function () {
      settings.defFontSize = parseInt(this.value, 10);
      applyPaper();
      saveSettings();
    });
    $('setPages').addEventListener('change', function () {
      settings.pages = this.checked;
      applyPaper();
      saveSettings();
    });
    $('setSpell').addEventListener('change', function () {
      settings.spell = this.checked;
      applyPaper();
      saveSettings();
    });
    $('setAutosave').addEventListener('change', function () {
      settings.autosave = this.checked;
      saveSettings();
      if (settings.autosave) scheduleSave();
      else setSaveState('ok', 'Simpan otomatis mati');
    });
    $('btnSaveNow').addEventListener('click', function () { saveNow(); pushHistory('Simpan manual'); renderHistory(); });
    $('btnNewDoc').addEventListener('click', newDoc);
    $('btnReset').addEventListener('click', resetSettings);

    $('zoomRange').addEventListener('input', function () {
      settings.zoom = parseInt(this.value, 10);
      $('zoomLabel').textContent = settings.zoom + '%';
      applyPaper();
      saveSettings();
    });

    /* event editor */
    paper.addEventListener('input', function () {
      if (suppressUndoCapture) return;
      pushUndo(lastAction || 'Ketik');
      lastAction = null;
      lastKnownHtml = paper.innerHTML;
      onEdit();
    });
    paper.addEventListener('keyup', updateToolbar);
    paper.addEventListener('mouseup', updateToolbar);
    document.addEventListener('selectionchange', function () {
      if (document.activeElement === paper || paper.contains(document.activeElement)) updateToolbar();
    });
    paper.addEventListener('paste', function (e) {
      var items = e.clipboardData && e.clipboardData.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') === 0) {
            e.preventDefault();
            readAndInsertImage(items[i].getAsFile());
            return;
          }
        }
      }
      setTimeout(onEdit, 0);
    });

    /* pintasan keyboard */
    document.addEventListener('keydown', function (e) {
      var mod = e.ctrlKey || e.metaKey;
      if (e.key === 'Escape') {
        closeSearch();
        closeAllDropdowns();
        closeAllPanels();
        return;
      }
      if (!mod) return;
      var k = e.key.toLowerCase();
      if (k === 'f') { e.preventDefault(); if ($('searchBar').hidden) openSearch(); }
      else if (k === 's') { e.preventDefault(); saveNow(); }
      else if (k === 'p') { e.preventDefault(); window.print(); }
      else if (k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if (k === 'y') { e.preventDefault(); redo(); }
      else if (document.activeElement === paper || paper.contains(document.activeElement)) {
        if (k === 'b') { e.preventDefault(); exec('bold'); }
        else if (k === 'i') { e.preventDefault(); exec('italic'); }
        else if (k === 'u') { e.preventDefault(); exec('underline'); }
        else if (k === 'k') { e.preventDefault(); addLink(); }
      }
    });

    /* ukuran kanvas */
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () { resizeWrap(); updatePageBreaks(); });
      ro.observe(paper);
      ro.observe(sheet);
    }

    /* snapshot riwayat otomatis */
    setInterval(function () { pushHistory('Auto'); }, 300000);

    window.addEventListener('beforeunload', function () {
      if (settings.autosave) storeSet(DOC_KEY, cleanHtml());
    });

    resizeWrap();
  }

  init();
})();
