import { ROLE_ORDER } from "./config/roles.js";

const INITIAL_LIMIT = 50;
let allMembers = [];
let expanded = false;

// ── Статичный fallback список (показывается если API недоступен) ──
const FALLBACK_MEMBERS = [
  { name: "Eddie Miller",  status: "online", avatar: "images/eddie.jpg", roles: [{ name: "Создатель",        color: "#ff2a2a" }] },
  { name: "Adam Miller",   status: "online", avatar: "images/adam.jpg",  roles: [{ name: "꒰👑꒱ Director  ✦", color: "#c0a030" }] },
  { name: "Roy Miller",    status: "online", avatar: "images/roy.jpg",   roles: [{ name: "✦🦢୧﹕Deputy Director", color: "#888" }] },
];

function memberPriority(member) {
  if (!member.roles?.length) return ROLE_ORDER.length;
  const best = member.roles.reduce((min, role) => {
    const idx = ROLE_ORDER.indexOf(role.name);
    return idx !== -1 && idx < min ? idx : min;
  }, ROLE_ORDER.length);
  return best;
}

function renderMembers() {
  const list = document.getElementById("discordMembers");
  if (!list) return;

  const visible = expanded ? allMembers : allMembers.slice(0, INITIAL_LIMIT);
  const colors  = { online: "#43b581", idle: "#faa61a", dnd: "#f04747" };

  const items = visible.map(member => {
    const color   = colors[member.status] || "#777";
    const name    = document.createTextNode(member.name).textContent;
    const topRole = member.roles?.[0];
    const roleHtml = topRole
      ? `<span class="member-role" style="color:${topRole.color === '#000000' ? '#888' : topRole.color}">${topRole.name}</span>`
      : "";

    // Кеш аватаров — берём из localStorage если есть
    const cacheKey = `mf_avatar_${member.name}`;
    if (member.avatar && !member.avatar.startsWith("images/")) {
      localStorage.setItem(cacheKey, member.avatar);
    }
    const avatarSrc = member.avatar || localStorage.getItem(cacheKey) || "images/family-logo.jpeg";

    return `
      <div class="member-item">
        <span class="member-dot" style="background:${color}"></span>
        <img src="${avatarSrc}" loading="lazy" style="width:28px;height:28px;border-radius:50%;margin-right:10px;object-fit:cover;"
             onerror="this.src='images/family-logo.jpeg'">
        <span class="member-name-wrap">
          <span class="member-name">${name}</span>
          ${roleHtml}
        </span>
      </div>`;
  }).join("");

  const hasMore = allMembers.length > INITIAL_LIMIT;
  const btnHtml = hasMore
    ? `<button class="load-more-btn" id="loadMoreBtn">
        ${expanded ? "СКРЫТЬ" : `ЕЩЁ +${allMembers.length - INITIAL_LIMIT}`}
       </button>`
    : "";

  list.innerHTML = items + btnHtml;

  const btn = document.getElementById("loadMoreBtn");
  if (btn) btn.addEventListener("click", () => { expanded = !expanded; renderMembers(); });
}

export async function loadDiscordMembers() {
  try {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error("API недоступен");
    const members = await res.json();

    const count = document.getElementById("memberCount");
    if (count) count.textContent = members.length;

    allMembers = members
      .filter(m => m.roles?.some(r => ROLE_ORDER.includes(r.name)))
      .sort((a, b) => memberPriority(a) - memberPriority(b));
    renderMembers();
  } catch {
    // API недоступен — показываем fallback
    const count = document.getElementById("memberCount");
    if (count) count.textContent = FALLBACK_MEMBERS.length;
    allMembers = FALLBACK_MEMBERS;
    renderMembers();
  }
}

export function initDiscordMembers() {
  loadDiscordMembers();
  setInterval(loadDiscordMembers, 30000);
}
