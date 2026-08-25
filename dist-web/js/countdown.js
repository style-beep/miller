import { NEXT_EVENT } from "./config/events.js";

export function initCountdown() {
  const el = document.getElementById("countdownWidget") || document.getElementById("countdown");
  if (!el) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  // Читаем актуальные данные события из localStorage
  function getEvent() {
    const stored = JSON.parse(localStorage.getItem("miller_event") || "null");
    return stored || { title: NEXT_EVENT.title, desc: NEXT_EVENT.description, date: NEXT_EVENT.date };
  }

  // Применяем данные события в DOM
  function applyEvent(event) {
    const nameEl = document.getElementById("countdownEventName");
    const descEl = document.getElementById("countdownEventDesc");
    if (nameEl) nameEl.textContent = event.title || "";
    if (descEl) descEl.textContent = event.desc  || "";
  }

  // Инициализируем с текущими данными
  applyEvent(getEvent());

  let timerInterval = null;

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    const event  = getEvent();
    applyEvent(event);
    const target = new Date(event.date).getTime();

    const labelEl = document.querySelector(".countdown-label-top");

    function tick() {
      const diff = target - Date.now();

      if (diff <= 0) {
        document.getElementById("cdDays").textContent    = "00";
        document.getElementById("cdHours").textContent   = "00";
        document.getElementById("cdMinutes").textContent = "00";
        document.getElementById("cdSeconds").textContent = "00";
        if (labelEl) labelEl.textContent = "СОБЫТИЕ УЖЕ НАЧАЛОСЬ!";
        return;
      }

      if (labelEl) labelEl.textContent = "СЛЕДУЮЩЕЕ СОБЫТИЕ";

      const days    = Math.floor(diff / 86400000);
      const hours   = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000)  / 60000);
      const seconds = Math.floor((diff % 60000)    / 1000);

      document.getElementById("cdDays").textContent    = pad(days);
      document.getElementById("cdHours").textContent   = pad(hours);
      document.getElementById("cdMinutes").textContent = pad(minutes);
      document.getElementById("cdSeconds").textContent = pad(seconds);
    }

    tick();
    timerInterval = setInterval(tick, 1000);
  }

  startTimer();

  // Реагируем на изменения в localStorage (из другой вкладки/окна — например, из админки)
  window.addEventListener("storage", e => {
    if (e.key === "miller_event") startTimer();
  });
}
