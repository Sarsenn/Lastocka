"use client";

import { Home, Building2, Warehouse, Factory } from "lucide-react";

const ROWS = [
  {
    type: "Каркасно-щитовой дом",
    area: "120–180 м²",
    price: "от 28 млн ₸",
    term: "45–60 дней",
    Icon: Home,
  },
  {
    type: "Дом из керамического блока",
    area: "150–220 м²",
    price: "от 42 млн ₸",
    term: "60–90 дней",
    Icon: Building2,
    popular: true,
  },
  {
    type: "Коммерческий павильон",
    area: "300–600 м²",
    price: "от 55 млн ₸",
    term: "70–100 дней",
    Icon: Warehouse,
  },
  {
    type: "Складской комплекс",
    area: "800+ м²",
    price: "по расчёту",
    term: "90–150 дней",
    Icon: Factory,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className="container-wrap">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-sand-600">
              <span className="h-px w-6 bg-sand-600" /> Стоимость
            </p>
            <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight sm:text-4xl">
              Ориентировочные цены по типам объектов
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-navy-500/80">
            Точная стоимость фиксируется в смете после замера и утверждения
            проекта. Цена в договоре не меняется в процессе стройки.
          </p>
        </div>

        {/* Мобайл / планшет — карточки */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 lg:hidden">
          {ROWS.map((r) => (
            <div
              key={r.type}
              className={
                "relative rounded-xl border bg-white p-5 shadow-sm " +
                (r.popular
                  ? "border-sand/50 ring-1 ring-sand/20"
                  : "border-navy-100")
              }
            >
              {r.popular && (
                <span className="absolute -top-2.5 right-5 rounded-full bg-sand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy-900">
                  Популярный выбор
                </span>
              )}
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-800">
                  <r.Icon className="h-5 w-5 text-sand" strokeWidth={1.75} />
                </span>
                <h3 className="text-[15px] font-semibold text-navy">
                  {r.type}
                </h3>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-navy-100 pt-4">
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-navy-400">
                    Площадь
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-navy-700">
                    {r.area}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-navy-400">
                    Цена
                  </dt>
                  <dd className="mt-1 text-[13px] font-semibold text-sand-600">
                    {r.price}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wider text-navy-400">
                    Срок
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-navy-700">
                    {r.term}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* Десктоп — таблица с объёмом */}
        <div className="mt-14 hidden overflow-hidden rounded-xl border border-navy-100 shadow-sm lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/60 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                <th className="py-4 pl-6 pr-4 font-semibold">Тип объекта</th>
                <th className="py-4 pr-4 font-semibold">Площадь</th>
                <th className="py-4 pr-4 font-semibold">Стоимость под ключ</th>
                <th className="py-4 pr-6 font-semibold">Срок</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr
                  key={r.type}
                  className={
                    "group relative border-b border-navy-50 text-sm transition-colors duration-200 last:border-b-0 hover:bg-navy-50/50" +
                    (r.popular ? " bg-sand/[0.04]" : "")
                  }
                >
                  <td className="relative py-5 pl-6 pr-4 font-medium text-navy">
                    <span className="absolute left-0 top-0 h-full w-[3px] scale-y-0 bg-sand transition-transform duration-200 group-hover:scale-y-100" />
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-800">
                        <r.Icon
                          className="h-4 w-4 text-sand"
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="flex items-center gap-2">
                        {r.type}
                        {r.popular && (
                          <span className="rounded-full bg-sand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sand-700">
                            Популярный
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 pr-4 text-navy-500/80">{r.area}</td>
                  <td className="py-5 pr-4 font-semibold text-sand-600">
                    {r.price}
                  </td>
                  <td className="py-5 pr-6 text-navy-500/80">{r.term}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 text-xs text-navy-400">
          Стоимость фундамента и подключения коммуникаций рассчитывается
          отдельно в зависимости от участка.
        </p>
      </div>
    </section>
  );
}
