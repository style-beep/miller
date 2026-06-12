import { ROLE_ORDER, DEPARTMENTS } from "./config/roles.js";

// Все роли, которые показаны в отделах — их исключаем из Soldiers
const DEPT_ROLES = new Set(DEPARTMENTS.flatMap(d => d.roles));

const INITIAL_LIMIT = 12; // показываем меньше сразу — остальные по кнопке
let allMembers = [];
let expanded   = false;
let intervalId = null;

const FALLBACK_MEMBERS = [
  { name: "Eddie Miller", status: "online", avatar: "images/eddie.jpg", roles: [{ name: "Создатель",              color: "#ff2a2a" }] },
  { name: "Adam Miller",  status: "online", avatar: "images/adam.jpg",  roles: [{ name: "꒰👑꒱ Director  ✦",     color: "#c0a030" }] },
  { name: "Roy Miller",   status: "online", avatar: "images/roy.jpg",   roles: [{ name: "✦🦢୧﹕Deputy Director", color: "#888"    }] },
];

const STATUS_COLOR = { online: "#43b581", idle: "#faa61a", dnd: "#f04747" };

function memberPriority(member) {
  if (!member.roles?.length) return ROLE_ORDER.length;
  return member.roles.reduce((min, role) => {
    const idx = ROLE_ORDER.indexOf(role.name);
    return idx !== -1 && idx < min ? idx : min;
  }, ROLE_ORDER.length);
}

function renderMembers() {
  const list = document.getElementById("discordMembers");
  if (!list) return;

  const visible = expanded ? allMembers : allMembers.slice(0, INITIAL_LIMIT);
  const hasMore = allMembers.length > INITIAL_LIMIT;

  // Используем DocumentFragment — один reflow вместо N
  const frag = document.createDocumentFragment();

  visible.forEach(member => {
    const color   = STATUS_COLOR[member.status] || "#555";
    const topRole = member.roles?.[0];

    const cacheKey = `mf_avatar_${member.name}`;
    if (member.avatar && !member.avatar.startsWith("images/")) {
      try { localStorage.setItem(cacheKey, member.avatar); } catch {}
    }
    const avatarSrc = member.avatar || localStorage.getItem(cacheKey) || "images/family-logo.jpeg";

    const item = document.createElement("div");
    item.className = "member-item";

    // Левая часть: точка + аватар + имя/роль
    const left = document.createElement("div");
    left.className = "member-left";
    left.style.cssText = "display:flex;align-items:center;gap:9px;min-width:0";

    const dot = document.createElement("span");
    dot.className = `member-dot ${member.status === "online" ? "online-dot" : "offline-dot"}`;
    dot.style.cssText = `background:${color};flex-shrink:0`;

    const avatar = document.createElement("img");
    avatar.src = avatarSrc;
    avatar.loading = "lazy";
    avatar.width = 28;
    avatar.height = 28;
    avatar.style.cssText = "border-radius:50%;object-fit:cover;flex-shrink:0";
    avatar.onerror = () => { avatar.src = "images/family-logo.jpeg"; };

    const nameWrap = document.createElement("span");
    nameWrap.className = "member-name-wrap";

    const nameEl = document.createElement("span");
    nameEl.className = "member-name";
    nameEl.textContent = member.name;
    nameWrap.appendChild(nameEl);

    if (topRole) {
      const roleEl = document.createElement("span");
      roleEl.className = "member-role";
      roleEl.style.color = topRole.color === "#000000" ? "#888" : topRole.color;
      roleEl.textContent = topRole.name;
      nameWrap.appendChild(roleEl);
    }

    left.append(dot, avatar, nameWrap);
    item.appendChild(left);
    frag.appendChild(item);
  });

  // Кнопка "ещё"
  if (hasMore) {
    const btn = document.createElement("button");
    btn.className = "load-more-btn";
    btn.id = "loadMoreBtn";
    btn.textContent = expanded
      ? "СКРЫТЬ"
      : `ЕЩЁ +${allMembers.length - INITIAL_LIMIT}`;
    btn.addEventListener("click", () => { expanded = !expanded; renderMembers(); });
    frag.appendChild(btn);
  }

  list.innerHTML = "";
  list.appendChild(frag);
}

async function loadDiscordMembers() {
  try {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error();
    const members = await res.json();

    const count = document.getElementById("memberCount");
    if (count) count.textContent = members.length;

    allMembers = members
      .filter(m =>
        m.roles?.some(r => ROLE_ORDER.includes(r.name)) &&
        !m.roles.some(r => DEPT_ROLES.has(r.name))
      )
      .sort((a, b) => memberPriority(a) - memberPriority(b));
  } catch {
    const count = document.getElementById("memberCount");
    if (count) count.textContent = FALLBACK_MEMBERS.length;
    allMembers = FALLBACK_MEMBERS;
  }
  renderMembers();
}

export function initDiscordMembers() {
  const card = document.querySelector(".soldiers-card");
  if (!card) return;

  // Загружаем ТОЛЬКО когда карточка появляется в viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !intervalId) {
        loadDiscordMembers();
        // Обновляем каждые 30 сек только пока видно
        intervalId = setInterval(loadDiscordMembers, 30000);
      } else if (!entry.isIntersecting && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  }, { rootMargin: "200px" }); // начинаем чуть заранее

  observer.observe(card);
}
