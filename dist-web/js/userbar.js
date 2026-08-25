// Подтягивает текущего пользователя и добавляет его в шапку
export async function initUserBar() {
  try {
    const res = await fetch("/api/auth/me");
    const { user } = await res.json();
    renderUserBar(user);
  } catch {
    renderUserBar(null);
  }
}

function renderUserBar(user) {
  // Ищем кнопку "ВСТУПИТЬ" чтобы вставить рядом
  const joinBtn = document.querySelector(".header-join-btn, .join-btn-header, a[href*='apply'], nav a[href*='join']")
    || document.querySelector("header nav")?.lastElementChild;

  const header = document.querySelector("header .header-right, header nav, header");
  if (!header) return;

  // Убираем старый userbar если есть
  document.getElementById("userBarEl")?.remove();

  const bar = document.createElement("div");
  bar.id = "userBarEl";
  bar.style.cssText = "display:flex;align-items:center;gap:10px;margin-left:12px;";

  if (user) {
    const avatar = user.discordAvatar || null;
    const name   = (user.discordName || user.username || "Профиль").substring(0, 18);

    bar.innerHTML = `
      <a href="/profile.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;
        padding:6px 12px 6px 6px;border-radius:20px;
        background:rgba(255,42,42,0.08);border:1px solid rgba(255,42,42,0.2);
        transition:background 0.2s,border-color 0.2s;"
        onmouseover="this.style.background='rgba(255,42,42,0.15)';this.style.borderColor='rgba(255,42,42,0.4)'"
        onmouseout="this.style.background='rgba(255,42,42,0.08)';this.style.borderColor='rgba(255,42,42,0.2)'">
        ${avatar
          ? `<img src="${avatar}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,42,42,0.4);" onerror="this.style.display='none'">`
          : `<span style="width:26px;height:26px;border-radius:50%;background:rgba(255,42,42,0.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;">${(name[0]||'?').toUpperCase()}</span>`
        }
        <span style="font-size:11px;font-weight:700;letter-spacing:1px;color:rgba(255,255,255,0.85);font-family:Montserrat,sans-serif;">${name}</span>
      </a>
      <button onclick="logoutUser()" style="background:none;border:none;color:rgba(255,255,255,0.25);font-size:13px;cursor:pointer;padding:4px;transition:color 0.2s;" title="Выйти"
        onmouseover="this.style.color='#ff2a2a'" onmouseout="this.style.color='rgba(255,255,255,0.25)'">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    `;
  } else {
    bar.innerHTML = `
      <a href="/auth.html" style="display:flex;align-items:center;gap:7px;text-decoration:none;
        padding:7px 16px;border-radius:20px;
        background:rgba(255,42,42,0.1);border:1px solid rgba(255,42,42,0.25);
        font-family:Montserrat,sans-serif;font-size:11px;font-weight:700;
        letter-spacing:2px;color:rgba(255,255,255,0.7);text-transform:uppercase;
        transition:all 0.2s;"
        onmouseover="this.style.background='rgba(255,42,42,0.2)';this.style.color='#fff'"
        onmouseout="this.style.background='rgba(255,42,42,0.1)';this.style.color='rgba(255,255,255,0.7)'">
        <i class="fa-solid fa-right-to-bracket"></i> Войти
      </a>
    `;
  }

  // Вставляем в конец header nav
  const nav = document.querySelector("header nav") || header;
  nav.appendChild(bar);
}

window.logoutUser = async function() {
  await fetch("/api/auth/logout", { method: "POST" });
  renderUserBar(null);
  if (location.pathname.includes("profile")) location.href = "/";
};
