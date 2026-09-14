// ================= SPLASHSCREEN — Premium Smooth Entry & Exit =================
;(function () {
  const splash = document.getElementById('splash')
  if (!splash) return
  const bar = document.getElementById('splashBar')
  const barGlow = document.getElementById('splashBarGlow')
  const pctEl = document.getElementById('splashPercent')
  const skipBtn = document.getElementById('splashSkip')
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  document.body.classList.add('splash-lock')
  document.documentElement.style.scrollbarWidth = 'none'
  // entry animation dimatikan — langsung tampil tanpa fade

  let dismissed = false
  let rafId = null
  let start = null
  // durasi adaptif: pertama kali 2.6s, kunjungan ulang di session sama 1.6s biar tidak mengganggu
  const seen = sessionStorage.getItem('sgf_splash_seen')
  const DURATION = seen ? 1650 : 2650
  const MIN_DISPLAY = seen ? 1200 : 1900

  function setProgress (p) {
    const v = Math.max(0, Math.min(100, p))
    if (bar) bar.style.width = v + '%'
    if (barGlow) barGlow.style.width = v + '%'
    if (pctEl) pctEl.textContent = Math.round(v) + '%'
  }

  function hideSplash (immediate) {
    if (dismissed) return
    dismissed = true
    if (rafId) cancelAnimationFrame(rafId)
    // cepat isi bar ke 100% kalau di-skip
    if (immediate) {
      setProgress(100)
    }
    splash.classList.remove('is-entering')
    // paksa reflow biar transition exit super smooth (expo cubic)
    void splash.offsetWidth
    splash.classList.add('is-hiding')
    splash.setAttribute('aria-hidden', 'true')
    sessionStorage.setItem('sgf_splash_seen', '1')
    // lepas lock setelah animasi exit selesai (0.92s)
    setTimeout(
      () => {
        splash.classList.add('is-hidden')
        document.body.classList.remove('splash-lock')
        // trigger reveal anim di hero biar sinkron smooth
        document
          .querySelectorAll('.hero-card, .logo-pack, .marquee')
          .forEach(el => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(8px)'
            el.style.transition =
              'opacity 0.72s cubic-bezier(0.16,1,0.3,1), transform 0.72s cubic-bezier(0.16,1,0.3,1)'
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
              })
            )
          })
        setTimeout(() => {
          document
            .querySelectorAll('.hero-card, .logo-pack, .marquee')
            .forEach(el => {
              el.style.opacity = ''
              el.style.transform = ''
              el.style.transition = ''
            })
        }, 800)
      },
      prefersReduced ? 160 : 920
    )
  }

  // progress lerp smooth dengan easing
  function easeOutExpo (t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
  }

  function tick (ts) {
    if (dismissed) return
    if (!start) start = ts
    const elapsed = ts - start
    const raw = Math.min(elapsed / DURATION, 1)
    // 78% via easing, sisanya nahan di 92% lalu sprint ke 100 biar terasa premium
    let p
    if (raw < 0.78) {
      p = easeOutExpo(raw / 0.78) * 78
    } else if (raw < 0.92) {
      p = 78 + ((raw - 0.78) / 0.14) * 14 // 78 -> 92 lambat
    } else {
      p = 92 + ((raw - 0.92) / 0.08) * 8 // 92 -> 100
    }
    // jitter halus biar tidak robotik
    const jitter = Math.sin(elapsed * 0.005) * 0.35
    setProgress(p + jitter)
    if (raw < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      setProgress(100)
      // tahan sebentar lalu exit super smooth
      const hold = prefersReduced ? 120 : 420
      setTimeout(() => hideSplash(false), hold)
    }
  }

  // start counting
  if (prefersReduced) {
    setProgress(100)
    setTimeout(() => hideSplash(false), MIN_DISPLAY)
  } else {
    rafId = requestAnimationFrame(tick)
    // fallback max 4.2s wajib hilang
    setTimeout(() => hideSplash(false), 4200)
  }

  // skip interaksi — super smooth immediate exit
  function onSkip (e) {
    e.preventDefault()
    e.stopPropagation()
    hideSplash(true)
  }
  skipBtn?.addEventListener('click', onSkip)
  splash.addEventListener('click', e => {
    // klik area kosong juga skip, kecuali klik loader
    if (e.target.closest('.splash-loader')) return
    hideSplash(true)
  })
  // keyboard: Enter / Space / Escape skip
  window.addEventListener(
    'keydown',
    e => {
      if (dismissed) return
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        if (
          splash.classList.contains('is-hiding') ||
          splash.classList.contains('is-hidden')
        )
          return
        hideSplash(true)
      }
    },
    { once: false }
  )
  // jika page sudah load dan durasi minimal terpenuhi, tidak perlu nunggu full
  window.addEventListener('load', () => {
    const elapsed = start ? performance.now() - start : 0
    if (elapsed < MIN_DISPLAY) return
    // biarkan tick yang selesaikan, tapi kalau sudah >=85% langsung accelerate
  })
})()

const members = [
  {
    name: 'Rohby Art',
    handle: '@rohbyart_',
    role: 'founder',
    label: 'FOUNDER',
    avatar: 'assets/img/SGF_FOUNDER.jpeg',
    bio: 'Hidup itu tentang memberi arti, bukan sekadar mengejar. Tetap rendah hati, terus belajar, dan berusaha jadi alasan orang lain tersenyum.',
    roleDesc: 'Founder',
    location: 'Jawa Barat, Indonesia',
    stats: { lirik: 87, project: 42 },
    verified: true,
    socials: {
      instagram: 'https://instagram.com/rohbywilliam'
    }
  },
  {
    name: 'Syahrul Buriq',
    handle: '@Syahrul',
    role: 'leader',
    label: 'LEADER',
    avatar: 'https://editor-miring-squad.netlify.app/assets/images/profile.jpg',
    bio: 'Percaya pada proses yang pelan tapi pasti. Menikmati tiap langkah, tidak terburu-buru, dan selalu berusaha jadi lebih baik dari kemarin.',
    roleDesc: 'Leader',
    location: 'Bogor, Indonesia',
    stats: { lirik: 52, project: 31 },
    verified: true,
    socials: {
      instagram: 'https://instagram.com/syahrulfirds._'
    }
  },
  {
    name: 'Indriannor',
    handle: '@Indriannor',
    role: 'leader',
    label: 'LEADER',
    avatar: 'https://editor-miring-squad.netlify.app/assets/images/profile.jpg',
    bio: 'Hidup sederhana, hati tetap tenang. Banyak bersyukur, sedikit mengeluh, dan selalu mencari makna di hal-hal kecil.',
    roleDesc: 'Leader',
    location: 'Jakarta, Indonesia',
    stats: { lirik: 71, project: 29 },
    verified: false,
    socials: { instagram: 'https://instagram.com/driannoor'}
  },
  {
    name: 'Irgi Design',
    handle: '@Irgi',
    role: 'co_lead',
    label: 'CO LEADER',
    avatar: 'https://editor-miring-squad.netlify.app/assets/images/profile.jpg',
    bio: 'Berusaha jadi versi terbaik dari diri sendiri, bukan saingan orang lain. Pelan-pelan tapi pasti terus melangkah.',
    roleDesc: 'Co Leader',
    location: 'Jakarta, Indonesia',
    stats: { lirik: 38, project: 22 },
    verified: false,
    socials: { instagram: 'https:/instagram.com/irgistwn._'}
  },
  {
    name: 'Andreas',
    handle: '@Andreas',
    role: 'co_lead',
    label: 'CO LEADER',
    avatar: 'assets/img/SGF_I.jpg',
    bio: 'Menikmati perjalanan hidup apa adanya. Terus tumbuh, terus berbagi, dan berusaha hadir dengan tulus untuk sekitar.',
    roleDesc: 'Co Leader',
    location: 'Jakarta, Indonesia',
    stats: { lirik: 38, project: 22 },
    verified: true,
    socials: { instagram: 'https://instagram.com/andreasoktrap'}
  },
  {
    name: 'Dani perfect',
    handle: '@Daniperfect',
    role: 'co_lead',
    label: 'CO LEADER',
    avatar: 'https://editor-miring-squad.netlify.app/assets/images/profile.jpg',
    bio: 'Hidup itu belajar terus. Gagal itu wajar, yang penting tetap bangkit dan terus berjalan dengan hati yang baik.',
    roleDesc: 'Co Leader',
    location: 'Jakarta, Indonesia',
    stats: { lirik: 38, project: 22 },
    verified: false,
    socials: { instagram: 'https://instagram.com/mr_londd26'}
  },
  {
    name: 'Marchell Kevandra',
    handle: '@Chell',
    role: 'dev',
    label: 'DEVELOPER',
    avatar: 'assets/img/SGF_II.png',
    slides: [
      'assets/img/SGF_II.png',
      'assets/img/vx1.png',
      'assets/img/vx6.png',
      'assets/img/vx7.png'
    ],
    bio: 'Hidup sederhana saja, banyak belajar, banyak bersyukur, dan berusaha berguna. Tidak mengejar sempurna, cukup jadi versi yang lebih baik dari kemarin.',
    roleDesc: 'Developer',
    location: 'Jakarta, Indonesia',
    stats: { lirik: 38, project: 22 },
    verified: true,
    socials: {
      instagram: 'https://instagram.com/chellgnzxz',
      github: 'https://github.com/mkxchl',
      youtube: '#',
      tiktok: '#',
      whatsapp: '#'
    },
    stack: ['Next.js', 'Web Developer', 'Mobile App', 'UI/UX Designer']
  }
]

function cardHTML (m) {
  const idx = members.indexOf(m)
  const isDev = m.role === 'dev'
  return `
    <div class="m-list-item ${m.role}${
    isDev ? ' dev-premium' : ''
  }" data-member-idx="${idx}" role="button" tabindex="0" aria-label="Lihat profil ${
    m.name
  }">
      <div class="m-list-avatar"><img src="${m.avatar}" alt="${
    m.name
  }" loading="lazy"></div>
      <div class="m-list-info">
        <b class="m-list-name">${m.name} ${
    m.verified ? '<i class="ri-verified-badge-fill" title="Verified"></i>' : ''
  }</b>
        <span class="m-list-handle">${m.handle}</span>
      </div>
      <span class="m-list-status ${m.role}">${m.label}</span>
    </div>`
}
function skeletonMembersHTML (n = 4) {
  return Array.from({ length: n })
    .map(
      () => `
    <div class="skeleton-member">
      <div class="skeleton sk-avatar"></div>
      <div class="sk-lines"><div class="skeleton sk-line w60"></div><div class="skeleton sk-line w40"></div></div>
      <div class="skeleton sk-badge"></div>
    </div>`
    )
    .join('')
}
function skeletonKaryaHTML (n = 2) {
  return Array.from({ length: n })
    .map(
      () => `
    <article class="skeleton-karya"><div class="skeleton sk-thumb"></div><div class="sk-body"><div class="skeleton sk-title"></div><div class="skeleton sk-text"></div><div class="skeleton sk-meta"></div></div></article>`
    )
    .join('')
}
function renderTo (gridEl, list) {
  if (!gridEl) return
  // skeleton dulu biar tidak blank
  gridEl.innerHTML = skeletonMembersHTML(Math.min(4, list.length || 4))
  setTimeout(() => {
    gridEl.innerHTML = list.map(cardHTML).join('')
    const items = gridEl.querySelectorAll('.m-list-item')
    items.forEach((el, i) => {
      el.style.transitionDelay = i * 0.045 + 's'
    })
    // direct click biar pasti kebuka modal (delegated tetap jalan sebagai fallback)
    items.forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.memberIdx, 10)
        if (!isNaN(idx) && members[idx] && typeof openMemberModal === 'function') openMemberModal(members[idx])
      })
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const idx = parseInt(el.dataset.memberIdx, 10)
          if (!isNaN(idx) && members[idx] && typeof openMemberModal === 'function') openMemberModal(members[idx])
        }
      })
    })
    const rootEl = gridEl.closest('.sheet-view') || null
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, root: rootEl }
    )
    items.forEach(el => io.observe(el))
    setTimeout(() => {
      items.forEach(el => {
        if (
          el.getBoundingClientRect().top <
          (rootEl ? rootEl.getBoundingClientRect().bottom : window.innerHeight)
        )
          el.classList.add('in')
      })
    }, 80)
  }, 420)
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in')
    })
  },
  { threshold: 0.12 }
)
document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

const countEl = document.getElementById('countMember')
if (countEl) {
  let n = 0
  const target = members.length
  const t = setInterval(() => {
    n++
    countEl.textContent = n
    if (n >= target) clearInterval(t)
  }, 28)
}

const heroRight = document.getElementById('heroRight')
const logoScene = document.getElementById('logoScene')
if (heroRight && logoScene) {
  let targetX = 0,
    targetY = 0,
    curX = 0,
    curY = 0
  let ticking = false
  let isHover = false
  function lerp (a, b, t) {
    return a + (b - a) * t
  }
  function tick () {
    curX = lerp(curX, targetX, 0.08)
    curY = lerp(curY, targetY, 0.08)

    if (Math.abs(curX - targetX) < 0.01) curX = targetX
    if (Math.abs(curY - targetY) < 0.01) curY = targetY
    if (isHover) {
      logoScene.style.transform = `translateZ(0) rotateX(${curX}deg) rotateY(${curY}deg)`
    }
    if (isHover || Math.abs(curX) > 0.05 || Math.abs(curY) > 0.05) {
      requestAnimationFrame(tick)
    } else {
      ticking = false
      logoScene.style.transform = ''
    }
  }
  heroRight.addEventListener('mousemove', e => {
    const r = heroRight.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    targetY = x * 14
    targetX = -y * 12
    isHover = true
    logoScene.style.animationPlayState = 'paused'
    if (!ticking) {
      ticking = true
      requestAnimationFrame(tick)
    }
  })
  heroRight.addEventListener('mouseleave', () => {
    isHover = false
    targetX = 0
    targetY = 0
    logoScene.style.animationPlayState = ''
    if (!ticking) {
      ticking = true
      requestAnimationFrame(tick)
    }
  })

  heroRight.addEventListener(
    'touchmove',
    e => {
      const t = e.touches[0]
      if (!t) return
      const r = heroRight.getBoundingClientRect()
      const x = (t.clientX - r.left) / r.width - 0.5
      const y = (t.clientY - r.top) / r.height - 0.5
      targetY = x * 10
      targetX = -y * 8
      isHover = true
      logoScene.style.animationPlayState = 'paused'
      if (!ticking) {
        ticking = true
        requestAnimationFrame(tick)
      }
    },
    { passive: true }
  )
  heroRight.addEventListener('touchend', () => {
    isHover = false
    targetX = 0
    targetY = 0
    logoScene.style.animationPlayState = ''
    if (!ticking) {
      ticking = true
      requestAnimationFrame(tick)
    }
  })

  let lastGyro = 0
  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      'deviceorientation',
      e => {
        const now = Date.now()
        if (now - lastGyro < 32) return
        lastGyro = now
        if (!e.gamma || !e.beta) return

        if (isHover) return
        const rx = Math.max(-10, Math.min(10, e.beta / 6))
        const ry = Math.max(-12, Math.min(12, e.gamma / 5))
        logoScene.style.transform = `translateZ(0) rotateX(${
          -rx * 0.6
        }deg) rotateY(${ry * 0.6}deg)`
      },
      true
    )
  }
}

const sheet = document.getElementById('bottomSheet')
const sheetOverlay = document.getElementById('sheetOverlay')
const sheetTitle = document.getElementById('sheetTitle')
const sheetSub = document.getElementById('sheetSub')
const sheetIcon = document.getElementById('sheetIcon')
const sheetBody = document.getElementById('sheetBody')
const sheetCloseBtn = document.getElementById('sheetClose')
const sheetDismiss = document.getElementById('sheetDismiss')
const sheetViews = document.getElementById('sheetViews')
const sheetBack = document.getElementById('sheetBack')
const bottomNavLinks = document.querySelectorAll('.bottom-nav a')
const railLinks = document.querySelectorAll('.rail-links a')
const allNavLinks = document.querySelectorAll('.bottom-nav a, .rail-links a')
const navLinks = document.getElementById('navLinks')
const hamburger = document.getElementById('hamburger')

const LOGO_TEAM = 'assets/img/sgf_logo.webp'
const sheetMeta = {
  '#about': { title: 'Tentang Kami', sub: 'SGF Revolution', icon: LOGO_TEAM },
  '#members': {
    title: 'Pengurus / Admin',
    sub: 'SGF Revolution',
    icon: LOGO_TEAM
  },
  '#karya': { title: 'Video', sub: 'SGF Revolution', icon: LOGO_TEAM },
  '#contact': { title: 'Join', sub: 'Daftar • SGF-R / 2026', icon: LOGO_TEAM },
  '#unduh': {
    title: 'Download Center',
    sub: 'Intro & Lagu • SGF Revolution',
    icon: 'ri-download-2-line'
  },
  '#unduhIntro': {
    title: 'Download Center',
    sub: 'Intro Video',
    icon: 'ri-movie-2-line'
  },
  '#unduhLagu': {
    title: 'Download Center',
    sub: 'Lagu Full + Lirik',
    icon: 'ri-music-2-line'
  },
  '#setting': {
    title: 'Setting',
    sub: 'Appearance • Local',
    icon: 'ri-settings-3-line'
  }
}

// ================= THEME LOCAL — hanya user yang lihat (localStorage) =================
const SGF_THEMES = {
  default: {
    bg: '#08080b',
    surface: '#14141c',
    surface2: '#1b1b24',
    primary: '#e93dff',
    primary2: '#8b5cf6',
    gold: '#d4b483'
  },
  midnight: {
    bg: '#070A14',
    surface: '#111827',
    surface2: '#1e293b',
    primary: '#3b82f6',
    primary2: '#6366f1',
    gold: '#93c5fd'
  },
  crimson: {
    bg: '#120709',
    surface: '#1c0f12',
    surface2: '#2a1518',
    primary: '#ef4444',
    primary2: '#f97316',
    gold: '#fca5a5'
  },
  emerald: {
    bg: '#071412',
    surface: '#0f1f1c',
    surface2: '#1a2e2a',
    primary: '#10b981',
    primary2: '#06b6d4',
    gold: '#6ee7b7'
  },
  goldlux: {
    bg: '#0f0e0a',
    surface: '#1c1a12',
    surface2: '#2a2416',
    primary: '#d4b483',
    primary2: '#f59e0b',
    gold: '#fde68a'
  },
  neon: {
    bg: '#0a0a0f',
    surface: '#1a1a24',
    surface2: '#1e1e2e',
    primary: '#00ffcc',
    primary2: '#e93dff',
    gold: '#00ffcc'
  }
}
const THEME_KEY = 'sgf_theme_local_v2'
function applyThemeVars (o) {
  const r = document.documentElement
  if (!o) return
  r.style.setProperty('--bg', o.bg)
  r.style.setProperty('--bg-soft', o.surface)
  r.style.setProperty('--surface', o.surface)
  r.style.setProperty('--surface-2', o.surface2)
  r.style.setProperty('--primary', o.primary)
  r.style.setProperty('--primary-2', o.primary2)
  r.style.setProperty(
    '--primary-grad',
    `linear-gradient(135deg, ${o.primary} 0%, ${o.primary2} 100%)`
  )
  r.style.setProperty('--gold', o.gold)
  r.style.setProperty('--gold-soft', o.gold + '24')
  const metaTheme = document.querySelector('meta[name="theme-color"]')
  if (metaTheme) metaTheme.setAttribute('content', o.bg)
  document.body.style.background = o.bg
  const splashEl = document.getElementById('splash')
  if (splashEl) splashEl.style.background = o.bg
}
function saveTheme (id, custom) {
  try {
    localStorage.setItem(
      THEME_KEY,
      JSON.stringify({ id, custom: custom || null, ts: Date.now() })
    )
  } catch (e) {}
}
function loadTheme () {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    let theme = null
    if (data.custom) {
      theme = data.custom
    } else if (data.id && SGF_THEMES[data.id]) {
      theme = SGF_THEMES[data.id]
    }
    if (theme) applyThemeVars(theme)
    // mark active later in UI
    window._sgfSavedTheme = data
  } catch (e) {}
}
loadTheme()
function setupSetting (root) {
  if (!root) return
  const grid = root.querySelector('#themeGrid')
  const p1 = root.querySelector('#customPrimary')
  const p2 = root.querySelector('#customSecondary')
  const pg = root.querySelector('#customGold')
  const bg = root.querySelector('#customBg')
  const h1 = root.querySelector('#customPrimaryHex')
  const h2 = root.querySelector('#customSecondaryHex')
  const hg = root.querySelector('#customGoldHex')
  const hgBg = root.querySelector('#customBgHex')
  const applyBtn = root.querySelector('#applyCustom')
  const resetBtn = root.querySelector('#resetTheme')
  const cards = root.querySelectorAll('.theme-card')
  let saved = null
  try {
    saved = JSON.parse(localStorage.getItem(THEME_KEY) || 'null')
  } catch (e) {}
  function markActive (id) {
    cards.forEach(c =>
      c.classList.toggle('active', c.dataset.theme === id && !saved?.custom)
    )
    if (saved?.custom) {
      cards.forEach(c => c.classList.remove('active'))
    }
  }
  if (saved?.id) markActive(saved.id)
  else if (!saved) markActive('default')
  // sync custom inputs with current vars
  function syncInputs () {
    const cs = getComputedStyle(document.documentElement)
    const curP = cs.getPropertyValue('--primary').trim() || '#e93dff'
    const curP2 = cs.getPropertyValue('--primary-2').trim() || '#8b5cf6'
    const curG = cs.getPropertyValue('--gold').trim() || '#d4b483'
    const curBg = cs.getPropertyValue('--bg').trim() || '#08080b'
    if (p1) p1.value = curP
    if (p2) p2.value = curP2
    if (pg) pg.value = curG
    if (bg) bg.value = curBg
    if (h1) h1.textContent = curP
    if (h2) h2.textContent = curP2
    if (hg) hg.textContent = curG
    if (hgBg) hgBg.textContent = curBg
  }
  syncInputs()
  cards.forEach(c => {
    c.addEventListener('click', () => {
      const id = c.dataset.theme
      const th = SGF_THEMES[id]
      if (!th) return
      applyThemeVars(th)
      saveTheme(id, null)
      saved = { id, custom: null }
      markActive(id)
      syncInputs()
      // haptic
      try {
        if (navigator.vibrate) navigator.vibrate(12)
      } catch (_) {}
    })
  })
  function hexLive (e) {
    const input = e.target
    const hexEl = input.nextElementSibling
    if (hexEl) hexEl.textContent = input.value
  }
  ;[p1, p2, pg, bg].forEach(inp => {
    if (!inp) return
    inp.addEventListener('input', hexLive)
  })
  applyBtn?.addEventListener('click', () => {
    const custom = {
      bg: bg?.value || '#08080b',
      surface: bg?.value || '#08080b',
      surface2: bg?.value || '#08080b',
      primary: p1?.value || '#e93dff',
      primary2: p2?.value || '#8b5cf6',
      gold: pg?.value || '#d4b483'
    }
    // derive surface slightly lighter than bg
    try {
      const c = custom.bg.replace('#', '')
      const r = parseInt(c.slice(0, 2), 16),
        g = parseInt(c.slice(2, 4), 16),
        b = parseInt(c.slice(4, 6), 16)
      const l = v =>
        Math.min(255, Math.max(0, v + 18))
          .toString(16)
          .padStart(2, '0')
      custom.surface = `#${l(r)}${l(g)}${l(b)}`
      custom.surface2 = `#${l(r + 8)}${l(g + 8)}${l(b + 8)}`
    } catch (e) {}
    applyThemeVars(custom)
    saveTheme('custom', custom)
    saved = { id: 'custom', custom }
    cards.forEach(c => c.classList.remove('active'))
    try {
      if (navigator.vibrate) navigator.vibrate(18)
    } catch (_) {}
  })
  resetBtn?.addEventListener('click', () => {
    localStorage.removeItem(THEME_KEY)
    const def = SGF_THEMES.default
    applyThemeVars(def)
    saved = null
    markActive('default')
    syncInputs()
    try {
      if (navigator.vibrate) navigator.vibrate(10)
    } catch (_) {}
  })
}

function renderSheetIcon (iconValue, title) {
  if (!iconValue) return ''
  const isImage =
    iconValue.includes('/') ||
    iconValue.includes('.webp') ||
    iconValue.includes('.png') ||
    iconValue.includes('.jpg') ||
    iconValue.includes('.jpeg')
  if (isImage) {
    return `<img src="${iconValue}" alt="${
      title || 'SGF Logo'
    }" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`
  }
  return `<i class="${iconValue}"></i>`
}

let sheetActiveFilter = 'all'
let sheetSearchQuery = ''

let sheetStack = []
function updateSheetTransform () {
  if (!sheetViews) return
  const views = sheetViews.querySelectorAll('.sheet-view')
  views.forEach((v, i) => {
    v.classList.remove('active', 'exit')
    if (i === sheetStack.length - 1) v.classList.add('active')
    else if (i === sheetStack.length - 2) v.classList.add('exit')
  })
  if (sheetBack)
    sheetBack.style.display = sheetStack.length > 1 ? 'grid' : 'none'
}
function clearSheetStack () {
  sheetStack = []
  if (sheetViews) sheetViews.innerHTML = ''
  updateSheetTransform()
}
function closeSheet (opts = { toHome: true }) {
  if (!sheet) return
  const toHome = typeof opts === 'boolean' ? opts : opts?.toHome !== false
  sheet.classList.remove('open')
  sheetOverlay.classList.remove('open')
  sheet.setAttribute('aria-hidden', 'true')
  sheetOverlay.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
  if (sheetCloseBtn) sheetCloseBtn.style.display = ''
  setTimeout(() => {
    if (!sheet.classList.contains('open')) clearSheetStack()
  }, 380)
  if (toHome) {
    setActive('#home')
    setTimeout(
      () =>
        document
          .getElementById('home')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      120
    )
  }
}

function openSheet (target) {
  if (target === '#home') {
    closeSheet()
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
    setActive(target)
    return
  }
  const meta = sheetMeta[target]
  if (!meta || !sheet) return

  sheetTitle.textContent = meta.title
  sheetSub.textContent = meta.sub
  if (meta.icon) {
    sheetIcon.style.display = ''
    sheetIcon.innerHTML = renderSheetIcon(meta.icon, meta.title)
    const isImg = meta.icon.includes('/') || meta.icon.includes('.')
    sheetIcon.style.padding = isImg ? 'px' : ''
    sheetIcon.style.overflow = isImg ? 'hidden' : ''
  } else {
    sheetIcon.style.display = 'none'
    sheetIcon.innerHTML = ''
  }

  if (sheetCloseBtn) sheetCloseBtn.style.display = ''

  const tplId = 'tpl-' + target.replace('#', '')
  const tpl = document.getElementById(tplId)
  let viewEl
  if (!tpl) {
    const wrap = document.createElement('div')
    wrap.className = 'sheet-view'
    wrap.innerHTML = `<div class="sheet-preview">Konten belum tersedia.</div>`
    viewEl = wrap
  } else {
    const clone = tpl.content.cloneNode(true)
    const wrap = document.createElement('div')
    wrap.className = 'sheet-view'
    wrap.appendChild(clone)
    viewEl = wrap
  }
  const isFirst = sheetStack.length === 0 || !sheet.classList.contains('open')
  if (isFirst) {
    clearSheetStack()
    sheetViews.appendChild(viewEl)
    sheetStack.push(target)
    requestAnimationFrame(() => updateSheetTransform())
  } else {
    sheetViews.appendChild(viewEl)
    sheetStack.push(target)

    requestAnimationFrame(() => updateSheetTransform())
  }
  const activeBody = viewEl
  if (target === '#members') {
    const grid =
      activeBody.querySelector('#sheetMemberGrid') ||
      document.getElementById('sheetMemberGrid')
    const filters = activeBody.querySelectorAll('.filter-btn')
    const searchInput =
      activeBody.querySelector('#sheetSearchMember') ||
      document.getElementById('sheetSearchMember')
    function applySheetFilter () {
      const q = (searchInput?.value || '').toLowerCase().trim()
      let filtered = members.filter(m => {
        const matchRole =
          sheetActiveFilter === 'all' || m.role === sheetActiveFilter
        const matchSearch =
          !q ||
          `${m.name} ${m.handle} ${m.role} ${m.label}`.toLowerCase().includes(q)
        return matchRole && matchSearch
      })
      renderTo(grid, filtered)
    }
    sheetActiveFilter = 'all'
    sheetSearchQuery = ''
    renderTo(grid, members)
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        sheetActiveFilter = btn.dataset.filter
        applySheetFilter()
      })
    })
    if (searchInput) {
      searchInput.addEventListener('input', applySheetFilter)
      setTimeout(() => searchInput.focus(), 320)
    }
  }
  if (target === '#karya') {
    const karyaGrid = activeBody.querySelector('.karya-grid')
    if (karyaGrid) {
      const original = karyaGrid.innerHTML
      karyaGrid.innerHTML = skeletonKaryaHTML(2)
      setTimeout(() => {
        karyaGrid.innerHTML = original
        setupVid(activeBody)
        // re-trigger reveal
        karyaGrid
          .querySelectorAll('.reveal')
          .forEach(el => el.classList.add('in'))
      }, 650)
    }
  }
  if (target === '#setting') {
    setupSetting(activeBody)
  }
  activeBody.querySelectorAll('.sheet-trigger').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      const t = a.dataset.sheet || a.getAttribute('href')
      if (t) openSheet(t)
    })
  })
  sheet.classList.add('open')
  sheetOverlay.classList.add('open')
  sheet.setAttribute('aria-hidden', 'false')
  sheetOverlay.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
  setActive(target)

  const reveals = activeBody.querySelectorAll('.reveal')
  reveals.forEach((el, i) => {
    el.style.transitionDelay = i * 0.065 + 's'
  })
  const sheetObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          sheetObserver.unobserve(e.target)
        }
      })
    },
    { threshold: 0.14, root: activeBody }
  )
  reveals.forEach(el => sheetObserver.observe(el))
  setTimeout(() => {
    reveals.forEach(el => {
      if (
        el.getBoundingClientRect().top <
        activeBody.getBoundingClientRect().bottom - 20
      )
        el.classList.add('in')
    })
  }, 100)
  activeBody.scrollTop = 0
  sheetBody.scrollTop = 0
  if (sheetViews) sheetViews.scrollTop = 0
}

function setActive (target) {
  allNavLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === target)
  )
}

allNavLinks.forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href')
    if (href && href.startsWith('#')) {
      if (href === '#home') {
        e.preventDefault()
        closeSheet()
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
        setActive(href)
      } else {
        e.preventDefault()
        openSheet(href)
      }
    }
  })
})

document.querySelectorAll('.sheet-trigger').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.dataset.sheet || a.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      if (href === '#home') {
        closeSheet()
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        openSheet(href)
      }
    }
  })
})

sheetBack?.addEventListener('click', () => {
  if (sheetStack.length > 1) {
    sheetStack.pop()
    updateSheetTransform()

    const prev = sheetStack[sheetStack.length - 1]
    const meta = sheetMeta[prev]
    if (meta) {
      sheetTitle.textContent = meta.title
      sheetSub.textContent = meta.sub
      if (meta.icon) {
        sheetIcon.style.display = ''
        sheetIcon.innerHTML = renderSheetIcon(meta.icon, meta.title)
        const isImg = meta.icon.includes('/') || meta.icon.includes('.')
        sheetIcon.style.padding = isImg ? '3px' : ''
        sheetIcon.style.overflow = isImg ? 'hidden' : ''
      } else {
        sheetIcon.style.display = 'none'
        sheetIcon.innerHTML = ''
      }
      if (sheetCloseBtn) sheetCloseBtn.style.display = ''
      setActive(prev)
    }

    setTimeout(() => {
      const views = sheetViews.querySelectorAll('.sheet-view')
      if (views.length > sheetStack.length) views[views.length - 1].remove()
    }, 380)
  } else {
    closeSheet()
  }
})
sheetOverlay?.addEventListener('click', closeSheet)
sheetCloseBtn?.addEventListener('click', closeSheet)
sheetDismiss?.addEventListener('click', closeSheet)

let startY = 0
sheet?.addEventListener(
  'touchstart',
  e => {
    startY = e.touches[0].clientY
  },
  { passive: true }
)
sheet?.addEventListener(
  'touchmove',
  e => {
    const dy = e.touches[0].clientY - startY
    if (dy > 80) closeSheet()
  },
  { passive: true }
)
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('memberModal')?.classList.contains('open'))
      return
    closeSheet()
  }
  if (
    e.key === '/' &&
    document.activeElement.tagName !== 'INPUT' &&
    document.activeElement.tagName !== 'TEXTAREA'
  ) {
    const m = document.getElementById('sheetSearchMember')
    if (m && sheet.classList.contains('open')) {
      e.preventDefault()
      m.focus()
    }
  }
})

document.querySelectorAll('.fab').forEach(f => {
  f.addEventListener('click', e => {
    e.preventDefault()
    openSheet('#contact')
  })
})

function fmt (t) {
  if (isNaN(t)) return '00:00'
  const m = Math.floor(t / 60)
    .toString()
    .padStart(2, '0')
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}
function setupVid (root = document) {
  root.querySelectorAll('[data-video]').forEach(box => {
    if (box.dataset.vidInit) return
    box.dataset.vidInit = '1'
    const video = box.querySelector('video')
    const btnPlay = box.querySelector('.vid-play')
    const btnCenter = box.querySelector('.vid-center')
    const btnMute = box.querySelector('.vid-mute')
    const btnFs = box.querySelector('.vid-fs')
    const seek = box.querySelector('.vid-seek')
    const fill = box.querySelector('.vid-progress-fill')
    const timeEl = box.querySelector('.vid-time')
    if (!video) return
    function syncPlay () {
      const isPlaying = !video.paused
      box.classList.toggle('playing', isPlaying)
      if (btnPlay)
        btnPlay.innerHTML = isPlaying
          ? '<i class="ri-pause-fill"></i>'
          : '<i class="ri-play-fill"></i>'
      if (btnCenter) {
        btnCenter.innerHTML = isPlaying
          ? '<i class="ri-pause-fill"></i>'
          : '<i class="ri-play-fill"></i>'
        btnCenter.classList.toggle('hidden', isPlaying)
      }
    }
    function syncTime () {
      const cur = fmt(video.currentTime)
      const dur = fmt(video.duration || 0)
      if (timeEl) timeEl.textContent = `${cur} / ${dur}`
      const pct = video.duration
        ? (video.currentTime / video.duration) * 100
        : 0
      if (fill) fill.style.width = pct + '%'
      if (seek) seek.value = pct
    }
    ;[btnPlay, btnCenter, video].forEach(el => {
      if (!el) return
      el.addEventListener('click', e => {
        if (el === video && video.controls) return
        e.preventDefault()
        if (video.paused) {
          document.querySelectorAll('[data-video] video').forEach(v => {
            if (v !== video) {
              v.pause()
              v.closest('[data-video]')?.classList.remove('playing')
            }
          })
          video.play()
        } else video.pause()
      })
    })
    video.addEventListener('play', syncPlay)
    video.addEventListener('pause', syncPlay)
    video.addEventListener('timeupdate', syncTime)
    video.addEventListener('loadedmetadata', syncTime)
    video.addEventListener('ended', () => {
      syncPlay()
      syncTime()
    })
    if (seek) {
      seek.addEventListener('input', () => {
        if (video.duration)
          video.currentTime = (seek.value / 100) * video.duration
      })
    }
    if (btnMute) {
      btnMute.addEventListener('click', () => {
        video.muted = !video.muted
        btnMute.innerHTML = video.muted
          ? '<i class="ri-volume-mute-line"></i>'
          : '<i class="ri-volume-up-line"></i>'
      })
    }
    if (btnFs) {
      btnFs.addEventListener('click', () => {
        if (document.fullscreenElement) document.exitFullscreen()
        else box.requestFullscreen?.() || video.requestFullscreen?.()
      })
    }
    syncTime()
    syncPlay()
  })
}
setupVid(document)

const _openSheetOrig = openSheet
openSheet = function (target) {
  _openSheetOrig(target)

  setTimeout(() => setupVid(sheetBody), 60)
}

const _closeSheetOrig = closeSheet
closeSheet = function (opts) {
  document.querySelectorAll('[data-video] video').forEach(v => v.pause())
  return _closeSheetOrig(opts)
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.intro-play')
  if (!btn) return
  const src = btn.dataset.src
  const activeView =
    btn.closest('.sheet-view') ||
    document.querySelector('.sheet-view.active') ||
    document
  let audio =
    activeView.querySelector?.('#laguPreview') ||
    document.getElementById('laguPreview')
  let wave =
    activeView.querySelector?.('#playingWave') ||
    activeView.querySelector?.('.playing-wave') ||
    document.getElementById('playingWave') ||
    document.querySelector('.sheet-view.active .playing-wave')

  if (!wave) wave = document.querySelector('.sheet-view.active .playing-wave')
  if (!audio) audio = document.querySelector('.sheet-view.active #laguPreview')
  const waveText = wave?.querySelector?.('#waveText')
  if (!audio || !src) return
  e.preventDefault()
  e.stopPropagation()
  const wasPlaying = btn.classList.contains('playing')

  document.querySelectorAll('.intro-play.playing').forEach(b => {
    b.innerHTML = '<i class="ri-play-fill"></i>'
  })
  const audios = document.querySelectorAll('audio, video')
  audios.forEach(a => {
    if (a !== audio) a.pause()
  })
  function showWave (title) {
    if (!wave) return
    const txt = wave.querySelector('#waveText')
    if (txt) txt.textContent = title
    wave.style.display = 'flex'

    void wave.offsetWidth
    wave.classList.remove('hiding')
    wave.classList.add('show')

    const view = wave.closest('.sheet-view')
    if (view) view.scrollTo({ top: view.scrollHeight, behavior: 'smooth' })
  }
  function hideWave () {
    if (!wave) return
    wave.classList.remove('show')
    wave.classList.add('hiding')
    setTimeout(() => {
      if (!wave.classList.contains('show')) wave.style.display = 'none'
      wave.classList.remove('hiding')
    }, 360)
  }
  if (wasPlaying) {
    audio.pause()
    audio.currentTime = 0
    hideWave()
  } else {
    const absSrc = new URL(src, location.href).href
    if (audio.src !== absSrc) {
      audio.src = src
      audio.load()
    }
    const title =
      btn
        .closest('.intro-item')
        ?.querySelector('.intro-main b')
        ?.textContent?.trim() || 'Lagu'
    showWave(title)
    audio.play().catch(() => {})
    btn.classList.add('playing')
    btn.innerHTML = '<i class="ri-pause-fill"></i>'
    audio.onended = () => {
      btn.classList.remove('playing')
      btn.innerHTML = '<i class="ri-play-fill"></i>'
      hideWave()
    }
    const onPause = () => {
      btn.classList.remove('playing')
      btn.innerHTML = '<i class="ri-play-fill"></i>'
      hideWave()
      audio.removeEventListener('pause', onPause)
    }
    audio.addEventListener('pause', onPause, { once: true })
  }
})

const _closeSheetOrig2 = closeSheet
closeSheet = (function (orig) {
  return function (opts) {
    document.querySelectorAll('#laguPreview, audio').forEach(aud => {
      try {
        aud.pause()
        aud.currentTime = 0
      } catch (e) {}
    })
    document.querySelectorAll('.intro-play.playing').forEach(b => {
      b.classList.remove('playing')
      b.innerHTML = '<i class="ri-play-fill"></i>'
    })
    document.querySelectorAll('.playing-wave, #playingWave').forEach(w => {
      w.classList.remove('show')
      w.style.display = 'none'
      w.classList.remove('hiding')
    })
    return orig(opts)
  }
})(_closeSheetOrig2)

const memberModal = document.getElementById('memberModal')
const memberModalCard = document.getElementById('memberModalCard')
const memberModalOverlay = document.getElementById('memberModalOverlay')
const memberModalClose = document.getElementById('memberModalClose')
const mmAvatar = document.getElementById('memberModalAvatar')
const mmBadge = document.getElementById('memberModalBadge')
const mmName = document.getElementById('memberModalName')
const mmRole = document.getElementById('memberModalRole')
const mmBio = document.getElementById('memberModalBio')
const mmLocation = document.getElementById('memberModalLocation')
const mmHandle = document.getElementById('memberModalHandle')
const mmStats = document.getElementById('memberModalStats')
const mmSocials = document.getElementById('memberModalSocials')
let modalSlideTimer = null

function openMemberModal (m) {
  if (!memberModal || !m) return
  const isDev = m.role === 'dev'
  const socials = m.socials || {}

  function handleText (key) {
    const url = socials[key]
    if (url && url !== '#' && url.includes('/')) {
      const seg = url.replace(/\/$/, '').split('/').pop()
      return seg.startsWith('@') ? seg : seg
    }
    return (m.handle || '').replace('@', '')
  }
  const followCfg = isDev
    ? [
        { key: 'instagram', icon: 'ri-instagram-line' },
        { key: 'github', icon: 'ri-github-line' }
      ]
    : [
        { key: 'instagram', icon: 'ri-instagram-line' }
      ]

  let followList = followCfg.filter(
    c => socials[c.key] && socials[c.key] !== '#'
  )
  if (followList.length === 0) followList = followCfg.slice(0, 1)
  if (followList.length === 1 && followCfg.length > 1) {
    const next = followCfg.find(c => !followList.includes(c))
    if (next) followList.push(next)
  }

  if (memberModalCard) memberModalCard.classList.toggle('is-dev', isDev)
  if (modalSlideTimer) {
    clearInterval(modalSlideTimer)
    modalSlideTimer = null
  }
  if (mmAvatar) {
    const slides = m.slides && m.slides.length > 1 ? m.slides : null
    if (slides) {
      mmAvatar.classList.add('has-slideshow')
      mmAvatar.innerHTML =
        slides
          .map(
            (src, i) =>
              `<img src="${src}" alt="${m.name} ${i + 1}" class="${
                i === 0 ? 'active' : ''
              }" loading="${
                i === 0 ? 'eager' : 'lazy'
              }" onerror="this.style.display='none'">`
          )
          .join('') +
        `<div class="member-modal-dots">${slides
          .map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`)
          .join('')}</div>`
      let idx = 0
      const imgs = mmAvatar.querySelectorAll('img')
      const dots = mmAvatar.querySelectorAll('.member-modal-dots span')
      modalSlideTimer = setInterval(() => {
        const prev = idx
        idx = (idx + 1) % slides.length
        imgs[prev].classList.remove('active')
        imgs[prev].classList.add('prev')
        dots[prev]?.classList.remove('active')
        imgs[idx].classList.add('active')
        imgs[idx].classList.remove('prev')
        dots[idx]?.classList.add('active')
        setTimeout(() => imgs[prev].classList.remove('prev'), 700)
      }, 2200)
      dots.forEach((d, i) =>
        d.addEventListener('click', () => {
          if (i === idx) return
          imgs[idx].classList.remove('active')
          dots[idx]?.classList.remove('active')
          idx = i
          imgs[idx].classList.add('active')
          dots[idx]?.classList.add('active')
        })
      )
    } else {
      mmAvatar.classList.remove('has-slideshow')
      mmAvatar.innerHTML = `<img src="${m.avatar}" alt="${m.name}" onerror="this.style.display='none'">`
    }
  }
  if (mmBadge) {
    mmBadge.textContent = m.label || m.role.toUpperCase()
    mmBadge.className =
      'member-modal-badge ' + m.role + (isDev ? ' is-dev-badge' : '')
  }
  if (mmName)
    mmName.innerHTML = `${m.name} ${
      m.verified
        ? '<i class="ri-verified-badge-fill" title="Verified"></i>'
        : ''
    }`
  if (mmRole) mmRole.textContent = m.roleDesc || m.bio || ''
  if (mmBio) {
    if (m.bio && m.bio !== m.roleDesc) {
      mmBio.textContent = m.bio
      mmBio.classList.add('has-content')
    } else {
      mmBio.textContent = ''
      mmBio.classList.remove('has-content')
    }
  }
  if (mmLocation) {
    const locSpan = mmLocation.querySelector('span')
    if (locSpan) locSpan.textContent = m.location || 'Indonesia'
  }
  if (mmHandle) mmHandle.textContent = m.handle
  if (mmStats) mmStats.innerHTML = ''
  if (mmSocials) {
    mmSocials.innerHTML = followList
      .map(c => {
        const url = socials[c.key]
        const has = url && url !== '#'
        const user = handleText(c.key)
        const display = user
          ? user.startsWith('@')
            ? user
            : user
          : m.handle.replace('@', '') || c.key
        return `<a href="${
          has ? url : '#'
        }" target="_blank" rel="noopener" class="${
          has ? '' : 'disabled'
        }" aria-label="${c.key} ${m.name}"><i class="${
          c.icon
        }"></i><span>${display}</span></a>`
      })
      .join('')
  }
  let devStackEl = document.getElementById('devStack')
  if (isDev && m.stack && m.stack.length) {
    const followEl = document.querySelector('.member-modal-follow')
    if (!devStackEl) {
      devStackEl = document.createElement('div')
      devStackEl.id = 'devStack'
      devStackEl.className = 'dev-stack'
      followEl.parentElement.insertBefore(devStackEl, followEl)
    } else if (
      devStackEl.parentElement !== followEl.parentElement ||
      devStackEl.nextSibling !== followEl
    ) {
      followEl.parentElement.insertBefore(devStackEl, followEl)
    }
    const iconMap = {
      'Next.js': 'ri-reactjs-line',
      'Mobile App': 'ri-smartphone-line',
      'UX/UI Designer': 'ri-palette-line',
      'Web Developer': 'ri-link-m'
    }
    devStackEl.innerHTML = m.stack
      .map(
        s =>
          `<div class="dev-stack-pill"><i class="${
            iconMap[s] || 'ri-palette-line'
          }"></i><span>${s.trim()}</span></div>`
      )
      .join('')
    devStackEl.style.display = 'grid'
  } else if (devStackEl) {
    devStackEl.style.display = 'none'
  }
  const topLabel = document.querySelector('.member-modal-top span')
  if (topLabel) topLabel.textContent = 'All ' + (m.label || 'Member')
  memberModal.classList.add('open')
  memberModal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'
}
function closeMemberModal () {
  if (!memberModal) return
  memberModal.classList.remove('open')
  memberModal.setAttribute('aria-hidden', 'true')
  if (modalSlideTimer) {
    clearInterval(modalSlideTimer)
    modalSlideTimer = null
  }

  if (!sheet?.classList.contains('open')) document.body.style.overflow = ''
}

memberModalOverlay?.addEventListener('click', closeMemberModal)
memberModalClose?.addEventListener('click', closeMemberModal)

document.addEventListener('click', e => {
  const item = e.target.closest('.m-list-item[data-member-idx]')
  if (!item) return

  const idx = parseInt(item.dataset.memberIdx, 10)
  if (!isNaN(idx) && members[idx]) openMemberModal(members[idx])
})
document.addEventListener('keydown', e => {
  const item = e.target.closest?.('.m-list-item[data-member-idx]')
  if (e.key === 'Enter' && item) {
    const idx = parseInt(item.dataset.memberIdx, 10)
    if (!isNaN(idx) && members[idx]) openMemberModal(members[idx])
  }
})

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && memberModal?.classList.contains('open')) {
    e.stopImmediatePropagation()
    closeMemberModal()
  }
})
;(function () {
  const el = document.getElementById('deviceType')
  const cursor = document.getElementById('deviceCursor')
  if (!el) return
  const full = 'SGF REVOLUTION'
  let i = 0
  function type () {
    if (i < full.length) {
      el.textContent += full[i++]
      setTimeout(type, 95)
    }
  }
  setTimeout(type, 500)
})()
;(function () {
  const wrap = document.getElementById('logoCoreInner')
  if (!wrap) return
  const imgs = wrap.querySelectorAll('.logo-img')
  if (imgs.length < 2) return

  imgs.forEach(img => {
    const p = new Image()
    p.src = img.src
  })
  let idx = 0
  let timer = null
  function swap () {
    const prev = idx
    idx = (idx + 1) % imgs.length
    imgs[prev].classList.remove('active')
    imgs[idx].classList.add('active')
  }
  function start () {
    if (timer) clearInterval(timer)
    timer = setInterval(swap, 2800)
  }
  function stop () {
    if (timer) clearInterval(timer)
    timer = null
  }
  start()

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop()
    else start()
  })

  wrap.closest('.logo-scene')?.addEventListener('mouseenter', stop)
  wrap.closest('.logo-scene')?.addEventListener('mouseleave', start)
})()

let aboutBannerTimer = null
function initAboutBanner (root = document) {
  const banner =
    root.querySelector?.('#aboutBanner') ||
    document.getElementById('aboutBanner')
  if (!banner) return
  if (banner.dataset.init) return
  banner.dataset.init = '1'
  const imgs = banner.querySelectorAll('.ab-img')
  if (imgs.length < 2) return
  let idx = 0
  aboutBannerTimer = setInterval(() => {
    const prev = idx
    idx = (idx + 1) % imgs.length
    imgs[prev].classList.remove('active')
    imgs[idx].classList.add('active')
  }, 3200)
}
initAboutBanner(document)
const _openSheetAbout = openSheet
openSheet = function (target) {
  _openSheetAbout(target)
  setTimeout(() => initAboutBanner(sheetBody), 80)
}

document.querySelector('.pack-all')?.addEventListener('click', e => {
  e.preventDefault()
  const links = Array.from(document.querySelectorAll('.bento-grid a[download]'))
  if (!links.length) return

  links.forEach((a, i) => {
    setTimeout(() => {
      const url = a.getAttribute('href')
      const name = url.split('/').pop()
      const tmp = document.createElement('a')
      tmp.href = url
      tmp.download = name
      tmp.style.display = 'none'
      document.body.appendChild(tmp)
      tmp.click()
      tmp.remove()
    }, i * 320)
  })
})
const danceStyles = [
  '',
  'shuffle',
  'floss',
  'wave',
  'robot',
  'moonwalk',
  'clap',
  'salsa',
  'worm',
  'dab',
  'tap',
  'jump',
  'sway',
  'disco',
  'charleston',
  'hype',
  'brazil'
]
let danceIdx = 0
setInterval(() => {
  danceIdx = (danceIdx + 1) % danceStyles.length
  const next = danceStyles[danceIdx]
  document.querySelectorAll('.stickman').forEach(el => {
    el.style.transition =
      'opacity 0.32s cubic-bezier(0.45,0,0.55,1), transform 0.38s cubic-bezier(0.45,0,0.55,1)'
    el.style.opacity = '0.45'
    el.style.transform = 'translateY(3px) scale(0.94)'
    setTimeout(() => {
      el.classList.remove(
        'shuffle',
        'floss',
        'wave',
        'robot',
        'moonwalk',
        'clap',
        'salsa',
        'worm',
        'dab',
        'tap',
        'jump',
        'sway',
        'disco',
        'charleston',
        'hype',
        'brazil'
      )
      if (next) el.classList.add(next)
      el.style.opacity = '1'
      el.style.transform = 'translateY(0) scale(1)'
      setTimeout(() => {
        el.style.transition = ''
        el.style.transform = ''
      }, 420)
    }, 320)
  })
}, 2600)
const footerLink = document.getElementById('footerNameLink')
if (footerLink) {
  const openMarchell = () => {
    const m = members.find(
      x => x.handle === '@Chell' || x.name === 'Marchell Kevandra'
    )
    if (m) openMemberModal(m)
  }
  footerLink.addEventListener('click', openMarchell)
  footerLink.addEventListener('keydown', e => {
    if (e.key === 'Enter') openMarchell()
  })
}

const inspectToast = document.getElementById('inspectToast')
const inspectToastClose = document.getElementById('inspectToastClose')
const inspectLock = document.getElementById('inspectLock')
const customMenu = document.getElementById('customMenu')
let inspectToastTimer = null
let inspectHits = []
function showInspectToast () {
  if (!inspectToast) return
  const now = Date.now()
  inspectHits.push(now)
  inspectHits = inspectHits.filter(t => now - t < 6000)
  if (inspectHits.length >= 3) {
    inspectToast.querySelector('b').textContent = 'Yuk chat aja langsung'
    inspectToast.querySelector('span').innerHTML =
      'Udah 3x nih — langsung hubungi Marchell aja biar cepat. <a href="https://wa.me/6281234567890" target="_blank" style="color:#d4b483;text-decoration:underline">WhatsApp</a>'
  } else {
    inspectToast.querySelector('b').textContent = 'Heh, ketahuan'
    inspectToast.querySelector('span').textContent =
      'Inspect & klik kanan dimatikan buat jaga karya SGF. Mau lihat source? Chat Marchell aja.'
  }
  inspectToast.classList.add('show')
  clearTimeout(inspectToastTimer)
  inspectToastTimer = setTimeout(() => {
    inspectToast.classList.remove('show')
  }, 3800)
}
if (inspectToastClose) {
  inspectToastClose.addEventListener('click', () => {
    inspectToast.classList.remove('show')
    clearTimeout(inspectToastTimer)
  })
}
function hideCustomMenu () {
  if (customMenu) customMenu.classList.remove('show')
}
document.addEventListener('click', hideCustomMenu)
if (customMenu) {
  customMenu
    .querySelector('[data-action="copy-link"]')
    .addEventListener('click', () => {
      navigator.clipboard.writeText(location.href).catch(() => {})
      hideCustomMenu()
      showInspectToast()
    })
}
document.addEventListener('contextmenu', e => {
  e.preventDefault()
  if (customMenu) {
    customMenu.style.left = Math.min(e.clientX, window.innerWidth - 210) + 'px'
    customMenu.style.top = Math.min(e.clientY, window.innerHeight - 140) + 'px'
    customMenu.classList.add('show')
  }
  showInspectToast()
})
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase()
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
    (e.ctrlKey && k === 'u') ||
    (e.metaKey && e.altKey && k === 'i')
  ) {
    e.preventDefault()
    showInspectToast()
  }
})
let lastInspectCheck = 0
let isLocked = false
setInterval(() => {
  const now = Date.now()
  if (now - lastInspectCheck < 800) return
  lastInspectCheck = now
  const wDiff = window.outerWidth - window.innerWidth
  const hDiff = window.outerHeight - window.innerHeight
  const opened = wDiff > 160 || hDiff > 160
  if (opened && !isLocked) {
    isLocked = true
    document.body.classList.add('inspect-blur')
    if (inspectLock) {
      inspectLock.classList.add('show')
      inspectLock.setAttribute('aria-hidden', 'false')
    }
    document.querySelectorAll('video, audio').forEach(m => {
      try {
        m.pause()
      } catch (e) {}
    })
    showInspectToast()
  } else if (!opened && isLocked) {
    isLocked = false
    document.body.classList.remove('inspect-blur')
    if (inspectLock) {
      inspectLock.classList.remove('show')
      inspectLock.setAttribute('aria-hidden', 'true')
    }
  }
  if (opened) {
    lastInspectCheck = now + 800
  }
}, 700)
document.addEventListener('copy', e => {
  const sel = window.getSelection().toString()
  if (sel.length > 18) {
    showInspectToast()
    try {
      e.clipboardData.setData(
        'text/plain',
        sel + ' — © SGF Revolution by Marchell Kevandra ' + location.href
      )
      e.preventDefault()
    } catch (err) {}
  }
})
setInterval(() => {
  const t0 = performance.now()
  debugger
  const dt = performance.now() - t0
  if (dt > 120) {
    showInspectToast()
  }
}, 2200)
// PWA register
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  )
}
// Lazy + blur placeholder
;(function () {
  const imgs = document.querySelectorAll('img[loading="lazy"]')
  imgs.forEach(img => {
    if (img.complete) return
    img.classList.add('img-blur')
    img.addEventListener('load', () => img.classList.add('loaded'), {
      once: true
    })
    img.addEventListener('error', () => img.classList.add('loaded'), {
      once: true
    })
  })
  // untuk about-banner cross-fade tetap halus
  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (
          e.isIntersecting &&
          e.target.tagName === 'IMG' &&
          !e.target.classList.contains('loaded')
        ) {
          const tmp = new Image()
          tmp.src = e.target.src
          tmp.onload = () => e.target.classList.add('loaded')
        }
      })
    },
    { threshold: 0.01 }
  )
  imgs.forEach(i => io.observe(i))
})()

// Logo-pack preview dengan tombol download di atas image
;(function () {
  const modal = document.getElementById('logoPreview')
  const img = document.getElementById('logoPreviewImg')
  const dl = document.getElementById('logoPreviewDl')
  const overlay = document.getElementById('logoPreviewOverlay')
  const closeBtn = document.getElementById('logoPreviewClose')
  if (!modal || !img || !dl) return
  function open (src) {
    img.src = src
    img.alt = src.split('/').pop()
    dl.href = src
    dl.setAttribute('download', src.split('/').pop())
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
  }
  function close () {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
    if (
      !document.getElementById('memberModal')?.classList.contains('open') &&
      !document.getElementById('bottomSheet')?.classList.contains('open')
    ) {
      document.body.style.overflow = ''
    }
  }
  document.querySelectorAll('.bento-item[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.preview))
  })
  overlay?.addEventListener('click', close)
  closeBtn?.addEventListener('click', close)
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close()
  })
})()

// Toast download
;(function () {
  const toast = document.getElementById('dlToast')
  const msg = document.getElementById('dlToastMsg')
  const closeBtn = document.getElementById('dlToastClose')
  let t
  function show (name) {
    if (!toast || !msg) return
    msg.textContent = name + ' • menyiapkan file...'
    toast.classList.add('show')
    toast.setAttribute('aria-hidden', 'false')
    clearTimeout(t)
    t = setTimeout(hide, 2600)
    setTimeout(() => {
      if (toast.classList.contains('show'))
        msg.textContent = name + ' • download dimulai ✓'
    }, 900)
  }
  function hide () {
    if (!toast) return
    toast.classList.remove('show')
    toast.setAttribute('aria-hidden', 'true')
  }
  closeBtn?.addEventListener('click', hide)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[download], button[data-preview]')
    // untuk link download asli
    const dlLink = e.target.closest('a[download]')
    if (dlLink) {
      const href = dlLink.getAttribute('href') || ''
      const name = href.split('/').pop() || 'File'
      show(name)
    }
  })
  // juga untuk preview download
  document.getElementById('logoPreviewDl')?.addEventListener('click', e => {
    const name =
      e.currentTarget.getAttribute('href')?.split('/').pop() || 'File'
    show(name)
  })
  document.getElementById('introPreviewDl')?.addEventListener('click', e => {
    const name =
      e.currentTarget.getAttribute('href')?.split('/').pop() || 'File'
    show(name)
  })
  window.showDlToast = show
})()

// Intro video preview — custom controls (play, progress, time, mute, fullscreen) + download icon-only
;(function () {
  const modal = document.getElementById('introPreview')
  const wrap = document.getElementById('introPreviewWrap')
  const video = document.getElementById('introPreviewVideo')
  const dl = document.getElementById('introPreviewDl')
  const overlay = document.getElementById('introPreviewOverlay')
  const closeBtn = document.getElementById('introPreviewClose')
  const titleEl = document.getElementById('introPreviewTitle')
  const subEl = document.getElementById('introPreviewSub')
  const centerBtn = document.getElementById('introPreviewCenter')
  const playBtn = document.getElementById('ipcPlay')
  const seek = document.getElementById('ipcSeek')
  const fill = document.getElementById('ipcFill')
  const timeEl = document.getElementById('ipcTime')
  const muteBtn = document.getElementById('ipcMute')
  const fsBtn = document.getElementById('ipcFs')
  if (!modal || !video || !dl) return
  function fmt(t){ if(isNaN(t)) return '00:00'; const m=Math.floor(t/60).toString().padStart(2,'0'); const s=Math.floor(t%60).toString().padStart(2,'0'); return m+':'+s }
  function syncPlay(){
    const playing = !video.paused
    if(playBtn) playBtn.innerHTML = playing ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>'
    if(centerBtn){ centerBtn.innerHTML = playing ? '<i class="ri-pause-fill"></i>' : '<i class="ri-play-fill"></i>'; centerBtn.classList.toggle('hidden', playing) }
    wrap?.classList.toggle('is-playing', playing)
  }
  function syncTime(){
    if(timeEl) timeEl.textContent = fmt(video.currentTime)+' / '+fmt(video.duration||0)
    const pct = video.duration ? (video.currentTime/video.duration)*100 : 0
    if(fill) fill.style.width = pct+'%'
    if(seek) seek.value = pct
  }
  function open(src, title, sub) {
    video.src = src
    video.load()
    dl.href = src
    dl.setAttribute('download', src.split('/').pop())
    if (titleEl) titleEl.textContent = title || 'Intro SGF'
    if (subEl) subEl.textContent = sub || 'SGF Revolution • MP4'
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'
    syncPlay(); syncTime()
    video.play().catch(() => {})
  }
  function close() {
    modal.classList.remove('open')
    modal.setAttribute('aria-hidden', 'true')
    try { video.pause(); } catch(e){}
    if (document.fullscreenElement) { try{ document.exitFullscreen() }catch(e){} }
    if (
      !document.getElementById('memberModal')?.classList.contains('open') &&
      !document.getElementById('bottomSheet')?.classList.contains('open') &&
      !document.getElementById('logoPreview')?.classList.contains('open')
    ) {
      document.body.style.overflow = ''
    }
  }
  function togglePlay(){
    if(video.paused){ video.play().catch(()=>{}) } else { video.pause() }
  }
  centerBtn?.addEventListener('click', e=>{ e.stopPropagation(); togglePlay() })
  playBtn?.addEventListener('click', e=>{ e.stopPropagation(); togglePlay() })
  video.addEventListener('click', togglePlay)
  video.addEventListener('play', syncPlay)
  video.addEventListener('pause', syncPlay)
  video.addEventListener('timeupdate', syncTime)
  video.addEventListener('loadedmetadata', syncTime)
  video.addEventListener('ended', ()=>{ syncPlay(); syncTime() })
  seek?.addEventListener('input', ()=>{ if(video.duration) video.currentTime = (seek.value/100)*video.duration })
  muteBtn?.addEventListener('click', e=>{
    e.stopPropagation()
    video.muted = !video.muted
    muteBtn.innerHTML = video.muted ? '<i class="ri-volume-mute-line"></i>' : '<i class="ri-volume-up-line"></i>'
  })
  fsBtn?.addEventListener('click', e=>{
    e.stopPropagation()
    if(document.fullscreenElement) document.exitFullscreen()
    else (wrap?.requestFullscreen?.() || video.requestFullscreen?.()).catch(()=>{})
  })
  // delegated — work untuk template yang di-clone ke dalam bottomSheet
  document.addEventListener('click', e => {
    const btn = e.target.closest('.intro-video-btn')
    if (!btn) return
    e.preventDefault()
    const src = btn.dataset.video
    const title = btn.dataset.title || btn.querySelector('.intro-main b')?.textContent?.trim()
    const sub = btn.dataset.sub || btn.querySelector('.intro-main span')?.textContent?.trim()
    if (src) open(src, title, sub)
  })
  overlay?.addEventListener('click', close)
  closeBtn?.addEventListener('click', close)
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close()
    if (e.key === ' ' && modal.classList.contains('open')) { e.preventDefault(); togglePlay() }
  })
  document.addEventListener('fullscreenchange', ()=>{ if(fsBtn) fsBtn.innerHTML = document.fullscreenElement ? '<i class="ri-fullscreen-exit-line"></i>' : '<i class="ri-fullscreen-line"></i>' })
})()

try {
  console.log(
    '%c SGF Revolution ',
    'background:#0a0a0c;color:#d4b483;padding:6px 10px;border-radius:8px;font-weight:800;'
  )
  console.log(
    '%c Heh ketahuan buka console - karya dijaga ya. Chat Marchell kalau butuh source. ',
    'color:#9aa0b2;'
  )
} catch (e) {}
