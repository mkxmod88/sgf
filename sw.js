const CACHE = 'sgf-v1';
const CORE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/img/sgf_logo.webp',
  './assets/img/SGF_BANNER.png',
  './assets/img/SGFFFF.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CORE)).then(()=> self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // cache-first untuk img / css / js / font
  if (url.pathname.match(/\.(webp|png|jpg|jpeg|css|js|woff2?)$/)) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetched = fetch(req).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(req, clone));
          }
          return res;
        }).catch(()=> cached);
        return cached || fetched;
      })
    );
    return;
  }
  // network-first untuk html
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
        return res;
      }).catch(()=> caches.match(req).then(r=> r || caches.match('./index.html')))
    );
  }
});
