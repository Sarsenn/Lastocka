const NAV = [
  { href: "#objects", label: "Объекты" },
  { href: "#process", label: "Как строим" },
  { href: "#pricing", label: "Стоимость" },
  { href: "#ceo", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 py-10 sm:py-14">
      <div className="container-wrap">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <span className="font-display text-base font-semibold text-white">
              Ласточка<span className="text-sand"> СТРОЙ</span>
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-mist-100/55">
              Строительная компания полного цикла. Проектируем и строим объекты
              под заказ по всей стране.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[13px] text-mist-100/70 hover:text-sand"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="text-[13px] text-mist-100/70">
            <a href="tel:+77001234567" className="block hover:text-sand">
              +7 700 123-45-67
            </a>
            <a
              href="mailto:info@gorizont-stroy.kz"
              className="mt-1.5 block hover:text-sand"
            >
              info@lastocka-stroy.kz
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[11.5px] text-mist-100/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ТОО «Ласточка». Все права защищены.
          </p>
          <p>Информация на сайте не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
