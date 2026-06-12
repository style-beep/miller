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

Полноценный многостраничный сайт с живым списком участников Discord, системой входа и личных кабинетов, музыкальным плеером, кастомным видеоплеером, мини-игрой захвата территорий, системой заявок на вступление, профилями участников с системой достижений и редактируемой статистикой, и динамическими блоками отделов.

---

## ⚡ Стек технологий

| Слой | Технологии |
|------|-----------|
| Фронтенд | HTML5, CSS3, Vanilla JS (ES Modules) |
| Бэкенд | Node.js, Express |
| Discord | discord.js v14 |
| Авторизация | passport, passport-local, passport-discord, bcryptjs, express-session |
| Окружение | dotenv |
| Dev-режим | browser-sync, concurrently |

---

## 📁 Структура проекта

```
miller/
│
├── 📄 index.html              # Главная страница
├── 📄 auth.html               # Вход / Регистрация (NEW)
├── 📄 admin.html              # Админ-панель (Ctrl+Shift+Z)
├── 📄 gallery.html            # Галерея
├── 📄 history.html            # История семьи
├── 📄 rules.html              # Правила
├── 📄 map.html                # Карта территорий
├── 📄 profile.html            # Профили участников + Личный кабинет
├── 📄 allies.html             # Союзники
├── 📄 media.html              # Медиа (YouTube / Twitch)
├── 📄 dossier.html            # Секретное досье
├── 📄 game.html               # Мини-игра «Захват территорий»
│
├── 📁 css/
│   ├── style.css              # Основные стили
│   ├── page.css               # Стили подстраниц
│   └── extras.css             # Стили отделов, достижений, dept-карточек
│
├── 📁 js/
│   ├── 📁 config/
│   │   ├── events.js          # Конфиг событий, галереи, таймлайна, доски почёта
│   │   └── roles.js           # Порядок ролей Discord + конфиг DEPARTMENTS (NEW)
│   │
│   ├── main.js                # Точка входа
│   ├── animations.js          # Анимации и визуальные эффекты
│   ├── cursor.js              # Кастомный курсор
│   ├── discord.js             # Загрузка Soldiers из Discord (исключает отделы)
│   ├── departments.js         # Динамические блоки отделов из Discord API (NEW)
│   ├── userbar.js             # Аватар / кнопка входа в шапке (NEW)
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
├── server.js                  # Express-сервер + Discord-бот + Auth API
├── users.json                 # База пользователей (создаётся автоматически, не в git!)
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

# Discord OAuth (для кнопки «Войти через Discord»)
DISCORD_CLIENT_ID=id_приложения
DISCORD_CLIENT_SECRET=секрет_приложения
DISCORD_CALLBACK_URL=http://localhost:3001/api/auth/discord/callback
SESSION_SECRET=любая_случайная_строка
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

### 🔐 Система аккаунтов и входа *(NEW)*

Страница `/auth.html` — вход и регистрация с двумя способами:

| Способ | Описание |
|--------|----------|
| Email + пароль | Регистрация с хешированием bcrypt |
| Discord OAuth2 | Одна кнопка — вход через Discord-аккаунт |

После входа в шапке каждой страницы появляется аватар с именем пользователя.

### 👤 Личный кабинет *(ПЕРЕРАБОТАН)*

`/profile.html` — если пользователь авторизован и открывает страницу без `?id=`, показывается личный профиль:

**Что отображается:**
- Hero-баннер с аватаром Discord, статусом онлайн, ролью
- 8 карточек статистики с цветными иконками и форматированием (1K / 1M)
- Роли с Discord-сервера в виде цветных чипов
- K/D ratio, дата регистрации, кол-во достижений
- Вкладки: «О себе» и «Достижения» (12 карточек с уровнями редкости)

**Что можно редактировать** (кнопка «Редактировать» → модальное окно с 3 вкладками):

| Вкладка | Поля |
|---------|------|
| Профиль | Никнейм, описание (до 300 символов), статус/цитата (до 60) |
| Статистика | Убийства, смерти, победы, ивенты, деньги, репутация, часы, аресты |
| Достижения | Чекбоксы для каждого из 12 достижений |

### 🏛️ Динамические отделы на главной *(NEW)*

Раздел СОСТАВ на главной странице показывает 4 блока с реальными участниками из Discord:

| Отдел | Роли |
|-------|------|
| Руководство | Создатель, Director, Deputy Director |
| Старшая Администрация | Руководитель Модерации, Зам.Руководителя Модерации |
| Техническая Администрация | Тех.Админ, Админ.Дизайнер |
| Модерация | Moderator, Cand.Moder |

- Показываются серверные никнеймы (не Discord-логины)
- Участники отделов не отображаются в блоке Soldiers
- Фолбек на статические данные если API недоступен

### 🏠 Главная страница
- Интро-экран с логотипом и прогресс-баром при первом посещении
- Живые счётчики статистики семьи с анимацией
- Блок требований и преимуществ с Font Awesome иконками
- Состав: динамические блоки отделов + Soldiers из Discord
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

### 🔐 Админ-панель
Доступ: **`Ctrl + Shift + Z`** → пароль на странице входа

| Вкладка | Возможности |
|---------|-------------|
| 📋 Заявки | Просмотр, одобрение, отклонение, комментарии, удаление |
| 🏆 Доска почёта | Редактировать имя, роль, причину, фото каждого места |
| 📅 Событие | Изменить название и дату таймера обратного отсчёта |
| 🤝 Союзники | Добавлять, редактировать, удалять союзников |

### 🎵 Музыкальный плеер
- Плейлист с обложками альбомов
- Управление: play/pause, prev/next, громкость, прогресс
- Сворачивается в мини-режим

### 📱 PWA + адаптивность
- Устанавливается на телефон как приложение
- Полная адаптация: 1024px / 768px / 480px / 360px
- Service Worker для офлайн-режима

### 🐣 Пасхальное яйцо
Введи **Konami Code**: `↑ ↑ ↓ ↓ ← → ← → B A`

---

## ⚙️ Настройка контента

### Discord OAuth
1. Зайди на [discord.com/developers/applications](https://discord.com/developers/applications)
2. New Application → OAuth2 → скопируй Client ID и Client Secret
3. Добавь Redirect URI: `http://localhost:3001/api/auth/discord/callback`
4. Заполни `.env` (см. раздел «Быстрый старт»)

### Отделы и роли
`js/config/roles.js` → массив `DEPARTMENTS` — названия ролей должны точно совпадать с Discord:
```js
export const DEPARTMENTS = [
  { id: "leadership", name: "РУКОВОДСТВО", roles: ["Создатель", "꒰👑꒱ Director  ✦", ...] },
  ...
];
```

### Следующее событие
`js/config/events.js` → поле `NEXT_EVENT`:
```js
export const NEXT_EVENT = {
  title: "СЕМЕЙНЫЙ СБОР",
  date: "2026-06-20T20:00:00",
};
```

### Галерея
`js/config/events.js` → массив `GALLERY`.

### Треки плеера
`js/player.js` → массив `songs`:
```js
{ title: "НАЗВАНИЕ", artist: "Исполнитель", src: "music/файл.mp3", cover: "images/covers/cover1.png" }
```

---

## 🔌 API

### Auth

| Метод | Роут | Описание |
|-------|------|----------|
| `POST` | `/api/auth/register` | Регистрация (email + пароль) |
| `POST` | `/api/auth/login` | Вход |
| `POST` | `/api/auth/logout` | Выход |
| `GET` | `/api/auth/me` | Текущий пользователь + Discord-роли |
| `PATCH` | `/api/auth/profile` | Обновить bio / username / stats / achievements |
| `GET` | `/api/auth/discord` | Начать OAuth2-флоу |
| `GET` | `/api/auth/discord/callback` | Коллбэк Discord OAuth2 |

### Участники и заявки

| Метод | Роут | Описание |
|-------|------|----------|
| `GET` | `/api/members` | Список участников Discord (роли, статусы) |
| `POST` | `/api/apply` | Подача заявки |
| `GET` | `/api/application-status?discord=tag` | Статус заявки |
| `PATCH` | `/api/application-status/:id` | Изменить статус (требует `x-admin-secret`) |
| `GET` | `/api/applications` | Все заявки (требует `x-admin-secret`) |

---

## 🌐 Деплой

### Railway *(рекомендуется)*
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Добавить все переменные из `.env` в Variables
3. Railway автоматически запустит `npm start`

### Render
1. [render.com](https://render.com) → New Web Service
2. Build: `npm install` / Start: `npm start`
3. Добавить переменные в Environment

> При деплое добавь второй Redirect URI в Discord Developer Portal с твоим доменом:
> `https://твой-домен.com/api/auth/discord/callback`

---

## 🔒 Безопасность

- `.env`, `users.json`, `applications.json` — в `.gitignore`, **никогда не коммитить**
- Пароли хранятся только в виде bcrypt-хешей
- Если токен Discord попал в git — немедленно сбросить на [discord.com/developers](https://discord.com/developers)
- `SESSION_SECRET` должен быть длинной случайной строкой

---

<div align="center">

**MILLER FAMILY · DEL PERRO RP · 2023–2026**

*dev by donskoyy*

</div>
