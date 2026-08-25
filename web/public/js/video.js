// ── Видеоплеер ──────────────────────────────────────────────
export function initVideo() {
  const video       = document.getElementById("mainVideo");
  const overlay     = document.getElementById("videoOverlay");
  const overlayBtn  = document.getElementById("videoPlayBtn");
  const controls    = document.getElementById("videoControls");
  const vcPlay      = document.getElementById("vcPlay");
  const vcProgress  = document.getElementById("vcProgress");
  const vcCurrent   = document.getElementById("vcCurrent");
  const vcDuration  = document.getElementById("vcDuration");
  const vcMute      = document.getElementById("vcMute");
  const vcVolume    = document.getElementById("vcVolume");
  const vcFullscreen = document.getElementById("vcFullscreen");

  if (!video) return;

  // Если src не задан — показываем заглушку и выходим
  const source = video.querySelector("source");
  if (!source || !source.src || source.src === window.location.href) {
    overlay?.classList.add("no-video");
    if (overlayBtn) overlayBtn.innerHTML = '<i class="fa-solid fa-film"></i>';
    return;
  }

  function formatTime(sec) {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }

  function setPlayIcon(el, playing) {
    el.innerHTML = playing
      ? '<i class="fa-solid fa-pause"></i>'
      : '<i class="fa-solid fa-play"></i>';
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
      overlay.classList.add("hidden");
    } else {
      video.pause();
      overlay.classList.remove("hidden");
    }
    setPlayIcon(vcPlay, !video.paused);
    setPlayIcon(overlayBtn, !video.paused);
  }

  // Клик по оверлею / кнопке поверх видео
  overlay?.addEventListener("click", togglePlay);
  vcPlay?.addEventListener("click", togglePlay);

  // Клик по самому видео
  video.addEventListener("click", togglePlay);

  // Прогресс
  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    vcProgress.value = pct;
    vcProgress.style.setProperty("--pct", pct + "%");
    if (vcCurrent) vcCurrent.textContent = formatTime(video.currentTime);
  });

  video.addEventListener("loadedmetadata", () => {
    if (vcDuration) vcDuration.textContent = formatTime(video.duration);
  });

  vcProgress?.addEventListener("input", () => {
    video.currentTime = (vcProgress.value / 100) * video.duration;
  });

  // Громкость
  function updateVolumeSlider() {
    if (!vcVolume) return;
    const val = video.muted ? 0 : video.volume;
    vcVolume.value = val;
    vcVolume.style.setProperty("--vol", (val * 100) + "%");
  }

  vcVolume?.addEventListener("input", () => {
    video.volume = vcVolume.value;
    video.muted  = video.volume === 0;
    vcVolume.style.setProperty("--vol", (vcVolume.value * 100) + "%");
    updateMuteIcon();
  });

  function updateMuteIcon() {
    if (!vcMute) return;
    vcMute.innerHTML = video.muted || video.volume === 0
      ? '<i class="fa-solid fa-volume-xmark"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  }

  vcMute?.addEventListener("click", () => {
    video.muted = !video.muted;
    if (vcVolume) vcVolume.value = video.muted ? 0 : video.volume;
    updateMuteIcon();
  });

  // Полноэкранный режим
  vcFullscreen?.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      video.requestFullscreen?.();
      vcFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      document.exitFullscreen?.();
      vcFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && vcFullscreen) {
      vcFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  });

  // Показывать контролы при наведении
  let hideTimer;
  const wrapper = video.closest(".video-wrapper");
  wrapper?.addEventListener("mousemove", () => {
    controls?.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) controls?.classList.remove("visible");
    }, 2500);
  });

  wrapper?.addEventListener("mouseleave", () => {
    clearTimeout(hideTimer);
    if (!video.paused) controls?.classList.remove("visible");
  });

  // Всегда показывать контролы на паузе
  video.addEventListener("pause", () => controls?.classList.add("visible"));
  video.addEventListener("play",  () => {
    hideTimer = setTimeout(() => controls?.classList.remove("visible"), 2500);
  });

  video.addEventListener("ended", () => {
    overlay?.classList.remove("hidden");
    setPlayIcon(vcPlay, false);
    setPlayIcon(overlayBtn, false);
    controls?.classList.add("visible");
  });
}
