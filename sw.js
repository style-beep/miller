// ── Service Worker — Miller Family PWA ──────────────────────
const CACHE = "miller-v2";
const STATIC = [
  "/",
  "/index.html",
  "/style.css",
  "/new-features.css",
  "/page.css",
  "/manifest.json",
  "/js/main.js",
  "/js/cursor.js",
  "/js/player.js",
  "/js/animations.js",
  "/js/modal.js",
  "/js/discord.js",
  "/js/video.js",
  "/js/game.js",
  "/js/intro.js",
  "/js/countdown.js",
  "/js/halloffame.js",
  "/js/appstatus.js",
  "/js/notifications.js",
  "/events.config.js",
  "/roles.config.js",
  "/images/family-logo.jpeg",
  "/images/miller-emblem.png",
  "/images/background.png",
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;900&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = e.request.url;

  // Пропускаем: API, chrome-extension, не-http запросы
  if (
    url.includes("/api/") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("moz-extension://") ||
    !url.startsWith("http")
  ) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === "opaque") return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match("/index.html"));
    })
  );
});
