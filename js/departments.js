import { DEPARTMENTS, ROLE_ORDER } from "./config/roles.js";

const FALLBACK = {
  "Создатель":               { name: "Eddie Miller",  avatar: "images/eddie.jpg"  },
  "꒰👑꒱ Director  ✦":       { name: "Adam Miller",   avatar: "images/adam.jpg"   },
  "✦🦢୧﹕Deputy Director":   { name: "Roy Miller",    avatar: "images/roy.jpg"    },
};

function memberPriority(member) {
  if (!member.roles?.length) return ROLE_ORDER.length;
  return member.roles.reduce((min, r) => {
    const i = ROLE_ORDER.indexOf(r.name);
    return i !== -1 && i < min ? i : min;
  }, ROLE_ORDER.length);
}

function topRoleInDept(member, deptRoles) {
  if (!member.roles?.length) return null;
  return member.roles.find(r => deptRoles.includes(r.name)) || null;
}

function getDisplayRole(roleName) {
  const map = {
    "Создатель":                      "Создатель",
    "꒰👑꒱ Director  ✦":              "Директор",
    "✦🦢୧﹕Deputy Director":          "Зам. директора",
    "Руководитель Модерации":         "Рук. модерации",
    "Зам.Руководителя Модерации":     "Зам рук. модерации",
    "Тех.Админ":                      "Тех. Админ",
    "Админ.Дизайнер":                 "Админ Дизайнер",
    "Moderator":                      "Модератор",
    "Cand.Moder":                     "Кандидат в модераторы",
  };
  return map[roleName] || roleName;
}

function buildMemberCard(member, roleColor) {
  const cacheKey = `mf_avatar_${member.name}`;
  let avatarSrc = member.avatar || localStorage.getItem(cacheKey) || "images/family-logo.jpeg";
  if (member.avatar && !member.avatar.startsWith("images/")) {
    try { localStorage.setItem(cacheKey, member.avatar); } catch {}
  }

  const role = topRoleInDept(member, member._deptRoles || []);
  const roleLabel = role ? getDisplayRole(role.name) : "";
  const color = role?.color === "#000000" ? "#888" : (role?.color || roleColor);

  const card = document.createElement("div");
  card.className = "dept-member";

  const avatarWrap = document.createElement("div");
  avatarWrap.className = "dept-avatar-wrap";
  avatarWrap.style.borderColor = color + "55";

  const img = document.createElement("img");
  img.src = avatarSrc;
  img.alt = member.name;
  img.loading = "lazy";
  img.onerror = () => { img.src = "images/family-logo.jpeg"; };

  const statusDot = document.createElement("span");
  statusDot.className = "dept-status";
  statusDot.style.background = member.status === "online" ? "#4cff72"
    : member.status === "idle" ? "#faa61a" : "#555";

  avatarWrap.append(img, statusDot);

  const info = document.createElement("div");
  info.className = "dept-member-info";

  const nameEl = document.createElement("span");
  nameEl.className = "dept-member-name";
  nameEl.textContent = member.name;

  const roleEl = document.createElement("span");
  roleEl.className = "dept-member-role";
  roleEl.style.color = color;
  roleEl.textContent = roleLabel;

  info.append(nameEl, roleEl);
  card.append(avatarWrap, info);
  return card;
}

function renderDepartments(allMembers) {
  DEPARTMENTS.forEach(dept => {
    const container = document.getElementById(`dept-${dept.id}`);
    if (!container) return;

    const members = allMembers
      .filter(m => m.roles?.some(r => dept.roles.includes(r.name)))
      .sort((a, b) => memberPriority(a) - memberPriority(b));

    // Счётчик
    const countEl = container.closest(".dept-card")?.querySelector(".dept-count");
    if (countEl) countEl.textContent = members.length || "0";

    const frag = document.createDocumentFragment();

    if (members.length === 0) {
      const empty = document.createElement("div");
      empty.className = "dept-empty";
      empty.textContent = "Нет участников";
      frag.appendChild(empty);
    } else {
      members.forEach(m => {
        m._deptRoles = dept.roles;
        frag.appendChild(buildMemberCard(m, dept.color));
      });
    }

    container.innerHTML = "";
    container.appendChild(frag);
  });
}

export async function initDepartments() {
  const section = document.getElementById("members");
  if (!section) return;

  try {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error();
    const members = await res.json();
    renderDepartments(members);
  } catch {
    // Fallback — показываем заглушки с known members
    const fallbackMembers = Object.entries(FALLBACK).map(([roleName, data]) => ({
      name: data.name,
      avatar: data.avatar,
      status: "online",
      roles: [{ name: roleName, color: "#ff2a2a" }],
    }));
    renderDepartments(fallbackMembers);
  }
}
