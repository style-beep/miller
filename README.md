# MILLER FAMILY — DEL PERRO RP

Сайт игровой семьи **Miller Family** с сервера [Del Perro RP](https://discord.gg/SaCXzgckS) (GTA 5 Roleplay).

Полноценный многостраничный сайт с живым списком участников Discord, музыкальным плеером, видеоплеером, мини-игрой захвата территорий, закрытыми разделами с терминальным загрузчиком и системой заявок в реальном времени.

---

## Стек

| Слой | Технологии |
|---|---|
| Фронтенд | HTML5, CSS3, Vanilla JS (ES Modules) |
| Бэкенд | Node.js, Express, WebSocket (ws) |
| Discord | discord.js v14 |
| Окружение | dotenv |
| Dev-режим | browser-sync, concurrently |

---

## Структура проекта

```
miller/
│
├── js/                      # Фронтенд JS — модули
│   ├── main.js              # Точка входа, подключает всё
│   ├── animations.js        # Визуальные эффекты и анимации
│   ├── cursor.js            # Кастомный курсор
│   ├── discord.js           # Загрузка участников из Discord API
│   ├── modal.js             # Модалка заявки на вступление
│   ├── player.js            # Музыкальный плеер
│   ├── video.js             # Видеоплеер с кастомными контролами
│   ├── game.js              # Мини-игра «Захват территорий»
│   ├── gallery.js           # Галерея с лайтбоксом (главная)
│   ├── halloffame.js        # Доска почёта
│   ├── countdown.js         # Обратный отсчёт до события
│   ├── appstatus.js         # Проверка статуса заявки
│   ├── notifications.js     # WebSocket уведомления (тосты)
│   ├── timeline.js          # Таймлайн истории (подстраница)
│   └── page-loader.js       # Терминальный загрузчик подстраниц
│
├── images/                  # Аватары, эмблема, обложки плеера, галерея
├── music/                   # Аудиофайлы плеера
├── video/                   # Видеофайлы (трейлер и т.д.)
│
├── index.html               # Главная страница
├── gallery.html             # Галерея (защищена паролем)
├── history.html             # История семьи (защищена паролем)
├── rules.html               # Правила семьи (защищена паролем)
│
├── style.css                # Основные стили
├── new-features.css         # Стили новых разделов
├── page.css                 # Стили подстраниц (gallery/history/rules)
│
├── server.js                # Express-сервер + Discord-бот + WebSocket
├── events.config.js         # Конфиг событий, таймлайна, галереи, доски почёта
├── roles.config.js          # Порядок и фильтрация ролей Discord
│
├── .env                     # Секреты (не в git!)
├── .env.example             # Шаблон для .env
├── .gitignore
└── package.json
```

---

## Быстрый старт

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
ADMIN_SECRET=секретный_ключ_для_смены_статуса_заявок
PORT=3001
```

### 4. Запустить

```bash
# Продакшн
npm start

# Разработка (авто-перезапуск сервера + live reload браузера)
npm run dev
```

В режиме разработки:
- Сервер: `http://localhost:3001`
- Браузер с live reload: `http://localhost:3000`

---

## Нововведения

### 🎬 Видеоплеер
Кастомный видеоплеер с красивыми контролами. Видео хранится в папке `video/`.  
Для замены: положи файл в `video/` и обнови `src` в `index.html`.

### 🎮 Мини-игра «Захват территорий»
Стратегическая игра прямо на сайте:
- 20 районов Los Santos на карте 5×4
- 4 фракции: Miller Family, Los Diablos, Vagos, Ballas
- AI атакует каждые 2.2 секунды
- Войска регенерируются каждые 3 секунды
- Превью атаки при наведении на врага

### 🔐 Закрытые разделы с терминальным загрузчиком
Три отдельные страницы с уникальными паролями:

| Страница | Пароль | Содержимое |
|---|---|---|
| `gallery.html` | `MF·VISUAL·ACCESS·2026` | Фотогалерея с лайтбоксом |
| `history.html` | `MF·CHRONICLE·CLASSIFIED` | Таймлайн истории семьи |
| `rules.html` | `CODEX·FAMILIA·ALPHA` | Правила + иерархия |

При открытии страницы — терминал автоматически вводит пароль посимвольно, заполняет прогресс-бар и показывает `ACCESS GRANTED`.

### ⏱️ Обратный отсчёт до события
Настраивается в `events.config.js` — одна строка с датой и названием ивента.

### 🏆 Доска почёта
Топ-3 участника с золотым/серебряным/бронзовым рангом. Настраивается в `events.config.js`.

### 🔔 WebSocket уведомления
Тосты в реальном времени:
- При подаче новой заявки
- При одобрении/отклонении заявки администратором
- При подключении Discord-бота

### 📋 Система заявок
- Заявки сохраняются в `applications.json` (не в git)
- Проверка статуса по Discord тегу на главной странице
- Администратор меняет статус через `PATCH /api/application-status/:id` с заголовком `x-admin-secret`

### 🎵 Музыкальный плеер
Треки и роли управляются в конфиг-файлах. Первые 50 участников Discord видны сразу, остальные — по кнопке «ЕЩЁ».

### 📱 Адаптивная вёрстка
Полная адаптация под все устройства: 1024px (планшет), 768px (мобильный), 480px, 360px.

---

## Настройка Discord

### Токен бота (`DISCORD_TOKEN`)

1. Открыть [discord.com/developers/applications](https://discord.com/developers/applications)
2. Создать новое приложение → **Bot** → **Reset Token**
3. Скопировать токен в `.env`
4. В разделе **Privileged Gateway Intents** включить:
   - `SERVER MEMBERS INTENT`
   - `PRESENCE INTENT`
5. Пригласить бота на сервер: **OAuth2 → URL Generator** → scope `bot`

### Webhook для заявок (`DISCORD_WEBHOOK`)

1. Открыть нужный канал в Discord
2. **Настройки канала → Интеграции → Вебхуки → Создать**
3. Скопировать URL в `.env`

### Роли участников (`roles.config.js`)

Отредактируй массив `ROLE_ORDER` — только участники с этими ролями будут отображаться в карточке Soldiers, отсортированные по порядку из конфига.

---

## API

### `GET /api/members`
Список участников Discord с ролями и статусами.

### `POST /api/apply`
Подача заявки. Сохраняется локально + отправляется в Discord webhook.

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
Изменение статуса заявки (требует заголовок `x-admin-secret`).

```json
{ "status": "approved", "comment": "Добро пожаловать в семью!" }
```

Возможные статусы: `pending`, `approved`, `rejected`

---

## Настройка контента

### Следующее событие (countdown)
`events.config.js` → поле `NEXT_EVENT`:
```js
export const NEXT_EVENT = {
  title: "СЕМЕЙНЫЙ СБОР",
  description: "Общий сбор Miller Family",
  date: "2026-06-20T20:00:00",
};
```

### Галерея
`events.config.js` → массив `GALLERY`. Добавь фото в `images/` и впиши путь.

### Доска почёта
`events.config.js` → массив `HALL_OF_FAME`.

### Таймлайн истории
`events.config.js` → массив `TIMELINE`.

### Треки плеера
`js/player.js` → массив `songs`:
```js
{ title: "НАЗВАНИЕ", artist: "Исполнитель", src: "music/файл.mp3", cover: "images/covers/cover1.png" }
```

---

## Деплой

### Railway (рекомендуется)
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Variables: добавить все переменные из `.env`
3. Railway сам запустит `npm start`

### Render
1. [render.com](https://render.com) → New Web Service
2. Build: `npm install` / Start: `npm start`
3. Добавить переменные в Environment

---

## Безопасность

- `.env` и `applications.json` в `.gitignore` — **никогда не коммитить**
- Если токен попал в git — немедленно сбросить на [discord.com/developers](https://discord.com/developers)
- `ADMIN_SECRET` — придумай сложный ключ, он защищает API смены статуса заявок
