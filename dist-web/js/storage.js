// ── localStorage версионирование и миграция ──────────────────
const STORAGE_VERSION = 2;
const VERSION_KEY     = "miller_storage_version";

export function initStorage() {
  const current = parseInt(localStorage.getItem(VERSION_KEY) || "0");
  if (current === STORAGE_VERSION) return;

  // Миграция v0 → v1: добавить поле comment в заявки
  if (current < 1) {
    try {
      const apps = JSON.parse(localStorage.getItem("miller_applications") || "[]");
      const migrated = apps.map(a => ({
        id:         a.id         || Date.now().toString(),
        nickname:   a.nickname   || "",
        age:        a.age        || "",
        discord:    a.discord    || "",
        experience: a.experience || "",
        reason:     a.reason     || "",
        status:     a.status     || "pending",
        comment:    a.comment    || "",
        createdAt:  a.createdAt  || new Date().toISOString(),
      }));
      localStorage.setItem("miller_applications", JSON.stringify(migrated));
    } catch(e) {
      console.warn("[storage] migration v1 failed:", e);
    }
  }

  // Миграция v1 → v2: добавить поле id если нет
  if (current < 2) {
    try {
      const apps = JSON.parse(localStorage.getItem("miller_applications") || "[]");
      const migrated = apps.map((a, i) => ({
        ...a,
        id: a.id || `legacy-${i}-${Date.now()}`,
      }));
      localStorage.setItem("miller_applications", JSON.stringify(migrated));
    } catch(e) {
      console.warn("[storage] migration v2 failed:", e);
    }
  }

  localStorage.setItem(VERSION_KEY, STORAGE_VERSION.toString());
  console.info(`[storage] migrated to v${STORAGE_VERSION}`);
}
