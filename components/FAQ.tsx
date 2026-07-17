const FAQS = [
  {
    q: "Сколько стоит проект под ключ?",
    a: "Стоимость зависит от типа объекта, площади и комплектации. Ориентировочные цены — в разделе «Стоимость». Точную смету готовим бесплатно после замера участка.",
  },
  {
    q: "Сколько длится строительство?",
    a: "От 45 дней для дома площадью 120–180 м² до 150 дней для крупных промышленных объектов. Точный срок фиксируется в договоре и не переносится в одностороннем порядке.",
  },
  {
    q: "Можно ли работать по своему проекту?",
    a: "Да, строим как по своим типовым проектам, так и по проекту заказчика — после проверки нашим инженером-конструктором.",
  },
  {
    q: "Как контролируется качество на объекте?",
    a: "На каждом этапе — приёмка прорабом и еженедельный фотоотчёт. Ключевые этапы (фундамент, каркас, инженерные системы) лично проверяет директор компании.",
  },
  {
    q: "Какая гарантия на объект?",
    a: "5 лет на несущие конструкции и 2 года на инженерные системы — гарантия закреплена в договоре в письменном виде.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="container-wrap max-w-3xl">
        <p className="eyebrow text-sand-600">
          <span className="h-px w-6 bg-sand-600" /> Вопросы и ответы
        </p>
        <h2 className="mt-4 text-[28px] font-semibold leading-tight sm:text-4xl">
          Часто спрашивают
        </h2>

        <div className="mt-10 divide-y divide-navy-100 border-t border-navy-100 sm:mt-14">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-navy marker:content-none">
                {item.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-navy-200 text-navy-400 transition-transform duration-300 group-open:rotate-45">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-navy-500/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
