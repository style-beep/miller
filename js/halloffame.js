import { HALL_OF_FAME } from "./config/events.js";

export function initHallOfFame() {
  const grid = document.getElementById("hofGrid");
  if (!grid) return;

  grid.innerHTML = HALL_OF_FAME.map((m, i) => `
    <div class="hof-card hof-rank-${i + 1}">
      <div class="hof-rank-badge">#${i + 1}</div>
      <div class="hof-glow" style="--hc:${m.color}"></div>
      <div class="hof-badge">${m.badge}</div>
      <img src="${m.photo}" alt="${m.name}" class="hof-photo">
      <div class="hof-name">${m.name}</div>
      <div class="hof-role" style="color:${m.color}">${m.role}</div>
      <div class="hof-reason">${m.reason}</div>
      <div class="hof-stats">
        ${Object.entries(m.stats).map(([k, v]) => `
          <div class="hof-stat">
            <span class="hof-stat-val">${v}</span>
            <span class="hof-stat-key">${k}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  // Анимация появления
  const cards = grid.querySelectorAll(".hof-card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("hof-visible"), idx * 120);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
}
