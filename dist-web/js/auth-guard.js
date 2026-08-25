// ── Проверка авторизации ─────────────────────────────────────

let _cachedUser = undefined;

export async function checkAuth() {
  if (_cachedUser !== undefined) return _cachedUser;
  try {
    const res  = await fetch("/api/auth/me");
    const data = await res.json();
    _cachedUser = data.user || null;
  } catch {
    _cachedUser = null;
  }
  return _cachedUser;
}

// Создаёт экран-спиннер который закрывает страницу пока идёт проверка
function showAuthChecker() {
  const el = document.createElement("div");
  el.id = "auth-checking";
  el.innerHTML = `
    <div class="auth-checking-logo">MILLER <span>FAMILY</span></div>
    <div class="auth-checking-spinner"></div>
    <div class="auth-checking-sub">ПРОВЕРКА ДОСТУПА...</div>
  `;
  document.body.prepend(el);
  return () => el.remove();
}

// Для закрытых страниц — редирект на /auth.html если не залогинен
export async function requireAuth() {
  const hide = showAuthChecker();
  const user = await checkAuth();
  if (!user) {
    window.location.replace("/auth.html?redirect=" + encodeURIComponent(window.location.pathname));
    return null;
  }
  hide();
  return user;
}

// Для index.html — скрывает всё после "О НАС" для незалогиненных
export async function initIndexGuard() {
  const user  = await checkAuth();
  const about = document.getElementById("about");
  const wall  = document.getElementById("auth-wall");
  if (!about || !wall) return;

  if (user) {
    // Залогинен — убедимся что стена скрыта
    wall.style.display = "none";
    return;
  }

  // Не залогинен — скрыть всё что идёт после #about в DOM
  let node = about.nextElementSibling;
  while (node) {
    if (node !== wall) node.style.display = "none";
    node = node.nextElementSibling;
  }

  // Вставить стену сразу после #about
  about.insertAdjacentElement("afterend", wall);
  wall.style.display = "flex";
}
