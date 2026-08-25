import { initStorage }        from "./storage.js";
import { initIndexGuard }    from "./auth-guard.js";
import { initPerf }           from "./perf.js";
import { initPageTransition } from "./page-transition.js";
import { initEasterEgg }      from "./easter-egg.js";
import { initCursor }         from "./cursor.js";
import { initPlayer }         from "./player.js";
import { initModal }          from "./modal.js";
import { initDiscordMembers } from "./discord.js";
import { initDepartments }    from "./departments.js";
import { initUserBar }        from "./userbar.js";
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
  initIndexGuard();     // AUTH WALL — скрыть закрытый контент для гостей
  initStorage();        // миграция localStorage — самым первым
  initPerf();           // режим производительности — до всего визуального
  initUserBar();        // кнопка входа / аватар пользователя в шапке
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
  initDepartments();
  initVideo();
  initGallery();
  initHallOfFame();
  initCountdown();
  initAppStatus();
  initNotifications();
});
