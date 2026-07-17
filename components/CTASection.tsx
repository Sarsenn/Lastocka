"use client";

import { useState } from "react";

export default function CTASection() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: подключить отправку данных на бэкенд / CRM / Telegram-бот
    setStatus("sent");
  }

  return (
    <section
      id="contacts"
      className="relative overflow-hidden bg-navy-800 py-16 sm:py-24"
    >
      <div
        className="blueprint-bg pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
      />
      <div className="container-wrap relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div>
          <p className="eyebrow text-sand-300">
            <span className="h-px w-6 bg-sand-300" /> Обсудим ваш проект
          </p>
          <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight text-white sm:text-4xl">
            Оставьте заявку — рассчитаем стоимость за 1 день
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-mist-100/75">
            Свяжемся в течение рабочего дня, уточним задачу и договоримся о
            выезде на замер участка.
          </p>

          <div className="mt-10 space-y-5">
            <a
              href="tel:+77001234567"
              className="flex items-center gap-3 text-white transition-colors hover:text-sand"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-sand"
                aria-hidden="true"
              >
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.5a2 2 0 0 1 2-.4c1 .3 2 .5 3 .7a2 2 0 0 1 1.5 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-medium">+7 700 123-45-67</span>
            </a>
            <a
              href="mailto:info@gorizont-stroy.kz"
              className="flex items-center gap-3 text-white transition-colors hover:text-sand"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-sand"
                aria-hidden="true"
              >
                <path
                  d="M3 6h18v12H3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="m3 7 9 6 9-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[15px] font-medium">
                info@lastocka-stroy.ru
              </span>
            </a>
            <div className="flex items-center gap-3 text-mist-100/85">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-sand"
                aria-hidden="true"
              >
                <path
                  d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="9.5"
                  r="2.3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="text-[15px]">
                г. Благовещенск, ул. Ленина, 123
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-sm bg-white p-6 sm:p-8">
          {status === "sent" ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sand-100 text-sand-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="mt-4 text-[15px] font-semibold text-navy">
                Заявка отправлена
              </p>
              <p className="mt-1.5 text-[13.5px] text-navy-400">
                Перезвоним вам в течение рабочего дня.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold text-navy">
                Рассчитать стоимость проекта
              </h3>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-medium text-navy-500"
                >
                  Имя
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Как к вам обращаться"
                  className="w-full rounded-sm border border-navy-100 bg-white px-4 py-3 text-[14px] text-navy outline-none transition-colors placeholder:text-navy-300 focus:border-sand"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-medium text-navy-500"
                >
                  Телефон
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+7 700 000-00-00"
                  className="w-full rounded-sm border border-navy-100 bg-white px-4 py-3 text-[14px] text-navy outline-none transition-colors placeholder:text-navy-300 focus:border-sand"
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-xs font-medium text-navy-500"
                >
                  Тип объекта
                </label>
                <select
                  id="type"
                  name="type"
                  className="w-full rounded-sm border border-navy-100 bg-white px-4 py-3 text-[14px] text-navy outline-none transition-colors focus:border-sand"
                >
                  <option>Жилой дом</option>
                  <option>Коммерческий объект</option>
                  <option>Промышленное здание</option>
                  <option>Реконструкция</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">
                Получить расчёт
              </button>
              <p className="text-[11px] leading-relaxed text-navy-300">
                Нажимая кнопку, вы соглашаетесь с политикой обработки
                персональных данных.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
