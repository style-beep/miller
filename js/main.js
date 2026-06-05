import { initCursor }         from "./cursor.js";
import { initPlayer }         from "./player.js";
import { initModal }          from "./modal.js";
import { initDiscordMembers } from "./discord.js";
import { initVideo }          from "./video.js";
import { initGame }           from "./game.js";
import { initGallery }        from "./gallery.js";
import { initHallOfFame }     from "./halloffame.js";
import { initCountdown }      from "./countdown.js";
import { initAppStatus }      from "./appstatus.js";
import { initNotifications }  from "./notifications.js";
import {
  initLoader,
  initClock,
  initScrollProgress,
  initHeaderScroll,
  initNavHighlight,
  initSmoothScroll,
  initScrollReveal,
  initCounters,
  initParallax,
  initCardTilt,
  initGlitch,
  initTyping,
  initLogoRipple,
  initBloodSplatter,
  initTitleSplit,
  initAlerts,
} from "./animations.js";

// Инициализируем всё после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initLoader();
  initClock();
  initScrollProgress();
  initHeaderScroll();
  initNavHighlight();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initParallax();
  initCardTilt();
  initGlitch();
  initTyping();
  initLogoRipple();
  initBloodSplatter();
  initTitleSplit();
  initAlerts();
  initPlayer();
  initModal();
  initDiscordMembers();
  initVideo();
  initGame();
  initGallery();
  initHallOfFame();
  initCountdown();
  initAppStatus();
  initNotifications();
});
