<div align="center">

# 🔴 MILLER FAMILY

### Официальный сайт игровой семьи с сервера [Del Perro RP](https://discord.gg/SaCXzgckS) — GTA 5 Roleplay

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

> **Power · Loyalty · Respect**

</div>

---

## 📋 О проекте

Полноценный многостраничный сайт с живым списком участников Discord, музыкальным плеером, кастомным видеоплеером, мини-игрой захвата территорий, системой заявок на вступление, профилями участников с системой достижений и админ-панелью управления контентом.

---

## ⚡ Стек технологий

| Слой | Технологии |
|------|-----------|
| Фронтенд | HTML5, CSS3, Vanilla JS (ES Modules) |
| Бэкенд | Node.js, Express |
| Discord | discord.js v14 |
| Окружение | dotenv |
| Dev-режим | browser-sync, concurrently |

---

## 📁 Структура проекта

```
miller/
│
├── 📄 index.html              # Главная страница
├── 📄 admin.html              # Админ-панель (Ctrl+Shift+Z)
├── 📄 gallery.html            # Галерея
├── 📄 history.html            # История семьи
├── 📄 rules.html              # Правила
├── 📄 map.html                # Карта территорий
├── 📄 profile.html            # Профили участников
├── 📄 allies.html             # Союзники
├── 📄 media.html              # Медиа (YouTube / Twitch)
├── 📄 dossier.html            # Секретное досье
├── 📄 game.html               # Мини-игра «Захват территорий»
│
├── 📁 css/
│   ├── style.css              # Основные стили
│   ├── page.css               # Стили подстраниц
│   └── extras.css             # Дополнительные стили (countdown, hof и др.)
│
├── 📁 js/
│   ├── 📁 config/
│   │   ├── events.js          # Конфиг событий, галереи, таймлайна, доски почёта
│   │   └── roles.js           # Порядок и фильтрация ролей Discord
│   │
│   ├── main.js                # Точка входа
│   ├── animations.js          # Анимации и визуальные эффекты
│   ├── cursor.js              # Кастомный курсор
│   ├── discord.js             # Загрузка участников Discord
│   ├── modal.js               # Модалка заявки на вступление
│   ├── player.js              # Музыкальный плеер
│   ├── video.js               # Кастомный видеоплеер
│   ├── game.js                # Мини-игра
│   ├── gallery.js             # Галерея с лайтбоксом
│   ├── halloffame.js          # Доска почёта
│   ├── countdown.js           # Обратный отсчёт до события
│   ├── appstatus.js           # Проверка статуса заявки
│   ├── notifications.js       # Уведомления (тосты)
│   ├── easter-egg.js          # Пасхальное яйцо (Konami code)
│   ├── intro.js               # Интро-экран при первом заходе
│   ├── page-loader.js         # Терминальный загрузчик подстраниц
│   └── page-transition.js     # Переходы между страницами
│
├── 📁 images/                 # Фото участников, эмблема, фон, обложки плеера
├── 📁 music/                  # Аудиофайлы плеера (.mp3)
├── 📁 video/                  # Видеофайлы (трейлер)
│
├── server.js                  # Express-сервер + Discord-бот
├── manifest.json              # PWA манифест
├── sw.js                      # Service Worker
├── package.json
├── .env                       # Секреты (не в git!)
└── .env.example               # Шаблон для .env
```

---

## 🚀 Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd miller
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить окружение

```bash
cp .env.example .env
```

Открыть `.env` и заполнить:

```env
DISCORD_TOKEN=токен_бота
DISCORD_WEBHOOK=ссылка_на_вебхук
ADMIN_SECRET=секретный_ключ
PORT=3001
```

### 4. Запустить

```bash
# Продакшн
npm start

# Разработка (авто-перезапуск + live reload)
npm run dev
```

| Режим | URL |
|-------|-----|
| Сервер | `http://localhost:3001` |
| Live reload | `http://localhost:3000` |

---

## ✨ Возможности

### 🏠 Главная страница
- Интро-экран с логотипом и прогресс-баром при первом посещении
- Живые счётчики статистики семьи с анимацией
- Блок требований и преимуществ с иконками
- Секция структуры с карточками Eddie / Adam / Roy
- Состав с кнопками перехода на профили
- Обратный отсчёт до следующего события
- Доска почёта топ-3 участников
- Закрытые разделы с терминальным загрузчиком
- Проверка статуса заявки по Discord тегу
- Кастомный видеоплеер с трейлером

### 🎮 Мини-игра «Street Wars»
- 20 районов Los Santos на карте 5×4
- 4 фракции: Miller Family, Los Diablos, Vagos, Ballas
- AI атакует каждые 2.2 секунды
- Войска регенерируются каждые 3 секунды
- Превью атаки при наведении на врага

### 👤 Профили участников
- Страница для Eddie, Adam и Roy (`profile.html?id=eddie`)
- Статистика, навыки с прогресс-барами, биография
- **Система достижений** — 12 ачивок с 4 уровнями редкости:

| Редкость | Цвет |
|----------|------|
| UNCOMMON | 🟢 Зелёный |
| RARE | 🔵 Синий |
| EPIC | 🟣 Фиолетовый |
| LEGENDARY | 🟠 Оранжевый |

### 🔐 Админ-панель
Доступ: **`Ctrl + Shift + Z`** → пароль на странице входа

| Вкладка | Возможности |
|---------|-------------|
| 📋 Заявки | Просмотр, одобрение, отклонение, комментарии, удаление |
| 🏆 Доска почёта | Редактировать имя, роль, причину, фото каждого места |
| 📅 Событие | Изменить название и дату таймера обратного отсчёта |
| 🤝 Союзники | Добавлять, редактировать, удалять союзников |

> Все данные сохраняются в `localStorage` — работает без сервера.

### 📋 Система заявок
- Форма вступления сохраняет данные в `localStorage`
- Проверка дубликатов по Discord тегу
- Статус заявки можно проверить прямо на главной странице
- Администратор одобряет/отклоняет + оставляет комментарий

### 🎵 Музыкальный плеер
- Плейлист с обложками альбомов
- Управление: play/pause, prev/next, громкость, прогресс
- Сворачивается в мини-режим

### 🐣 Пасхальное яйцо
Введи **Konami Code**: `↑ ↑ ↓ ↓ ← → ← → B A` — и увидишь секретный экран

### 📱 PWA + адаптивность
- Устанавливается на телефон как приложение
- Полная адаптация: 1024px / 768px / 480px / 360px
- Service Worker для офлайн-режима

---

## ⚙️ Настройка контента

### Следующее событие
`js/config/events.js` → поле `NEXT_EVENT`:
```js
export const NEXT_EVENT = {
  title: "СЕМЕЙНЫЙ СБОР",
  description: "Общий сбор Miller Family",
  date: "2026-06-20T20:00:00",
};
```
> Или измени прямо в **Админ-панели** → вкладка 📅 Событие

### Галерея
`js/config/events.js` → массив `GALLERY`. Добавь фото в `images/` и впиши путь.

### Доска почёта
`js/config/events.js` → массив `HALL_OF_FAME`.
> Или измени в **Админ-панели** → вкладка 🏆 Доска почёта

### Союзники
`js/config/events.js` → массив `ALLIES`.
> Или добавь в **Админ-панели** → вкладка 🤝 Союзники

### Треки плеера
`js/player.js` → массив `songs`:
```js
{ title: "НАЗВАНИЕ", artist: "Исполнитель", src: "music/файл.mp3", cover: "images/covers/cover1.png" }
```

### Роли Discord
`js/config/roles.js` → массив `ROLE_ORDER` — только участники с этими ролями отображаются в блоке Soldiers.

---

## 🔌 API (при запущенном сервере)

### `GET /api/members`
Список участников Discord с ролями и статусами.

### `POST /api/apply`
Подача заявки.
```json
{
  "nickname": "Eddie_Miller",
  "age": "20",
  "discord": "eddie#0000",
  "experience": "1.5 года на Del Perro RP",
  "reason": "Хочу быть частью лучшей семьи сервера"
}
```

### `GET /api/application-status?discord=username`
Проверка статуса заявки по Discord тегу.

### `PATCH /api/application-status/:id`
Изменение статуса (требует заголовок `x-admin-secret`).
```json
{ "status": "approved", "comment": "Добро пожаловать в семью!" }
```
Статусы: `pending` · `approved` · `rejected`

---

## 🌐 Деплой

### Railway *(рекомендуется)*
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Добавить переменные из `.env` в Variables
3. Railway автоматически запустит `npm start`

### Render
1. [render.com](https://render.com) → New Web Service
2. Build: `npm install` / Start: `npm start`
3. Добавить переменные в Environment

---

## 🔒 Безопасность

- `.env` и `applications.json` — в `.gitignore`, **никогда не коммитить**
- Если токен Discord попал в git — немедленно сбросить на [discord.com/developers](https://discord.com/developers)
- Пароль от админки хранится только у тебя

---

<div align="center">

**MILLER FAMILY · DEL PERRO RP · 2023–2026**

*dev by donskoyy*

</div>
