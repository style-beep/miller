// ── Модалка заявки ─────────────────────────────────────────
export function initModal() {
  const modal      = document.getElementById("applyModal");
  const closeBtn   = document.getElementById("modalClose");
  const form       = document.getElementById("applyForm");
  const openBtns   = document.querySelectorAll(".join-btn, .main-btn");

  if (!modal) return;

  const open  = () => { modal.classList.add("show");    document.body.style.overflow = "hidden";  };
  const close = () => { modal.classList.remove("show"); document.body.style.overflow = "visible"; };

  openBtns.forEach((btn) => btn.addEventListener("click", (e) => { e.preventDefault(); open(); }));
  closeBtn?.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nickname:   document.getElementById("nickname").value,
      age:        document.getElementById("age").value,
      discord:    document.getElementById("discord").value,
      experience: document.getElementById("experience").value,
      reason:     document.getElementById("reason").value,
    };

    try {
      const res    = await fetch("/api/apply", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        alert("✅ Заявка успешно отправлена! Мы свяжемся с тобой в Discord.");
        close();
        form.reset();
      } else {
        alert("Ошибка отправки заявки: " + (result.message || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить заявку.");
    }
  });
}
