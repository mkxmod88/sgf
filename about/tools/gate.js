/* MK Tools Gate — kunci password untuk halaman tools.
   Cara pasang: <script src="../gate.js"></script> di awal <head>.
   Hanya hash SHA-256 yang disimpan di sini, bukan password asli.
   Sekali dibuka (dari halaman about / tool mana pun), semua tool
   bebas diakses selama sesi tab yang sama (sessionStorage). */
(function () {
  "use strict";

  var HASH = "184e36407045c9ccdb0ae137061d0e567e557369ea73321b20404dd0c79f2b1b";
  var KEY = "mk_tools_unlocked";

  function isUnlocked() {
    try {
      return window.sessionStorage.getItem(KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  // Sudah dibuka di sesi ini -> biarkan halaman tampil normal.
  if (isUnlocked()) return;

  // Sembunyikan halaman secepatnya agar konten tidak mengintip.
  var root = document.documentElement;
  root.style.visibility = "hidden";

  var lang = "id";
  try {
    if ((navigator.language || "id").toLowerCase().indexOf("id") !== 0) lang = "en";
  } catch (e) { /* default id */ }

  var T = {
    id: {
      title: "Area Terkunci",
      desc: "Masukkan password untuk membuka",
      ph: "Password",
      btn: "Buka",
      err: "Password salah, coba lagi.",
      nosubtle: "Browser tidak mendukung verifikasi aman."
    },
    en: {
      title: "Locked Area",
      desc: "Enter the password to open",
      ph: "Password",
      btn: "Unlock",
      err: "Wrong password, try again.",
      nosubtle: "This browser does not support secure verification."
    }
  }[lang];

  function toolName() {
    try {
      var t = (document.title || "").split(/[—\-|]/)[0].trim();
      return t || "Tools";
    } catch (e) {
      return "Tools";
    }
  }

  var CSS = [
    "#mk-tools-gate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;",
    "background:radial-gradient(720px 420px at 50% -8%,rgba(168,85,247,.22),transparent 60%),radial-gradient(520px 360px at 90% 92%,rgba(217,70,239,.14),transparent 58%),#0d0618;",
    "font-family:'Plus Jakarta Sans','DM Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;}",
    "#mk-tools-gate .mtg-card{width:min(330px,88vw);display:flex;flex-direction:column;align-items:center;gap:10px;",
    "padding:28px 24px 24px;border-radius:24px;background:rgba(28,14,52,.92);border:1px solid rgba(168,85,247,.28);",
    "box-shadow:0 25px 60px rgba(0,0,0,.55),0 0 80px rgba(139,92,246,.18);text-align:center;}",
    "#mk-tools-gate .mtg-icon{width:54px;height:54px;display:grid;place-items:center;border-radius:50%;",
    "background:#0a0a0a;color:#fff;box-shadow:0 8px 20px rgba(0,0,0,.35);}",
    "#mk-tools-gate .mtg-icon svg{width:24px;height:24px;}",
    "#mk-tools-gate .mtg-title{font-size:17px;font-weight:800;letter-spacing:-.2px;color:#f5f3ff;}",
    "#mk-tools-gate .mtg-desc{margin:0;font-size:12px;line-height:1.6;color:rgba(245,243,255,.68);}",
    "#mk-tools-gate .mtg-desc strong{color:#fff;}",
    "#mk-tools-gate .mtg-input{width:100%;box-sizing:border-box;padding:12px 14px;border-radius:14px;",
    "border:1px solid rgba(168,85,247,.35);background:rgba(168,85,247,.08);color:#fff;font-size:14px;",
    "text-align:center;letter-spacing:1px;outline:none;}",
    "#mk-tools-gate .mtg-input:focus{border-color:#a855f7;box-shadow:0 0 0 3px rgba(168,85,247,.25);}",
    "#mk-tools-gate .mtg-input::placeholder{color:rgba(245,243,255,.45);letter-spacing:.3px;}",
    "#mk-tools-gate .mtg-err{margin:0;font-size:11.5px;font-weight:700;color:#f87171;}",
    "#mk-tools-gate .mtg-err[hidden]{display:none;}",
    "#mk-tools-gate .mtg-btn{width:100%;padding:12px 14px;border:0;border-radius:999px;background:#fff;color:#0a0a0a;",
    "font-size:12.5px;font-weight:800;letter-spacing:1px;text-transform:uppercase;cursor:pointer;",
    "box-shadow:0 10px 22px rgba(0,0,0,.35);transition:transform .2s ease,background .2s ease;}",
    "#mk-tools-gate .mtg-btn:hover{transform:translateY(-2px);background:#e9e9ee;}",
    "#mk-tools-gate .mtg-btn:active{transform:scale(.98);}",
    "#mk-tools-gate .mtg-card.mtg-shake{animation:mtg-shake .4s ease;}",
    "@keyframes mtg-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}",
    "@media (prefers-reduced-motion:reduce){#mk-tools-gate .mtg-card.mtg-shake{animation:none;}}"
  ].join("");

  var SVG_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>'
    + '<path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

  function sha256hex(str) {
    var data = new TextEncoder().encode(str);
    return window.crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  function show() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var gate = document.createElement("div");
    gate.id = "mk-tools-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-label", T.title);

    var card = document.createElement("div");
    card.className = "mtg-card";

    var icon = document.createElement("div");
    icon.className = "mtg-icon";
    icon.innerHTML = SVG_LOCK;

    var title = document.createElement("div");
    title.className = "mtg-title";
    title.textContent = T.title;

    var desc = document.createElement("p");
    desc.className = "mtg-desc";
    desc.textContent = T.desc + " ";
    var strong = document.createElement("strong");
    strong.textContent = toolName() + ".";
    desc.appendChild(strong);

    var input = document.createElement("input");
    input.className = "mtg-input";
    input.type = "password";
    input.placeholder = T.ph;
    input.autocomplete = "current-password";
    input.setAttribute("aria-label", T.ph);

    var err = document.createElement("p");
    err.className = "mtg-err";
    err.setAttribute("role", "alert");
    err.hidden = true;

    var btn = document.createElement("button");
    btn.className = "mtg-btn";
    btn.type = "button";
    btn.textContent = T.btn;

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(input);
    card.appendChild(err);
    card.appendChild(btn);
    gate.appendChild(card);

    // Tampilkan overlay dulu, baru buka kembali halaman di baliknya.
    document.body.appendChild(gate);
    try { document.body.style.overflow = "hidden"; } catch (e) {}
    root.style.visibility = "";

    function fail(msg) {
      err.textContent = msg;
      err.hidden = false;
      card.classList.remove("mtg-shake");
      void card.offsetWidth;
      card.classList.add("mtg-shake");
      input.value = "";
      input.focus();
    }

    function submit() {
      var val = (input.value || "").trim();
      if (!val) { input.focus(); return; }
      if (!window.crypto || !window.crypto.subtle) {
        fail(T.nosubtle);
        return;
      }
      btn.disabled = true;
      sha256hex(val).then(function (hex) {
        btn.disabled = false;
        if (hex === HASH) {
          try { window.sessionStorage.setItem(KEY, "1"); } catch (e) {}
          try { document.body.style.overflow = ""; } catch (e2) {}
          gate.remove();
        } else {
          fail(T.err);
        }
      }).catch(function () {
        btn.disabled = false;
        fail(T.err);
      });
    }

    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });

    setTimeout(function () { try { input.focus(); } catch (e) {} }, 80);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", show);
  } else {
    show();
  }
})();
