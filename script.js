// ====================== 1. LOADER ======================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
    }, 1200);
  }
});

// ====================== 2. CURSOR GLOW ======================
const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", (e) => {
  if (glow) {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }
});

// ====================== 2.5. CUSTOM CURSOR ======================
const cursorOuter = document.getElementById("cursorOuter");
const cursorInner = document.getElementById("cursorInner");

let mouseX = 0,
  mouseY = 0;
let outerX = 0,
  outerY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorInner.style.left = mouseX + "px";
  cursorInner.style.top = mouseY + "px";
});

(function animateOuter() {
  outerX += (mouseX - outerX) * 0.13;
  outerY += (mouseY - outerY) * 0.13;
  cursorOuter.style.left = outerX + "px";
  cursorOuter.style.top = outerY + "px";
  requestAnimationFrame(animateOuter);
})();

const hoverTargets =
  "a, button, input, textarea, [class*='card'], .toggle-members, .main-btn, .join-btn, .discord-btn, .submit-btn, .modal-close";
document.querySelectorAll(hoverTargets).forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cursorOuter.classList.add("cursor-hover");
    cursorInner.classList.add("cursor-hover");
  });
  el.addEventListener("mouseleave", () => {
    cursorOuter.classList.remove("cursor-hover");
    cursorInner.classList.remove("cursor-hover");
  });
});

document.addEventListener("mousedown", () =>
  cursorOuter.classList.add("cursor-click"),
);
document.addEventListener("mouseup", () =>
  cursorOuter.classList.remove("cursor-click"),
);

// ====================== 3. LIVE CLOCK ======================
const clock = document.querySelector(".live-clock");
if (clock) {
  setInterval(() => {
    clock.textContent = new Date().toLocaleTimeString("ru-RU", {
      hour12: false,
    });
  }, 1000);
}

// ====================== 4. NAV ACTIVE LINK ======================
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ====================== 4.5. HEADER SCROLL EFFECT ======================
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    if (window.scrollY > 80) {
      header.style.background = "rgba(10,10,10,0.92)";
      header.style.borderColor = "rgba(255,255,255,0.1)";
    } else {
      header.style.background = "rgba(10,10,10,0.78)";
      header.style.borderColor = "rgba(255,255,255,0.07)";
    }
  }
});

// ====================== 5. PREMIUM MUSIC PLAYER ======================
const songs = [
  {
    title: "GTA NIGHT DRIVE",
    artist: "ALTA RP Theme",
    src: "music/theme1.mp3",
    cover: "images/covers/cover1.png",
  },

  {
    title: "LOS SANTOS VIBES",
    artist: "Night Drive",
    src: "music/theme2.mp3",
    cover: "images/covers/cover2.png",
  },

  {
    title: "BIG ROOM BEATS",
    artist: "ALTA RP",
    src: "music/theme3.mp3",
    cover: "images/covers/cover3.png",
  },

  {
    title: "Некрасивый",
    artist: "Автостопом по фазе сна",
    src: "music/nekrasiviy.mp3",
    cover: "images/covers/cover1.png",
  },

  {
    title: "Когда я умер",
    artist: "Кишлак",
    src: "music/kogda-ya-umer.mp3",
    cover: "images/covers/cover2.png",
  },

  {
    title: "Темная ночь холодный дождь",
    artist: "Гурпал Абдулкеримов",
    src: "music/temnaya-noch.mp3",
    cover: "images/covers/cover2.png",
  },
  {
    title: "Хэмильтон",
    artist: "Whole Lotta Swag feat. GATASKI",
    src: "music/WLS.mp3",
    cover: "images/covers/cover1.png",
  },
  {
    title: "NEON",
    artist: "NEWLIGHTCHILD",
    src: "music/NEON.mp3",
    cover: "images/covers/cover3.png",
  },
  {
    title: "Отмена",
    artist: "Кишлак",
    src: "music/ОТМЕНА.mp3",
    cover: "images/covers/cover3.png",
  },
  {
    title: "GOAT",
    artist: "Whole Lotta Swag",
    src: "music/GOAT.mp3",
    cover: "images/covers/cover1.png",
  },
  {
    title: "COLLECTOR",
    artist: "Big Baby Tape feat. Джон Гарик",
    src: "music/COLLECTOR.mp3",
    cover: "images/covers/cover2.png",
  },
];
let currentSong = parseInt(localStorage.getItem("currentSong")) || 0;

const audio = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const albumArt = document.getElementById("albumArt");
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.getElementById("progressBar");
const musicPlayer = document.getElementById("musicPlayer");
const minimizeBtn = document.getElementById("minimizeBtn");
const playlistElement = document.getElementById("playlist");
const savedVolume = localStorage.getItem("playerVolume");
let isMinimized = false;
if (savedVolume !== null) {
  audio.volume = parseFloat(savedVolume);
  volumeSlider.value = savedVolume;
} else {
  audio.volume = 0.65;
}
function loadSong(index) {
  localStorage.setItem("currentSong", index);
  audio.src = songs[index].src;
  songTitle.textContent = songs[index].title;
  songArtist.textContent = songs[index].artist;

  if (albumArt) {
    albumArt.src = songs[index].cover;
  }

  renderPlaylist();
}
function renderPlaylist() {
  playlistElement.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");

    const isActive = index === currentSong;

    li.innerHTML = `
      <div class="track-number">
        ${isActive ? "▶" : index + 1}
      </div>

      <div class="track-info">
        <div class="track-title">
          ${song.title}
        </div>

        <div class="track-artist">
          ${song.artist}
        </div>
      </div>

      ${isActive ? '<div class="track-playing">♪</div>' : ""}
    `;

    if (isActive) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      currentSong = index;

      loadSong(currentSong);

      audio.play();

      playBtn.innerHTML = "❚❚";

      renderPlaylist();
    });

    playlistElement.appendChild(li);
  });
}
loadSong(currentSong);

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = "❚❚";
  } else {
    audio.pause();
    playBtn.innerHTML = "▶";
  }
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
  playBtn.innerHTML = "❚❚";
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
  playBtn.innerHTML = "❚❚";
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration)
    progressBar.value = (audio.currentTime / audio.duration) * 100;
});

progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
});
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem("playerVolume", volumeSlider.value);
});

if (minimizeBtn) {
  minimizeBtn.addEventListener("click", () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
      musicPlayer.classList.add("minimized");
      minimizeBtn.innerHTML = "+";
    } else {
      musicPlayer.classList.remove("minimized");
      minimizeBtn.innerHTML = "−";
    }
  });
}

// ====================== 6. SCROLL ANIMATIONS ======================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);

document
  .querySelectorAll(
    ".hero-left, .hero-right, .glass-card, .rank-card, .member-card, .join-box, .composition, .section-title, .stat-card",
  )
  .forEach((el) => {
    el.classList.add("hidden");
    revealObserver.observe(el);
  });

const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  heroTitle.classList.add("hidden");
  setTimeout(() => heroTitle.classList.add("show"), 400);
}

// ====================== 7. NUMBER COUNTER ANIMATION ======================
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"));
  const duration = 2200;
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent =
      el.getAttribute("data-target") === "70"
        ? Math.floor(current) + "+"
        : Math.floor(current);
  }, 16);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach((num) => {
          if (!num.classList.contains("counted")) {
            animateCounter(num);
            num.classList.add("counted");
          }
        });
      }
    });
  },
  { threshold: 0.5 },
);

document
  .querySelectorAll(".stat-card")
  .forEach((card) => counterObserver.observe(card));

/* =========================
   DRAGGABLE MUSIC PLAYER
========================= */

const player = document.querySelector(".music-player");

let isDragging = false;

let offsetX = 0;
let offsetY = 0;

/* START DRAG */

player.addEventListener("mousedown", (e) => {
  /* НЕ ДВИГАЕМ если нажали на кнопку/ползунок */

  if (
    e.target.closest("button") ||
    e.target.closest("input") ||
    e.target.closest(".music-controls") ||
    e.target.closest(".volume-box")
  ) {
    return;
  }

  isDragging = true;

  player.classList.add("dragging");

  offsetX = e.clientX - player.getBoundingClientRect().left;

  offsetY = e.clientY - player.getBoundingClientRect().top;
});

/* MOVE */

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  player.style.left = `${e.clientX - offsetX}px`;

  player.style.top = `${e.clientY - offsetY}px`;

  player.style.right = "auto";

  player.style.bottom = "auto";
});

/* STOP */

document.addEventListener("mouseup", () => {
  isDragging = false;

  player.classList.remove("dragging");
});
/* PARTICLES */

const particlesContainer = document.getElementById("particles");

if (particlesContainer) {
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement("div");

    particle.classList.add("particle");

    particle.style.left = Math.random() * 100 + "%";

    const size = Math.random() * 4 + 2;

    particle.style.width = size + "px";
    particle.style.height = size + "px";

    particle.style.animationDuration = Math.random() * 10 + 10 + "s";

    particle.style.animationDelay = Math.random() * 10 + "s";

    particlesContainer.appendChild(particle);
  }
}
const scrollProgress = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;
});
const alerts = [
  {
    title: "TERRITORY SECURED",
    text: "Roy Miller captured territory",
  },
  {
    title: "NEW MEMBER",
    text: "New player joined family",
  },
  {
    title: "MEETING STARTED",
    text: "Eddie Miller opened briefing",
  },
  {
    title: "BUSINESS UPDATED",
    text: "Family income increased",
  },
];

function createAlert() {
  const container = document.getElementById("alertContainer");

  if (!container) return;

  const data = alerts[Math.floor(Math.random() * alerts.length)];

  const alert = document.createElement("div");

  alert.className = "alert-box";

  alert.innerHTML = `
      <div class="alert-title">${data.title}</div>
      <div class="alert-text">${data.text}</div>
  `;

  container.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, 5000);
}

setInterval(createAlert, 15000);

// ====================== TERRITORY CONTROL ANIMATION ======================
(function initTerritoryControl() {
  const TOTAL_PCT = 87;
  const CIRCUMFERENCE = 2 * Math.PI * 34; // r=34 → ≈213.6

  const ring = document.getElementById("territoryRing");
  const pctLabel = document.getElementById("territoryPct");
  const fills = document.querySelectorAll(".territory-fill");

  if (!ring || !pctLabel) return;

  let animated = false;

  function runAnimation() {
    if (animated) return;
    animated = true;

    // Animate individual bars
    fills.forEach((fill) => {
      setTimeout(() => fill.classList.add("animated"), 120);
    });

    // Animate ring stroke
    const offset = CIRCUMFERENCE - (TOTAL_PCT / 100) * CIRCUMFERENCE;
    setTimeout(() => {
      ring.style.strokeDashoffset = offset;
    }, 200);

    // Animate counter number
    let current = 0;
    const step = TOTAL_PCT / 80;
    const timer = setInterval(() => {
      current += step;
      if (current >= TOTAL_PCT) {
        current = TOTAL_PCT;
        clearInterval(timer);
      }
      pctLabel.textContent = Math.floor(current);
    }, 25);
  }

  // Trigger when panel enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) runAnimation();
      });
    },
    { threshold: 0.4 },
  );

  const panel = document.querySelector(".family-status");
  if (panel) observer.observe(panel);
})();

// ====================== 8. MOUSE PARALLAX ON BG ======================
(function initParallax() {
  const bg = document.querySelector(".bg-overlay");
  const cursorGlow = document.querySelector(".cursor-glow");
  if (!bg) return;

  let tX = 0,
    tY = 0,
    cX = 0,
    cY = 0;

  document.addEventListener("mousemove", (e) => {
    const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
    const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
    tX = xPct * 18;
    tY = yPct * 12;
  });

  (function tick() {
    cX += (tX - cX) * 0.04;
    cY += (tY - cY) * 0.04;
    bg.style.transform = `scale(1.06) translate(${cX}px, ${cY}px)`;
    requestAnimationFrame(tick);
  })();
})();

// ====================== 9. BLOOD SPLATTER ON CLICK ======================
(function initBloodSplatter() {
  document.addEventListener("click", (e) => {
    const count = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < count; i++) {
      const drop = document.createElement("div");
      drop.className = "blood-drop";
      const angle = Math.random() * 360;
      const dist = Math.random() * 70 + 20;
      const size = Math.random() * 8 + 4;
      const dur = Math.random() * 0.4 + 0.4;
      drop.style.cssText = `
        left:${e.clientX}px; top:${e.clientY}px;
        width:${size}px; height:${size}px;
        --ax:${Math.cos((angle * Math.PI) / 180) * dist}px;
        --ay:${Math.sin((angle * Math.PI) / 180) * dist}px;
        animation-duration:${dur}s;
      `;
      document.body.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove());
    }
  });
})();

// ====================== 10. GLITCH EFFECT ON HERO TITLE ======================
(function initGlitch() {
  const title = document.querySelector(".hero-title");
  if (!title) return;

  const originalHTML = title.innerHTML;

  function triggerGlitch() {
    title.classList.add("glitching");
    setTimeout(() => title.classList.remove("glitching"), 600);
  }

  // Auto-trigger every 6–12s
  function scheduleGlitch() {
    const delay = Math.random() * 6000 + 6000;
    setTimeout(() => {
      triggerGlitch();
      scheduleGlitch();
    }, delay);
  }
  scheduleGlitch();

  title.addEventListener("mouseenter", triggerGlitch);
})();

// ====================== 11. 3D TILT ON RANK & MEMBER CARDS ======================
(function initCardTilt() {
  const cards = document.querySelectorAll(
    ".rank-card, .member-card, .stat-card",
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        translateY(-14px) scale(1.02)
        rotateY(${x * 14}deg)
        rotateX(${-y * 10}deg)
      `;
      card.style.boxShadow = `
        ${-x * 20}px ${y * 20}px 40px rgba(255,0,0,0.18),
        0 30px 80px rgba(0,0,0,0.5)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
})();

// ====================== 12. TYPING EFFECT ON HERO SUBTITLE ======================
(function initTyping() {
  const el = document.querySelector(".hero-subtitle");
  if (!el) return;

  const phrases = [
    "ALTA GTA 5 ROLEPLAY",
    "ВЛАСТЬ НАД LOS SANTOS",
    "ЭЛИТА СЕРВЕРА",
    "MILLER FAMILY",
  ];

  let pIdx = 0,
    cIdx = 0,
    deleting = false;
  el.textContent = "";

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 1600);
})();

// ====================== 13. LOGO HEARTBEAT + CLICK RIPPLE ======================
(function initLogoEffects() {
  const logo = document.querySelector(".logo");
  if (!logo) return;

  logo.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.className = "logo-ripple";
    const rect = logo.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top = e.clientY - rect.top + "px";
    logo.style.position = "relative";
    logo.style.overflow = "hidden";
    logo.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
})();

// ====================== 14. SCANLINE FLICKER ON LOADER ======================
(function initLoaderScanlines() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const scan = document.createElement("div");
  scan.className = "loader-scanlines";
  loader.appendChild(scan);
})();

// ====================== 15. SECTION TITLE SPLIT REVEAL ======================
(function initTitleSplit() {
  document.querySelectorAll(".section-title").forEach((title) => {
    const text = title.textContent.trim();
    title.textContent = "";
    title.style.overflow = "hidden";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.className = "split-char";
      span.style.transitionDelay = `${i * 0.04}s`;
      title.appendChild(span);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            title
              .querySelectorAll(".split-char")
              .forEach((s) => s.classList.add("char-show"));
            obs.unobserve(title);
          }
        });
      },
      { threshold: 0.5 },
    );
    obs.observe(title);
  });
})();

/* ==========================================================================
   ADVANCED CYBERPUNK FUNCTIONALITY & PERFORMANCE OPTIMIZATIONS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Scroll Progress Bar Implementation
  const scrollBar = document.querySelector(".scroll-progress");
  window.addEventListener(
    "scroll",
    () => {
      if (scrollBar) {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollBar.style.width = `${progress}%`;
      }
    },
    { passive: true },
  );

  // 2. 3D Card Hover Perspective (Tilt Effect)
  const interactiveCards = document.querySelectorAll(
    ".stat-card, .rank-card, .member-item, .about-card",
  );

  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt degrees (Max 8 degrees for clean look)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = "transform 0.08s ease-out, box-shadow 0.3s ease";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    });
  });

  // 3. Automated Counting & Territory Progress Trigger
  const territorySection =
    document.querySelector(".family-status") || document.querySelector(".hero");

  if (territorySection) {
    // Add decorative giant background text watermarks dynamically
    const watermark = document.createElement("div");
    watermark.className = "background-word";
    watermark.textContent = "MILLER";
    territorySection.appendChild(watermark);
  }

  // Triggering the animated filling of horizontal and circular progress metrics
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Active visual bars filling
          entry.target.classList.add("show");

          // Circular ring fill animation logic if element exists
          const ringFill = document.getElementById("territoryRing");
          const ringText = document.getElementById("territoryPct");

          if (ringFill && ringText) {
            const targetPercentage = 88; // Default premium level target
            const circumference = 213.6; // 2 * Math.PI * 34

            let currentPct = 0;
            const duration = 1800; // ms
            const startTime = performance.now();

            function animateMetrics(now) {
              const elapsed = now - startTime;
              const progressRatio = Math.min(elapsed / duration, 1);
              // Ease out quad function
              const easeProgress = progressRatio * (2 - progressRatio);

              currentPct = Math.floor(easeProgress * targetPercentage);
              ringText.textContent = `${currentPct}%`;

              const offset =
                circumference -
                ((easeProgress * targetPercentage) / 100) * circumference;
              ringFill.style.strokeDashoffset = offset;

              if (progressRatio < 1) {
                requestAnimationFrame(animateMetrics);
              }
            }
            requestAnimationFrame(animateMetrics);
          }

          // Also fill custom inline variables
          document.querySelectorAll(".territory-item").forEach((item) => {
            const pctValue = item.getAttribute("data-control") || "85";
            const fillBar = item.querySelector(".territory-fill");
            if (fillBar) {
              fillBar.style.width = `${pctValue}%`;
            }
          });

          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  const statusPanel =
    document.querySelector(".family-status") || document.querySelector(".join");
  if (statusPanel) progressObserver.observe(statusPanel);

  // 4. Clean Header Link Binding with Precise Target Padding Offset
  document
    .querySelectorAll("header nav a, .footer-socials a")
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const targetHref = this.getAttribute("href");
        if (targetHref && targetHref.startsWith("#")) {
          e.preventDefault();
          const targetId = targetHref.substring(1);
          const destination = document.getElementById(targetId);

          if (destination) {
            const topGap = 100; // Perfectly fits your floating menu container height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elemRect = destination.getBoundingClientRect().top;
            const totalOffset = elemRect - bodyRect - topGap;

            window.scrollTo({
              top: totalOffset,
              behavior: "smooth",
            });
          }
        }
      });
    });
});
// ====================== APPLICATION MODAL ======================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("applyModal");
  if (!modal) return;

  const openButtons = document.querySelectorAll(".join-btn, .main-btn");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("applyForm");

  function openModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "visible";
  }

  // Открытие модалки
  openButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Закрытие
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Отправка формы
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        nickname: document.getElementById("nickname").value,
        age: document.getElementById("age").value,
        discord: document.getElementById("discord").value,
        experience: document.getElementById("experience").value,
        reason: document.getElementById("reason").value,
      };

      try {
        const response = await fetch("send-application.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          alert("✅ Заявка успешно отправлена! Мы свяжемся с тобой в Discord.");
          closeModal();
          form.reset();
        } else {
          alert("Ошибка отправки заявки.");
        }
      } catch (error) {
        console.error(error);
        alert("Не удалось отправить заявку.");
      }
    });
  }
});
// Восстановление позиции
const savedX = localStorage.getItem("playerX");
const savedY = localStorage.getItem("playerY");

if (savedX && savedY) {
  player.style.left = savedX + "px";
  player.style.top = savedY + "px";
  player.style.right = "auto";
  player.style.bottom = "auto";
}

// Сохранение позиции
document.addEventListener("mouseup", () => {
  if (player.style.left) {
    localStorage.setItem("playerX", parseInt(player.style.left));

    localStorage.setItem("playerY", parseInt(player.style.top));
  }
});
const currentTimeLabel = document.getElementById("currentTime");

const durationLabel = document.getElementById("duration");

audio.addEventListener("timeupdate", () => {
  currentTimeLabel.textContent = formatTime(audio.currentTime);

  durationLabel.textContent = formatTime(audio.duration);
});

function formatTime(sec) {
  if (!sec) return "0:00";

  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);

  return `${m}:${s < 10 ? "0" : ""}${s}`;
}
async function loadMembers() {
  const response = await fetch("api/discord.php");

  const members = await response.json();

  const container = document.getElementById("discordMembers");

  container.innerHTML = "";

  members.forEach((member) => {
    container.innerHTML += `
            <div class="member-item">
                <span class="online-dot"></span>
                ${member.name}
            </div>
        `;
  });
}

loadMembers();

async function loadMembers() {
  const response = await fetch("api/discord.php");
  const data = await response.json();

  const container = document.getElementById("members");

  container.innerHTML = data
    .map(
      (m) => `
      <div class="member">
        <img src="${m.avatar}" />
        <span>${m.name}</span>
        <b class="${m.status}">${m.status}</b>
      </div>
    `,
    )
    .join("");
}

loadMembers();
setInterval(loadMembers, 10000);
