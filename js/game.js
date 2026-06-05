// ── Territory Capture Game ─────────────────────────────────────

const FACTIONS = {
  player:  { name: 'MILLER FAMILY', color: '#cc1111', light: '#ff4444', glow: 'rgba(204,17,17,0.5)',  icon: '👑' },
  diablos: { name: 'LOS DIABLOS',   color: '#7b2fbe', light: '#b06fe8', glow: 'rgba(123,47,190,0.5)', icon: '💀' },
  vagos:   { name: 'VAGOS',         color: '#c8960c', light: '#f0c040', glow: 'rgba(200,150,12,0.5)', icon: '🔥' },
  ballas:  { name: 'BALLAS',        color: '#1a4fa0', light: '#5090f0', glow: 'rgba(26,79,160,0.5)',  icon: '⚔️' },
  neutral: { name: 'НЕЙТРАЛЬНЫЕ',   color: '#1c1c1c', light: '#555',    glow: 'none',                 icon: '🏳️' },
};

const TERRITORY_DATA = [
  { id: 0,  name: 'Paleto Bay',     row: 0, col: 0, emoji: '🏔️' },
  { id: 1,  name: 'Grapeseed',      row: 0, col: 1, emoji: '🌾' },
  { id: 2,  name: 'Sandy Shores',   row: 0, col: 2, emoji: '🏜️' },
  { id: 3,  name: 'Alamo Sea',      row: 0, col: 3, emoji: '🌊' },
  { id: 4,  name: 'Blaine County',  row: 0, col: 4, emoji: '🏕️' },
  { id: 5,  name: 'Ft. Zancudo',    row: 1, col: 0, emoji: '🪖' },
  { id: 6,  name: 'Chumash',        row: 1, col: 1, emoji: '🌅' },
  { id: 7,  name: 'Vinewood Hills', row: 1, col: 2, emoji: '⭐' },
  { id: 8,  name: 'Rockford Hills', row: 1, col: 3, emoji: '🏡' },
  { id: 9,  name: 'Harmony',        row: 1, col: 4, emoji: '🛣️' },
  { id: 10, name: 'Del Perro',      row: 2, col: 0, emoji: '🏖️' },
  { id: 11, name: 'Vespucci',       row: 2, col: 1, emoji: '🌴' },
  { id: 12, name: 'Downtown LS',    row: 2, col: 2, emoji: '🏙️' },
  { id: 13, name: 'East LS',        row: 2, col: 3, emoji: '🏢' },
  { id: 14, name: 'La Mesa',        row: 2, col: 4, emoji: '🏭' },
  { id: 15, name: 'LSIA',           row: 3, col: 0, emoji: '✈️' },
  { id: 16, name: 'Little Seoul',   row: 3, col: 1, emoji: '🏮' },
  { id: 17, name: 'Strawberry',     row: 3, col: 2, emoji: '🍓' },
  { id: 18, name: 'Davis',          row: 3, col: 3, emoji: '🔫' },
  { id: 19, name: 'Cypress Flats',  row: 3, col: 4, emoji: '🏗️' },
];

// Starting territory for each faction (corner positions)
const FACTION_STARTS = {
  player:  10, // Del Perro
  ballas:  0,  // Paleto Bay
  diablos: 4,  // Blaine County
  vagos:   19, // Cypress Flats
};

const REGEN_MS   = 3000;
const AI_MS      = 2200;
const MAX_TROOPS = 30;

export function initGame() {
  let territories = [];
  let selected    = null;
  let gamePhase   = 'idle';
  let timerSec    = 0;
  let regenTimer  = null;
  let aiTimer     = null;
  let clockTimer  = null;

  const mapEl       = document.getElementById('gameMap');
  const timerEl     = document.getElementById('gameTimerEl');
  const logEl       = document.getElementById('gameLog');
  const infoPanel   = document.getElementById('gameInfoPanel');
  const overlay     = document.getElementById('gameOverlay');
  const overlayTitle = document.getElementById('gameOverlayTitle');
  const overlayMsg  = document.getElementById('gameOverlayMsg');

  if (!mapEl) return;

  // ─── Neighbours ────────────────────────────────────────────
  function getNeighbors(id) {
    const t = TERRITORY_DATA[id];
    return TERRITORY_DATA
      .filter(n => {
        const dr = Math.abs(n.row - t.row);
        const dc = Math.abs(n.col - t.col);
        return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
      })
      .map(n => n.id);
  }

  // ─── Init ──────────────────────────────────────────────────
  function initTerritories() {
    territories = TERRITORY_DATA.map(t => ({
      ...t,
      faction:   'neutral',
      troops:    Math.floor(Math.random() * 4) + 3,
      neighbors: getNeighbors(t.id),
      el:        null,
    }));

    Object.entries(FACTION_STARTS).forEach(([faction, id]) => {
      territories[id].faction = faction;
      territories[id].troops  = faction === 'player' ? 12 : 8;
    });
  }

  // ─── Render ────────────────────────────────────────────────
  function renderMap() {
    mapEl.innerHTML = '';
    territories.forEach(t => {
      const el = document.createElement('div');
      el.className = 'game-territory';
      el.dataset.id = t.id;
      el.innerHTML = `
        <div class="gt-header">
          <span class="gt-emoji">${t.emoji}</span>
          <span class="gt-name">${t.name}</span>
        </div>
        <div class="gt-troops-wrap">
          <div class="gt-troops">${t.troops}</div>
          <div class="gt-troops-label">войска</div>
        </div>
        <div class="gt-bar-wrap">
          <div class="gt-bar"><div class="gt-bar-fill" style="width:${(t.troops/MAX_TROOPS)*100}%"></div></div>
        </div>
        <div class="gt-faction-badge">${FACTIONS[t.faction].icon}</div>
      `;
      el.addEventListener('click',       () => onTerritoryClick(t.id));
      el.addEventListener('mouseenter',  () => onTerritoryHover(t.id));
      el.addEventListener('mouseleave',  () => onTerritoryLeave());
      mapEl.appendChild(el);
      t.el = el;
      refreshEl(t);
    });
  }

  function refreshEl(t) {
    if (!t.el) return;
    const f = FACTIONS[t.faction];
    t.el.style.setProperty('--fc', f.color);
    t.el.style.setProperty('--fl', f.light);
    t.el.style.setProperty('--fg', f.glow);

    t.el.querySelector('.gt-troops').textContent  = t.troops;
    t.el.querySelector('.gt-faction-badge').textContent = f.icon;
    const fill = t.el.querySelector('.gt-bar-fill');
    if (fill) fill.style.width = `${(t.troops / MAX_TROOPS) * 100}%`;

    // Classes
    t.el.className = `game-territory faction-${t.faction}`;
    if (selected === t.id) t.el.classList.add('selected');

    // Attackable highlight
    if (selected !== null && t.id !== selected) {
      const src = territories[selected];
      if (src?.faction === 'player' && src.neighbors.includes(t.id) && t.faction !== 'player') {
        t.el.classList.add('attackable');
      }
    }
  }

  function refreshAll() {
    territories.forEach(t => refreshEl(t));
  }

  // ─── Interactions ──────────────────────────────────────────
  function onTerritoryClick(id) {
    if (gamePhase !== 'playing') return;
    const t = territories[id];

    if (t.faction === 'player') {
      if (t.troops <= 1) {
        showInfo('⚠️ МАЛО ВОЙСК', 'Нужно минимум 2 войска для атаки. Подожди регенерации.', 'warn');
        return;
      }
      selected = (selected === id) ? null : id;
      refreshAll();
      if (selected !== null) {
        const attackable = t.neighbors.filter(n => territories[n].faction !== 'player');
        showInfo(`📍 ${t.name}`, `
          <div class="gip-stat"><i class="fa-solid fa-users"></i> Войска: <b>${t.troops}</b></div>
          <div class="gip-stat"><i class="fa-solid fa-crosshairs"></i> Доступно атак: <b>${attackable.length}</b></div>
          <div class="gip-hint">Кликни соседнюю территорию для атаки</div>
        `, 'select');
      } else {
        showInfo('ВЫБЕРИ ТЕРРИТОРИЮ', 'Кликни на свою территорию чтобы атаковать', 'default');
      }
    } else if (selected !== null) {
      const src = territories[selected];
      if (!src || src.faction !== 'player') { selected = null; refreshAll(); return; }
      if (!src.neighbors.includes(id)) {
        showInfo('❌ НЕ СОСЕД', `${t.name} не граничит с выбранной территорией`, 'warn');
        return;
      }
      doAttack(selected, id, 'player');
      selected = null;
      refreshAll();
    } else {
      const f = FACTIONS[t.faction];
      showInfo(`${f.icon} ${t.name}`, `
        <div class="gip-stat" style="color:${f.light}">Владелец: <b>${f.name}</b></div>
        <div class="gip-stat"><i class="fa-solid fa-users"></i> Войска: <b>${t.troops}</b></div>
      `, 'neutral');
    }
  }

  function onTerritoryHover(id) {
    if (gamePhase !== 'playing' || selected === null) return;
    const src = territories[selected];
    const dst = territories[id];
    if (!src || src.faction !== 'player' || !src.neighbors.includes(id) || dst.faction === 'player') return;

    const attack  = src.troops - 1;
    const defend  = dst.troops;
    const win     = attack > defend;
    const remain  = Math.abs(attack - defend);
    const f       = FACTIONS[dst.faction];

    showInfo(`${win ? '⚔️' : '🛡️'} АТАКА: ${dst.name}`, `
      <div class="gip-preview ${win ? 'win' : 'lose'}">
        <div class="gip-vs"><span class="gip-atk">${attack} ⚔️</span><span class="gip-sep">VS</span><span class="gip-def">🛡 ${defend}</span></div>
        <div class="gip-result ${win ? 'win' : 'lose'}">${win ? `✅ ПОБЕДА — останется ${remain} войск` : `❌ ПОРАЖЕНИЕ — защита устоит`}</div>
        <div class="gip-stat" style="color:${f.light}">Защищает: ${f.name}</div>
      </div>
    `, win ? 'win' : 'lose');
  }

  function onTerritoryLeave() {
    if (selected !== null) {
      const src = territories[selected];
      if (src) {
        const attackable = src.neighbors.filter(n => territories[n].faction !== 'player');
        showInfo(`📍 ${src.name}`, `
          <div class="gip-stat"><i class="fa-solid fa-users"></i> Войска: <b>${src.troops}</b></div>
          <div class="gip-stat"><i class="fa-solid fa-crosshairs"></i> Доступно атак: <b>${attackable.length}</b></div>
          <div class="gip-hint">Кликни соседнюю территорию для атаки</div>
        `, 'select');
      }
    }
  }

  // ─── Combat ────────────────────────────────────────────────
  function doAttack(fromId, toId, attackerFaction) {
    const src    = territories[fromId];
    const dst    = territories[toId];
    const attack = src.troops - 1;
    const defend = dst.troops;

    src.troops = 1;

    // Animations
    src.el?.classList.add('attacking');
    dst.el?.classList.add('under-attack');
    setTimeout(() => {
      src.el?.classList.remove('attacking');
      dst.el?.classList.remove('under-attack');
    }, 700);

    if (attack > defend) {
      const remaining     = attack - defend;
      const prevFaction   = dst.faction;
      dst.faction         = attackerFaction;
      dst.troops          = Math.max(1, remaining);
      addLog(`${FACTIONS[attackerFaction].icon} ${FACTIONS[attackerFaction].name} захватил <b>${dst.name}</b> (осталось: ${dst.troops})`, attackerFaction);
      dst.el?.classList.add('captured');
      setTimeout(() => dst.el?.classList.remove('captured'), 900);
      // Check if faction eliminated
      if (prevFaction !== 'neutral') {
        const remaining = territories.filter(t => t.faction === prevFaction).length;
        if (remaining === 0) {
          addLog(`💥 ${FACTIONS[prevFaction].name} уничтожен!`, 'neutral');
        }
      }
    } else {
      dst.troops = Math.max(1, defend - attack);
      addLog(`🛡 ${dst.name} устоял! Защита: ${dst.troops} войск`, dst.faction);
      dst.el?.classList.add('defended');
      setTimeout(() => dst.el?.classList.remove('defended'), 700);
    }

    refreshEl(src);
    refreshEl(dst);
    updateHUD();
    checkEndGame();
  }

  // ─── AI ────────────────────────────────────────────────────
  function doAI() {
    if (gamePhase !== 'playing') return;
    ['diablos', 'vagos', 'ballas'].forEach(faction => {
      const sources = territories.filter(t => t.faction === faction && t.troops > 1);
      if (!sources.length) return;

      let best = null, bestScore = -Infinity;
      sources.forEach(src => {
        src.neighbors.forEach(nid => {
          const dst = territories[nid];
          if (dst.faction === faction) return;
          // Score: prefer player territories and weak defenders
          let score = (src.troops - 1) - dst.troops;
          if (dst.faction === 'player') score += 5;
          if (dst.faction === 'neutral') score += 1;
          if (score > bestScore) { bestScore = score; best = { from: src.id, to: nid }; }
        });
      });

      if (best && bestScore > -4) doAttack(best.from, best.to, faction);
    });
  }

  // ─── Regen ─────────────────────────────────────────────────
  function regenTroops() {
    if (gamePhase !== 'playing') return;
    territories.forEach(t => {
      if (t.faction !== 'neutral' && t.troops < MAX_TROOPS) {
        t.troops++;
        refreshEl(t);
      }
    });
  }

  // ─── HUD ───────────────────────────────────────────────────
  function updateHUD() {
    ['player', 'diablos', 'vagos', 'ballas', 'neutral'].forEach(f => {
      const el = document.getElementById(`hud-count-${f}`);
      if (el) el.textContent = territories.filter(t => t.faction === f).length;
    });
    // Progress bar
    const total    = territories.length;
    const playerN  = territories.filter(t => t.faction === 'player').length;
    const bar      = document.getElementById('playerProgressBar');
    if (bar) bar.style.width = `${(playerN / total) * 100}%`;
  }

  function checkEndGame() {
    const pCount = territories.filter(t => t.faction === 'player').length;
    if (pCount === 0) { endGame('lost'); return; }
    if (territories.every(t => t.faction === 'player')) { endGame('won'); return; }
    const aiAlive = ['diablos', 'vagos', 'ballas'].some(f => territories.some(t => t.faction === f));
    if (!aiAlive) endGame('won');
  }

  function endGame(result) {
    gamePhase = result;
    clearInterval(regenTimer);
    clearInterval(aiTimer);
    clearInterval(clockTimer);
    if (overlay) {
      overlay.classList.add('visible');
      if (result === 'won') {
        overlayTitle.textContent  = '🏆 LOS SANTOS НАША!';
        overlayMsg.textContent    = `Miller Family захватил город за ${formatTime(timerSec)}`;
        overlayTitle.style.color  = '#ff2a2a';
      } else {
        overlayTitle.textContent  = '💀 СЕМЬЯ УНИЧТОЖЕНА';
        overlayMsg.textContent    = 'Miller Family потерял все территории. Начни заново.';
        overlayTitle.style.color  = '#555';
      }
    }
  }

  // ─── Utils ─────────────────────────────────────────────────
  function formatTime(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  }

  function showInfo(title, body, type = 'default') {
    if (!infoPanel) return;
    infoPanel.className = `game-info-panel gip-${type}`;
    infoPanel.innerHTML = `<div class="gip-title">${title}</div><div class="gip-body">${body}</div>`;
  }

  function addLog(msg, faction) {
    if (!logEl) return;
    const color = FACTIONS[faction]?.light || '#888';
    const el    = document.createElement('div');
    el.className = 'game-log-entry';
    el.innerHTML = `<span class="gle-dot" style="background:${color}"></span><span>${msg}</span>`;
    logEl.prepend(el);
    while (logEl.children.length > 30) logEl.removeChild(logEl.lastChild);
  }

  // ─── Start / Restart ───────────────────────────────────────
  function startGame() {
    clearInterval(regenTimer);
    clearInterval(aiTimer);
    clearInterval(clockTimer);
    timerSec  = 0;
    selected  = null;
    gamePhase = 'playing';
    if (logEl)    logEl.innerHTML = '';
    if (overlay)  overlay.classList.remove('visible');
    if (timerEl)  timerEl.textContent = '00:00';

    initTerritories();
    renderMap();
    updateHUD();
    showInfo('🔴 MILLER FAMILY', `
      <div class="gip-stat">Стартовая позиция: <b>Del Perro</b></div>
      <div class="gip-stat">Войска: <b>12</b></div>
      <div class="gip-hint">Кликни на <b style="color:#ff4444">красную</b> территорию чтобы начать атаку</div>
    `, 'default');
    addLog('🚀 Игра началась! Miller Family выдвигается из Del Perro.', 'player');

    regenTimer = setInterval(regenTroops, REGEN_MS);
    aiTimer    = setInterval(doAI, AI_MS);
    clockTimer = setInterval(() => {
      timerSec++;
      if (timerEl) timerEl.textContent = formatTime(timerSec);
    }, 1000);
  }

  // Bind buttons (there may be two restart buttons)
  document.querySelectorAll('.game-restart-btn').forEach(btn => {
    btn.addEventListener('click', startGame);
  });

  startGame();
}
