// ── Прицел-курсор ───────────────────────────────────────────
export function initCursor() {
  const outer = document.getElementById("cursorOuter");
  const inner = document.getElementById("cursorInner");
  const glow  = document.querySelector(".cursor-glow");

  if (!outer || !inner) return;

  // Строим прицел из линий
  outer.innerHTML = `
    <div class="ch-line ch-top"></div>
    <div class="ch-line ch-right"></div>
    <div class="ch-line ch-bottom"></div>
    <div class="ch-line ch-left"></div>
    <div class="ch-center"></div>
  `;

  let mouseX = 0, mouseY = 0;
  let outerX = 0,  outerY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + "px";
    inner.style.top  = mouseY + "px";
    if (glow) { glow.style.left = mouseX + "px"; glow.style.top = mouseY + "px"; }
  });

  (function animateOuter() {
    outerX += (mouseX - outerX) * 0.1;
    outerY += (mouseY - outerY) * 0.1;
    outer.style.left = outerX + "px";
    outer.style.top  = outerY + "px";
    requestAnimationFrame(animateOuter);
  })();

  const hoverTargets = "a, button, input, textarea, [class*='card'], .main-btn, .join-btn, .discord-btn, .submit-btn";

  function bindHover(el) {
    el.addEventListener("mouseenter", () => { outer.classList.add("cursor-hover"); inner.classList.add("cursor-hover"); });
    el.addEventListener("mouseleave", () => { outer.classList.remove("cursor-hover"); inner.classList.remove("cursor-hover"); });
  }

  document.querySelectorAll(hoverTargets).forEach(bindHover);

  // Наблюдаем за динамически добавленными элементами
  new MutationObserver(() => {
    document.querySelectorAll(hoverTargets).forEach(bindHover);
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener("mousedown", () => outer.classList.add("cursor-click"));
  document.addEventListener("mouseup",   () => outer.classList.remove("cursor-click"));
}
