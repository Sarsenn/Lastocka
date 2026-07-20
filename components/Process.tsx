"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  PenSquare,
  FileSignature,
  HardHat,
  KeyRound,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Заявка и замер",
    desc: "Обсуждаем задачу, выезжаем на участок, фиксируем требования и ограничения.",
    Icon: ClipboardCheck,
    from: { x: -40, y: 0 },
  },
  {
    n: "02",
    title: "Проект и смета",
    desc: "Готовим архитектурный проект и фиксированную смету — без скрытых доплат.",
    Icon: PenSquare,
    from: { x: 0, y: 40 },
  },
  {
    n: "03",
    title: "Договор",
    desc: "Подписываем договор с графиком платежей и сроками по этапам стройки.",
    Icon: FileSignature,
    from: { x: 40, y: 0 },
  },
  {
    n: "04",
    title: "Строительство",
    desc: "Собственные бригады, еженедельные фотоотчёты, контроль на каждом этапе.",
    Icon: HardHat,
    from: { x: -40, y: 0 },
  },
  {
    n: "05",
    title: "Сдача объекта",
    desc: "Передаём объект по акту, предоставляем гарантию и исполнительную документацию.",
    Icon: KeyRound,
    from: { x: 40, y: 0 },
  },
];

// на lg вручную задаём стартовую колонку только 4-му и 5-му элементу,
// чтобы визуально отцентрировать неполный второй ряд (3 + 2 из 6 колонок)
const LG_COL_START: Record<number, string> = {
  3: "lg:col-start-2",
  4: "lg:col-start-4",
};

export default function Process() {
  return (
    <section id="process" className="bg-navy-50 py-16 sm:py-24">
      <div className="container-wrap">
        <p className="eyebrow text-sand-600">
          <span className="h-px w-6 bg-sand-600" /> Как мы работаем
        </p>
        <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight sm:text-4xl">
          Пять этапов от заявки до сдачи ключей
        </h2>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-6 ">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              className={`relative rounded-xl border border-navy-100 bg-white p-7 sm:p-8 lg:col-span-2 lg:p-9  ${LG_COL_START[i] ?? ""}`}
              initial={{ opacity: 0, x: s.from.x, y: s.from.y }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.55,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center justify-between ">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 lg:h-14 lg:w-14">
                  <s.Icon
                    className="h-5 w-5 text-sand lg:h-6 lg:w-6"
                    strokeWidth={1.75}
                  />
                </span>
                <span className="font-display text-2xl font-semibold text-mist-300 lg:text-3xl">
                  {s.n}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-navy lg:mt-6 lg:text-xl">
                {s.title}
              </h3>
              <p className="mt-2.5 max-w-sm text-[13.5px] leading-relaxed text-navy-500/75 lg:mt-3 lg:text-[14.5px]">
                {s.desc}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
