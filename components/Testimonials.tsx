const REVIEWS = [
  {
    name: "Асель Т.",
    role: "заказчик коттеджа, 184 м²",
    text: "Смета не менялась ни разу за 2 месяца стройки. Фотоотчёты присылали каждую пятницу, всегда было видно, на каком этапе объект.",
    rating: 5,
  },
  {
    name: "Дамир К.",
    role: "владелец шоурума «Атриум»",
    text: "Сдали на 5 дней раньше срока из договора. Директор сам приезжал на приёмку каркаса и инженерных систем.",
    rating: 5,
  },
  {
    name: "Марат С.",
    role: "склад «Логоцентр-3»",
    text: "Единственная компания из трёх, с кем мы разговаривали, кто дал реальный срок и его выдержал.",
    rating: 4,
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Оценка ${rating} из 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
          className={i < rating ? "text-sand-500" : "text-navy-200"}
          aria-hidden="true"
        >
          <path
            strokeLinejoin="round"
            d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5Z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-navy-50 py-16 sm:py-24">
      <div className="container-wrap">
        <p className="eyebrow text-sand-600">
          <span className="h-px w-6 bg-sand-600" /> Отзывы
        </p>
        <h2 className="mt-4 max-w-lg text-[28px] font-semibold leading-tight sm:text-4xl">
          Что говорят заказчики
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure
              key={r.name}
              className="flex h-full flex-col rounded-sm border border-navy-100 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <svg
                  width="22"
                  height="18"
                  viewBox="0 0 22 18"
                  fill="none"
                  className="text-sand-400"
                  aria-hidden="true"
                >
                  <path
                    d="M0 18V10.6C0 4.7 3.6 1 8.9 0l1 2.5C6.5 3.6 4.4 6 4.2 9h4.6v9H0Zm12.1 0V10.6c0-5.9 3.6-9.6 8.9-10.6l1 2.5c-3.4 1.1-5.5 3.5-5.7 6.5h4.6v9h-8.8Z"
                    fill="currentColor"
                  />
                </svg>
                <Stars rating={r.rating} />
              </div>

              <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-navy-500/85">
                {r.text}
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-50 pt-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-[12px] font-semibold text-navy-500">
                  {getInitials(r.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{r.name}</p>
                  <p className="text-[12.5px] text-navy-400">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
