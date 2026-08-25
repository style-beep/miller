import { TIMELINE } from "./config/events.js";

export function initTimeline() {
  const container = document.getElementById("timelineList");
  if (!container) return;

  container.innerHTML = TIMELINE.map((ev, i) => `
    <div class="tl-item tl-${ev.side} ${ev.active ? "tl-active" : ""}" data-index="${i}">
      <div class="tl-dot">
        <span>${ev.icon}</span>
      </div>
      <div class="tl-card">
        <div class="tl-date">${ev.date}</div>
        <div class="tl-title">${ev.title}</div>
        <div class="tl-text">${ev.text}</div>
      </div>
    </div>
  `).join("");

  // Анимация при скролле
  const items = container.querySelectorAll(".tl-item");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("tl-visible");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(el => observer.observe(el));
}
