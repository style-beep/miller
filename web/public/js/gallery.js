import { GALLERY } from "./config/events.js";

export function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  // Рендер сетки
  grid.innerHTML = GALLERY.map((item, i) => `
    <div class="gallery-item" data-index="${i}">
      <img src="${item.src}" alt="${item.caption}" loading="lazy">
      <div class="gallery-overlay">
        <span class="gallery-caption">${item.caption}</span>
        <span class="gallery-zoom"><i class="fa-solid fa-expand"></i></span>
      </div>
    </div>
  `).join("");

  // Лайтбокс
  const lb      = document.getElementById("galleryLightbox");
  const lbImg   = document.getElementById("lbImg");
  const lbCap   = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev  = document.getElementById("lbPrev");
  const lbNext  = document.getElementById("lbNext");
  const lbCount = document.getElementById("lbCount");

  let current = 0;

  function openLightbox(i) {
    current = i;
    lbImg.src       = GALLERY[i].src;
    lbCap.textContent = GALLERY[i].caption;
    lbCount.textContent = `${i + 1} / ${GALLERY.length}`;
    lb.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("active");
    document.body.style.overflow = "";
  }

  function navigate(dir) {
    current = (current + dir + GALLERY.length) % GALLERY.length;
    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.src = GALLERY[current].src;
      lbCap.textContent = GALLERY[current].caption;
      lbCount.textContent = `${current + 1} / ${GALLERY.length}`;
      lbImg.style.opacity = "1";
    }, 180);
  }

  grid.querySelectorAll(".gallery-item").forEach((el, i) => {
    el.addEventListener("click", () => openLightbox(i));
  });

  lbClose?.addEventListener("click", closeLightbox);
  lbPrev?.addEventListener("click",  () => navigate(-1));
  lbNext?.addEventListener("click",  () => navigate(1));

  lb?.addEventListener("click", e => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (!lb?.classList.contains("active")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
}
