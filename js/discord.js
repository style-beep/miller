import { ROLE_ORDER } from "../roles.config.js";

const INITIAL_LIMIT = 50;
let allMembers = [];
let expanded = false;

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

  const colors = { online: "#43b581", idle: "#faa61a", dnd: "#f04747" };

  const items = visible.map((member) => {
    const color     = colors[member.status] || "#777";
    const name      = document.createTextNode(member.name).textContent;
    const topRole   = member.roles?.[0];
    const roleHtml  = topRole
      ? `<span class="member-role" style="color:${topRole.color === '#000000' ? '#888' : topRole.color}">${topRole.name}</span>`
      : "";
    return `
      <div class="member-item">
        <span class="member-dot" style="background:${color}"></span>
        <img src="${member.avatar}" style="width:28px;height:28px;border-radius:50%;margin-right:10px;">
        <span class="member-name-wrap">
          <span class="member-name">${name}</span>
          ${roleHtml}
        </span>
      </div>
    `;
  }).join("");

  const hasMore = allMembers.length > INITIAL_LIMIT;
  const btnHtml = hasMore
    ? `<button class="load-more-btn" id="loadMoreBtn">
        ${expanded ? "СКРЫТЬ" : `ЕЩЁ +${allMembers.length - INITIAL_LIMIT}`}
       </button>`
    : "";

  list.innerHTML = items + btnHtml;

  const btn = document.getElementById("loadMoreBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      expanded = !expanded;
      renderMembers();
    });
  }
}

// ── Загрузка участников Discord ────────────────────────────
export async function loadDiscordMembers() {
  try {
    const res     = await fetch("/api/members");
    const members = await res.json();

    const count = document.getElementById("memberCount");
    if (count) count.textContent = members.length;

    allMembers = members
      .filter(m => m.roles?.some(r => ROLE_ORDER.includes(r.name)))
      .sort((a, b) => memberPriority(a) - memberPriority(b));
    renderMembers();
  } catch (err) {
    console.error("Discord members error:", err);
  }
}

export function initDiscordMembers() {
  loadDiscordMembers();
  setInterval(loadDiscordMembers, 10000);
}
