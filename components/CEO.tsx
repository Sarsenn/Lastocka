import Image from "next/image";
export default function CEO() {
  return (
    <section id="ceo" className="bg-navy-50 py-16 sm:py-24">
      <div className="container-wrap grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
          <div
            className="blueprint-bg absolute -inset-4 -z-10 opacity-40"
            aria-hidden="true"
          />
          <div className="aspect-[4/5] w-full overflow-hidden rounded-sm border border-navy-100 bg-gradient-to-br from-navy-100 via-mist-100 to-white">
            {/* Замените на реальную фотографию руководителя, формат webp/avif */}
            <Image src={"/images/boss.webp"} alt="Ержан Ахмето" fill />
            <div className="flex h-full w-full items-center justify-center">
              {/* <span className="font-display text-6xl font-semibold text-navy-200">ЕА</span> */}
            </div>
          </div>
          <div className="absolute -bottom-5 left-5 right-5 rounded-sm bg-white p-4 shadow-lg shadow-navy-900/10 sm:left-6 sm:right-auto sm:w-64">
            <p className="text-[13px] font-semibold text-navy">Ержан Ахметов</p>
            <p className="text-[12px] text-navy-400">
              Основатель и генеральный директор
            </p>
          </div>
        </div>

        <div className="pt-2 lg:pt-4">
          <p className="eyebrow text-sand-600">
            <span className="h-px w-6 bg-sand-600" /> О компании
          </p>
          <h2 className="mt-4 max-w-xl text-[26px] font-semibold leading-tight sm:text-4xl">
            «Каждый объект я веду так, будто строю для своей семьи»
          </h2>

          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-navy-500/85">
            <p>
              Основал компанию в 2014 году с одной бригадой и одного заказчика.
              Сегодня «Горизонт Строй» — 9 собственных бригад, проектный отдел и
              более 180 сданных объектов по всей стране.
            </p>
            <p>
              Лично проверяю каждый ключевой этап приёмки: фундамент, каркас,
              инженерные системы. Не берём объект в работу, если не уверены, что
              сдадим его в срок и по смете из договора.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-navy-100 pt-7 sm:grid-cols-4">
            {[
              { v: "12 лет", l: "в строительстве" },
              { v: "180+", l: "объектов сдано" },
              { v: "9", l: "бригад в штате" },
              { v: "0", l: "просроченных сдач" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-2xl font-semibold text-navy sm:text-3xl">
                  {s.v}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-navy-400">
                  {s.l}
                </p>
              </div>
            ))}
          </div>

          <a href="#contacts" className="btn-outline mt-9 !rounded-xl">
            Записаться на встречу с директором
          </a>
        </div>
      </div>
    </section>
  );
}
