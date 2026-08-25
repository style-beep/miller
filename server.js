require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express   = require("express");
const path      = require("path");
const fs        = require("fs");
const crypto    = require("crypto");
const http      = require("http");
const WebSocket = require("ws");
const session      = require("express-session");
const FileStore    = require("session-file-store")(session);
const bcrypt    = require("bcryptjs");
const passport  = require("passport");
const { Strategy: LocalStrategy }   = require("passport-local");
const { Strategy: DiscordStrategy } = require("passport-discord");

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });
const PORT   = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Session secret: fail-closed in production ──────────────
function resolveSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  const isWeak = !secret || secret.length < 32;
  if (NODE_ENV === "production") {
    if (isWeak) {
      console.error(
        "[FATAL] SESSION_SECRET отсутствует или короче 32 символов. " +
        "Установите надёжный случайный SESSION_SECRET в .env перед запуском в production."
      );
      process.exit(1);
    }
    return secret;
  }
  if (isWeak) {
    console.warn(
      "[WARN] SESSION_SECRET не задан или слишком короткий — используется случайный " +
      "секрет только для этого dev-процесса (сессии будут сброшены при перезапуске)."
    );
    return crypto.randomBytes(32).toString("hex");
  }
  return secret;
}
const SESSION_SECRET = resolveSessionSecret();

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
        role:          "user",
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
  store:             new FileStore({ path: "./sessions", ttl: 7 * 24 * 3600, retries: 1, logFn: () => {} }),
  secret:            SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Блокировка доступа к чувствительным файлам через static ─
const PUBLIC_DIR = path.join(__dirname, "dist-web");
const SENSITIVE_PATHS = new Set(["/users.json", "/applications.json", "/users.json;C", "/applications.json;C", "/sessions;C"]);
app.use((req, res, next) => {
  if (SENSITIVE_PATHS.has(req.path) || req.path.startsWith("/sessions/") || req.path === "/sessions") {
    return res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
  }
  next();
});
app.use(express.static(PUBLIC_DIR, { dotfiles: "deny" }));

// ── Admin authorization: server-side session + role check ──
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
}

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
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let membersCache = [];
let voiceCache   = [];   // [{channelId, channelName, members:[{name,avatar,id}]}]
let messagesCache = [];  // последние 100 сообщений [{id,author,avatar,content,channel,channelId,ts}]

const MSG_LIMIT = 100;

client.on("ready", async () => {
  console.log(`Bot online: ${client.user.tag}`);
  const guild = client.guilds.cache.first();
  if (!guild) return console.warn("No guild found");
  await guild.members.fetch();
  updateCache(guild);
  updateVoiceCache(guild);
  setInterval(() => updateCache(guild), 5000);

  setTimeout(() => broadcast({ text: "🤖 Бот Miller Family онлайн", type: "info" }), 2000);
});

function updateCache(guild) {
  membersCache = guild.members.cache.map(m => ({
    id:     m.id,
    name:   m.displayName,
    avatar: m.user.displayAvatarURL({ extension: "png", size: 64, forceStatic: true }),
    status: m.presence?.status || "offline",
    roles:  m.roles.cache
      .filter(r => r.name !== "@everyone")
      .sort((a, b) => b.position - a.position)
      .map(r => ({ id: r.id, name: r.name, color: r.hexColor })),
  }));
}

function updateVoiceCache(guild) {
  const channels = {};
  guild.members.cache.forEach(m => {
    const vs = m.voice;
    if (!vs?.channel) return;
    const ch = vs.channel;
    if (!channels[ch.id]) {
      channels[ch.id] = { channelId: ch.id, channelName: ch.name, members: [] };
    }
    channels[ch.id].members.push({
      id:     m.id,
      name:   m.displayName,
      avatar: m.user.displayAvatarURL({ extension: "png", size: 64, forceStatic: true }),
      mute:   vs.serverMute || vs.selfMute,
      deaf:   vs.serverDeaf || vs.selfDeaf,
    });
  });
  voiceCache = Object.values(channels).sort((a, b) => b.members.length - a.members.length);
}

// Обновляем войс-кэш при изменении состояния
client.on("voiceStateUpdate", (_old, _new) => {
  const guild = client.guilds.cache.first();
  if (guild) updateVoiceCache(guild);
});

// Сохраняем входящие сообщения
client.on("messageCreate", msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  messagesCache.push({
    id:        msg.id,
    author:    msg.member?.displayName || msg.author.username,
    avatar:    msg.author.displayAvatarURL({ extension: "png", size: 32, forceStatic: true }),
    content:   msg.content.substring(0, 400),
    channel:   msg.channel.name,
    channelId: msg.channelId,
    ts:        msg.createdTimestamp,
  });
  if (messagesCache.length > MSG_LIMIT) messagesCache.shift();
});

// ── API: участники ──────────────────────────────────────────
app.get("/api/members", (req, res) => res.json(membersCache));

// ── API: текстовые каналы (admin) ──────────────────────────
app.get("/api/admin/channels", requireAdmin, (req, res) => {
  const guild = client.guilds.cache.first();
  if (!guild) return res.json([]);
  const channels = guild.channels.cache
    .filter(ch => ch.type === 0) // GUILD_TEXT = 0
    .sort((a, b) => a.rawPosition - b.rawPosition)
    .map(ch => ({ id: ch.id, name: ch.name, parentName: ch.parent?.name || null }));
  res.json(channels);
});

// ── API: отправить сообщение в канал (admin) ───────────────
app.post("/api/admin/send-message", requireAdmin, async (req, res) => {
  const { channelId, content } = req.body;
  if (!channelId || !content?.trim())
    return res.status(400).json({ success: false, message: "channelId и content обязательны" });
  try {
    const ch = await client.channels.fetch(channelId);
    if (!ch || ch.type !== 0)
      return res.status(404).json({ success: false, message: "Канал не найден" });
    const { replyToId } = req.body;
    const payload = { content: String(content).substring(0, 2000) };
    if (replyToId) payload.reply = { messageReference: replyToId, failIfNotExists: false };
    const msg = await ch.send(payload);
    res.json({ success: true, messageId: msg.id });
  } catch (err) {
    console.error("[send-message]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── API: войс-каналы (admin) ────────────────────────────────
app.get("/api/admin/voice", requireAdmin, (req, res) => {
  res.json(voiceCache);
});

// ── API: сообщения (admin) ──────────────────────────────────
app.get("/api/admin/messages", requireAdmin, (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 50, MSG_LIMIT);
  res.json([...messagesCache].reverse().slice(0, limit));
});

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
    role:         "user",
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
    const member = membersCache.find(m => m.id === user.discordId);
    if (member) {
      user.discordRoles  = member.roles;
      user.discordStatus = member.status;
      user.discordName   = member.name;
    }
  }
  res.json({ user });
});

// ── Публичный профиль по Discord ID ────────────────────────
app.get("/api/users/:discordId", (req, res) => {
  const user = loadUsers().find(u => u.discordId === req.params.discordId);
  if (!user) return res.status(404).json({ user: null });

  const safe = safeUser(user);
  const member = membersCache.find(m => m.id === req.params.discordId);
  if (member) {
    safe.discordRoles  = member.roles;
    safe.discordStatus = member.status;
    safe.discordName   = member.name;
  }
  res.json({ user: safe });
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
    u.achievements = achievements.filter(a => typeof a === "string").slice(0, 50);
  }
  saveUsers(users);
  res.json({ success: true, user: safeUser(u) });
});

// ── ADMIN: список пользователей ────────────────────────────
app.get("/api/admin/users", requireAdmin, (req, res) => {
  res.json(loadUsers().map(safeUser));
});

// ── ADMIN: редактировать пользователя (статы, достижения, титул) ──
app.patch("/api/admin/users/:id", requireAdmin, (req, res) => {
  const users = loadUsers();
  const u = users.find(x => x.id === req.params.id);
  if (!u) return res.status(404).json({ success: false });
  const { stats, achievements, title } = req.body;
  if (stats !== undefined && typeof stats === "object") {
    u.stats = u.stats || {};
    const allowed = ["kills","deaths","wins","events","money","reputation","hours","arrests"];
    allowed.forEach(k => { if (stats[k] !== undefined) u.stats[k] = Math.max(0, parseInt(stats[k]) || 0); });
  }
  if (achievements !== undefined && Array.isArray(achievements)) {
    u.achievements = achievements.filter(a => typeof a === "string").slice(0, 50);
  }
  if (title !== undefined) u.title = String(title).substring(0, 40);
  saveUsers(users);
  res.json({ success: true, user: safeUser(u) });
});

// ── AUTH: Discord OAuth ────────────────────────────────────
app.get("/api/auth/discord",
  passport.authenticate("discord")
);
app.get("/api/auth/discord/callback",
  (req, res, next) => {
    passport.authenticate("discord", { failureRedirect: "/auth.html?error=discord" }, (err, user, info) => {
      if (err) {
        console.error("[discord-oauth] code:", err.code, "message:", err.message, "status:", err.status);
        return res.redirect("/auth.html?error=discord");
      }
      if (!user) return res.redirect("/auth.html?error=discord");
      req.login(user, loginErr => {
        if (loginErr) return next(loginErr);
        res.redirect("/profile.html");
      });
    })(req, res, next);
  }
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
app.patch("/api/application-status/:id", requireAdmin, (req, res) => {
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
app.get("/api/applications", requireAdmin, (req, res) => {
  res.json(loadApps());
});

// ── 404 ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

// ── Запуск ──────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
