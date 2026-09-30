/// ============ Background stars ============
const bgStars = document.getElementById("bg-stars");
const STAR_COUNT = 45;

function createStars() {
  for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement("i");
    star.className = "star";
    star.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: #c4b5fd;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.6 + 0.2};
      animation-duration: ${(Math.random() * 3 + 2).toFixed(2)}s;
      animation-delay: ${(Math.random() * 3).toFixed(2)}s;
    `;
    bgStars.appendChild(star);
  }
}

/// ============ Intro animation (CSS) ============
function cardEntrance() {
  const cardEl = document.querySelector(".card");
  if (!cardEl) return;
  cardEl.classList.add("card-in");
  // Hapus class saat animasi selesai supaya tilt/transisi tetap jalan
  cardEl.addEventListener("animationend", function handler(e) {
    if (e.target !== cardEl) return;
    cardEl.classList.remove("card-in");
    cardEl.removeEventListener("animationend", handler);
  });
}

function contentIntro() {
  const name = document.querySelector(".card-fullname");
  const job = document.querySelector(".card-jobtitle");
  const cont = document.querySelector(".mk-cont");
  const btn = document.querySelector(".btn-home");
  const btns = document.querySelectorAll(".card-buttons button");

  [
    [name, 0.8],
    [job, 0.95],
    [cont, 1.1],
    [btn, 1.2],
  ].forEach(([el, delay]) => {
    if (!el) return;
    el.style.setProperty("--in-dur", "0.5s");
    el.style.animationDelay = delay + "s";
    el.classList.add("in");
  });

  btns.forEach((b, i) => {
    b.style.setProperty("--in-dur", "0.5s");
    b.style.animationDelay = 1.3 + i * 0.08 + "s";
    b.classList.add("in");
  });

  // Bersihkan class animasi setelah selesai supaya efek tilt/transisi CSS tetap jalan
  document.querySelectorAll(".in").forEach((el) => {
    el.addEventListener("animationend", function handler(e) {
      if (e.target !== el) return;
      el.classList.remove("in");
      el.removeEventListener("animationend", handler);
    });
  });
}

/// ============ Tab switching — smooth & anti-flicker ============
const buttons = document.querySelectorAll(".card-buttons button");
const sections = document.querySelectorAll(".card-section");
const card = document.querySelector(".card");

function syncA11y() {
  sections.forEach((section) => {
    const active = section.classList.contains("is-active");
    try { section.inert = !active; } catch (_) {}
    section.setAttribute("aria-hidden", String(!active));
  });
}
syncA11y();

function pauseAllMusicDOM() {
  document.querySelectorAll(".music-card.playing").forEach((c) => {
    const a = c.querySelector("audio");
    if (a) { try { a.pause(); } catch(_) {} }
    c.classList.remove("playing");
    const ic = c.querySelector(".music-play i");
    if (ic) ic.className = "ri-play-fill";
    const r = c.querySelector(".music-progress");
    if (r) r.setAttribute("aria-valuenow", "0");
  });
}

let isSwitching = false;
let switchTimer = null;
const SWITCH_DUR = 380;

function getActiveSection() {
  return document.querySelector(".card-section.is-active");
}

function setButtonsActive(targetSection, keepMore) {
  buttons.forEach((b) => {
    b.classList.remove("is-active");
    b.setAttribute("aria-selected", "false");
    b.removeAttribute("aria-current");
  });
  let activeBtn = null;
  if (keepMore) {
    activeBtn = document.querySelector('.card-buttons button[data-section="#more"]');
  } else {
    activeBtn = document.querySelector(`.card-buttons button[data-section="${targetSection}"]`);
    if (!activeBtn) activeBtn = document.querySelector('.card-buttons button[data-section="#more"]');
  }
  if (activeBtn) {
    activeBtn.classList.add("is-active");
    activeBtn.setAttribute("aria-selected", "true");
    activeBtn.setAttribute("aria-current", "page");
  }
}

function performSwitch(targetSection, opts = {}) {
  const section = document.querySelector(targetSection);
  if (!section) return;
  const current = getActiveSection();
  if (current === section && !isSwitching) return;

  // 1: mini-player persisten — jangan auto-pause saat pindah tab, biar tetap muter

  // Update card height/state immediately (smooth via CSS height transition)
  if (targetSection !== "#home") card.classList.add("is-active");
  else card.classList.remove("is-active");
  card.setAttribute("data-state", targetSection);
  setButtonsActive(targetSection, !!opts.keepMoreActive);
  syncHeaderText(targetSection);

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !current) {
    sections.forEach((s) => {
      s.classList.remove("is-active", "is-leaving");
      s.scrollTop = 0;
    });
    section.classList.add("is-active");
    section.scrollTop = 0;
    const main = document.querySelector(".card-main");
    if (main) main.scrollTop = 0;
    document.getElementById("menu-wrap")?.classList.remove("open");
    syncA11y();
    return;
  }

  // Interrupt previous switch if user clicks rapidly
  if (isSwitching) {
    clearTimeout(switchTimer);
    document.querySelectorAll(".card-section.is-leaving").forEach((el) => el.classList.remove("is-leaving"));
  }

  isSwitching = true;
  card.classList.add("is-switching");

  if (current) {
    current.classList.add("is-leaving");
    current.classList.remove("is-active");
  }

  // stage incoming: ensure it starts from hidden state then animate to active on next frame
  section.classList.remove("is-leaving");
  // force reflow trick: make it invisible for one frame
  section.style.visibility = "hidden";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      section.style.visibility = "";
      section.classList.add("is-active");
      section.scrollTop = 0;
      const main = document.querySelector(".card-main");
      if (main) main.scrollTop = 0;
      syncA11y();
    });
  });

  document.getElementById("menu-wrap")?.classList.remove("open");

  switchTimer = setTimeout(() => {
    document.querySelectorAll(".card-section.is-leaving").forEach((el) => el.classList.remove("is-leaving"));
    isSwitching = false;
    card.classList.remove("is-switching");
  }, SWITCH_DUR + 40);
}

const handleButtonClick = (e) => {
  const targetSection = e.currentTarget.getAttribute("data-section");
  performSwitch(targetSection);
};

buttons.forEach((btn) => btn.addEventListener("click", handleButtonClick));

// Header global ganti teks per tab: nama section di fullname,
// "Marchell Kevandra" di jobtitle (span equalizer di h1 dibiarkan utuh).
// Tab lain (home/profile/tools) balik ke default.
const headerNameEl = document.querySelector(".card-fullname");
const headerJobEl = document.querySelector(".card-jobtitle");
const headerNameNode = document.querySelector(".card-fullname .fullname-text") || (headerNameEl ? headerNameEl.firstChild : null);
const headerJobNode = document.querySelector(".card-jobtitle .jobtitle-text") || headerJobEl;
const headerNameDefault = headerNameNode ? headerNameNode.textContent : "Marchell Kevandra";
const headerJobDefault = headerJobNode ? headerJobNode.textContent : "BE YOUR SELF";

const HEADER_TITLES = {
  "#more": "moreTitle",
  "#music": "musicTitle",
  "#download": "downloadTitle",
  "#gallery": "galleryTitle",
  "#contact": "contactTitle",
};

function headerDict() {
  try {
    if (typeof I18N !== "undefined" && I18N[currentLang]) return I18N[currentLang];
  } catch (_) {}
  return null;
}

function syncHeaderText(targetSection) {
  if (!headerNameNode || !headerJobNode) return;
  const key = HEADER_TITLES[targetSection];
  const dict = headerDict();
  if (key && dict && dict[key]) {
    headerNameNode.textContent = dict[key];
    headerJobNode.textContent = "Marchell Kevandra";
  } else {
    headerNameNode.textContent = headerNameDefault;
    headerJobNode.textContent = headerJobDefault;
  }
}

// Navigasi dari dalam More ke tab hidden (Gallery/Contact/Music/Download) — tetap smooth
function switchSection(targetSection) {
  performSwitch(targetSection, { keepMoreActive: true });
}

// Tombol back global: dari Music/Gallery/Contact/Download balik ke More,
// kalau sudah di More balik ke Home (biar nggak jadi tombol mati)
function goBack() {
  const st = document.querySelector(".card")?.getAttribute("data-state");
  if (st === "#more") performSwitch("#home");
  else switchSection("#more");
}

/// ============ Music data & render (1 template, tanpa pengulangan HTML) ============
const MK_TRACKS = [
  { title: "DJ SOASU X CHELL V2", artist: "Marchell Kevandra", cover: "assets/img/vx1.png", audio: "assets/mix/music1.mp3" },
  { title: "Ubur Ubur x Mkchl V5", artist: "Marchell Kevandra", cover: "assets/img/vx2.png", audio: "assets/mix/music2.mp3" },
  { title: "YUNKAI X KITAPEEHATIIIINI", artist: "Marchell Kevandra", cover: "assets/img/vx3.png", audio: "assets/mix/music3.mp3" },
  { title: "Ch3l - Stay With Me", artist: "Marchell Kevandra", cover: "assets/img/vx4.png", audio: "assets/mix/music4.mp3" },
];

function buildMusicCard(track) {
  const card = document.createElement("div");
  card.className = "music-card is-loading";
  card.dataset.audio = track.audio;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "Play " + track.title);

  const coverWrap = document.createElement("div");
  coverWrap.className = "music-cover-wrap";
  const cover = document.createElement("img");
  cover.className = "music-cover";
  cover.src = track.cover;
  cover.alt = track.title + " cover";
  cover.loading = "lazy";
  cover.decoding = "async";
  const eq = document.createElement("span");
  eq.className = "music-eq";
  eq.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 3; i++) eq.appendChild(document.createElement("span"));
  const skeleton = document.createElement("span");
  skeleton.className = "music-skeleton";
  skeleton.setAttribute("aria-hidden", "true");
  coverWrap.append(cover, eq, skeleton);

  const info = document.createElement("div");
  info.className = "music-info";
  const title = document.createElement("div");
  title.className = "music-title";
  title.textContent = track.title;
  const artist = document.createElement("div");
  artist.className = "music-artist";
  artist.textContent = track.artist;
  const progress = document.createElement("input");
  progress.className = "music-progress";
  progress.type = "range";
  progress.min = "0";
  progress.max = "100";
  progress.step = "0.1";
  progress.value = "0";
  progress.disabled = true;
  progress.setAttribute("aria-label", "Seek " + track.title);
  const meta = document.createElement("div");
  meta.className = "music-meta";
  const time = document.createElement("span");
  time.className = "music-time";
  time.textContent = "00:00";
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.textContent = "•";
  const dur = document.createElement("span");
  dur.className = "music-duration";
  dur.textContent = "--:--";
  meta.append(time, dot, dur);
  info.append(title, artist, meta);

  const play = document.createElement("button");
  play.className = "music-play";
  play.setAttribute("aria-label", "Play " + track.title);
  const playIcon = document.createElement("i");
  playIcon.className = "ri-play-fill";
  play.appendChild(playIcon);

  const audio = document.createElement("audio");
  audio.preload = "metadata";
  audio.src = track.audio;

  card.append(coverWrap, info, play, progress, audio);
  return card;
}

function renderMusicCards() {
  const grid = document.getElementById("music-grid");
  if (!grid || grid.children.length) return;
  const frag = document.createDocumentFragment();
  MK_TRACKS.forEach((t) => frag.appendChild(buildMusicCard(t)));
  grid.appendChild(frag);
}

renderMusicCards();

/// ============ Download data & render (tambah file cukup edit array ini) ============
const MK_DOWNLOADS = [
  { name: "Vanz Font", meta: "RAR/ZIP", file: "assets/docs/vanz-font.rar", icon: "ri-file-text-line" },
  { name: "Kinemaster", meta: "APK", file: "assets/docs/KineMaster_v7_6_26_34820_GP.apk", icon: "ri-android-line" }
];

function buildDlCard(item) {
  const a = document.createElement("a");
  a.className = "dl-card";
  a.href = item.file;
  a.setAttribute("download", "");
  a.setAttribute("aria-label", "Unduh " + item.name);

  const iconWrap = document.createElement("span");
  iconWrap.className = "dl-icon";
  const icon = document.createElement("i");
  icon.className = item.icon || "ri-download-line";
  icon.setAttribute("aria-hidden", "true");
  iconWrap.appendChild(icon);

  const info = document.createElement("span");
  info.className = "dl-info";
  const name = document.createElement("span");
  name.className = "dl-name";
  name.textContent = item.name;
  const meta = document.createElement("span");
  meta.className = "dl-meta";
  meta.textContent = item.meta || "";
  info.append(name, meta);

  const btn = document.createElement("span");
  btn.className = "dl-btn";
  const btnIcon = document.createElement("i");
  btnIcon.className = "ri-download-line";
  btnIcon.setAttribute("aria-hidden", "true");
  btn.appendChild(btnIcon);

  a.append(iconWrap, info, btn);
  return a;
}

function renderDlCards() {
  const grid = document.getElementById("dl-grid");
  if (!grid || grid.children.length) return;
  const frag = document.createDocumentFragment();
  MK_DOWNLOADS.forEach((d) => frag.appendChild(buildDlCard(d)));
  grid.appendChild(frag);
  const count = document.getElementById("dl-count");
  if (count) {
    const n = MK_DOWNLOADS.length;
    // Jangan pakai currentLang di sini — variabel itu dideklarasi di bawah (TDZ)
    // yang bikin seluruh script error & splash stuck. Baca dari localStorage saja.
    let lang = "id";
    try { lang = localStorage.getItem("selected-lang") === "en" ? "en" : "id"; } catch (_) {}
    count.textContent = lang === "en"
      ? n + (n === 1 ? " file" : " files")
      : n + " file";
  }
}

renderDlCards();

/// ============ Music inline player (assets/mix) ============
function formatTime(sec) {
  if (isNaN(sec) || sec === Infinity) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function initMusicPlayers() {
  const cards = document.querySelectorAll(".music-card");
  const feedback = document.querySelector(".music-feedback");
  const mini = document.getElementById("mk-mini");
  const miniCover = mini ? mini.querySelector(".mini-cover") : null;
  const miniTitle = mini ? mini.querySelector(".mini-title") : null;
  const miniArtist = mini ? mini.querySelector(".mini-artist") : null;
  const miniBar = mini ? mini.querySelector(".mini-bar span") : null;
  const miniPlay = mini ? mini.querySelector(".mini-play") : null;
  const miniClose = mini ? mini.querySelector(".mini-close") : null;
  if (!cards.length) return;

  let currentAudio = null;
  let currentCard = null;

  const setFeedback = (msg) => {
    if (!feedback) return;
    feedback.textContent = msg || "";
    if (msg) {
      clearTimeout(feedback._t);
      feedback._t = setTimeout(() => { feedback.textContent = ""; }, 2600);
    }
  };

  const updateProgressUI = (progress, pct) => {
    if (!progress) return;
    const v = Math.max(0, Math.min(100, pct));
    progress.value = String(v);
    progress.style.setProperty("--pct", v + "%");
    progress.setAttribute("aria-valuenow", String(Math.round(v)));
    if (miniBar && currentCard && progress.closest(".music-card") === currentCard) {
      miniBar.style.width = v + "%";
    }
  };

  const showMini = (cardEl) => {
    if (!mini || !cardEl) return;
    const title = cardEl.querySelector(".music-title")?.textContent?.trim() || "—";
    const artist = cardEl.querySelector(".music-artist")?.textContent?.trim() || "Marchell Kevandra";
    const cover = cardEl.querySelector(".music-cover")?.getAttribute("src") || "";
    if (miniTitle) miniTitle.textContent = title;
    if (miniArtist) miniArtist.textContent = artist;
    if (miniCover) { miniCover.src = cover; miniCover.alt = title + " cover"; }
    mini.hidden = false;
    requestAnimationFrame(() => mini.classList.add("is-visible"));
  };
  const hideMini = () => {
    if (!mini) return;
    mini.classList.remove("is-visible");
    setTimeout(() => { if (!mini.classList.contains("is-visible")) mini.hidden = true; }, 380);
  };
  const syncMiniIcon = (playing) => {
    if (!miniPlay) return;
    const ic = miniPlay.querySelector("i");
    if (ic) ic.className = playing ? "ri-pause-fill" : "ri-play-fill";
    miniPlay.setAttribute("aria-label", playing ? "Jeda" : "Putar");
  };

  cards.forEach((cardEl) => {
    const audio = cardEl.querySelector("audio");
    const btn = cardEl.querySelector(".music-play");
    const progress = cardEl.querySelector(".music-progress");
    const timeEl = cardEl.querySelector(".music-time");
    const durEl = cardEl.querySelector(".music-duration");
    const retry = cardEl.querySelector(".music-retry");
    const icon = btn ? btn.querySelector("i") : null;
    if (!audio || !btn || !progress) return;

    const title = cardEl.querySelector(".music-title")?.textContent?.trim() || "Lagu";
    const coverSrc = cardEl.querySelector(".music-cover")?.getAttribute("src") || "";

    const setIcon = (playing) => {
      if (!icon) return;
      icon.className = playing ? "ri-pause-fill" : "ri-play-fill";
      btn.setAttribute("aria-label", (playing ? "Pause " : "Play ") + title);
      cardEl.setAttribute("aria-label", (playing ? "Pause " : "Play ") + title);
    };

    const enableProgress = () => {
      progress.disabled = false;
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
    };

    const markLoaded = () => {
      cardEl.classList.remove("is-loading");
      cardEl.classList.add("is-loaded");
      cardEl.classList.remove("is-error");
      if (retry) retry.hidden = true;
      if (!isNaN(audio.duration) && audio.duration) enableProgress();
      if (durEl) durEl.textContent = formatTime(audio.duration);
    };
    const markError = () => {
      cardEl.classList.remove("is-loading");
      cardEl.classList.add("is-error");
      cardEl.classList.remove("playing");
      setIcon(false);
      progress.disabled = true;
      if (retry) retry.hidden = false;
      setFeedback("Gagal memuat " + title);
    };

    audio.addEventListener("loadedmetadata", markLoaded);
    audio.addEventListener("canplay", markLoaded);
    audio.addEventListener("canplaythrough", markLoaded);

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      updateProgressUI(progress, pct);
      if (timeEl) timeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
      cardEl.classList.remove("playing");
      setIcon(false);
      syncMiniIcon(false);
      updateProgressUI(progress, 0);
      if (timeEl) timeEl.textContent = "00:00";
      if (miniBar) miniBar.style.width = "0%";
      if (currentAudio === audio) {
        // keep mini visible paused state, user can close manually
      }
      setFeedback(title + " selesai");
    });

    audio.addEventListener("error", markError);
    // also handle cover image error -> fallback skeleton hide
    const cov = cardEl.querySelector(".music-cover");
    if (cov) {
      cov.addEventListener("error", () => {
        cov.style.background = "#e8e8e8";
      });
      if (cov.complete && cov.naturalWidth) {
        // cover already loaded, remove skeleton after short delay if audio also ready
        setTimeout(() => { if (!cardEl.classList.contains("is-error")) { cardEl.classList.remove("is-loading"); } }, 400);
      }
    }

    if (retry) {
      retry.addEventListener("click", (e) => {
        e.stopPropagation();
        retry.hidden = true;
        cardEl.classList.remove("is-error");
        cardEl.classList.add("is-loading");
        setFeedback("Memuat ulang " + title + "…");
        try { audio.load(); } catch(_) {}
        // try play after reload if was current
        setTimeout(() => {
          audio.play().catch(() => {
            cardEl.classList.remove("is-loading");
            cardEl.classList.add("is-error");
            if (retry) retry.hidden = false;
          });
        }, 300);
      });
    }

    // seek via range input
    progress.addEventListener("input", () => {
      const pct = parseFloat(progress.value) || 0;
      progress.style.setProperty("--pct", pct + "%");
      if (miniBar && cardEl === currentCard) miniBar.style.width = pct + "%";
      if (timeEl && audio.duration) {
        const t = (pct / 100) * audio.duration;
        timeEl.textContent = formatTime(t);
      }
    });
    progress.addEventListener("change", () => {
      const pct = parseFloat(progress.value) || 0;
      if (audio.duration) audio.currentTime = (pct / 100) * audio.duration;
    });

    const toggle = (e) => {
      if (e) e.stopPropagation();
      if (cardEl.classList.contains("is-error") && retry && !retry.hidden) {
        retry.click();
        return;
      }
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        if (currentCard) {
          currentCard.classList.remove("playing");
          const ic = currentCard.querySelector(".music-play i");
          if (ic) ic.className = "ri-play-fill";
        }
      }
      if (audio.paused) {
        const p = audio.play();
        if (p && p.catch) {
          p.catch(() => {
            // autoplay block or not ready
            cardEl.classList.add("is-error");
            if (retry) retry.hidden = false;
            setFeedback("Ketuk lagi untuk memutar " + title);
          });
        }
        cardEl.classList.add("playing");
        cardEl.classList.remove("is-loading");
        setIcon(true);
        syncMiniIcon(true);
        showMini(cardEl);
        currentAudio = audio;
        currentCard = cardEl;
        enableProgress();
        setFeedback("Memutar — " + title);
      } else {
        audio.pause();
        cardEl.classList.remove("playing");
        setIcon(false);
        syncMiniIcon(false);
        setFeedback("Dijeda — " + title);
        // keep mini visible in paused state
      }
    };

    btn.addEventListener("click", toggle);
    cardEl.addEventListener("click", (e) => {
      if (e.target.closest(".music-progress") || e.target.closest(".music-retry") || e.target.closest("a")) return;
      if (e.target.closest(".music-play")) return;
      toggle(e);
    });
    cardEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(e);
      }
    });
    updateProgressUI(progress, 0);
    // if metadata already available (cached)
    if (!isNaN(audio.duration) && audio.duration) markLoaded();
  });

  // mini controls
  if (miniPlay) {
    miniPlay.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!currentAudio || !currentCard) return;
      const btn = currentCard.querySelector(".music-play");
      if (btn) btn.click();
    });
  }
  if (miniClose) {
    miniClose.addEventListener("click", (e) => {
      e.stopPropagation();
      if (currentAudio) { try { currentAudio.pause(); } catch(_) {} }
      if (currentCard) {
        currentCard.classList.remove("playing");
        const ic = currentCard.querySelector(".music-play i");
        if (ic) ic.className = "ri-play-fill";
        syncMiniIcon(false);
      }
      hideMini();
      currentAudio = null;
      currentCard = null;
      setFeedback("Player ditutup");
    });
  }
  if (mini) {
    mini.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      // tap mini -> go to music tab
      if (typeof switchSection === "function") switchSection("#music");
      else {
        const sec = document.querySelector("#music");
        if (sec) performSwitch("#music");
      }
    });
  }

  // Bar di samping nama header: hanya tampil saat ada lagu yang diputar.
  // CSS yang menampilkan: .card[data-state="#music"].is-active.is-playing .name-bars
  const cardRoot = document.querySelector(".card");
  const syncCardPlaying = () => {
    if (!cardRoot) return;
    cardRoot.classList.toggle("is-playing", !!document.querySelector(".music-card.playing"));
  };
  const grid = document.getElementById("music-grid");
  if (grid && typeof MutationObserver !== "undefined") {
    new MutationObserver(syncCardPlaying).observe(grid, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }
  syncCardPlaying();

  // global helper dipakai oleh tab switch untuk pause via close saja (tidak auto pause)
  window.__mkPauseAllMusic = pauseAllMusicDOM;
  window.__mkMini = { showMini, hideMini, syncMiniIcon };
}

document.addEventListener("DOMContentLoaded", initMusicPlayers);

/// ============ 3D tilt effect ============
const tiltCard = () => {
  const cardBody = document.querySelector(".card");
  const maxTilt = 6;
  let raf = null;

  document.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 768) return;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const rect = cardBody.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        cardBody.style.transform = "";
        return;
      }
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      cardBody.style.transform =
        `perspective(900px) rotateX(${(-y * maxTilt).toFixed(2)}deg) ` +
        `rotateY(${(x * maxTilt).toFixed(2)}deg)`;
    });
  });
};

/// ============ Avatar heart burst ============
function burstHearts(x, y) {
  const colors = ["#a855f7", "#d946ef", "#8b5cf6", "#f0abfc"];
  const icons = ["ri-heart-3-fill", "ri-heart-fill", "ri-heart-2-fill", "ri-sparkling-2-fill"];

  for (let i = 0; i < 16; i++) {
    const el = document.createElement("i");
    el.className = `mk-heart-particle ri ${icons[i % icons.length]}`;
    el.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: ${Math.random() * 14 + 10}px;
      color: ${colors[i % colors.length]};
      transform: translate(-50%, -50%);
      animation-duration: ${(Math.random() * 0.7 + 0.5).toFixed(2)}s;
    `;
    const angle = (Math.PI * 2 * i) / 16;
    const dist = Math.random() * 90 + 50;
    el.style.setProperty("--dx", `${(Math.cos(angle) * dist).toFixed(1)}px`);
    el.style.setProperty("--dy", `${(Math.sin(angle) * dist - 30).toFixed(1)}px`);
    el.style.setProperty("--s", (Math.random() * 0.6 + 0.5).toFixed(2));
    el.style.setProperty("--r", `${Math.round(Math.random() * 360 - 180)}deg`);
    el.classList.add("burst");
    document.body.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

function mkImageTouch() {
  const avatar = document.querySelector(".card-avatar");
  if (!avatar) return;
  const rect = avatar.getBoundingClientRect();
  burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);

  avatar.classList.remove("avatar-pop");
  void avatar.offsetWidth; // force reflow agar animasi bisa diputar ulang
  avatar.classList.add("avatar-pop");
}

/// ============ Theme toggle ============
const themeButton = document.getElementById("theme-button");
const lightTheme = "light-theme";
const iconTheme = "ri-sun-line";
const savedTheme = localStorage.getItem("selected-theme");
const savedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () => (document.body.classList.contains(lightTheme) ? "light" : "dark");
const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? "ri-sun-line" : "ri-moon-line");

if (savedTheme) {
  document.body.classList[savedTheme === "light" ? "add" : "remove"](lightTheme);
  themeButton.classList[savedIcon === "ri-sun-line" ? "add" : "remove"](iconTheme);
} else {
  // default baru: light saat pertama diakses (belum ada pilihan tersimpan)
  document.body.classList.add(lightTheme);
  themeButton.classList.add(iconTheme);
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(lightTheme);
  themeButton.classList.toggle(iconTheme);
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());

  themeButton.classList.remove("spin");
  void themeButton.offsetWidth; // force reflow agar animasi bisa diputar ulang
  themeButton.classList.add("spin");
  menuWrap.classList.remove("open");
});

themeButton.addEventListener("animationend", () => themeButton.classList.remove("spin"));

/// ============ Header menu ============
const menuWrap = document.getElementById("menu-wrap");
const menuButton = document.getElementById("menu-button");

if (menuButton && menuWrap) {
  menuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    menuWrap.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!menuWrap.contains(e.target)) menuWrap.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menuWrap.classList.remove("open");
  });
}

/// ============ Language toggle (ID/EN) ============
const I18N = {
  id: {
    homeQuote:
      "Tak perlu menjadi serba bisa, Tekuni salah satu bidang yang Kamu suka Dan menjadi hebat lah dengannya.",
    homeEyebrow: "Tersedia untuk kerja • Jakarta",
    homeStat1: "Tahun fokus",
    homeStat2: "Tools",
    homeStat3: "Bilingual",
    homeGhost: "Lihat Profil",
    btnStart: "Mulai",
    tabHome: "Home",
    tabProfile: "Profil",
    tabTools: "Tools",
    tabGallery: "Galeri",
    tabContact: "Kontak",
    tabMore: "More",
    addrTitle: "Alamat",
    addrDesc: "Jakarta, Indonesia",
    addrMeta: "GMT+7 · Jakarta Selatan",
    hobbyTitle: "Hobi",
    hobbyDesc: "Coding",
    hobbyMeta: "Ngoprek tiap malam · suka hal kecil yang rapi",
    focusTitle: "Fokus",
    focusDesc: "Data Analyst & Social Engineering",
    focusMeta: "Open buat projek & kolab",
    aboutText: "Saya Marchell, seorang technology enthusiast yang memiliki ketertarikan pada data, pemrograman, dan pengembangan berbagai tools yang dapat memberikan manfaat nyata.",
    statYears: "Tahun ngulik",
    statTools: "Tools jadi",
    statTracks: "Lagu rilis",
    nowTitle: "Sedang Fokus",
    nowLearn: "Belajar Python buat analisis data",
    nowBuild: "Ngerapihin VanzTrace & VanzMap",
    nowListen: "Muter-muter “Stay With Me”",
    availText: "Open freelance & kolab • balas < sehari",
    skillsTitle: "Keahlian",
    techTitle: "Tech Stack",
    toolsTitle: "Tools Saya",
    toolsSub: "Web tools berguna yang kubuat untukmu",
    toolTiktok: "Unduh video tanpa watermark",
    toolApp: "Cari & unduh aplikasi",
    toolWrite: "Editor teks seperti Word",
    toolPrompt: "Kumpulan prompt AI untuk pasangan",
    toolLove: "Tools romantis untuk pasangan",
    toolMap: "Eksplorasi peta mewah",
    toolLacak: "Intelijen nomor telepon",
    galleryTitle: "Galeri",
    gallerySub: "Momen & kenangan",
    capBg: "Latar Vanz",
    capAvatar: "Avatar",
    capLogo: "Logo",
    capMoment: "Momen",
    capMemory: "Kenangan",
    capVibes: "Vibes",
    capChill: "Santai",
    capGold: "Berharga",
    capBest: "Terbaik",
    capNight: "Malam",
    contactTitle: "Hubungi Saya",
    contactSub: "Terbuka untuk peluang baru",
    contactNote: "DM saya — biasanya balas dalam sehari",
    musicTitle: "Music",
    musicSub: "Karya & produksi saya",
    musicNote: "Dengarkan lebih banyak di SoundCloud",
    musicIntro: "Pilih lagu. Nikmati suasananya.",
    musicCollection: "Koleksi pribadi",
    musicCount: "4 lagu",
    musicRetry: "Coba lagi",
    downloadTitle: "Download",
    downloadSub: "Kumpulan file",
    dlCollection: "Koleksi file",
    dlCount: "3 file",
    dlNote: "Ketuk untuk mengunduh langsung.",
    moreTitle: "More",
    moreSub: "Jelajahi lebih banyak",
    moreNote: "Temukan lebih banyak link & info di sini.",
    moreLinks: "Link cepat",
    moreFoot: "v2.4 • Jakarta • GMT+7",
    moreHome: "Homepage",
    moreHomeDesc: "Kembali ke halaman utama",
    moreGithubDesc: "Lihat project open source",
    moreEmailDesc: "Hubungi via email",
    menuTheme: "Tema",
    langsTitle: "Bahasa",
    langIndo: "Indonesia",
    langIndoLevel: "Lancar",
    langEng: "Inggris",
    langEngLevel: "Menengah",
    btnCv: "Unduh CV",
    loaderHello: "Selamat Datang",
    loaderTag: "Mari berkenalan lebih dekat",
    gateTitle: "Area Terkunci",
    gateDesc: "Masukkan password untuk membuka {name}.",
    gateUnlock: "Buka",
    gateError: "Password salah, coba lagi.",
  },
  en: {
    homeQuote:
      "You don't need to be good at everything, Master one field you love and become great at it.",
    homeEyebrow: "Available for work • Jakarta",
    homeStat1: "Years focus",
    homeStat2: "Tools",
    homeStat3: "Bilingual",
    homeGhost: "View Profile",
    btnStart: "Get Started",
    tabHome: "Home",
    tabProfile: "Profile",
    tabTools: "Tools",
    tabGallery: "Gallery",
    tabContact: "Contact",
    tabMore: "More",
    addrTitle: "Address",
    addrDesc: "Jakarta, Indonesia",
    addrMeta: "GMT+7 · South Jakarta",
    hobbyTitle: "Hobby",
    hobbyDesc: "Coding",
    hobbyMeta: "Tinkering nightly · into small neat details",
    focusTitle: "Focus On",
    focusDesc: "Data Analyst & Social Engineering",
    focusMeta: "Open for projects & collabs",
    aboutText: "I'm Marchell — Jakarta kid who stays up late digging into data, coding, and building tools people actually use. Not good at everything, but what I pick up I take all the way.",
    statYears: "Years tinkering",
    statTools: "Tools shipped",
    statTracks: "Tracks out",
    nowTitle: "Learning now",
    nowLearn: "Learning Python for data analysis",
    nowBuild: "Polishing VanzTrace & VanzMap",
    nowListen: "On repeat: “Stay With Me”",
    availText: "Open for freelance & collabs • replies < a day",
    skillsTitle: "Skills",
    techTitle: "Tech Stack",
    toolsTitle: "My Tools",
    toolsSub: "Handy web tools I built for you",
    toolTiktok: "Download videos without watermark",
    toolApp: "Search & download apps",
    toolWrite: "Word-like text editor",
    toolPrompt: "AI prompts collection for couples",
    toolLove: "Romantic tools for couples",
    toolMap: "Map explorer",
    toolLacak: "Phone intelligence",
    galleryTitle: "Gallery",
    gallerySub: "Moments & memories",
    capBg: "Vanz Background",
    capAvatar: "Avatar",
    capLogo: "Logo",
    capMoment: "Moment",
    capMemory: "Memory",
    capVibes: "Vibes",
    capChill: "Chill",
    capGold: "Precious",
    capBest: "Favorite",
    capNight: "Night",
    contactTitle: "Get In Touch",
    contactSub: "I'm open for new opportunities",
    contactNote: "DM me — usually reply within a day",
    musicTitle: "Music",
    musicSub: "My works & productions",
    musicNote: "Listen more on SoundCloud",
    musicIntro: "Pick a track. Enjoy the vibe.",
    musicCollection: "Personal collection",
    musicCount: "4 tracks",
    musicRetry: "Retry",
    downloadTitle: "Download",
    downloadSub: "File collection",
    dlCollection: "File collection",
    dlCount: "3 files",
    dlNote: "Tap to download directly.",
    moreTitle: "More",
    moreSub: "Explore more",
    moreNote: "Find more links & info here.",
    moreLinks: "Quick links",
    moreFoot: "v2.4 • Jakarta • GMT+7",
    moreHome: "Homepage",
    moreHomeDesc: "Back to main page",
    moreGithubDesc: "View open source projects",
    moreEmailDesc: "Contact via email",
    menuTheme: "Theme",
    langsTitle: "Languages",
    langIndo: "Indonesia",
    langIndoLevel: "Native",
    langEng: "English",
    langEngLevel: "Intermediate",
    btnCv: "Download CV",
    loaderHello: "Welcome",
    loaderTag: "Let's get to know each other",
    gateTitle: "Locked Area",
    gateDesc: "Enter the password to open {name}.",
    gateUnlock: "Unlock",
    gateError: "Wrong password, try again.",
  },
};

const langButton = document.getElementById("lang-button");
const savedLang = localStorage.getItem("selected-lang");
let currentLang = savedLang === "en" ? "en" : "id";

function applyLanguage(lang) {
  const dict = I18N[lang];
  if (!dict) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.documentElement.setAttribute("lang", lang);
  if (langButton) langButton.textContent = lang === "id" ? "ID" : "EN";
  localStorage.setItem("selected-lang", lang);
  currentLang = lang;
  // Header ikut bahasa aktif kalau lagi di tab More/Music/Gallery/Contact/Download
  try {
    const st = document.querySelector(".card")?.getAttribute("data-state") || "#home";
    syncHeaderText(st);
  } catch (_) {}
  // Sinkron jumlah file download dengan bahasa aktif
  try {
    const count = document.getElementById("dl-count");
    if (count && typeof MK_DOWNLOADS !== "undefined") {
      const n = MK_DOWNLOADS.length;
      count.textContent = lang === "en"
        ? n + (n === 1 ? " file" : " files")
        : n + " file";
    }
  } catch (_) {}
}

if (langButton) {
  langButton.addEventListener("click", () => {
    applyLanguage(currentLang === "id" ? "en" : "id");
    menuWrap.classList.remove("open");
  });
}

applyLanguage(currentLang);

/// ============ Password gate — semua kartu Tools ============
// Hanya hash SHA-256 yang disimpan, password asli tidak ada di kode.
const MK_GATE_HASH = "184e36407045c9ccdb0ae137061d0e567e557369ea73321b20404dd0c79f2b1b";
const MK_GATE_KEY = "mk_tools_unlocked";
let mkGateTarget = null;

async function mkGateHash(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function mkGateDesc(name) {
  const tpl =
    (typeof I18N !== "undefined" && I18N[currentLang]?.gateDesc) ||
    "Masukkan password untuk membuka {name}.";
  return tpl.replace("{name}", name || "Tools");
}

function openGate(url, name) {
  mkGateTarget = url;
  const gate = document.getElementById("mk-gate");
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-error");
  const desc = document.getElementById("gate-desc");
  if (!gate || !input) { window.open(url, "_blank", "noopener"); return; }
  if (desc) desc.textContent = mkGateDesc(name);
  if (err) err.hidden = true;
  input.value = "";
  gate.hidden = false;
  requestAnimationFrame(() => gate.classList.add("show"));
  setTimeout(() => input.focus(), 60);
}

function closeGate() {
  const gate = document.getElementById("mk-gate");
  if (!gate) return;
  gate.classList.remove("show");
  setTimeout(() => { gate.hidden = true; }, 220);
  mkGateTarget = null;
}

async function submitGate() {
  const input = document.getElementById("gate-input");
  const err = document.getElementById("gate-error");
  const card = document.querySelector(".gate-card");
  const val = (input?.value || "").trim();
  if (!val) { input?.focus(); return; }
  let hex = "";
  try {
    hex = await mkGateHash(val);
  } catch (_) {
    if (err) { err.textContent = "Browser tidak mendukung verifikasi aman."; err.hidden = false; }
    return;
  }
  if (hex === MK_GATE_HASH) {
    try { sessionStorage.setItem(MK_GATE_KEY, "1"); } catch (_) {}
    const url = mkGateTarget;
    if (input) input.value = "";
    closeGate();
    if (url) window.open(url, "_blank", "noopener");
  } else {
    if (err) {
      err.textContent = (typeof I18N !== "undefined" && I18N[currentLang]?.gateError) || "Password salah, coba lagi.";
      err.hidden = false;
    }
    if (card) {
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
    }
    if (input) { input.value = ""; input.focus(); }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a.tool-card[href]').forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const url = el.getAttribute("href");
      const name = el.querySelector(".tool-name")?.textContent?.trim() || "Tools";
      try {
        if (sessionStorage.getItem(MK_GATE_KEY) === "1") window.open(url, "_blank", "noopener");
        else openGate(url, name);
      } catch (_) { openGate(url, name); }
    });
  });
  document.getElementById("gate-submit")?.addEventListener("click", submitGate);
  document.querySelector(".gate-close")?.addEventListener("click", closeGate);
  document.getElementById("gate-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitGate();
  });
  document.getElementById("mk-gate")?.addEventListener("click", (e) => {
    if (e.target.id === "mk-gate") closeGate();
  });
  document.addEventListener("keydown", (e) => {
    const gate = document.getElementById("mk-gate");
    if (e.key === "Escape" && gate && !gate.hidden) closeGate();
  });
});

/// ============ Link functions ============
function mkFacebook() {
  window.location.replace("https://www.facebook.com/marchel.ganz");
}
function mkInstagram() {
  window.location.replace("https://www.instagram.com/chellgnzxz_");
}
function mkTiktok() {
  window.location.replace("https://www.tiktok.com/mkxchl");
}
function mkSoundcloud() {
  window.location.replace("https://soundcloud.com/marchellkevandra");
}

/// ============ Gallery lightbox ============
function openLightbox(src, alt) {
  const box = document.getElementById("mk-lightbox");
  const img = box.querySelector("img");
  img.src = src;
  img.alt = alt || "";
  box.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const box = document.getElementById("mk-lightbox");
  box.classList.remove("show");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("mk-lightbox");
  if (!box) return;
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.closest(".ri-close-line")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});

function mkGalleryClick(e) {
  const item = e.currentTarget;
  const img = item.querySelector("img");
  if (img) openLightbox(img.src, img.alt);
}

// Gallery bisa dibuka pakai keyboard (Enter/Spasi) + terbaca screen reader
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    const label =
      item.querySelector(".gallery-cap span")?.textContent?.trim() ||
      item.querySelector("img")?.alt ||
      "Foto";
    item.setAttribute("aria-label", "Lihat " + label);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const img = item.querySelector("img");
        if (img) openLightbox(img.src, img.alt);
      }
    });
  });
});

// Contact bisa dibuka pakai keyboard (Enter/Spasi) — vestibule a11y gallery
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".contact-card").forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });
});

/// ============ Misc (guarded) ============
function playMyAudio() {
  const audio = document.getElementById("myAudio");
  if (audio && typeof audio.play === "function") {
    audio.play();
  }
}

/// ============ Splash loader ============
const mkLoader = document.getElementById("mk-loader");
const loaderBody = document.body;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// SATU elemen avatar dipakai dua peran: logo splash lalu avatar kartu.
let splashAvatar = null;

function setupSplashAvatar() {
  const wrap = document.querySelector(".card-avatar-wrap");
  const inner = document.querySelector(".loader-inner");
  const header = document.querySelector(".card-header");
  if (!wrap || !inner || !header) return;

  // Ukur target saat kartu masih DIAM (belum card-in), lalu simpan
  const r = wrap.getBoundingClientRect();

  splashAvatar = {
    wrap,
    img: wrap.querySelector(".card-avatar"),
    header,
    tx: r.left + r.width / 2,
    ty: r.top + r.height / 2,
    tw: r.width,
  };

  // Pindahkan avatar ke loader sebagai logo splash (bukan gambar duplikat)
  inner.appendChild(wrap);
  wrap.classList.add("splash");
}

function restoreAvatar(pop) {
  if (!splashAvatar) return;
  const { wrap, img, header } = splashAvatar;

  // Kembalikan avatar ke tempat asalnya di header kartu
  header.appendChild(wrap);
  wrap.classList.remove("splash");
  wrap.style.transform = "";
  wrap.style.opacity = "";
  wrap.style.transition = "";
  wrap.style.boxShadow = "";

  if (pop) {
    img.style.animationDelay = "0s";
    img.classList.add("avatar-in");
    img.addEventListener("animationend", function handler(e) {
      if (e.target !== img) return;
      img.classList.remove("avatar-in");
      img.removeEventListener("animationend", handler);
    });
  }
}

function hideLoader(callback) {
  if (!mkLoader) {
    if (callback) callback();
    return;
  }

  loaderBody.classList.add("loader-lock");

  if (prefersReduced) {
    setTimeout(() => {
      restoreAvatar();
      mkLoader.classList.add("done", "finished");
      loaderBody.classList.remove("loader-lock");
      if (callback) callback();
    }, 300);
    return;
  }

  setTimeout(() => {
    if (!splashAvatar) {
      mkLoader.classList.add("done");
      setTimeout(() => {
        mkLoader.classList.add("finished");
        loaderBody.classList.remove("loader-lock");
        if (callback) callback();
      }, 460);
      return;
    }

    const { wrap, tx, ty, tw } = splashAvatar;

    // KARTU MEMBUKA + loader card keluar, sinkron premium
    cardEntrance();
    mkLoader.classList.add("done");

    const wr = wrap.getBoundingClientRect();
    const dx = tx - (wr.left + wr.width / 2);
    const dy = ty - (wr.top + wr.height / 2);
    const scale = tw / wr.width;

    // Avatar terbang dari splash ke kartu (smooth 1.2s)
    wrap.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    wrap.style.opacity = "0";

    try {
      if (callback) callback();
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      restoreAvatar(true);
      mkLoader.classList.add("finished");
      loaderBody.classList.remove("loader-lock");
    }, 1180);
  }, 1050);
}

/// ============ Init ============
window.addEventListener("DOMContentLoaded", () => {
  try { createStars(); } catch (e) { console.error(e); }
  try { setupSplashAvatar(); } catch (e) { console.error(e); }
  try { hideLoader(contentIntro); } catch (e) {
    console.error(e);
    // Failsafe: jangan biarkan splash mengunci layar
    document.getElementById("mk-loader")?.classList.add("done", "finished");
    document.body.classList.remove("loader-lock");
  }
  try { tiltCard(); } catch (e) { console.error(e); }
});

// Failsafe global: paksa tutup splash setelah 4 detik kalau masih nyangkut
// (misal ada error di modul lain / gambar gagal load / JS tambahan error).
setTimeout(() => {
  const loader = document.getElementById("mk-loader");
  if (loader && !loader.classList.contains("finished")) {
    try { restoreAvatar(false); } catch (_) {}
    loader.classList.add("done", "finished");
    document.body.classList.remove("loader-lock");
  }
}, 4000);