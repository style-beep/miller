// Порядок ролей: чем меньше индекс — тем выше в списке
export const ROLE_ORDER = [
  "Создатель",
  "꒰👑꒱ Director  ✦",
  "✦🦢୧﹕Deputy Director",
  "Руководитель Модерации",
  "Зам.Руководителя Модерации",
  "Тех.Админ",
  "Админ.Дизайнер",
  "Moderator",
  "Cand.Moder",
  "След.Админ - Войсы + Чаты",
  "Коллер",
  "˚✨ × MILLER ˚",
];

// Конфиг отделов для страницы "Состав"
export const DEPARTMENTS = [
  {
    id: "leadership",
    name: "РУКОВОДСТВО",
    subtitle: "Высшее командование семьи",
    icon: "👑",
    color: "#ff2a2a",
    roles: ["Создатель", "꒰👑꒱ Director  ✦", "✦🦢୧﹕Deputy Director"],
  },
  {
    id: "senior-admin",
    name: "СТАРШАЯ АДМИНИСТРАЦИЯ",
    subtitle: "Координация и надзор",
    icon: "⭐",
    color: "#c9a227",
    roles: ["Руководитель Модерации", "Зам.Руководителя Модерации"],
  },
  {
    id: "tech-admin",
    name: "ТЕХНИЧЕСКАЯ АДМИНИСТРАЦИЯ",
    subtitle: "Техническая поддержка и дизайн",
    icon: "⚙️",
    color: "#4a9eff",
    roles: ["Тех.Админ", "Админ.Дизайнер"],
  },
  {
    id: "moderation",
    name: "МОДЕРАЦИЯ",
    subtitle: "Поддержание порядка в семье",
    icon: "🛡️",
    color: "#43b581",
    roles: ["Moderator", "Cand.Moder"],
  },
];
