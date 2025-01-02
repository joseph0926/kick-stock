# 킥스톡 (KickStock)

축구 결과를 이용한 가상의 주식 웹 애플리케이션입니다.

## 구조

```sh
├── apps
│   ├── server # API Server
│   └── react # React SSR
├── packages
│   ├── core # React 관련 (hooks, components, ...)
│   ├── ui # UI Components (with Shadcn)
│   ├── shared # 공통 로직 (types, constants, ...)
└── └── data-cdn # json CDN
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
