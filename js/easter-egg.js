// ── Easter Egg — Konami Code + Glitch — Miller Family ──────────

// ─── Konami Code ─────────────────────────────────────────────
const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'KeyB','KeyA',
];

const EGG_CSS = `
  #egg-overlay {
    position: fixed; inset: 0; z-index: 2147483647;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    opacity: 0; pointer-events: none;
    transition: opacity 0.5s;
    overflow: hidden;
  }
  #egg-overlay.egg-show { opacity: 1; pointer-events: all; }

  /* Scan lines */
  #egg-overlay::before {
    content: '';
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: repeating-linear-gradient(
      0deg, transparent 0px, transparent 3px,
      rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px
    );
  }
  /* Red vignette */
  #egg-overlay::after {
    content: '';
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 40%, rgba(120,0,0,0.5) 100%);
  }

  .egg-content {
    position: relative; z-index: 1;
    text-align: center; padding: 30px 20px;
    max-width: 700px;
  }
  .egg-stamp {
    font-family: 'Special Elite', 'Courier New', cursive;
    font-size: clamp(11px, 2vw, 14px); letter-spacing: 6px;
    color: rgba(255,42,42,0.6); margin-bottom: 24px;
    animation: egg-blink 1.5s ease-in-out infinite;
  }
  @keyframes egg-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .egg-emblem-wrap {
    position: relative; display: inline-block; margin-bottom: 28px;
  }
  .egg-emblem {
    width: clamp(80px,15vw,120px); height: clamp(80px,15vw,120px);
    object-fit: contain;
    filter: drop-shadow(0 0 30px rgba(255,0,0,0.8))
            drop-shadow(0 0 60px rgba(255,0,0,0.4));
    animation: egg-emblem-spin 8s linear infinite;
  }
  @keyframes egg-emblem-spin { to { transform: rotate(360deg); } }

  .egg-title {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(28px, 6vw, 52px); font-weight: 900;
    letter-spacing: 4px; color: #fff; line-height: 1.1;
    margin-bottom: 6px;
    animation: egg-glitch-title 2.5s infinite;
  }
  @keyframes egg-glitch-title {
    0%,88%,100% { filter: none; transform: none; }
    89% { filter: hue-rotate(90deg); transform: translateX(-3px) skewX(-2deg); }
    90% { filter: none; transform: translateX(3px); }
    91% { filter: invert(0.08); transform: none; }
  }
  .egg-title span { color: #ff2a2a; }

  .egg-subtitle {
    font-family: 'Montserrat', sans-serif;
    font-size: clamp(9px, 1.5vw, 11px); font-weight: 700;
    letter-spacing: 5px; color: rgba(255,42,42,0.6);
    margin-bottom: 32px;
  }

  .egg-divider {
    width: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, #ff2a2a, transparent);
    margin: 0 auto 28px;
  }

  .egg-secret-box {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,42,42,0.2);
    border-left: 3px solid rgba(255,42,42,0.6);
    border-radius: 4px; padding: 18px 24px;
    margin-bottom: 24px; text-align: left;
  }
  .egg-secret-label {
    font-family: 'Special Elite', 'Courier New', cursive;
    font-size: 9px; letter-spacing: 4px;
    color: rgba(255,42,42,0.5); margin-bottom: 10px; font-weight: 700;
  }
  .egg-secret-text {
    font-family: 'Special Elite', 'Courier New', cursive;
    font-size: clamp(12px, 2vw, 14px); line-height: 1.9;
    color: rgba(255,255,255,0.55);
  }
  .egg-secret-text b { color: rgba(255,200,200,0.8); }

  .egg-code-row {
    display: flex; align-items: center; justify-content: center;
    gap: 8px; flex-wrap: wrap; margin-bottom: 28px;
  }
  .egg-key {
    display: inline-block; padding: 5px 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-bottom: 2px solid rgba(255,255,255,0.2);
    border-radius: 5px; font-size: 11px; font-weight: 700;
    color: rgba(255,255,255,0.6); font-family: monospace;
    letter-spacing: 1px;
  }
  .egg-key.active {
    background: rgba(255,42,42,0.2);
    border-color: rgba(255,42,42,0.5);
    color: #ff6666;
    box-shadow: 0 0 8px rgba(255,42,42,0.4);
  }

  .egg-close {
    background: none; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.35); padding: 10px 28px;
    border-radius: 6px; font-family: 'Montserrat', sans-serif;
    font-size: 10px; font-weight: 700; letter-spacing: 3px;
    cursor: pointer; transition: all 0.25s;
  }
  .egg-close:hover {
    border-color: rgba(255,42,42,0.5); color: #fff;
    background: rgba(255,42,42,0.1);
  }

  .egg-corner {
    position: absolute; font-family: 'Special Elite', cursive;
    font-size: 10px; letter-spacing: 2px;
    color: rgba(255,255,255,0.07);
  }
  .egg-corner-tl { top: 20px; left: 24px; }
  .egg-corner-tr { top: 20px; right: 24px; text-align: right; }
  .egg-corner-bl { bottom: 20px; left: 24px; }
  .egg-corner-br { bottom: 20px; right: 24px; text-align: right; }
`;

function createEggOverlay() {
  const div = document.createElement('div');
  div.id = 'egg-overlay';
  div.innerHTML = `
    <div class="egg-corner egg-corner-tl">MILLER FAMILY<br>CLASSIFIED ACCESS</div>
    <div class="egg-corner egg-corner-tr">LEVEL: OMEGA<br>CLEARANCE GRANTED</div>
    <div class="egg-corner egg-corner-bl">DEL PERRO RP · 2026</div>
    <div class="egg-corner egg-corner-br">EYES ONLY<br>DESTROY AFTER READING</div>

    <div class="egg-content">
      <div class="egg-stamp">⚠ СЕКРЕТНЫЙ ФАЙЛ РАЗБЛОКИРОВАН ⚠</div>

      <div class="egg-emblem-wrap">
        <img src="/images/miller-emblem.png" class="egg-emblem" alt="" draggable="false">
      </div>

      <div class="egg-title">MILLER <span>FAMILY</span></div>
      <div class="egg-subtitle">DEL PERRO RP · POWER · LOYALTY · RESPECT</div>
      <div class="egg-divider"></div>

      <div class="egg-secret-box">
        <div class="egg-secret-label">// СЕКРЕТНЫЙ АРХИВ — MILLER FAMILY //</div>
        <div class="egg-secret-text">
          Ты нашёл то, что не должны были найти.<br>
          Семья <b>Miller</b> существует в тени — пока другие думают, что контролируют улицы,
          настоящая власть принадлежит <b>Del Perro</b>.<br><br>
          С <b>2023</b> года — ни одного провала. Ни одного предателя, который остался бы жив.<br>
          <b>70+</b> бойцов. <b>5</b> районов. <b>0</b> сожалений.<br><br>
          Ты знаешь слишком много. Но раз ты здесь — ты уже один из нас.
        </div>
      </div>

      <div class="egg-code-row" id="eggCodeRow"></div>

      <button class="egg-close" id="eggClose">[ ESC ] ЗАКРЫТЬ ФАЙЛ</button>
    </div>
  `;
  return div;
}

// ─── Glitch Effect on Logos ───────────────────────────────────
const GLITCH_CSS = `
  @keyframes logo-glitch {
    0%,80%,100% { filter:none; transform:none; }
    81% { filter:hue-rotate(25deg) saturate(2); transform:translateX(-3px) skewX(-1.5deg); }
    82% { filter:none; transform:translateX(3px); }
    83% { filter:contrast(1.3) brightness(1.1); transform:none; }
    84% { filter:none; transform:translateX(-1px); }
    85% { filter:hue-rotate(-15deg); transform:none; }
    86% { filter:none; transform:none; }
  }
  @keyframes logo-glitch-hover {
    0%,100% { filter:none; transform:none; }
    15% { filter:hue-rotate(30deg) saturate(3); transform:translateX(-4px) scaleY(0.98); }
    16% { filter:none; transform:translateX(4px); }
    17% { filter:contrast(2) brightness(1.2); transform:none; }
    18% { filter:none; transform:translateX(-2px); }
    35% { filter:hue-rotate(-20deg) saturate(2); transform:translateX(2px) skewX(1deg); }
    36% { filter:none; transform:none; }
  }

  /* Главная страница */
  .logo {
    animation: logo-glitch 7s ease-in-out infinite;
    cursor: pointer;
  }
  .logo:hover {
    animation: logo-glitch-hover 0.6s steps(1) forwards;
  }

  /* Подстраницы */
  .header-logo-main {
    animation: logo-glitch 9s ease-in-out infinite;
  }
  .header-logo:hover .header-logo-main {
    animation: logo-glitch-hover 0.6s steps(1) forwards;
  }

  /* page.css подстраницы */
  .page-logo {
    animation: logo-glitch 8s ease-in-out infinite;
  }
  .page-logo:hover {
    animation: logo-glitch-hover 0.6s steps(1) forwards;
  }
`;

// ─── Main export ──────────────────────────────────────────────
export function initEasterEgg() {
  // Inject CSS
  if (!document.getElementById('egg-styles')) {
    const s = document.createElement('style');
    s.id = 'egg-styles';
    s.textContent = EGG_CSS + GLITCH_CSS;
    document.head.appendChild(s);
  }

  // ── Konami code listener ──
  let seq = [];
  const KEYS_DISPLAY = ['↑','↑','↓','↓','←','→','←','→','B','A'];

  document.addEventListener('keydown', e => {
    seq.push(e.code);
    if (seq.length > KONAMI.length) seq.shift();

    if (seq.join(',') === KONAMI.join(',')) {
      seq = [];
      showEasterEgg(KEYS_DISPLAY);
    }
  });
}

function showEasterEgg(keys) {
  // Remove existing if any
  document.getElementById('egg-overlay')?.remove();

  const overlay = createEggOverlay();
  document.body.appendChild(overlay);

  // Render key sequence
  const row = document.getElementById('eggCodeRow');
  if (row) {
    keys.forEach((k, i) => {
      const span = document.createElement('span');
      span.className = 'egg-key';
      span.textContent = k;
      row.appendChild(span);
      // Animate keys lighting up
      setTimeout(() => span.classList.add('active'), i * 60);
    });
  }

  // Close button & ESC
  document.getElementById('eggClose')?.addEventListener('click', hideEasterEgg);
  const escHandler = e => {
    if (e.key === 'Escape') { hideEasterEgg(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  // Show with slight delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('egg-show'));
  });
}

function hideEasterEgg() {
  const overlay = document.getElementById('egg-overlay');
  if (!overlay) return;
  overlay.classList.remove('egg-show');
  setTimeout(() => overlay.remove(), 500);
}
