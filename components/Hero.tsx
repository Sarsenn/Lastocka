import HeroVideoBackground from "@/components/HeroVideoBackground";

const STATS = [
  { value: "12", suffix: " лет", label: "на строительном рынке" },
  { value: "180", suffix: "+", label: "сданных объектов" },
  { value: "5", suffix: " лет", label: "гарантии по договору" },
  { value: "45", suffix: " дней", label: "средний срок стройки" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-800 pb-16 pt-28 sm:pb-24 sm:pt-36">
      <HeroVideoBackground
        poster="/images/hero-poster.jpg"
        webm="/video/hero-construction.webm"
        mp4="/video/hero-construction.mp4"
      />
      <div
        className="pointer-events-none absolute -right-24 top-16 h-[420px] w-[420px] rounded-full bg-sand/10 blur-3xl sm:h-[520px] sm:w-[520px]"
        aria-hidden="true"
      />

      <div className="container-wrap relative">
        <p className="eyebrow text-sand-300">
          <span className="h-px w-6 bg-sand-300" /> Строительная компания полного цикла
        </p>

        <h1 className="mt-5 max-w-3xl font-display text-[34px] font-semibold leading-[1.12] text-white sm:text-5xl lg:text-[56px]">
          Строим объекты под заказ —
          <span className="text-sand"> от проекта до сдачи ключей</span>
        </h1>

        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist-100/85 sm:text-base">
          Жилые дома, коммерческие и промышленные объекты. Проектируем под задачу заказчика,
          строим собственными бригадами, фиксируем стоимость в договоре и сдаём объект в срок.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#contacts" className="btn-primary">
            Рассчитать стоимость проекта
          </a>
          <a href="#objects" className="btn-outline-light">
            Смотреть объекты
          </a>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-9 sm:mt-16 sm:grid-cols-4 sm:gap-x-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {s.value}
                <span className="text-sand">{s.suffix}</span>
              </dd>
              <p className="mt-1.5 text-[13px] leading-snug text-mist-100/70">{s.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
