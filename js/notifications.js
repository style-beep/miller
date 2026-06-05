export function initNotifications() {
  const container = document.getElementById("alertContainer");
  if (!container) return;

  // Подключаемся по WebSocket
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${protocol}//${location.hostname}:3001`);

  ws.addEventListener("message", e => {
    try {
      const msg = JSON.parse(e.data);
      showNotification(msg.text, msg.type || "info");
    } catch {
      // ignore malformed
    }
  });

  ws.addEventListener("error", () => {}); // тихо игнорируем если WS не поднят

  function showNotification(text, type = "info") {
    const icons = { info: "fa-bell", success: "fa-circle-check", warning: "fa-triangle-exclamation" };
    const toast = document.createElement("div");
    toast.className = `alert-toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || "fa-bell"}"></i>
      <span>${text}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);

    // Появление
    requestAnimationFrame(() => toast.classList.add("toast-visible"));

    // Автоудаление через 6 секунд
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }

  // Экспортируем для использования в других местах
  window.showNotification = showNotification;
}
