// ── Все анимации и визуальные эффекты ──────────────────────

// Loader
export function initLoader() {
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    setTimeout(() => {
      loader.style.opacity    = "0";
      loader.style.visibility = "hidden";
    }, 1200);

    // Scanlines поверх лоадера
    const scan = document.createElement("div");
    scan.className = "loader-scanlines";
    loader.appendChild(scan);
  });
}

// Live clock
export function initClock() {
  const clock = document.querySelector(".live-clock");
  if (!clock) return;
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("ru-RU", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

// Scroll progress bar
export function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : "0%";
  }, { passive: true });
}

// Header тень при скролле
export function initHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  // Scroll effect
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
  }, { passive: true });

  // Burger menu
  const burger = document.getElementById("headerBurger");
  const mobileMenu = document.getElementById("headerMobileMenu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = burger.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
      mobileMenu.classList.toggle("open", open);
      mobileMenu.setAttribute("aria-hidden", !open);
    });
    // Закрыть при клике на ссылку
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
      });
    });
    // Закрыть при клике вне меню
    document.addEventListener("click", e => {
      if (!header.contains(e.target) && !mobileMenu.contains(e.target)) {
        burger.classList.remove("open");
        mobileMenu.classList.remove("open");
      }
    });
  }
}

// Активная ссылка в nav при скролле
export function initNavHighlight() {
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section[id]");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }, { passive: true });
}

// Плавный скролл к секциям с учётом высоты хедера
export function initSmoothScroll() {
  document.querySelectorAll("header nav a, .footer-socials a").forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;
      e.preventDefault();
      const target = document.getElementById(href.substring(1));
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// Reveal-анимации при скролле (IntersectionObserver)
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("show"); }),
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  document.querySelectorAll(
    ".hero-left, .hero-right, .glass-card, .rank-card, .member-card, .join-box, .composition, .section-title, .stat-card"
  ).forEach((el) => { el.classList.add("hidden"); observer.observe(el); });

  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    heroTitle.classList.add("hidden");
    setTimeout(() => heroTitle.classList.add("show"), 400);
  }
}

// Счётчики цифр (stat cards)
export function initCounters() {
  function animateCounter(el) {
    const target    = parseInt(el.getAttribute("data-target"));
    const duration  = 2200;
    let current     = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = target === 70
        ? Math.floor(current) + "+"
        : Math.floor(current);
    }, 16);
  }

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".stat-number").forEach((num) => {
          if (!num.classList.contains("counted")) {
            animateCounter(num);
            num.classList.add("counted");
          }
        });
      }
    }),
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-card").forEach((c) => observer.observe(c));
}

// Mouse parallax на фоне
export function initParallax() {
  const bg = document.querySelector(".bg-overlay");
  if (!bg) return;
  let tX = 0, tY = 0, cX = 0, cY = 0;
  document.addEventListener("mousemove", (e) => {
    tX = (e.clientX / window.innerWidth  - 0.5) * 2 * 18;
    tY = (e.clientY / window.innerHeight - 0.5) * 2 * 12;
  });
  (function tick() {
    cX += (tX - cX) * 0.04;
    cY += (tY - cY) * 0.04;
    bg.style.transform = `scale(1.06) translate(${cX}px, ${cY}px)`;
    requestAnimationFrame(tick);
  })();
}

// 3D tilt на карточках
export function initCardTilt() {
  document.querySelectorAll(".rank-card, .member-card, .stat-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform  = `translateY(-14px) scale(1.02) rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
      card.style.boxShadow  = `${-x * 20}px ${y * 20}px 40px rgba(255,0,0,0.18), 0 30px 80px rgba(0,0,0,0.5)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}

// Glitch-эффект на заголовке hero
export function initGlitch() {
  const title = document.querySelector(".hero-title");
  if (!title) return;
  const trigger = () => {
    title.classList.add("glitching");
    setTimeout(() => title.classList.remove("glitching"), 600);
  };
  const schedule = () => setTimeout(() => { trigger(); schedule(); }, Math.random() * 6000 + 6000);
  schedule();
  title.addEventListener("mouseenter", trigger);
}

// Печатающийся текст в subtitle
export function initTyping() {
  const el = document.querySelector(".hero-subtitle");
  if (!el) return;
  const phrases = ["DEL PERRO GTA 5 ROLEPLAY", "ВЛАСТЬ НАД LOS SANTOS", "ЭЛИТА СЕРВЕРА", "MILLER FAMILY"];
  let pIdx = 0, cIdx = 0, deleting = false;
  el.textContent = "";
  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 80);
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 1600);
}

// Ripple на клике по логотипу
export function initLogoRipple() {
  const logo = document.querySelector(".logo");
  if (!logo) return;
  logo.style.position = "relative";
  logo.style.overflow = "hidden";
  logo.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.className = "logo-ripple";
    const rect = logo.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left + "px";
    ripple.style.top  = e.clientY - rect.top  + "px";
    logo.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
}

// Брызги крови при клике
export function initBloodSplatter() {
  document.addEventListener("click", (e) => {
    const count = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < count; i++) {
      const drop  = document.createElement("div");
      drop.className = "blood-drop";
      const angle = Math.random() * 360;
      const dist  = Math.random() * 70 + 20;
      const size  = Math.random() * 8 + 4;
      const dur   = Math.random() * 0.4 + 0.4;
      drop.style.cssText = `
        left:${e.clientX}px; top:${e.clientY}px;
        width:${size}px; height:${size}px;
        --ax:${Math.cos(angle * Math.PI / 180) * dist}px;
        --ay:${Math.sin(angle * Math.PI / 180) * dist}px;
        animation-duration:${dur}s;
      `;
      document.body.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove());
    }
  });
}

// Posplit reveal для .section-title
export function initTitleSplit() {
  document.querySelectorAll(".section-title").forEach((title) => {
    const text = title.textContent.trim();
    title.textContent = "";
    title.style.overflow = "hidden";
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? " " : char;
      span.className = "split-char";
      span.style.transitionDelay = `${i * 0.04}s`;
      title.appendChild(span);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          title.querySelectorAll(".split-char").forEach((s) => s.classList.add("char-show"));
          obs.unobserve(title);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(title);
  });
}

// Уведомления-алёрты
export function initAlerts() {
  const alerts = [
    { title: "TERRITORY SECURED", text: "Roy Miller captured territory" },
    { title: "NEW MEMBER",        text: "New player joined family"      },
    { title: "MEETING STARTED",   text: "Eddie Miller opened briefing"  },
    { title: "BUSINESS UPDATED",  text: "Family income increased"       },
  ];

  function createAlert() {
    const container = document.getElementById("alertContainer");
    if (!container) return;
    const data  = alerts[Math.floor(Math.random() * alerts.length)];
    const alert = document.createElement("div");
    alert.className = "alert-box";
    alert.innerHTML = `<div class="alert-title">${data.title}</div><div class="alert-text">${data.text}</div>`;
    container.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  }

  setInterval(createAlert, 15000);
}
