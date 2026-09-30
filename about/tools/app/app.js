/* ============================================================
   App Downloader — cari & unduh aplikasi iOS / Android
   API:
   - iOS:     https://itunes.apple.com/search  (App Store, publik)
   - Android: https://f-droid.org/api/v1/search (F-Droid, sumber terbuka)
   APK diunduh langsung dari repositori resmi F-Droid.
   ============================================================ */

"use strict";

const ITUNES_URL = "https://itunes.apple.com/search";
const FDROID_SEARCH_URL = "https://f-droid.org/api/v1/search";
const FDROID_APK_URL = "https://f-droid.org/apk/";

let platform = "ios";
let currentQuery = "";

/* ---------- Custom alert modal ---------- */
function showAlert(message, type = "error") {
  const modal = document.getElementById("customAlert");
  const box = document.getElementById("alertBox");
  const icon = document.getElementById("alertIcon");
  const title = document.getElementById("alertTitle");
  const msg = document.getElementById("alertMessage");
  const actions = document.getElementById("alertActions");

  icon.className = "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg";
  actions.innerHTML = "";

  if (type === "error") {
    icon.classList.add("bg-[#EE1D52]/20", "text-[#EE1D52]");
    title.innerText = "Oops!";
    icon.innerHTML = '<i class="bx bx-error-circle text-3xl"></i>';
    actions.innerHTML = `<button onclick="closeAlert()" class="btn btn-primary w-full">Mengerti</button>`;
  } else {
    icon.classList.add("bg-emerald-500/20", "text-emerald-400");
    title.innerText = "Berhasil";
    icon.innerHTML = '<i class="bx bx-check-circle text-3xl"></i>';
    actions.innerHTML = `<button onclick="closeAlert()" class="btn btn-primary w-full">Keren!</button>`;
  }

  msg.innerText = message;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  setTimeout(() => {
    modal.classList.add("opacity-100");
    box.classList.remove("scale-90");
    box.classList.add("scale-100");
  }, 10);
}

function closeAlert() {
  const modal = document.getElementById("customAlert");
  const box = document.getElementById("alertBox");
  modal.classList.remove("opacity-100");
  modal.classList.remove("flex");
  box.classList.remove("scale-100");
  box.classList.add("scale-90");
  setTimeout(() => modal.classList.add("hidden"), 300);
}

/* ---------- Format bantuan ---------- */
function formatBytes(bytes) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return (mb / 1024).toFixed(1) + " GB";
  if (mb >= 1) return Math.round(mb) + " MB";
  return Math.round(bytes / 1024) + " KB";
}

function formatRatingCount(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "J";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

/* ---------- Pilih platform ---------- */
function setPlatform(p) {
  platform = p;
  document.getElementById("platIos").classList.toggle("on", p === "ios");
  document.getElementById("platAndroid").classList.toggle("on", p === "android");
  document.getElementById("sourceHint").innerHTML =
    p === "ios"
      ? '<i class="bx bxl-apple text-purple-300"></i> iOS · App Store — sumber resmi iTunes'
      : '<i class="bx bxl-android text-emerald-400"></i> Android · F-Droid — repositori aplikasi sumber terbuka';
  hideResult();
}

function hideResult() {
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("appList").innerHTML = "";
}

/* ---------- Pencarian API ---------- */
async function searchItunes(q) {
  const url = `${ITUNES_URL}?term=${encodeURIComponent(q)}&country=id&entity=software&limit=12`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("iTunes error");
    const json = await res.json();
    return (json.results || []).map((app) => ({
      id: String(app.trackId),
      name: app.trackName || "Tanpa nama",
      dev: app.artistName || "Unknown",
      icon: app.artworkUrl100 || "",
      rating: app.averageUserRating ? app.averageUserRating.toFixed(1) : null,
      ratingCount: app.userRatingCount || 0,
      size: formatBytes(app.fileSizeBytes),
      version: app.version || null,
      category: app.primaryGenreName || "Lainnya",
      price: app.formattedPrice || "Gratis",
      url: app.trackViewUrl,
      source: "ios"
    }));
  } finally {
    clearTimeout(timer);
  }
}

async function searchFdroid(q) {
  const url = `${FDROID_SEARCH_URL}?q=${encodeURIComponent(q)}&lang=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("F-Droid error");
  const json = await res.json();
  return (Array.isArray(json) ? json : [])
    .slice(0, 12)
    .map((app) => ({
      id: app.packageName,
      name: app.name || "Tanpa nama",
      dev: app.summary || "Open Source",
      icon: app.icon || "",
      rating: null,
      ratingCount: 0,
      size: null,
      version: app.suggestedVersionName || null,
      category: "Open Source",
      price: "Gratis",
      url: `${FDROID_APK_URL}${app.packageName}/`,
      source: "android"
    }));
}

/* ---------- Render hasil ---------- */
function renderResults(apps) {
  const list = document.getElementById("appList");
  const box = document.getElementById("resultBox");
  const count = document.getElementById("resultCount");

  list.innerHTML = "";
  if (!apps.length) {
    box.classList.remove("hidden");
    count.innerText = "0 hasil";
    list.innerHTML = `
      <div class="glass p-10 text-center">
        <i class="bx bx-search-alt-2 text-5xl text-purple-400/40"></i>
        <p class="mt-4 font-bold text-neutral-100">Tidak ada aplikasi ditemukan</p>
        <p class="muted mt-1 text-sm">Coba kata kunci lain atau ganti platform.</p>
      </div>`;
    return;
  }

  box.classList.remove("hidden");
  count.innerText = `${apps.length} aplikasi ditemukan`;

  apps.forEach((app, i) => {
    const card = document.createElement("div");
    card.className = "app-card glass lift grad-border";
    card.style.animationDelay = `${i * 0.06}s`;

    const badge =
      app.source === "ios"
        ? '<span class="app-badge ios"><i class="bx bxl-apple"></i> iOS</span>'
        : '<span class="app-badge android"><i class="bx bxl-android"></i> Android</span>';

    const meta = [];
    if (app.rating)
      meta.push(
        `<span class="inline-flex items-center gap-1 font-bold"><i class="bx bxs-star rating-star"></i>${app.rating}</span>` +
          (app.ratingCount ? `<span class="text-neutral-500">(${formatRatingCount(app.ratingCount)})</span>` : "")
      );
    if (app.size) meta.push(`<span><i class="bx bx-hdd text-purple-300"></i> ${app.size}</span>`);
    if (app.version) meta.push(`<span><i class="bx bx-package text-purple-300"></i> v${app.version}</span>`);
    meta.push(`<span class="price-free"><i class="bx bx-dollar-circle"></i> ${app.price}</span>`);

    const btnClass = app.source === "ios" ? "btn-ios" : "btn-android";
    const btnLabel = app.source === "ios" ? "Buka App Store" : "Unduh APK";
    const btnIcon = app.source === "ios" ? "bx-link-external" : "bx-download";

    card.innerHTML = `
      <img src="${app.icon}" alt="${app.name}" class="app-icon"
        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2214%22 fill=%22%23271943%22/%3E%3Ctext x=%2232%22 y=%2242%22 font-size=%2226%22 text-anchor=%22middle%22 fill=%22%23a855f7%22 font-family=%22sans-serif%22 font-weight=%22bold%22>${(app.name || "?").charAt(0).toUpperCase()}</text>%3C/svg%3E'" />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="text-white font-bold text-sm truncate">${app.name}</h3>
          ${badge}
        </div>
        <p class="muted text-xs truncate mt-0.5">${app.dev}</p>
        <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] muted">
          ${meta.join("")}
        </div>
      </div>
      <a href="${app.url}" target="_blank" rel="noopener" class="btn ${btnClass} !px-5 !py-2.5 !text-xs shrink-0"
        data-magnetic>
        <i class="bx ${btnIcon} text-base leading-none"></i> ${btnLabel}
      </a>`;

    list.appendChild(card);
  });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(() => {
      list.querySelectorAll("[data-magnetic]").forEach(attachMagnetic);
    });
  }
}

/* ---------- Riwayat pencarian (localStorage) ---------- */
function escJs(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

function saveHistory(query) {
  const key = `appdl_${platform}_history`;
  let history = JSON.parse(localStorage.getItem(key) || "[]");
  history = history.filter((h) => h.q.toLowerCase() !== query.toLowerCase());
  history.unshift({ q: query, platform, date: new Date().toLocaleDateString("id-ID") });
  localStorage.setItem(key, JSON.stringify(history.slice(0, 6)));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  const sec = document.getElementById("historySection");
  let history = [];
  ["ios", "android"].forEach((p) => {
    history = history.concat(JSON.parse(localStorage.getItem(`appdl_${p}_history`) || "[]"));
  });
  history = history.slice(0, 6);

  if (!history.length) {
    sec.classList.add("hidden");
    return;
  }
  sec.classList.remove("hidden");
  list.innerHTML = history
    .map(
      (item) => `
      <div onclick="reSearch('${escJs(item.q)}')"
        class="glass lift grad-border p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition group">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
          item.platform === "ios"
            ? "bg-purple-600/15 text-purple-400 border border-purple-500/25"
            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
        }">
          <i class="bx ${item.platform === "ios" ? "bxl-apple" : "bxl-android"}"></i>
        </div>
        <div class="flex-1 text-left overflow-hidden">
          <p class="text-white font-bold text-xs truncate">${item.q}</p>
          <p class="text-[9px] text-purple-400 uppercase font-bold tracking-widest mt-1">${
            item.platform === "ios" ? "iOS · App Store" : "Android · F-Droid"
          } · ${item.date}</p>
        </div>
        <button onclick="event.stopPropagation(); deleteHistoryItem('${escJs(item.q)}', '${item.platform}')"
          class="p-2 text-neutral-600 hover:text-rose-400 transition shrink-0" aria-label="Hapus riwayat">
          <i class="bx bx-trash text-base"></i>
        </button>
        <i class="bx bx-chevron-right text-lg text-neutral-600 group-hover:text-purple-400 transition shrink-0"></i>
      </div>`
    )
    .join("");
}

function deleteHistoryItem(q, p) {
  const key = `appdl_${p}_history`;
  let history = JSON.parse(localStorage.getItem(key) || "[]");
  history = history.filter((h) => h.q !== q);
  localStorage.setItem(key, JSON.stringify(history));
  renderHistory();
}

function reSearch(q) {
  document.getElementById("appQuery").value = q;
  document.getElementById("appQuery").focus();
  searchApps();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Alur pencarian ---------- */
async function searchApps() {
  const q = document.getElementById("appQuery").value.trim();
  const btn = document.getElementById("btnAction");
  const loader = document.getElementById("fetchLoader");

  if (!q) return showAlert("Ketik nama aplikasi dulu!", "error");

  currentQuery = q;
  hideResult();

  btn.disabled = true;
  loader.classList.remove("hidden");
  loader.classList.add("flex");

  try {
    const apps = platform === "ios" ? await searchItunes(q) : await searchFdroid(q);
    renderResults(apps);
    saveHistory(q);
  } catch (err) {
    console.error(err);
    showAlert("Gagal mencari aplikasi. Cek koneksi internetmu, lalu coba lagi.", "error");
  } finally {
    loader.classList.add("hidden");
    loader.classList.remove("flex");
    btn.disabled = false;
  }
}

/* ---------- Efek magnetik ---------- */
function attachMagnetic(btn) {
  btn.addEventListener("pointermove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  });
  btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
}

/* ---------- Init ---------- */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Loader halaman */
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("loader").classList.add("done"), 400);
  });

  /* Reveal on scroll */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px" }
  );
  document.querySelectorAll("[data-reveal], .stagger").forEach((el) => io.observe(el));

  /* Magnetic buttons */
  if (!reduce) {
    document.querySelectorAll("[data-magnetic]").forEach(attachMagnetic);
  }

  /* Contoh kata kunci: isi input lalu langsung cari */
  document.querySelectorAll("[data-example]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.getElementById("appQuery").value = chip.textContent.trim();
      document.getElementById("appQuery").focus();
      searchApps();
    });
  });

  /* Pilih platform */
  document.getElementById("platIos").addEventListener("click", () => setPlatform("ios"));
  document.getElementById("platAndroid").addEventListener("click", () => setPlatform("android"));

  /* Submit form */
  document.getElementById("search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    searchApps();
  });

  /* Auto-cari saat teks ditempel */
  document.getElementById("appQuery").addEventListener("paste", () => {
    setTimeout(() => {
      const v = document.getElementById("appQuery").value.trim();
      if (v && v.length > 1) searchApps();
    }, 80);
  });

  /* Otomatis cari dari URL yang dibagikan (mis. ?q=...) */
  const preQuery = new URLSearchParams(location.search).get("q");
  if (preQuery) {
    document.getElementById("appQuery").value = preQuery;
    searchApps();
  }

  /* Hapus riwayat */
  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    localStorage.removeItem("appdl_ios_history");
    localStorage.removeItem("appdl_android_history");
    renderHistory();
    showAlert("Semua riwayat pencarian dihapus.", "success");
  });

  renderHistory();
})();
