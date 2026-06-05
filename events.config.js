// ── Конфиг событий ─────────────────────────────────────────────
// Измени дату и название следующего ивента здесь

export const NEXT_EVENT = {
  title:       "СЕМЕЙНЫЙ СБОР",
  description: "Общий сбор Miller Family",
  date:        "2026-06-20T20:00:00",  // ISO формат
};

// ── История семьи (таймлайн) ────────────────────────────────────
export const TIMELINE = [
  {
    date:  "Январь 2023",
    title: "Основание Miller Family",
    text:  "Eddie Miller основал семью на сервере Del Perro RP с первыми 5 участниками.",
    icon:  "👑",
    side:  "left",
  },
  {
    date:  "Март 2023",
    title: "Первая территориальная война",
    text:  "Miller Family выиграла первый конфликт за контроль над Del Perro Beach.",
    icon:  "⚔️",
    side:  "right",
  },
  {
    date:  "Июль 2023",
    title: "20 участников",
    text:  "Семья выросла до 20 человек. Открыт первый бизнес под контролем организации.",
    icon:  "📈",
    side:  "left",
  },
  {
    date:  "Декабрь 2023",
    title: "Захват Downtown LS",
    text:  "После серии переговоров и боёв семья установила контроль над центральным районом.",
    icon:  "🏙️",
    side:  "right",
  },
  {
    date:  "Апрель 2024",
    title: "50+ участников",
    text:  "Рекордный набор — семья пересекла отметку в 50 бойцов. Назначен Директор Adam Miller.",
    icon:  "🛡️",
    side:  "left",
  },
  {
    date:  "Сентябрь 2024",
    title: "Альянс с союзными кланами",
    text:  "Подписан пакт о ненападении с тремя крупнейшими организациями сервера.",
    icon:  "🤝",
    side:  "right",
  },
  {
    date:  "2025",
    title: "Доминирование Del Perro",
    text:  "Miller Family стала самой влиятельной организацией сервера. 70+ участников.",
    icon:  "🔥",
    side:  "left",
  },
  {
    date:  "Сейчас",
    title: "Новая эпоха",
    text:  "Семья продолжает расти. Власть. Деньги. Уважение.",
    icon:  "⭐",
    side:  "right",
    active: true,
  },
];

// ── Галерея ─────────────────────────────────────────────────────
// Добавляй свои фото в папку images/gallery/ и вписывай сюда

export const GALLERY = [
  { src: "images/miller1.jpeg",       caption: "Eddie Miller — Boss"             },
  { src: "images/miller2.jpeg",       caption: "Adam Miller — Director"          },
  { src: "images/miller3.jpeg",       caption: "Roy Miller — Deputy Director"    },
  { src: "images/eddie.jpg",          caption: "Eddie на улицах Los Santos"      },
  { src: "images/adam.jpg",           caption: "Adam — контроль операций"        },
  { src: "images/roy.jpg",            caption: "Roy — боевые операции"           },
  { src: "images/miller-emblem.png",  caption: "Официальный герб Miller Family"  },
  { src: "images/background.png",     caption: "Miller Family — Del Perro RP"    },
];

// ── Доска почёта ────────────────────────────────────────────────
export const HALL_OF_FAME = [
  {
    name:   "EDDIE MILLER",
    role:   "Family Boss",
    reason: "Основатель и лидер организации",
    stats:  { kills: "520M+", wars: "98%", rep: "MAX" },
    photo:  "images/eddie.jpg",
    badge:  "👑",
    color:  "#ff2a2a",
  },
  {
    name:   "ADAM MILLER",
    role:   "Director",
    reason: "Лучший менеджер месяца",
    stats:  { kills: "94%", wars: "12", rep: "MAX" },
    photo:  "images/adam.jpg",
    badge:  "🛡️",
    color:  "#c0a030",
  },
  {
    name:   "ROY MILLER",
    role:   "Deputy Director",
    reason: "Лучший боец месяца",
    stats:  { kills: "96%", wars: "84%", rep: "HIGH" },
    photo:  "images/roy.jpg",
    badge:  "⚔️",
    color:  "#888",
  },
];
