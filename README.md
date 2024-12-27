# 킥스톡 (KickStock)

축구 결과를 이용한 가상의 주식 웹 애플리케이션입니다.

## 구조

```sh
├── apps
│   ├── client # React Client Component (with vite)
│   ├── server # API Server
│   ├── ssr-client # React Server Component
│   └── ssr-server # React SSR Server
├── packages
│   ├── ui # UI Components (with Shadcn)
│   ├── shared # 공통 로직
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
