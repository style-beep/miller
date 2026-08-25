// ── Модалка заявки — localStorage + автосохранение ───────────
const DRAFT_KEY = "miller_form_draft";
const FIELDS    = ["nickname", "age", "discord", "experience", "reason"];

export function initModal() {
  const modal    = document.getElementById("applyModal");
  const closeBtn = document.getElementById("modalClose");
  const form     = document.getElementById("applyForm");
  const openBtns = document.querySelectorAll(".join-btn, .main-btn");

  if (!modal) return;

  const open  = () => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    restoreDraft();
  };
  const close = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "visible";
  };

  openBtns.forEach(btn => btn.addEventListener("click", e => { e.preventDefault(); open(); }));
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", e => { if (e.target === modal) close(); });

  // ── Автосохранение при вводе ──────────────────────────────
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", saveDraft);
  });

  // ── Отправка ──────────────────────────────────────────────
  form?.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
      id:         Date.now().toString(),
      nickname:   document.getElementById("nickname").value.trim(),
      age:        document.getElementById("age").value.trim(),
      discord:    document.getElementById("discord").value.trim(),
      experience: document.getElementById("experience").value.trim(),
      reason:     document.getElementById("reason").value.trim(),
      status:     "pending",
      comment:    "",
      createdAt:  new Date().toISOString(),
    };

    const apps = JSON.parse(localStorage.getItem("miller_applications") || "[]");
    const duplicate = apps.find(a => a.discord.toLowerCase() === data.discord.toLowerCase());
    if (duplicate) {
      showNotification("⚠️ Заявка с этим Discord уже подана!", "warning");
      return;
    }

    apps.push(data);
    localStorage.setItem("miller_applications", JSON.stringify(apps));
    clearDraft();

    showNotification("✅ Заявка отправлена! Ожидай ответа в Discord.", "success");
    close();
    form.reset();
  });
}

// ── Черновик ─────────────────────────────────────────────────
function saveDraft() {
  const draft = {};
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) draft[id] = el.value;
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function restoreDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;
  try {
    const draft = JSON.parse(raw);
    FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && draft[id]) el.value = draft[id];
    });
    // Показываем подсказку если есть черновик
    const hint = document.getElementById("draftHint");
    if (hint) hint.style.display = "flex";
  } catch(e) {}
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
  const hint = document.getElementById("draftHint");
  if (hint) hint.style.display = "none";
}

function showNotification(msg, type) {
  const n = document.createElement("div");
  n.style.cssText = `
    position:fixed;bottom:30px;right:30px;z-index:999999;
    padding:16px 24px;border-radius:10px;
    background:${type === "success" ? "rgba(20,80,20,0.95)" : "rgba(80,50,0,0.95)"};
    border:1px solid ${type === "success" ? "rgba(76,175,80,0.5)" : "rgba(255,160,0,0.5)"};
    color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;
    box-shadow:0 8px 32px rgba(0,0,0,0.5);
  `;
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}
