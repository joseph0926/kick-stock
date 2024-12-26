# 킥스톡 (KickStock)

축구 결과를 이용한 가상의 주식 웹 애플리케이션입니다.

## 구조

```
├── apps
│   ├── client
│   │   ├── public
│   │   ├── src
│   │   │   ├── App.tsx
│   │   │   ├── components
│   │   │   │   ├── clubs
│   │   │   │   └── ui
│   │   │   ├── constants
│   │   │   ├── context
│   │   │   ├── hooks
│   │   │   ├── lib
│   │   │   ├── main.tsx
│   │   │   ├── pages
│   │   │   │   ├── layouts
│   │   │   ├── router
│   │   │   ├── services
│   │   │   ├── types
│   ├── server
│   │   ├── prisma
│   │   ├── src
│   │   │   ├── controllers
│   │   │   ├── index.ts
│   │   │   ├── routes
│   │   │   ├── schemas
│   │   │   └── types
│   └── ssr-server
├── package.json
├── packages
│   └── data-cdn
│       ├── README.md
│       └── leagues
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

## 사용 기술

```sh
# Frontend

react v19
react-query v5
react-router v7

# Backend
fastify
prisma
postgreSQL
```

## 요구 사항

```sh
node v21
pnpm v9
```

```sh
# .env
DATABASE_URL= # psql
```
