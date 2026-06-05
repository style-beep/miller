// ── Кинематографическое интро (показывается только при первом визите) ──
export function initIntro() {
  // Показываем только при первом заходе
  if (localStorage.getItem("mf-intro-shown")) return;

  const overlay = document.getElementById("introOverlay");
  if (!overlay) return;

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  const logo    = overlay.querySelector(".intro-logo");
  const tagline = overlay.querySelector(".intro-tagline");
  const bar     = overlay.querySelector(".intro-bar-fill");
  const skip    = overlay.querySelector(".intro-skip");

  let done = false;

  function finish() {
    if (done) return;
    done = true;
    overlay.classList.add("intro-exit");
    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      localStorage.setItem("mf-intro-shown", "1");
    }, 800);
  }

  skip?.addEventListener("click", finish);

  // Последовательность анимаций
  setTimeout(() => logo?.classList.add("intro-visible"),    400);
  setTimeout(() => tagline?.classList.add("intro-visible"), 1200);
  setTimeout(() => { if (bar) bar.style.width = "100%"; },  1600);
  setTimeout(finish, 4200);
}
