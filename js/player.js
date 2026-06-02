// ── Музыкальный плеер ──────────────────────────────────────
const songs = [
  { title: "GTA NIGHT DRIVE",          artist: "ALTA RP Theme",                     src: "music/theme1.mp3",         cover: "images/covers/cover1.png" },
  { title: "LOS SANTOS VIBES",          artist: "Night Drive",                       src: "music/theme2.mp3",         cover: "images/covers/cover2.png" },
  { title: "BIG ROOM BEATS",            artist: "ALTA RP",                           src: "music/theme3.mp3",         cover: "images/covers/cover3.png" },
  { title: "Некрасивый",                artist: "Автостопом по фазе сна",            src: "music/nekrasiviy.mp3",     cover: "images/covers/cover1.png" },
  { title: "Когда я умер",              artist: "Кишлак",                            src: "music/kogda-ya-umer.mp3",  cover: "images/covers/cover2.png" },
  { title: "Темная ночь холодный дождь",artist: "Гурпал Абдулкеримов",              src: "music/temnaya-noch.mp3",   cover: "images/covers/cover2.png" },
  { title: "Хэмильтон",                 artist: "Whole Lotta Swag feat. GATASKI",   src: "music/WLS.mp3",            cover: "images/covers/cover1.png" },
  { title: "NEON",                      artist: "NEWLIGHTCHILD",                     src: "music/NEON.mp3",           cover: "images/covers/cover3.png" },
  { title: "Отмена",                    artist: "Кишлак",                            src: "music/ОТМЕНА.mp3",         cover: "images/covers/cover3.png" },
  { title: "GOAT",                      artist: "Whole Lotta Swag",                  src: "music/GOAT.mp3",           cover: "images/covers/cover1.png" },
  { title: "COLLECTOR",                 artist: "Big Baby Tape feat. Джон Гарик",   src: "music/COLLECTOR.mp3",      cover: "images/covers/cover2.png" },
];

export function initPlayer() {
  const audio        = document.getElementById("audioPlayer");
  const songTitle    = document.getElementById("songTitle");
  const songArtist   = document.getElementById("songArtist");
  const albumArt     = document.getElementById("albumArt");
  const playBtn      = document.getElementById("playBtn");
  const nextBtn      = document.getElementById("nextBtn");
  const prevBtn      = document.getElementById("prevBtn");
  const volumeSlider = document.getElementById("volumeSlider");
  const progressBar  = document.getElementById("progressBar");
  const minimizeBtn  = document.getElementById("minimizeBtn");
  const musicPlayer  = document.getElementById("musicPlayer");
  const playlistEl   = document.getElementById("playlist");
  const currentTimeLabel = document.getElementById("currentTime");
  const durationLabel    = document.getElementById("duration");

  if (!audio || !playBtn) return;

  let currentSong = parseInt(localStorage.getItem("currentSong")) || 0;
  let isMinimized  = false;

  // Громкость из localStorage
  const savedVolume = localStorage.getItem("playerVolume");
  audio.volume = savedVolume !== null ? parseFloat(savedVolume) : 0.65;
  if (volumeSlider) volumeSlider.value = audio.volume;

  // Позиция плеера из localStorage
  const savedX = localStorage.getItem("playerX");
  const savedY = localStorage.getItem("playerY");
  if (savedX && savedY && musicPlayer) {
    musicPlayer.style.left   = savedX + "px";
    musicPlayer.style.top    = savedY + "px";
    musicPlayer.style.right  = "auto";
    musicPlayer.style.bottom = "auto";
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function renderPlaylist() {
    if (!playlistEl) return;
    playlistEl.innerHTML = "";
    songs.forEach((song, i) => {
      const li = document.createElement("li");
      const isActive = i === currentSong;
      li.innerHTML = `
        <div class="track-number">${isActive ? "▶" : i + 1}</div>
        <div class="track-info">
          <div class="track-title">${song.title}</div>
          <div class="track-artist">${song.artist}</div>
        </div>
        ${isActive ? '<div class="track-playing">♪</div>' : ""}
      `;
      if (isActive) li.classList.add("active");
      li.addEventListener("click", () => {
        currentSong = i;
        loadSong(currentSong);
        audio.play();
        playBtn.innerHTML = "❚❚";
      });
      playlistEl.appendChild(li);
    });
  }

  function loadSong(index) {
    localStorage.setItem("currentSong", index);
    audio.src          = songs[index].src;
    songTitle.textContent  = songs[index].title;
    songArtist.textContent = songs[index].artist;
    if (albumArt) albumArt.src = songs[index].cover;
    renderPlaylist();
  }

  loadSong(currentSong);

  playBtn.addEventListener("click", () => {
    if (audio.paused) { audio.play();  playBtn.innerHTML = "❚❚"; }
    else              { audio.pause(); playBtn.innerHTML = "▶";  }
  });

  nextBtn?.addEventListener("click", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong); audio.play(); playBtn.innerHTML = "❚❚";
  });

  prevBtn?.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong); audio.play(); playBtn.innerHTML = "❚❚";
  });

  audio.addEventListener("ended", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong); audio.play();
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) progressBar.value = (audio.currentTime / audio.duration) * 100;
    if (currentTimeLabel) currentTimeLabel.textContent = formatTime(audio.currentTime);
    if (durationLabel)    durationLabel.textContent    = formatTime(audio.duration);
  });

  progressBar?.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  volumeSlider?.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    localStorage.setItem("playerVolume", volumeSlider.value);
  });

  // Свернуть / развернуть
  minimizeBtn?.addEventListener("click", () => {
    isMinimized = !isMinimized;
    musicPlayer?.classList.toggle("minimized", isMinimized);
    minimizeBtn.innerHTML = isMinimized ? "+" : "−";
  });

  // Перетаскивание
  if (musicPlayer) {
    let isDragging = false, offsetX = 0, offsetY = 0;

    musicPlayer.addEventListener("mousedown", (e) => {
      if (e.target.closest("button, input, .music-controls, .volume-box")) return;
      isDragging = true;
      musicPlayer.classList.add("dragging");
      offsetX = e.clientX - musicPlayer.getBoundingClientRect().left;
      offsetY = e.clientY - musicPlayer.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      musicPlayer.style.left   = `${e.clientX - offsetX}px`;
      musicPlayer.style.top    = `${e.clientY - offsetY}px`;
      musicPlayer.style.right  = "auto";
      musicPlayer.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      musicPlayer.classList.remove("dragging");
      if (musicPlayer.style.left) {
        localStorage.setItem("playerX", parseInt(musicPlayer.style.left));
        localStorage.setItem("playerY", parseInt(musicPlayer.style.top));
      }
    });
  }
}
