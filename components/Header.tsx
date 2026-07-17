"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const NAV = [
  { href: "#objects", label: "Объекты" },
  { href: "#process", label: "Как строим" },
  { href: "#pricing", label: "Стоимость" },
  { href: "#ceo", label: "О компании" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-navy-800/95 shadow-lg shadow-navy-900/20 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-wrap flex h-16 items-center justify-between sm:h-20">
        <a
          href="#top"
          className="flex shrink-0 items-center"
          aria-label="На главную"
        >
          <Image
            src="/lastochka-logo.png"
            alt="Ласточка — строительная компания"
            width={663}
            height={639}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium uppercase tracking-wide text-mist-100/80 transition-colors hover:text-sand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a
            href="tel:+77001234567"
            className="text-sm font-semibold text-white transition-colors hover:text-sand"
          >
            +7 700 123-45-67
          </a>

          <a href="#contacts" className="btn-primary !py-3">
            Обсудить проект
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center text-white lg:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden bg-navy-800 transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <nav className="container-wrap flex flex-col gap-1 pb-6 pt-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3.5 text-[15px] font-medium text-mist-100"
              >
                {item.label}
              </a>
            ))}

            <a
              href="tel:+77001234567"
              className="pt-4 text-base font-semibold text-sand"
            >
              +7 700 123-45-67
            </a>

            <a
              href="#contacts"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full"
            >
              Обсудить проект
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
