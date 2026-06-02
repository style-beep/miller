// ── Загрузка участников Discord ────────────────────────────
export async function loadDiscordMembers() {
  try {
    const res     = await fetch("/api/members");
    const members = await res.json();

    const list  = document.getElementById("discordMembers");
    const count = document.getElementById("memberCount");

    if (!list) return;

    if (count) count.textContent = members.length;

    list.innerHTML = members.map((member) => {
      const colors = { online: "#43b581", idle: "#faa61a", dnd: "#f04747" };
      const color  = colors[member.status] || "#777";
      return `
        <div class="member-item">
          <span class="member-dot" style="background:${color}"></span>
          <img src="${member.avatar}" style="width:28px;height:28px;border-radius:50%;margin-right:10px;">
          <span class="member-name">${member.name}</span>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error("Discord members error:", err);
  }
}

export function initDiscordMembers() {
  loadDiscordMembers();
  setInterval(loadDiscordMembers, 10000);
}
