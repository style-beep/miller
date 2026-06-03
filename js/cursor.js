// ── Кастомный курсор ───────────────────────────────────────
export function initCursor() {
  const outer = document.getElementById("cursorOuter");
  const inner = document.getElementById("cursorInner");
  const glow  = document.querySelector(".cursor-glow");

  if (!outer || !inner) return;

  let mouseX = 0, mouseY = 0;
  let outerX  = 0, outerY  = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    inner.style.left = mouseX + "px";
    inner.style.top  = mouseY + "px";

    if (glow) {
      glow.style.left = mouseX + "px";
      glow.style.top  = mouseY + "px";
    }
  });

  (function animateOuter() {
    outerX += (mouseX - outerX) * 0.13;
    outerY += (mouseY - outerY) * 0.13;
    outer.style.left = outerX + "px";
    outer.style.top  = outerY + "px";
    requestAnimationFrame(animateOuter);
  })();

  const hoverTargets =
    "a, button, input, textarea, [class*='card'], .main-btn, .join-btn, .discord-btn, .submit-btn, .modal-close";

  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      outer.classList.add("cursor-hover");
      inner.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      outer.classList.remove("cursor-hover");
      inner.classList.remove("cursor-hover");
    });
  });

  document.addEventListener("mousedown", () => outer.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => outer.classList.remove("cursor-click"));
}
