require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express   = require("express");
const path      = require("path");
const fs        = require("fs");
const http      = require("http");
const WebSocket = require("ws");
const session   = require("express-session");
const bcrypt    = require("bcryptjs");
const passport  = require("passport");
const { Strategy: LocalStrategy }   = require("passport-local");
const { Strategy: DiscordStrategy } = require("passport-discord");

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });
const PORT   = process.env.PORT || 3001;

// ── User storage ────────────────────────────────────────────
const USERS_FILE = path.join(__dirname, "users.json");

function loadUsers() {
  try { if (fs.existsSync(USERS_FILE)) return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); } catch {}
  return [];
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}
function safeUser(u) {
  if (!u) return null;
  const { passwordHash, ...safe } = u;
  return safe;
}

// ── Passport setup ──────────────────────────────────────────
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = loadUsers().find(u => u.id === id);
  done(null, user || false);
});

passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
  const user = loadUsers().find(u => u.email?.toLowerCase() === email.toLowerCase());
  if (!user)              return done(null, false, { message: "Пользователь не найден" });
  if (!user.passwordHash) return done(null, false, { message: "Используйте вход через Discord" });
  if (!bcrypt.compareSync(password, user.passwordHash))
                          return done(null, false, { message: "Неверный пароль" });
  return done(null, user);
}));

if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID:     process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL:  process.env.DISCORD_CALLBACK_URL || `http://localhost:${PORT}/api/auth/discord/callback`,
    scope: ["identify"],
  }, (accessToken, refreshToken, profile, done) => {
    const users  = loadUsers();
    let user     = users.find(u => u.discordId === profile.id);
    const avatar = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
      : null;

    if (!user) {
      user = {
        id:            Date.now().toString(),
        username:      profile.global_name || profile.username,
        discordId:     profile.id,
        discordTag:    profile.username,
        discordAvatar: avatar,
        bio:           "",
        statusText:    "",
        stats:         { kills: 0, deaths: 0, wins: 0, events: 0, money: 0, reputation: 0, hours: 0, arrests: 0 },
        achievements:  [],
        createdAt:     new Date().toISOString(),
        lastSeen:      new Date().toISOString(),
      };
      users.push(user);
    } else {
      user.username      = profile.global_name || profile.username;
      user.discordTag    = profile.username;
      user.discordAvatar = avatar || user.discordAvatar;
      user.lastSeen      = new Date().toISOString();
    }
    saveUsers(users);
    return done(null, user);
  }));
}

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(session({
  secret:            process.env.SESSION_SECRET || "miller-family-2026-secret",
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname)));

// ── WebSocket broadcast ─────────────────────────────────────
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  });
}

wss.on("connection", ws => {
  ws.send(JSON.stringify({ text: "Добро пожаловать на сайт Miller Family! 👑", type: "info" }));
});

// ── Хранилище заявок (JSON файл) ────────────────────────────
const APPS_FILE = path.join(__dirname, "applications.json");

function loadApps() {
  try {
    if (fs.existsSync(APPS_FILE)) return JSON.parse(fs.readFileSync(APPS_FILE, "utf8"));
  } catch {}
  return [];
}

function saveApps(apps) {
  fs.writeFileSync(APPS_FILE, JSON.stringify(apps, null, 2), "utf8");
}

// ── Discord Bot ─────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

let membersCache = [];

client.on("ready", async () => {
  console.log(`Bot online: ${client.user.tag}`);
  const guild = client.guilds.cache.first();
  if (!guild) return console.warn("No guild found");
  await guild.members.fetch();
  updateCache(guild);
  setInterval(() => updateCache(guild), 5000);

  // Уведомление при подключении бота
  setTimeout(() => broadcast({ text: "🤖 Бот Miller Family онлайн", type: "info" }), 2000);
});

function updateCache(guild) {
  membersCache = guild.members.cache.map(m => ({
    name:   m.displayName,
    avatar: m.user.displayAvatarURL({ extension: "png", size: 64, forceStatic: true }),
    status: m.presence?.status || "offline",
    roles:  m.roles.cache
      .filter(r => r.name !== "@everyone")
      .sort((a, b) => b.position - a.position)
      .map(r => ({ name: r.name, color: r.hexColor })),
  }));
}

// ── API: участники ──────────────────────────────────────────
app.get("/api/members", (req, res) => res.json(membersCache));

// ── AUTH: регистрация ───────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ success: false, message: "Заполните все поля" });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: "Пароль минимум 6 символов" });

  const users = loadUsers();
  if (users.find(u => u.email?.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ success: false, message: "Email уже используется" });

  const user = {
    id:           Date.now().toString(),
    username,
    email:        email.toLowerCase(),
    passwordHash: await bcrypt.hash(password, 10),
    bio:          "",
    statusText:   "",
    stats:        { kills: 0, deaths: 0, wins: 0, events: 0, money: 0, reputation: 0, hours: 0, arrests: 0 },
    achievements: [],
    createdAt:    new Date().toISOString(),
    lastSeen:     new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);

  req.login(user, err => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, user: safeUser(user) });
  });
});

// ── AUTH: вход ─────────────────────────────────────────────
app.post("/api/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)   return next(err);
    if (!user) return res.status(401).json({ success: false, message: info?.message || "Ошибка входа" });
    req.login(user, err => {
      if (err) return next(err);
      // обновляем lastSeen
      const users = loadUsers();
      const u = users.find(x => x.id === user.id);
      if (u) { u.lastSeen = new Date().toISOString(); saveUsers(users); }
      res.json({ success: true, user: safeUser(user) });
    });
  })(req, res, next);
});

// ── AUTH: выход ────────────────────────────────────────────
app.post("/api/auth/logout", (req, res) => {
  req.logout(() => res.json({ success: true }));
});

// ── AUTH: текущий пользователь ─────────────────────────────
app.get("/api/auth/me", (req, res) => {
  if (!req.user) return res.json({ user: null });
  const user = { ...safeUser(req.user) };
  // Подтягиваем роли с Discord сервера по discordId
  if (user.discordId) {
    const member = membersCache.find(m =>
      m.avatar?.includes(`/avatars/${user.discordId}/`)
    );
    if (member) {
      user.discordRoles  = member.roles;
      user.discordStatus = member.status;
      user.discordName   = member.name;
    }
  }
  res.json({ user });
});

// ── AUTH: обновить профиль ─────────────────────────────────
app.patch("/api/auth/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ success: false });
  const { bio, username, statusText, stats, achievements } = req.body;
  const users = loadUsers();
  const u = users.find(x => x.id === req.user.id);
  if (!u) return res.status(404).json({ success: false });
  if (bio        !== undefined) u.bio        = String(bio).substring(0, 300);
  if (username   !== undefined) u.username   = String(username).substring(0, 32);
  if (statusText !== undefined) u.statusText = String(statusText).substring(0, 60);
  if (stats      !== undefined && typeof stats === "object") {
    u.stats = u.stats || {};
    const allowed = ["kills","deaths","wins","events","money","reputation","hours","arrests"];
    allowed.forEach(k => { if (stats[k] !== undefined) u.stats[k] = Math.max(0, parseInt(stats[k]) || 0); });
  }
  if (achievements !== undefined && Array.isArray(achievements)) {
    u.achievements = achievements.filter(a => typeof a === "string").slice(0, 20);
  }
  saveUsers(users);
  res.json({ success: true, user: safeUser(u) });
});

// ── AUTH: Discord OAuth ────────────────────────────────────
app.get("/api/auth/discord",
  passport.authenticate("discord")
);
app.get("/api/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/auth.html?error=discord" }),
  (req, res) => res.redirect("/profile.html")
);

// ── API: подача заявки ──────────────────────────────────────
app.post("/api/apply", async (req, res) => {
  const { nickname, age, discord, experience, reason } = req.body;

  if (!nickname || !age || !discord || !experience || !reason)
    return res.status(400).json({ success: false, message: "Не все поля заполнены" });

  // Сохраняем заявку
  const apps = loadApps();
  const existing = apps.find(a => a.discord.toLowerCase() === discord.toLowerCase());
  if (existing)
    return res.status(409).json({ success: false, message: "Заявка с таким Discord уже существует" });

  const application = {
    id:        Date.now().toString(),
    nickname,
    age,
    discord,
    experience,
    reason,
    status:    "pending",
    comment:   "",
    createdAt: new Date().toISOString(),
  };
  apps.push(application);
  saveApps(apps);

  // Уведомление всем клиентам
  broadcast({ text: `📋 Новая заявка от ${nickname}`, type: "info" });

  // Отправка в Discord webhook
  const webhook = process.env.DISCORD_WEBHOOK;
  if (webhook) {
    const imageUrl =
      "https://cdn.discordapp.com/attachments/1509898657242021969/1510924961102172160/xmapp.png?ex=6a1e9606&is=6a1d4486&hm=436b8c61e6e3048fec413a50a7dfe6bfe185b522d478b7ae2bc870f993178773";

    const payload = {
      embeds: [{
        title:       "📋 НОВАЯ ЗАЯВКА В MILLER FAMILY",
        description: "Поступила новая заявка на вступление в семью.",
        color:       15548997,
        fields: [
          { name: "👤 Никнейм",           value: nickname,   inline: true  },
          { name: "🎂 Возраст",            value: String(age), inline: true },
          { name: "💬 Discord",            value: discord,    inline: false },
          { name: "🎮 RP Опыт",            value: experience, inline: false },
          { name: "📝 Причина вступления", value: reason,     inline: false },
          { name: "🆔 ID заявки",          value: application.id, inline: false },
        ],
        image:     { url: imageUrl },
        footer:    { text: "Miller Family • Power • Loyalty • Respect" },
        timestamp: new Date().toISOString(),
      }],
    };

    try {
      await fetch(webhook, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }

  res.json({ success: true, id: application.id });
});

// ── API: статус заявки ──────────────────────────────────────
app.get("/api/application-status", (req, res) => {
  const discord = req.query.discord?.toLowerCase();
  if (!discord) return res.status(400).json({ found: false });

  const apps = loadApps();
  const app_ = apps.find(a => a.discord.toLowerCase() === discord);
  if (!app_) return res.json({ found: false });

  res.json({
    found:     true,
    status:    app_.status,
    nickname:  app_.nickname,
    createdAt: app_.createdAt,
    comment:   app_.comment,
  });
});

// ── API: обновление статуса (защищён секретом) ──────────────
app.patch("/api/application-status/:id", (req, res) => {
  const secret = req.headers["x-admin-secret"];
  if (secret !== process.env.ADMIN_SECRET)
    return res.status(403).json({ success: false, message: "Forbidden" });

  const apps   = loadApps();
  const idx    = apps.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false });

  const { status, comment } = req.body;
  if (status) apps[idx].status  = status;
  if (comment !== undefined) apps[idx].comment = comment;
  saveApps(apps);

  // Уведомление
  if (status === "approved")
    broadcast({ text: `✅ Заявка ${apps[idx].nickname} одобрена!`, type: "success" });
  if (status === "rejected")
    broadcast({ text: `❌ Заявка ${apps[idx].nickname} отклонена`, type: "warning" });

  res.json({ success: true });
});

// ── API: все заявки для админки ────────────────────────────
app.get("/api/applications", (req, res) => {
  const secret = req.headers["x-admin-secret"];
  if (secret !== process.env.ADMIN_SECRET)
    return res.status(403).json({ success: false });
  res.json(loadApps());
});

// ── Запуск ──────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
