export function initAppStatus() {
  const form   = document.getElementById("statusForm");
  const result = document.getElementById("statusResult");
  if (!form) return;

  if (result) result.style.display = "";

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const discord = document.getElementById("statusDiscord").value.trim();
    if (!discord) return;

    result.className = "status-result loading";
    result.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Проверяем...`;

    try {
      const res  = await fetch(`/api/application-status?discord=${encodeURIComponent(discord)}`);
      const data = await res.json();

      if (!data.found) {
        result.className = "status-result not-found";
        result.innerHTML = `
          <i class="fa-solid fa-circle-question"></i>
          <div>
            <div class="sr-title">Заявка не найдена</div>
            <div class="sr-sub">Проверь правильность Discord тега или подай заявку</div>
          </div>`;
        return;
      }

      const icons = { pending: "fa-clock", approved: "fa-circle-check", rejected: "fa-circle-xmark" };
      const labels = { pending: "НА РАССМОТРЕНИИ", approved: "ОДОБРЕНО", rejected: "ОТКЛОНЕНО" };

      result.className = `status-result status-${data.status}`;
      result.innerHTML = `
        <i class="fa-solid ${icons[data.status] || "fa-clock"}"></i>
        <div>
          <div class="sr-title">${labels[data.status] || data.status}</div>
          <div class="sr-sub">Никнейм: <b>${data.nickname}</b> · Подано: ${new Date(data.createdAt).toLocaleDateString("ru-RU")}</div>
          ${data.comment ? `<div class="sr-comment">${data.comment}</div>` : ""}
        </div>`;
    } catch {
      result.className = "status-result not-found";
      result.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Ошибка соединения`;
    }
  });
}
