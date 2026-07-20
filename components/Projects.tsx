import Image from "next/image";
import { CalendarCheck, MapPin, Ruler } from "lucide-react";

const TAG_STYLES: Record<string, string> = {
  "Жилой дом": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Коммерция: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Промышленный: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Реконструкция: "bg-sand/15 text-sand-700 ring-sand/30",
};

const PROJECTS = [
  {
    name: "Аэропорт «Благовещенск»",
    desc: "Двухэтажный дом на каркасной технологии с террасой и гаражом на два авто.",
    area: "184 м²",
    tag: "Аэропорт",
    term: "152 дня",
    location: "г. Благовещенск",
    image: "/images/projects/aero.webp",
  },
  {
    name: "ЖК «Панорама»",
    desc: "Помещение под ключ с панорамным остеклением фасада и открытой планировкой зала.",
    area: "410 м²",
    tag: "Жилой дом",
    term: "78 дней",
    location: "г. Благовещенск",
    image: "/images/projects/jk.webp",
  },
  {
    name: "Пост 'Каникурган'",
    desc: "Складской комплекс на металлокаркасе с погрузочными доками и стеллажным хранением.",
    area: "1200 м²",
    tag: "Пост",
    term: "170 дней",
    location: "село Каникурган",
    image: "/images/projects/post.webp",
  },
  {
    name: "Дом в Благовещенске",
    desc: "Одноэтажный дом из керамоблока с мансардой и утеплённым цоколем под климат региона.",
    area: "156 м²",
    tag: "Жилой дом",
    term: "48 дней",
    location: "г. Благовещенск",
    image: "/images/projects/house.webp",
  },
  {
    name: "Офисный блок «Меридиан»",
    desc: "Три этажа open-space офисов с отдельным входом и парковкой на 20 машиномест.",
    area: "560 м²",
    tag: "Коммерция",
    term: "85 дней",
    location: "г. Благовещенск",
    image: "/images/projects/aero2.webp",
  },
  {
    name: "Реконструкция ЖК «Солнечный»",
    desc: "Усиление несущих конструкций, замена кровли и полная модернизация инженерных сетей.",
    area: "890 м²",
    tag: "Реконструкция",
    term: "63 дня",
    location: "г. Благовещенск",
    image: "/images/projects/jk2.webp",
  },
];

export default function Projects() {
  return (
    <section id="objects" className="scroll-mt-20 bg-white py-16 sm:py-24">
      <div className="container-wrap">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-sand-600">
              <span className="h-px w-6 bg-sand-600" />
              Портфолио
            </p>

            <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight text-navy sm:text-4xl">
              Последние сданные объекты
            </h2>
          </div>

          <a
            href="#contacts"
            className="text-sm font-semibold text-navy underline decoration-sand-400 decoration-2 underline-offset-4 transition-colors hover:text-sand-600"
          >
            Обсудить свой проект →
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <article
              key={project.name}
              className="group overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-navy-900/[0.06]"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-navy-100 via-mist-100 to-navy-50">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      33vw
                    "
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-navy-300 transition-transform duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 21V9.5L12 3l9 6.5V21"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 21v-7h6v7"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                    TAG_STYLES[project.tag] ??
                    "bg-white/90 text-navy ring-navy-200"
                  }`}
                >
                  {project.tag}
                </span>

                <span className="absolute right-3 top-3 rounded-sm bg-navy-900/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  Сдан
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold text-navy">
                  {project.name}
                </h3>

                <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-500/75">
                  {project.desc}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-navy-100 pt-3">
                  <span className="flex items-center gap-1.5 text-[12px] text-navy-500">
                    <Ruler
                      className="h-3.5 w-3.5 shrink-0 text-navy-300"
                      strokeWidth={1.75}
                    />
                    {project.area}
                  </span>

                  <span className="flex items-center gap-1.5 text-[12px] text-navy-500">
                    <CalendarCheck
                      className="h-3.5 w-3.5 shrink-0 text-navy-300"
                      strokeWidth={1.75}
                    />
                    {project.term}
                  </span>

                  <span className="flex items-center gap-1.5 text-[12px] text-navy-500">
                    <MapPin
                      className="h-3.5 w-3.5 shrink-0 text-navy-300"
                      strokeWidth={1.75}
                    />
                    {project.location}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
