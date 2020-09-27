[![Build Status](https://travis-ci.org/zinovik/bgg-top100-bot.svg?branch=master)](https://travis-ci.org/zinovik/bgg-top100-bot)

![logo](./avatar/bggtop100.png)

# BGG Top 100

This bot posts [BGG Top 100](https://boardgamegeek.com/browse/boardgame) list (with changes) to [@bggtop100](https://t.me/bggtop100) every week.

---

## Working locally

### 1. create and fill .env file (use .env.example for help)

### 2. start the project

You can start project as lambda function:

```bash
npm run start:dev
```

### 3. you can involve the function locally

```bash
curl localhost:3000/api/message?token=
```

---
