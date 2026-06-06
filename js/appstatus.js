// ── Статус заявки — localStorage версия ───────────────────────
export function initAppStatus() {
  const form   = document.getElementById("statusForm");
  const result = document.getElementById("statusResult");
  if (!form) return;

  if (result) result.style.display = "";

  form.addEventListener("submit", e => {
    e.preventDefault();
    const discord = document.getElementById("statusDiscord").value.trim();
    if (!discord) return;

    result.className = "status-result loading";
    result.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Проверяем...`;

    setTimeout(() => {
      const apps = JSON.parse(localStorage.getItem("miller_applications") || "[]");
      const app  = apps.find(a => a.discord.toLowerCase() === discord.toLowerCase());

      if (!app) {
        result.className = "status-result not-found";
        result.innerHTML = `
          <i class="fa-solid fa-circle-question"></i>
          <div>
            <div class="sr-title">Заявка не найдена</div>
            <div class="sr-sub">Проверь правильность Discord тега или подай заявку</div>
          </div>`;
        return;
      }

      const icons  = { pending: "fa-clock", approved: "fa-circle-check", rejected: "fa-circle-xmark" };
      const labels = { pending: "НА РАССМОТРЕНИИ", approved: "ОДОБРЕНО", rejected: "ОТКЛОНЕНО" };

      result.className = `status-result status-${app.status}`;
      result.innerHTML = `
        <i class="fa-solid ${icons[app.status] || "fa-clock"}"></i>
        <div>
          <div class="sr-title">${labels[app.status] || app.status}</div>
          <div class="sr-sub">Никнейм: <b>${app.nickname}</b> · Подано: ${new Date(app.createdAt).toLocaleDateString("ru-RU")}</div>
          ${app.comment ? `<div class="sr-comment">${app.comment}</div>` : ""}
        </div>`;
    }, 500);
  });
}
