// ── Service Worker — Miller Family PWA ──────────────────────
// Стратегия: network-first для HTML/CSS/JS, cache-first для картинок/шрифтов
const CACHE = "miller-v6";

const STATIC = [
  "/",
  "/index.html",
  "/offline.html",
  "/404.html",
  "/css/style.css",
  "/css/extras.css",
  "/css/page.css",
  "/manifest.json",
  "/images/family-logo.jpeg",
  "/images/miller-emblem.png",
  "/images/background.png",
];

// Расширения которые кэшируем навсегда (картинки, шрифты)
const CACHE_FIRST_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".woff", ".woff2", ".ttf", ".mp3", ".mp4"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = e.request.url;

  // Пропускаем: API, расширения браузера, не-http
  if (
    url.includes("/api/") ||
    url.startsWith("chrome-extension://") ||
    url.startsWith("moz-extension://") ||
    !url.startsWith("http")
  ) return;

  // Определяем расширение файла
  const isCacheFirst = CACHE_FIRST_EXT.some(ext => url.split("?")[0].endsWith(ext))
    || url.includes("fonts.gstatic.com");

  if (isCacheFirst) {
    // Cache-first: картинки, шрифты, аудио — берём из кэша, обновляем в фоне
    e.respondWith(
      caches.match(e.request).then(cached => {
        const fetchPromise = fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => null);
        return cached || fetchPromise;
      })
    );
  } else {
    // Network-first: HTML, CSS, JS — всегда берём свежее с сервера
    // Кэш используется только если сеть недоступна (офлайн)
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type !== "opaque") {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request).then(cached => {
            if (cached) return cached;
            // Для HTML запросов возвращаем offline страницу
            if (e.request.headers.get("accept")?.includes("text/html"))
              return caches.match("/offline.html");
            return caches.match("/index.html");
          })
        )
    );
  }
});
