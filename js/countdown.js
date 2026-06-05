import { NEXT_EVENT } from "../events.config.js";

export function initCountdown() {
  const el = document.getElementById("countdownWidget");
  if (!el) return;

  document.getElementById("countdownEventName")
    && (document.getElementById("countdownEventName").textContent = NEXT_EVENT.title);
  document.getElementById("countdownEventDesc")
    && (document.getElementById("countdownEventDesc").textContent = NEXT_EVENT.description);

  const target = new Date(NEXT_EVENT.date).getTime();

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
