// ── Service Worker — Miller Family PWA ──────────────────────
// Стратегия: network-first для HTML/CSS/JS, cache-first для картинок/шрифтов
const CACHE = "miller-v7";

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

  const EMPTY = new Response("", { status: 503, statusText: "Offline" });

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

        // Возвращаем кэш сразу, фоном обновляем; если кэша нет — ждём сеть
        if (cached) return cached;
        return fetchPromise.then(r => r || EMPTY.clone());
      })
    );
  } else {
    // Network-first: HTML, CSS, JS — всегда берём свежее с сервера
    // При офлайне HTML → offline.html, остальное → кэш или пустой ответ
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type !== "opaque") {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(async () => {
          const isHTML = e.request.headers.get("accept")?.includes("text/html");
          if (isHTML) {
            return (await caches.match("/offline.html")) || EMPTY.clone();
          }
          return (await caches.match(e.request)) || EMPTY.clone();
        })
    );
  }
});
