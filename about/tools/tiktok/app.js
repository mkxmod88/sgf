/* ============================================================
   TikTok Video Downloader — no-watermark tool
   API: https://tikwm.com  →  { code, msg, data: { play, hdplay,
   music, cover, images, title, author: { unique_id }, ... } }
   ============================================================ */

"use strict";

const API_URL = "https://www.tikwm.com/api/";

let hdVideoUrl = null;
let stdVideoUrl = null;
let selectedVideoUrl = null;
let currentDownloadController = null;
let currentSourceUrl = null;
let lastCaption = "";

/* ---------- Custom alert modal ---------- */
function showAlert(message, type = "error", onConfirm = null) {
  const modal = document.getElementById("customAlert");
  const box = document.getElementById("alertBox");
  const icon = document.getElementById("alertIcon");
  const title = document.getElementById("alertTitle");
  const msg = document.getElementById("alertMessage");
  const actions = document.getElementById("alertActions");

  icon.className = "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg";
  actions.innerHTML = "";

  if (type === "confirm") {
    icon.classList.add("bg-amber-500/20", "text-amber-500");
    title.innerText = "Konfirmasi";
    icon.innerHTML = '<i data-lucide="circle-help" class="w-7 h-7"></i>';
    actions.innerHTML = `
      <button id="confirmBtn" class="btn w-full !py-3 bg-[#EE1D52] hover:bg-[#EE1D52]/90 text-white">Ya, Hapus Semua</button>
      <button onclick="closeAlert()" class="btn btn-ghost w-full !py-2.5 !text-xs">Batalkan</button>`;
    document.getElementById("confirmBtn").onclick = () => {
      if (onConfirm) onConfirm();
      closeAlert();
    };
  } else if (type === "error") {
    icon.classList.add("bg-[#EE1D52]/20", "text-[#EE1D52]");
    title.innerText = "Oops!";
    icon.innerHTML = '<i data-lucide="circle-x" class="w-7 h-7"></i>';
    actions.innerHTML = `<button onclick="closeAlert()" class="btn btn-primary w-full">Mengerti</button>`;
  } else {
    icon.classList.add("bg-emerald-500/20", "text-emerald-400");
    title.innerText = "Berhasil";
    icon.innerHTML = '<i data-lucide="circle-check" class="w-7 h-7"></i>';
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
  refreshIcons();
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

function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ---------- Download dengan progress bar ---------- */
async function forceDownload(url, filename) {
  const container = document.getElementById("downloadProgressContainer");
  const fill = document.getElementById("progressFill");
  const percentText = document.getElementById("progressPercent");
  const sizeText = document.getElementById("progressSize");
  const cancelBtn = document.getElementById("cancelDownloadBtn");

  const randomSuffix = Math.floor(Math.random() * 10000);
  const nameParts = filename.split(".");
  const ext = nameParts.pop();
  const finalFilename = `${nameParts.join(".")}_${randomSuffix}.${ext}`;

  const controller = new AbortController();
  currentDownloadController = controller;

  container.classList.remove("hidden");
  cancelBtn.classList.remove("hidden");
  fill.style.width = "0%";
  percentText.innerText = "0%";
  sizeText.innerText = "Memulai unduhan...";

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Gagal mengunduh file");
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0;
    let chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (contentLength) {
        const step = (receivedLength / contentLength) * 100;
        const totalMB = (contentLength / (1024 * 1024)).toFixed(1);
        const currentMB = (receivedLength / (1024 * 1024)).toFixed(1);

        fill.style.width = `${step}%`;
        percentText.innerText = `${Math.round(step)}%`;
        sizeText.innerText = `${currentMB} MB / ${totalMB} MB`;
      }
    }
    const blob = new Blob(chunks);
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
    container.classList.add("hidden");
    showAlert("Berhasil diunduh!", "success");
  } catch (error) {
    if (error.name === "AbortError") {
      showAlert("Unduhan dibatalkan.", "error");
    } else {
      console.error("Download error:", error);
      showAlert("Gagal mengunduh file secara otomatis. Membuka di tab baru.", "error");
      window.open(url, "_blank");
    }
    container.classList.add("hidden");
  } finally {
    currentDownloadController = null;
    cancelBtn.classList.add("hidden");
  }
}

function downloadVideo() {
  if (!selectedVideoUrl) return;
  forceDownload(selectedVideoUrl, "TikChl_Video.mp4");
}

/* ---------- Pilih kualitas video ---------- */
function styleQualityBtn(btn, active) {
  if (!btn) return;
  btn.classList.toggle("on", active);
}

function setQuality(mode) {
  const hd = document.getElementById("qHd");
  const std = document.getElementById("qStd");
  styleQualityBtn(hd, mode === "hd" && hdVideoUrl);
  styleQualityBtn(std, mode === "std");
  selectedVideoUrl = mode === "hd" && hdVideoUrl ? hdVideoUrl : stdVideoUrl;
}

/* ---------- Format angka (1.2M, 3.4K) ---------- */
function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

/* ---------- Salin caption ---------- */
async function copyCaption() {
  if (!lastCaption) return;
  try {
    await navigator.clipboard.writeText(lastCaption);
    showAlert("Caption berhasil disalin!", "success");
  } catch (err) {
    console.error(err);
    showAlert("Gagal menyalin caption — browser tidak mendukung clipboard.", "error");
  }
}

/* ---------- Bagikan link yang sudah terisi ---------- */
function shareTool() {
  if (!currentSourceUrl) return;
  const shareUrl = `${location.origin}${location.pathname}?url=${encodeURIComponent(currentSourceUrl)}`;
  const text = `Download TikTok tanpa watermark: ${shareUrl}`;
  if (navigator.share) {
    navigator
      .share({ title: "TikTok Video Downloader", text, url: shareUrl })
      .catch(() => {});
  } else {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => showAlert("Link berhasil disalin!", "success"))
      .catch(() => showAlert("Gagal menyalin link.", "error"));
  }
}

/* ---------- Riwayat unduhan (localStorage) ---------- */
function saveToHistory(data) {
  let history = JSON.parse(localStorage.getItem("tikchl_history") || "[]");
  const newItem = {
    id: data.id,
    title: data.title || "TikTok Content",
    author: (data.author && data.author.unique_id) || "tiktok",
    cover: data.cover,
    date: new Date().toLocaleDateString("id-ID"),
  };
  history = history.filter((item) => item.id !== data.id);
  history.unshift(newItem);
  localStorage.setItem("tikchl_history", JSON.stringify(history.slice(0, 6)));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  const sec = document.getElementById("historySection");
  const history = JSON.parse(localStorage.getItem("tikchl_history") || "[]");
  if (history.length === 0) {
    sec.classList.add("hidden");
    return;
  }
  sec.classList.remove("hidden");
  list.innerHTML = history
    .map(
      (item) => `
        <div onclick="reFetch('${item.id}')"
          class="glass lift grad-border p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition group">
          <img src="${item.cover}" alt="Cover" class="w-14 h-14 object-cover rounded-lg"
            onerror="this.style.display='none'" />
          <div class="flex-1 text-left overflow-hidden">
            <p class="text-white font-bold text-xs truncate">@${item.author}</p>
            <p class="muted text-[11px] truncate mb-1">${item.title}</p>
            <p class="text-[9px] text-purple-400 uppercase font-bold tracking-widest">${item.date}</p>
          </div>
          <button onclick="event.stopPropagation(); deleteHistoryItem('${item.id}')"
            class="p-2 text-neutral-600 hover:text-rose-400 transition shrink-0" aria-label="Hapus riwayat">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          <i data-lucide="chevron-right"
            class="w-4 h-4 text-neutral-600 group-hover:text-purple-400 transition shrink-0"></i>
        </div>`
    )
    .join("");
  refreshIcons();
}

function clearHistory() {
  showAlert("Hapus semua riwayat unduhan?", "confirm", () => {
    localStorage.removeItem("tikchl_history");
    renderHistory();
  });
}

function deleteHistoryItem(id) {
  let history = JSON.parse(localStorage.getItem("tikchl_history") || "[]");
  history = history.filter((item) => item.id !== id);
  localStorage.setItem("tikchl_history", JSON.stringify(history));
  renderHistory();
}

function reFetch(id) {
  document.getElementById("videoUrl").value = `https://www.tiktok.com/video/${id}`;
  fetchContent();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Ambil data dari TikWM ---------- */
async function fetchContent() {
  const url = document.getElementById("videoUrl").value;
  const btn = document.getElementById("btnAction");
  const loader = document.getElementById("fetchLoader");
  const resultBox = document.getElementById("resultBox");
  const photoGallery = document.getElementById("photoGallery");
  const imageList = document.getElementById("imageList");
  const actionButtons = document.getElementById("actionButtons");
  const qualityToggle = document.getElementById("qualityToggle");

  if (!url) return showAlert("Tempel link TikTok dulu!", "error");

  currentSourceUrl = url;
  lastCaption = "";
  document.getElementById("vStats").innerHTML = "";

  btn.disabled = true;
  loader.classList.remove("hidden");
  loader.classList.add("flex");
  resultBox.classList.add("hidden");
  photoGallery.classList.add("hidden");
  qualityToggle.classList.add("hidden");
  imageList.innerHTML = "";
  hdVideoUrl = null;
  stdVideoUrl = null;
  selectedVideoUrl = null;

  try {
    const response = await fetch(`${API_URL}?url=${encodeURIComponent(url)}&hd=1`);
    const res = await response.json();

    if (res.code === 0) {
      const data = res.data;
      saveToHistory(data);
      document.getElementById("vCover").src = data.cover;
      document.getElementById("vAuthor").innerText = `@${data.author.unique_id}`;
      document.getElementById("vTitle").innerText = data.title || "TikTok Content";

      lastCaption = data.title || "";
      const stats = [];
      if (data.play_count != null) stats.push(["play", formatNumber(data.play_count)]);
      if (data.digg_count != null) stats.push(["heart", formatNumber(data.digg_count)]);
      if (data.comment_count != null) stats.push(["message-circle", formatNumber(data.comment_count)]);
      if (data.share_count != null) stats.push(["share-2", formatNumber(data.share_count)]);
      document.getElementById("vStats").innerHTML = stats
        .map(
          ([icon, label]) =>
            `<span class="inline-flex items-center gap-1.5"><i data-lucide="${icon}" class="w-3.5 h-3.5"></i> ${label}</span>`
        )
        .join("");

      const copyCaptionBtn = `
        <button onclick="copyCaption()" class="btn btn-ghost !px-6 !py-3 !text-sm w-full sm:w-auto">
          <i data-lucide="copy" class="w-5 h-5"></i> Copy Caption
        </button>`;

      if (data.images && data.images.length > 0) {
        photoGallery.classList.remove("hidden");
        data.images.forEach((img, i) => {
          imageList.innerHTML += `
            <div onclick="forceDownload('${img}', 'TikChl_Img_${i}.jpg')"
              class="relative group overflow-hidden rounded-xl aspect-[3/4] glass cursor-pointer">
              <img src="${img}" alt="Foto ${i + 1}" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <i data-lucide="download" class="w-5 h-5 text-white"></i>
              </div>
            </div>`;
        });
        actionButtons.innerHTML = data.music
          ? `<button onclick="forceDownload('${data.music}', 'TikChl_Audio.mp3')" class="btn btn-ghost !px-6 !py-3 !text-sm w-full sm:w-auto">
              <i data-lucide="music" class="w-5 h-5"></i> Simpan Audio
            </button>
            ${copyCaptionBtn}`
          : copyCaptionBtn;
      } else {
        hdVideoUrl = data.hdplay || null;
        stdVideoUrl = data.play || null;
        const qHd = document.getElementById("qHd");
        qHd.disabled = !hdVideoUrl;
        qualityToggle.classList.remove("hidden");
        setQuality(hdVideoUrl ? "hd" : "std");

        actionButtons.innerHTML = `
          <button onclick="downloadVideo()"
            class="btn !px-6 !py-3 !text-sm w-full sm:w-auto btn-primary text-white shadow-lg shadow-[#EE1D52]/20">
            <i data-lucide="video" class="w-5 h-5"></i> Video No Watermark
          </button>
          ${data.music
            ? `<button onclick="forceDownload('${data.music}', 'TikChl_Audio.mp3')" class="btn btn-ghost !px-6 !py-3 !text-sm w-full sm:w-auto">
                <i data-lucide="music" class="w-5 h-5"></i> Simpan Audio
              </button>`
            : ""}
          ${copyCaptionBtn}`;
      }
      refreshIcons();
      loader.classList.add("hidden");
      loader.classList.remove("flex");
      resultBox.classList.remove("hidden");
    } else {
      showAlert("Tautan tidak valid atau video privat.", "error");
      loader.classList.add("hidden");
      loader.classList.remove("flex");
    }
  } catch (err) {
    console.error(err);
    showAlert("Gangguan server, coba lagi nanti.", "error");
    loader.classList.add("hidden");
    loader.classList.remove("flex");
  } finally {
    btn.disabled = false;
  }
}

/* ---------- Sosial media ---------- */
function MkIg() {
  window.open("https://www.instagram.com/chellgnzxz/", "_blank");
}
function MkTw() {
  window.open("https://x.com/marchel_kvandra", "_blank");
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
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* Contoh link: isi input */
  document.querySelectorAll("[data-example]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.getElementById("videoUrl").value = chip.textContent.trim();
      document.getElementById("videoUrl").focus();
    });
  });

  /* Submit form */
  document.getElementById("download-form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetchContent();
  });

  /* Auto-proses saat link ditempel */
  document.getElementById("videoUrl").addEventListener("paste", () => {
    setTimeout(() => {
      const v = document.getElementById("videoUrl").value;
      if (v && /tiktok\.com/i.test(v)) fetchContent();
    }, 50);
  });

  /* Pilih kualitas video */
  document.getElementById("qHd").addEventListener("click", () => setQuality("hd"));
  document.getElementById("qStd").addEventListener("click", () => setQuality("std"));

  /* Bagikan link yang sudah terisi */
  document.getElementById("shareBtn").addEventListener("click", shareTool);

  /* Otomatis proses dari URL yang dibagikan (mis. ?url=...) */
  const preUrl = new URLSearchParams(location.search).get("url");
  if (preUrl) {
    document.getElementById("videoUrl").value = preUrl;
    fetchContent();
  }

  /* Batalkan unduhan yang sedang berjalan */
  document.getElementById("cancelDownloadBtn").addEventListener("click", () => {
    if (currentDownloadController) currentDownloadController.abort();
  });

  /* Hapus riwayat */
  document.getElementById("clearHistoryBtn").addEventListener("click", clearHistory);

  /* Riwayat yang tersimpan */
  renderHistory();

  /* Ikon */
  refreshIcons();

  /* Service worker (PWA) */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
})();
