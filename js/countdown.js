import { NEXT_EVENT } from "./config/events.js";

export function initCountdown() {
  const el = document.getElementById("countdownWidget");
  if (!el) return;

  // Берём событие из localStorage (если изменено в админке), иначе из конфига
  const stored = JSON.parse(localStorage.getItem("miller_event") || "null");
  const event  = stored || { title: NEXT_EVENT.title, desc: NEXT_EVENT.description, date: NEXT_EVENT.date };

  document.getElementById("countdownEventName")
    && (document.getElementById("countdownEventName").textContent = event.title);
  document.getElementById("countdownEventDesc")
    && (document.getElementById("countdownEventDesc").textContent = event.desc || "");

  const target = new Date(event.date).getTime();

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      document.getElementById("cdDays").textContent    = "00";
      document.getElementById("cdHours").textContent   = "00";
      document.getElementById("cdMinutes").textContent = "00";
      document.getElementById("cdSeconds").textContent = "00";
      document.querySelector(".countdown-label-top")
        && (document.querySelector(".countdown-label-top").textContent = "СОБЫТИЕ УЖЕ НАЧАЛОСЬ!");
      return;
    }

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
  setInterval(tick, 1000);
}
