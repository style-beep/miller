# MILLER FAMILY — ALTA RP

Сайт игровой семьи **Miller Family** с сервера [ALTA RP](https://discord.gg/SaCXzgckS) (GTA 5 Roleplay).

Лендинг с живым списком участников из Discord, музыкальным плеером и формой заявки на вступление.

---

## Стек

| Слой | Технологии |
|---|---|
| Фронтенд | HTML5, CSS3, Vanilla JS (ES Modules) |
| Бэкенд | Node.js, Express |
| Discord | discord.js v14 |
| Окружение | dotenv |

---

## Структура проекта

```
miller/
│
├── js/                      # Фронтенд JS — модули
│   ├── main.js              # Точка входа, подключает всё
│   ├── animations.js        # Все визуальные эффекты и анимации
│   ├── cursor.js            # Кастомный курсор
│   ├── discord.js           # Загрузка участников из Discord API
│   ├── modal.js             # Модалка заявки на вступление
│   └── player.js            # Музыкальный плеер
│
├── images/                  # Картинки: аватары, эмблема, обложки плеера
├── music/                   # Аудиофайлы плеера
│
├── index.html               # Главная страница
├── style.css                # Все стили
├── server.js                # Express-сервер + Discord-бот
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

Скопировать шаблон и заполнить:

```bash
cp .env.example .env
```

Открыть `.env` и вписать значения:

```env
DISCORD_TOKEN=токен_бота
DISCORD_WEBHOOK=ссылка_на_вебхук
PORT=3001
```

> Где взять значения — см. раздел [Настройка Discord](#настройка-discord)

### 4. Запустить

```bash
# Продакшн
npm start

# Разработка (авто-перезапуск при изменениях файлов)
npm run dev
```

Сайт откроется на `http://localhost:3001`

---

## Настройка Discord

### Токен бота (`DISCORD_TOKEN`)

1. Открыть [discord.com/developers/applications](https://discord.com/developers/applications)
2. Создать новое приложение → **Bot** → **Reset Token**
3. Скопировать токен в `.env`
4. В разделе **Privileged Gateway Intents** включить:
   - `SERVER MEMBERS INTENT`
   - `PRESENCE INTENT`
5. Пригласить бота на сервер: **OAuth2 → URL Generator** → выбрать scope `bot`

### Webhook для заявок (`DISCORD_WEBHOOK`)

1. Открыть нужный канал в Discord
2. **Настройки канала → Интеграции → Вебхуки → Создать**
3. Скопировать URL в `.env`

---

## API

Сервер предоставляет два эндпоинта:

### `GET /api/members`

Возвращает список участников Discord-сервера с их статусами.

**Пример ответа:**
```json
[
  {
    "name": "eddie_miller",
    "avatar": "https://cdn.discordapp.com/avatars/...",
    "status": "online"
  }
]
```

Возможные значения `status`: `online`, `idle`, `dnd`, `offline`

---

### `POST /api/apply`

Отправляет заявку на вступление в семью в Discord-канал через webhook.

**Тело запроса:**
```json
{
  "nickname":   "Eddie_Miller",
  "age":        "20",
  "discord":    "eddie#0000",
  "experience": "1.5 года на ALTA RP",
  "reason":     "Хочу быть частью лучшей семьи сервера"
}
```

**Ответ при успехе:**
```json
{ "success": true }
```

**Ответ при ошибке:**
```json
{ "success": false, "message": "Не все поля заполнены" }
```

---

## Фронтенд — JS модули

Все скрипты подключаются через `js/main.js` как ES Modules (`type="module"`).

| Модуль | Что делает |
|---|---|
| `animations.js` | Loader, часы, scroll-reveal, счётчики, parallax, tilt, glitch, typing-эффект, брызги крови, уведомления |
| `cursor.js` | Кастомный курсор с анимацией и hover-эффектом |
| `discord.js` | Запрашивает `/api/members` каждые 10 секунд, рендерит список с цветными статусами |
| `modal.js` | Открытие/закрытие модалки, отправка формы на `/api/apply` |
| `player.js` | Плеер с плейлистом, перетаскиванием, сохранением позиции и громкости в `localStorage` |

---

## Разработка

### Добавить новый трек в плеер

Открыть `js/player.js` и добавить объект в массив `songs`:

```js
{ title: "НАЗВАНИЕ", artist: "Исполнитель", src: "music/файл.mp3", cover: "images/covers/cover1.png" }
```

Положить `.mp3` файл в папку `music/`.

### Добавить участника в раздел «Структура»

Открыть `index.html`, найти секцию `<div class="structure-grid">` и скопировать блок `.rank-card`, заменив данные.

### Изменить цвета

Все основные цвета — в начале `style.css` в `:root`:

```css
:root {
  --red:  #ff2a2a;
  --dark: #0a0a0a;
  --glass: rgba(255, 255, 255, 0.05);
}
```

---

## Деплой

Проект готов к деплою на любой Node.js-хостинг.

### Railway (рекомендуется, есть бесплатный план)

1. Зарегистрироваться на [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub repo**
3. В разделе **Variables** добавить переменные из `.env`
4. Railway сам запустит `npm start`

### Render

1. Зарегистрироваться на [render.com](https://render.com)
2. **New → Web Service → Connect repo**
3. Build command: `npm install`
4. Start command: `npm start`
5. Добавить переменные окружения в **Environment**

---

## Безопасность

- Файл `.env` добавлен в `.gitignore` — **никогда не коммитить его**
- Токен бота и webhook URL хранятся только в `.env`
- Если токен случайно попал в git — немедленно **сбросить его** на [discord.com/developers](https://discord.com/developers)
- `.env.example` содержит только шаблон без реальных значений — его коммитить можно
