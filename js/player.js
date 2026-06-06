// ── Музыкальный плеер Miller Family ────────────────────────────

const SONGS = [
  { title: "GTA NIGHT DRIVE",             artist: "DEL PERRO RP Theme",               src: "music/theme1.mp3",        cover: "images/covers/cover1.png" },
  { title: "LOS SANTOS VIBES",            artist: "Night Drive",                       src: "music/theme2.mp3",        cover: "images/covers/cover2.png" },
  { title: "BIG ROOM BEATS",             artist: "DEL PERRO RP",                      src: "music/theme3.mp3",        cover: "images/covers/cover3.png" },
  { title: "Некрасивый",                  artist: "Автостопом по фазе сна",            src: "music/nekrasiviy.mp3",    cover: "images/covers/cover1.png" },
  { title: "Когда я умер",               artist: "Кишлак",                            src: "music/kogda-ya-umer.mp3", cover: "images/covers/cover2.png" },
  { title: "Темная ночь холодный дождь", artist: "Гурпал Абдулкеримов",               src: "music/temnaya-noch.mp3",  cover: "images/covers/cover2.png" },
  { title: "Хэмильтон",                  artist: "Whole Lotta Swag feat. GATASKI",    src: "music/WLS.mp3",           cover: "images/covers/cover1.png" },
  { title: "NEON",                       artist: "NEWLIGHTCHILD",                     src: "music/NEON.mp3",          cover: "images/covers/cover3.png" },
  { title: "Отмена",                     artist: "Кишлак",                            src: "music/ОТМЕНА.mp3",        cover: "images/covers/cover3.png" },
  { title: "GOAT",                       artist: "Whole Lotta Swag",                  src: "music/GOAT.mp3",          cover: "images/covers/cover1.png" },
  { title: "COLLECTOR",                  artist: "Big Baby Tape feat. Джон Гарик",    src: "music/COLLECTOR.mp3",     cover: "images/covers/cover2.png" },
];

export function initPlayer() {
  // ── Найти все элементы ──────────────────────────────────────
  const get = id => document.getElementById(id);

  const wrap         = get("musicPlayer");
  const audio        = get("audioPlayer");
  const playBtn      = get("playBtn");
  const prevBtn      = get("prevBtn");
  const nextBtn      = get("nextBtn");
  const minimizeBtn  = get("minimizeBtn");
  const progressBar  = get("progressBar");
  const volumeSlider = get("volumeSlider");
  const songTitle    = get("songTitle");
  const songArtist   = get("songArtist");
  const albumArt     = get("albumArt");
  const currentTimeEl = get("currentTime");
  const durationEl    = get("duration");
  const playlistEl    = get("playlist");

  // Если нет основных элементов — выходим
  if (!wrap || !audio || !playBtn) return;

  // ── Состояние ──────────────────────────────────────────────
  let current    = Math.min(parseInt(localStorage.getItem("mf_song") || "0"), SONGS.length - 1);
  let isPlaying  = false;
  let isMinimized = false;
  let isDragging = false;
  let dragOffX = 0, dragOffY = 0;

  // ── Восстановить громкость ──────────────────────────────────
  const savedVol = parseFloat(localStorage.getItem("mf_vol") ?? "0.65");
  audio.volume = Math.max(0, Math.min(1, savedVol));
  if (volumeSlider) volumeSlider.value = audio.volume;

  // ── Восстановить позицию ────────────────────────────────────
  const sx = localStorage.getItem("mf_px");
  const sy = localStorage.getItem("mf_py");
  if (sx && sy) {
    wrap.style.right  = "auto";
    wrap.style.bottom = "auto";
    wrap.style.left   = clampX(parseFloat(sx)) + "px";
    wrap.style.top    = clampY(parseFloat(sy)) + "px";
  }

  // ── Helpers ─────────────────────────────────────────────────
  function fmt(s) {
    if (!isFinite(s) || isNaN(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60), ss = Math.floor(s % 60);
    return `${m}:${ss < 10 ? "0" : ""}${ss}`;
  }

  function clampX(x) { return Math.max(0, Math.min(window.innerWidth  - wrap.offsetWidth,  x)); }
  function clampY(y) { return Math.max(0, Math.min(window.innerHeight - wrap.offsetHeight, y)); }

  // ── Загрузить трек ──────────────────────────────────────────
  function load(idx, autoPlay = false) {
    current = ((idx % SONGS.length) + SONGS.length) % SONGS.length;
    const song = SONGS[current];

    audio.src = song.src;
    audio.load();

    if (songTitle)  songTitle.textContent  = song.title;
    if (songArtist) songArtist.textContent = song.artist;
    if (albumArt)   albumArt.src           = song.cover;
    if (progressBar) { progressBar.value = 0; progressBar.style.setProperty("--fill", "0%"); }
    if (currentTimeEl) currentTimeEl.textContent = "0:00";
    if (durationEl)    durationEl.textContent    = "0:00";

    localStorage.setItem("mf_song", current);
    renderPlaylist();

    if (autoPlay) play();
    else { isPlaying = false; updatePlayBtn(); }
  }

  // ── Воспроизведение ─────────────────────────────────────────
  function play() {
    const p = audio.play();
    if (p) p.then(() => { isPlaying = true; updatePlayBtn(); })
            .catch(() => { isPlaying = false; updatePlayBtn(); });
    else { isPlaying = true; updatePlayBtn(); }
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updatePlayBtn();
  }

  function toggle() { isPlaying ? pause() : play(); }

  function updatePlayBtn() {
    if (!playBtn) return;
    playBtn.textContent = isPlaying ? "❚❚" : "▶";
  }

  // ── Рендер плейлиста ────────────────────────────────────────
  function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = "";
    SONGS.forEach((song, i) => {
      const li = document.createElement("li");
      li.className = i === current ? "active" : "";
      li.innerHTML = `
        <div class="track-number">${i === current ? "▶" : i + 1}</div>
        <div class="track-info">
          <div class="track-title">${song.title}</div>
          <div class="track-artist">${song.artist}</div>
        </div>
        ${i === current ? '<div class="track-playing">♪</div>' : ""}
      `;
      li.addEventListener("click", () => load(i, true));
      playlistEl.appendChild(li);
    });
  }

  // ── Прогресс-бар ────────────────────────────────────────────
  function updateProgress() {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressBar) {
      progressBar.value = pct;
      progressBar.style.setProperty("--fill", pct + "%");
    }
    if (currentTimeEl) currentTimeEl.textContent = fmt(audio.currentTime);
    if (durationEl)    durationEl.textContent    = fmt(audio.duration);
  }

  // ── События audio ───────────────────────────────────────────
  audio.addEventListener("timeupdate",  updateProgress);
  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("ended",       () => load(current + 1, true));
  audio.addEventListener("play",        () => { isPlaying = true;  updatePlayBtn(); });
  audio.addEventListener("pause",       () => { isPlaying = false; updatePlayBtn(); });
  audio.addEventListener("error",       () => { isPlaying = false; updatePlayBtn(); });

  // ── Кнопки управления ───────────────────────────────────────
  playBtn.addEventListener("click", e => { e.stopPropagation(); toggle(); });
  prevBtn?.addEventListener("click", e => { e.stopPropagation(); load(current - 1, true); });
  nextBtn?.addEventListener("click", e => { e.stopPropagation(); load(current + 1, true); });

  // ── Прогресс (перемотка) ────────────────────────────────────
  progressBar?.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  // ── Громкость ───────────────────────────────────────────────
  volumeSlider?.addEventListener("input", () => {
    audio.volume = parseFloat(volumeSlider.value);
    localStorage.setItem("mf_vol", volumeSlider.value);
  });

  // ── Свернуть/развернуть ─────────────────────────────────────
  minimizeBtn?.addEventListener("click", e => {
    e.stopPropagation();
    isMinimized = !isMinimized;
    wrap.classList.toggle("minimized", isMinimized);
    minimizeBtn.textContent = isMinimized ? "+" : "−";
  });

  // ── Перетаскивание (desktop) ────────────────────────────────
  wrap.addEventListener("mousedown", e => {
    if (e.target.closest("button, input, ul, li")) return;
    isDragging = true;
    wrap.classList.add("dragging");
    const rect = wrap.getBoundingClientRect();
    dragOffX = e.clientX - rect.left;
    dragOffY = e.clientY - rect.top;
    e.preventDefault();
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;
    const x = clampX(e.clientX - dragOffX);
    const y = clampY(e.clientY - dragOffY);
    wrap.style.left   = x + "px";
    wrap.style.top    = y + "px";
    wrap.style.right  = "auto";
    wrap.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove("dragging");
    localStorage.setItem("mf_px", parseInt(wrap.style.left  || 0));
    localStorage.setItem("mf_py", parseInt(wrap.style.top   || 0));
  });

  // ── Инициализация ───────────────────────────────────────────
  load(current, false);
}
