"use client";

import { motion } from "framer-motion";
import { Home, Building2, Factory, Hammer } from "lucide-react";

const CATEGORIES = [
  {
    title: "Жилые дома",
    desc: "Коттеджи и загородные дома по индивидуальному проекту или готовым планировкам.",
    meta: "от 120 м²",
    Icon: Home,
  },
  {
    title: "Коммерческие объекты",
    desc: "Магазины, офисные центры, шоурумы, объекты сферы услуг под ключ.",
    meta: "от 300 м²",
    Icon: Building2,
  },
  {
    title: "Промышленные здания",
    desc: "Склады, цеха, ангары и производственные помещения на металлокаркасе.",
    meta: "от 800 м²",
    Icon: Factory,
  },
  {
    title: "Реконструкция",
    desc: "Усиление конструкций, пристройки, капитальный ремонт зданий и фасадов.",
    meta: "любой объём",
    Icon: Hammer,
  },
];

export default function Services() {
  return (
    <section id="objects" className="bg-white py-16 sm:py-24">
      <div className="container-wrap">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-sand-600">
              <span className="h-px w-6 bg-sand-600" /> Что мы строим
            </p>
            <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight sm:text-4xl">
              Проекты под заказ —
              <br />
              под вашу задачу и бюджет
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-navy-500/80">
            Работаем по индивидуальному техническому заданию: разрабатываем
            проект с нуля или адаптируем ваш под требования участка и бюджета.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ title, desc, meta, Icon }, i) => (
            <motion.div
              key={title}
              className="group relative rounded-xl border border-navy-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sand/40 hover:shadow-lg hover:shadow-navy-900/[0.06] sm:p-8"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800 transition-colors duration-300 group-hover:bg-sand">
                <Icon
                  className="h-6 w-6 text-sand transition-colors duration-300 group-hover:text-navy-900"
                  strokeWidth={1.75}
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-navy sm:text-xl">
                {title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-navy-500/75">
                {desc}
              </p>

              <div className="mt-6 border-t border-navy-100 pt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sand-600">
                  {meta}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
