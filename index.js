const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

let membersCache = [];

client.on("ready", async () => {
  console.log("Bot online");

  const guild = client.guilds.cache.first();
  await guild.members.fetch();

  setInterval(() => {
    membersCache = guild.members.cache.map((m) => ({
      name: m.user.username,
      avatar: m.user.displayAvatarURL(),
      status: m.presence?.status || "offline",
    }));
  }, 5000);
});

app.get("/members", (req, res) => {
  res.json(membersCache);
});

app.listen(3001, () => {
  console.log("API on http://localhost:3001");
});

client.login(
  "MTUxMTM0MjEwMzk1ODEyNjY5Nw.GpSJvC.Gl9XK7V69SmznvD9OGGJniEw5w0Uo1Tq1msYoc",
);
