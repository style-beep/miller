require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

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

  // Начальное заполнение кэша
  updateCache(guild);

  // Обновление каждые 5 секунд
  setInterval(() => updateCache(guild), 5000);
});

function updateCache(guild) {
  membersCache = guild.members.cache.map((m) => ({
    name: m.user.username,
    avatar: m.user.displayAvatarURL(),
    status: m.presence?.status || "offline",
    roles: m.roles.cache
      .filter(r => r.name !== "@everyone")
      .sort((a, b) => b.position - a.position)
      .map(r => ({ name: r.name, color: r.hexColor })),
  }));
}

// ── API: список участников ──────────────────────────────────
app.get("/api/members", (req, res) => {
  res.json(membersCache);
});

// ── API: отправка заявки в Discord webhook ──────────────────
app.post("/api/apply", async (req, res) => {
  const { nickname, age, discord, experience, reason } = req.body;

  if (!nickname || !age || !discord || !experience || !reason) {
    return res.status(400).json({ success: false, message: "Не все поля заполнены" });
  }

  const webhook = process.env.DISCORD_WEBHOOK;
  if (!webhook) {
    return res.status(500).json({ success: false, message: "Webhook не настроен" });
  }

  const imageUrl =
    "https://cdn.discordapp.com/attachments/1509898657242021969/1510924961102172160/xmapp.png?ex=6a1e9606&is=6a1d4486&hm=436b8c61e6e3048fec413a50a7dfe6bfe185b522d478b7ae2bc870f993178773";

  const payload = {
    embeds: [
      {
        title: "📋 НОВАЯ ЗАЯВКА В MILLER FAMILY",
        description: "Поступила новая заявка на вступление в семью.",
        color: 15548997,
        fields: [
          { name: "👤 Никнейм",           value: nickname,   inline: true  },
          { name: "🎂 Возраст",            value: age,        inline: true  },
          { name: "💬 Discord",            value: discord,    inline: false },
          { name: "🎮 RP Опыт",            value: experience, inline: false },
          { name: "📝 Причина вступления", value: reason,     inline: false },
        ],
        image: { url: imageUrl },
        footer: { text: "Miller Family • Power • Loyalty • Respect" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Discord возвращает 204 No Content при успехе
    if (response.status === 204) {
      res.json({ success: true });
    } else {
      const text = await response.text();
      res.status(500).json({ success: false, message: text });
    }
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ success: false, message: "Ошибка отправки" });
  }
});

// ── Запуск ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
