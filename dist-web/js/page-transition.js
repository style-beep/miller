// ── Animated Page Transitions — Miller Family ──────────────────

const TRANSITION_CSS = `
  #pt-overlay {
    position: fixed; inset: 0; z-index: 2147483646;
    background: #030000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0;
    opacity: 0; pointer-events: none;
    transition: opacity 0.38s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity;
  }
  #pt-overlay.pt-show {
    opacity: 1; pointer-events: all;
  }
  .pt-emblem {
    width: 72px; height: 72px; object-fit: contain;
    filter: drop-shadow(0 0 18px rgba(255,42,42,0.55));
    transform: scale(0.82) rotate(-8deg);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0; transition: opacity 0.3s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
  }
  #pt-overlay.pt-show .pt-emblem {
    opacity: 1; transform: scale(1) rotate(0deg);
  }
  .pt-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 17px; font-weight: 900; letter-spacing: 7px;
    background: linear-gradient(90deg, #fff, #ff4444);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 18px;
    opacity: 0; transform: translateY(6px);
    transition: opacity 0.3s 0.08s, transform 0.3s 0.08s;
  }
  #pt-overlay.pt-show .pt-title { opacity: 1; transform: translateY(0); }
  .pt-sub {
    font-family: 'Montserrat', sans-serif;
    font-size: 8px; font-weight: 600; letter-spacing: 5px;
    color: rgba(255,42,42,0.45); margin-top: 5px;
    opacity: 0; transition: opacity 0.3s 0.12s;
  }
  #pt-overlay.pt-show .pt-sub { opacity: 1; }
  .pt-progress {
    width: 56px; height: 2px; background: rgba(255,255,255,0.06);
    border-radius: 2px; margin-top: 22px; overflow: hidden;
    opacity: 0; transition: opacity 0.25s 0.15s;
  }
  #pt-overlay.pt-show .pt-progress { opacity: 1; }
  .pt-progress-bar {
    height: 100%; width: 0%; border-radius: 2px;
    background: linear-gradient(90deg, #8a0000, #ff2a2a);
    transition: width 0.38s ease;
  }
  #pt-overlay.pt-show .pt-progress-bar { width: 100%; }
`;

let overlay = null;

export function initPageTransition() {
  // Inject CSS once
  if (!document.getElementById('pt-styles')) {
    const s = document.createElement('style');
    s.id = 'pt-styles';
    s.textContent = TRANSITION_CSS;
    document.head.appendChild(s);
  }

  // Create overlay
  overlay = document.createElement('div');
  overlay.id = 'pt-overlay';
  overlay.innerHTML = `
    <img src="/images/miller-emblem.png" class="pt-emblem" alt="Miller Family" draggable="false">
    <div class="pt-title">MILLER FAMILY</div>
    <div class="pt-sub">DEL PERRO RP</div>
    <div class="pt-progress"><div class="pt-progress-bar"></div></div>
  `;
  document.body.appendChild(overlay);

  // Enter animation: show → fade out
  overlay.classList.add('pt-show');
  setTimeout(() => overlay.classList.remove('pt-show'), 320);

  // Intercept internal link clicks
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Пропускаем якоря, внешние ссылки, пустые
    if (
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();

    // Fade in → navigate
    overlay.classList.add('pt-show');
    setTimeout(() => {
      window.location.href = href;
    }, 420);
  });
}
