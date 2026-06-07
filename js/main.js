import { initStorage }        from "./storage.js";
import { initPageTransition } from "./page-transition.js";
import { initEasterEgg }      from "./easter-egg.js";
import { initCursor }         from "./cursor.js";
import { initPlayer }         from "./player.js";
import { initModal }          from "./modal.js";
import { initDiscordMembers } from "./discord.js";
import { initVideo }          from "./video.js";
import { initGallery }        from "./gallery.js";
import { initHallOfFame }     from "./halloffame.js";
import { initCountdown }      from "./countdown.js";
import { initAppStatus }      from "./appstatus.js";
import { initNotifications }  from "./notifications.js";
import { initIntro }          from "./intro.js";
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

// Service Worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

// Инициализируем всё после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  initStorage();        // миграция localStorage — самым первым
  initPageTransition(); // transitions — первым, до всего
  initEasterEgg();      // konami code + glitch
  initIntro();          // интро
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
  initGallery();
  initHallOfFame();
  initCountdown();
  initAppStatus();
  initNotifications();
});
