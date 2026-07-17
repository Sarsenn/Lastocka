"use client";

import { FileCheck2, ShieldCheck, PenSquare } from "lucide-react";

const ITEMS = [
  {
    title: "Фиксированная смета",
    desc: "Стоимость закрепляется в договоре и не меняется в процессе строительства.",
    watermark: FileCheck2,
    lgSpan: "lg:col-span-2",
  },
  {
    title: "Собственные бригады",
    desc: "9 бригад в штате — не привлекаем случайных подрядчиков со стороны.",
    media: { type: "image" as const, src: "/images/advantages/workers.webp" },
    lgSpan: "lg:col-span-2 lg:row-span-2",
    smSpan: "sm:col-span-2",
  },
  {
    title: "Гарантия по договору",
    desc: "5 лет на конструктив, 2 года на инженерные системы — письменно, в договоре.",
    watermark: ShieldCheck,
    lgSpan: "lg:col-span-1",
  },
  {
    title: "Еженедельные отчёты",
    desc: "Фото и видео с объекта каждую неделю, доступ для заказчика в любой момент.",
    media: { type: "image" as const, src: "/images/advantages/report.webp" },
    lgSpan: "lg:col-span-1",
  },
  {
    title: "Своя проектная группа",
    desc: "Архитектор и инженер-конструктор в штате — проект готовим за 7–10 дней.",
    watermark: PenSquare,
    lgSpan: "lg:col-span-1",
  },
  {
    title: "Контроль лично CEO",
    desc: "Ключевые этапы приёмки проверяет руководитель компании лично.",
    media: { type: "image" as const, src: "/images/advantages/site.webp" },
    lgSpan: "lg:col-span-3",
    smSpan: "sm:col-span-2",
  },
];

function MediaCard({ item, i }: { item: (typeof ITEMS)[number]; i: number }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-white/10 ${item.smSpan ?? ""} ${item.lgSpan}`}
      style={{ minHeight: 220 }}
    >
      <img
        src={item.media!.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/35 to-navy-900/5" />

      <div className="relative flex h-full flex-col justify-end p-6 sm:p-7">
        <span className="font-display text-xs text-sand-300">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 text-[16px] font-semibold text-white sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-mist-100/80">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function TextCard({ item, i }: { item: (typeof ITEMS)[number]; i: number }) {
  const Watermark = item.watermark!;
  return (
    <div
      className={`relative flex flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-7 ${item.lgSpan}`}
      style={{ minHeight: 220 }}
    >
      <Watermark
        className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 text-white/[0.04]"
        strokeWidth={1}
      />
      <span className="relative font-display text-xs text-sand-300">
        {String(i + 1).padStart(2, "0")}
      </span>
      <h3 className="relative mt-3 text-[15px] font-semibold text-white">
        {item.title}
      </h3>
      <p className="relative mt-2 max-w-xs text-[13.5px] leading-relaxed text-mist-100/70">
        {item.desc}
      </p>
    </div>
  );
}

export default function Advantages() {
  return (
    <section className="bg-navy-800 py-16 sm:py-24">
      <div className="container-wrap">
        <p className="eyebrow text-sand-300">
          <span className="h-px w-6 bg-sand-300" /> Почему выбирают нас
        </p>
        <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight text-white sm:text-4xl">
          Строим так, как хотели бы себе
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[220px] lg:gap-5 lg:[grid-auto-flow:dense]">
          {ITEMS.map((item, i) =>
            item.media ? (
              <MediaCard key={item.title} item={item} i={i} />
            ) : (
              <TextCard key={item.title} item={item} i={i} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
