# Горизонт Строй — сайт-визитка

Next.js 14 (App Router) + Tailwind CSS. Одностраничный сайт для строительной компании,
структура вдохновлена elka-dom.ru: hero со статистикой → категории объектов → этапы работы →
цены → преимущества → блок CEO → портфолио → отзывы → FAQ → форма заявки → футер.

## Запуск локально

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

## Сборка в продакшн

```bash
npm run build
npm run start
```

## Что нужно заменить перед публикацией

1. **Название компании и CEO** — сейчас "Горизонт Строй" / "Ержан Ахметов" (заглушки).
   Ищите по файлам `components/*.tsx`.
2. **Телефон, email, адрес** — в `components/Header.tsx`, `components/CTASection.tsx`, `components/Footer.tsx`.
3. **Фото** — фото директора (`components/CEO.tsx`) и объектов (`components/Projects.tsx`)
   сейчас плейсхолдеры. Добавьте реальные изображения в `public/`, замените блоки на:
   ```tsx
   import Image from "next/image";
   <Image src="/photos/ceo.webp" alt="..." fill className="object-cover" />
   ```
   `next/image` сам генерирует webp/avif и подбирает размер под устройство — это часть
   оптимизации скорости загрузки.
4. **Форма заявки** (`components/CTASection.tsx`) — сейчас просто показывает "Заявка отправлена".
   Подключите отправку на почту / в Telegram-бота / CRM через API route (`app/api/lead/route.ts`).
5. **Домен** — замените `gorizont-stroy.example` в `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.
6. **Favicon** — добавьте `app/icon.png` (Next.js подхватит автоматически).

## Оптимизация скорости, уже встроенная в проект

- Next.js App Router: страница рендерится статически (Static Generation), без лишнего JS на клиенте.
- `next/font` — шрифты Unbounded и Manrope грузятся без layout shift, самохостятся автоматически.
- Все интерактивные части (меню, форма) вынесены в отдельные `"use client"` компоненты —
  остальная страница остаётся серверной и лёгкой.
- `next.config.mjs`: включено сжатие (`compress`), автоматический AVIF/WebP для изображений.
- Мобильная адаптивность: все секции построены mobile-first на Tailwind-брейкпоинтах
  (`sm:`, `lg:`), меню превращается в бургер на экранах уже 1024px.
- `prefers-reduced-motion` уважается — анимации отключаются, если это указано в системе пользователя.

## Деплой

Быстрее всего — [Vercel](https://vercel.com) (разработчик Next.js, бесплатный тариф достаточен
для сайта-визитки): `vercel` → подключить репозиторий → деплой в 1 клик.
Альтернативы: Netlify, или любой хостинг с поддержкой Node.js через `npm run build && npm run start`.
