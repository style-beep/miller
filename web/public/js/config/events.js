// ── Конфиг событий ─────────────────────────────────────────────
// Измени дату и название следующего ивента здесь

export const NEXT_EVENT = {
  title: "СЕМЕЙНЫЙ СБОР",
  description: "Общий сбор Miller Family",
  date: "2026-06-20T20:00:00", // ISO формат
};

// ── История семьи (таймлайн) ────────────────────────────────────
export const TIMELINE = [
  {
    date: "Январь 2023",
    title: "Основание Miller Family",
    text: "Eddie Miller основал семью на сервере Del Perro RP с первыми 5 участниками.",
    icon: "👑",
    side: "left",
  },
  {
    date: "Март 2023",
    title: "Первая территориальная война",
    text: "Miller Family выиграла первый конфликт за контроль над Del Perro Beach.",
    icon: "⚔️",
    side: "right",
  },
  {
    date: "Июль 2023",
    title: "20 участников",
    text: "Семья выросла до 20 человек. Открыт первый бизнес под контролем организации.",
    icon: "📈",
    side: "left",
  },
  {
    date: "Декабрь 2023",
    title: "Захват Downtown LS",
    text: "После серии переговоров и боёв семья установила контроль над центральным районом.",
    icon: "🏙️",
    side: "right",
  },
  {
    date: "Апрель 2024",
    title: "50+ участников",
    text: "Рекордный набор — семья пересекла отметку в 50 бойцов. Назначен Директор Adam Miller.",
    icon: "🛡️",
    side: "left",
  },
  {
    date: "Сентябрь 2024",
    title: "Альянс с союзными кланами",
    text: "Подписан пакт о ненападении с тремя крупнейшими организациями сервера.",
    icon: "🤝",
    side: "right",
  },
  {
    date: "2025",
    title: "Доминирование Del Perro",
    text: "Miller Family стала самой влиятельной организацией сервера. 70+ участников.",
    icon: "🔥",
    side: "left",
  },
  {
    date: "Сейчас",
    title: "Новая эпоха",
    text: "Семья продолжает расти. Власть. Деньги. Уважение.",
    icon: "⭐",
    side: "right",
    active: true,
  },
];

// ── Галерея ─────────────────────────────────────────────────────
// type: "photo"   → src: путь к файлу в images/
// type: "video"   → src: путь к файлу в video/
// type: "youtube" → src: ссылка вида https://youtu.be/ID или https://www.youtube.com/watch?v=ID

export const GALLERY = [
  { type: "photo", src: "images/miller1.jpeg", caption: "Eddie Miller — Boss" },
  {
    type: "photo",
    src: "images/miller2.jpeg",
    caption: "Adam Miller — Director",
  },
  {
    type: "photo",
    src: "images/miller3.jpeg",
    caption: "Roy Miller — Deputy Director",
  },
  {
    type: "photo",
    src: "images/eddie.jpg",
    caption: "Eddie на улицах Los Santos",
  },
  {
    type: "photo",
    src: "images/adam.jpg",
    caption: "Adam — контроль операций",
  },
  { type: "photo", src: "images/roy.jpg", caption: "Roy — боевые операции" },
  {
    type: "photo",
    src: "images/miller-emblem.png",
    caption: "Официальный герб Miller Family",
  },
  {
    type: "photo",
    src: "images/background.png",
    caption: "Miller Family — Del Perro RP",
  },
  {
    type: "video",
    src: "video/millerarmy.mp4",
    caption: "Miller Family — видео архив",
  },
  {
    type: "video",
    src: "video/army2.mp4",
    caption: "Miller Family — видео архив",
  },
  // Примеры для YouTube (вставь свои ссылки):
  // { type: "youtube", src: "https://youtu.be/XXXXXXXXXX", caption: "Война за Downtown LS" },
];

// ── Доска почёта ────────────────────────────────────────────────
export const HALL_OF_FAME = [
  {
    name: "EDDIE MILLER",
    role: "Family Boss",
    reason: "Основатель и лидер организации",
    stats: { kills: "520M+", wars: "98%", rep: "MAX" },
    photo: "images/eddie.jpg",
    badge: "👑",
    color: "#ff2a2a",
  },
  {
    name: "ADAM MILLER",
    role: "Director",
    reason: "Лучший менеджер месяца",
    stats: { kills: "94%", wars: "12", rep: "MAX" },
    photo: "images/adam.jpg",
    badge: "🛡️",
    color: "#c0a030",
  },
  {
    name: "ROY MILLER",
    role: "Deputy Director",
    reason: "Лучший боец месяца",
    stats: { kills: "96%", wars: "84%", rep: "HIGH" },
    photo: "images/roy.jpg",
    badge: "⚔️",
    color: "#888",
  },
];

// ── Союзники ────────────────────────────────────────────────────
export const ALLIES = [
  {
    name: "ПРИМЕРНЫЙ СОЮЗНИК",
    tag: "ALLY",
    desc: "Дружественная организация. Пакт о ненападении подписан в 2024 году.",
    discord: "https://discord.gg/",
    logo: "images/miller-emblem.png",
    status: "active",
    since: "Март 2024",
  },
  // Добавляй союзников сюда
];

// ── Медиа ───────────────────────────────────────────────────────
export const MEDIA = [
  {
    type: "youtube", // youtube | twitch | video
    title: "Война за Downtown LS",
    desc: "Эпичный рейд на территорию Los Diablos. Miller Family захватывает центр города.",
    url: "https://youtube.com/@eddiealta",
    thumb: "images/miller1.jpeg",
    date: "Декабрь 2024",
    author: "Eddie Miller",
  },
  {
    type: "youtube",
    title: "Семейный сбор 2024",
    desc: "Общий сбор 70+ участников Miller Family. Планирование стратегии на новый сезон.",
    url: "https://youtube.com/@eddiealta",
    thumb: "images/miller2.jpeg",
    date: "Ноябрь 2024",
    author: "Adam Miller",
  },
  {
    type: "twitch",
    title: "Ночной патруль",
    desc: "Стрим — контроль территорий Del Perro в ночное время.",
    url: "https://twitch.tv/eddiemi11er",
    thumb: "images/miller3.jpeg",
    date: "Октябрь 2024",
    author: "Roy Miller",
  },
  // Добавляй медиа сюда
];
