// ══════════════════════════════════════════════════════
//  Управление режимом производительности (Lite / Full)
// ══════════════════════════════════════════════════════

const STORAGE_KEY = "miller_lite_mode";

// ── Автоопределение слабого устройства ─────────────────
function isWeakDevice() {
  // Мобильный
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Мало ядер CPU (≤ 4 — слабый ПК/телефон)
  const lowCPU = navigator.hardwareConcurrency !== undefined
    && navigator.hardwareConcurrency <= 4;

  // Мало RAM (API доступен только в Chrome)
  const lowRAM = navigator.deviceMemory !== undefined
    && navigator.deviceMemory <= 2;

  return isMobile || lowCPU || lowRAM;
}

// ── Применить / снять lite mode ────────────────────────
function applyMode(lite) {
  document.body.classList.toggle("lite-mode", lite);
  localStorage.setItem(STORAGE_KEY, lite ? "1" : "0");
}

// ── Создать кнопку переключения ────────────────────────
function createToggleBtn() {
  const btn = document.createElement("button");
  btn.id = "perfToggleBtn";
  btn.innerHTML = `
    <span class="ptb-dot"></span>
    <span class="ptb-label-full">⚡ Лайт режим</span>
    <span class="ptb-label-lite">✨ Полный режим</span>
  `;
  btn.title = "Переключить режим производительности";
  btn.addEventListener("click", () => {
    const isLite = document.body.classList.contains("lite-mode");
    applyMode(!isLite);
  });
  document.body.appendChild(btn);
}

// ── Инициализация ──────────────────────────────────────
export function initPerf() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved === "1") {
    // Пользователь уже выбрал lite
    applyMode(true);
  } else if (saved === null && isWeakDevice()) {
    // Первый визит на слабом устройстве — включаем автоматически
    applyMode(true);
    console.info("[perf] Lite mode auto-enabled (weak device detected)");
  }
  // saved === "0" → пользователь явно выбрал полный режим, не трогаем

  // Кнопку добавляем после загрузки DOM
  if (document.body) {
    createToggleBtn();
  } else {
    document.addEventListener("DOMContentLoaded", createToggleBtn);
  }
}
