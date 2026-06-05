// ── Терминальный загрузчик страниц ─────────────────────────────
// Используется на gallery.html, rules.html, history.html

export function initPageLoader({ password, label, onComplete }) {
  const overlay   = document.getElementById("pageLoaderOverlay");
  const pwDisplay = document.getElementById("loaderPassword");
  const bar       = document.getElementById("loaderBar");
  const barPct    = document.getElementById("loaderBarPct");
  const status    = document.getElementById("loaderStatus");
  const content   = document.getElementById("pageContent");

  if (!overlay || !pwDisplay) { onComplete?.(); return; }

  let i = 0;

  // Шаг 1 — печатаем пароль
  function typePW() {
    if (i < password.length) {
      pwDisplay.textContent += password[i];
      i++;
      const delay = 40 + Math.random() * 80;
      setTimeout(typePW, delay);
    } else {
      // Шаг 2 — прогресс-бар
      setTimeout(fillBar, 300);
    }
  }

  function fillBar() {
    let pct = 0;
    status.textContent = "VERIFYING...";
    status.className = "loader-status verifying";
    const iv = setInterval(() => {
      pct += Math.floor(Math.random() * 8) + 3;
      if (pct >= 100) { pct = 100; clearInterval(iv); grantAccess(); }
      bar.style.width = pct + "%";
      barPct.textContent = pct + "%";
    }, 60);
  }

  function grantAccess() {
    setTimeout(() => {
      status.textContent = "✓  ACCESS GRANTED";
      status.className = "loader-status granted";
      // Шаг 3 — скрываем оверлей
      setTimeout(() => {
        overlay.classList.add("loader-exit");
        content?.classList.add("content-visible");
        setTimeout(() => { overlay.style.display = "none"; onComplete?.(); }, 700);
      }, 900);
    }, 300);
  }

  // Запуск с небольшой задержкой
  setTimeout(() => {
    const labelEl = document.getElementById("loaderLabel");
    if (labelEl) labelEl.textContent = label;
    typePW();
  }, 600);
}
