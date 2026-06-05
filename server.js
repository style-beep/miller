require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express   = require("express");
const path      = require("path");
const fs        = require("fs");
const http      = require("http");
const WebSocket = require("ws");

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });
const PORT   = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
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
    name:   m.user.username,
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
