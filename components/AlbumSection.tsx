"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * Секция «Альбом объектов» — сетка фото/видео + лайтбокс.
 * Цвета: фон #162E45, акцент #CFA779, вспомогательный #CFCFEA.
 *
 * Видео: самохостинг mp4 из public/videos на Vercel/Netlify — нативный
 * <video playsInline muted>. Vercel/Netlify отдают статику из public/ с
 * поддержкой HTTP Range из коробки, так что CORS/Range на них не проблема.
 * Раньше здесь был embed VK Video, т.к. предыдущие mp4-файлы не проигрывали
 * видеодорожку на iOS Safari (играл только звук) — причина была не в
 * хостинге, а в кодировании файлов (не тот профиль H.264 и/или moov atom
 * не в начале файла). См. инструкцию по перекодированию ниже.
 *
 * Как подключить видео:
 * 1) Перекодировать исходник под iOS Safari:
 *      ffmpeg -i input.mov \
 *        -c:v libx264 -profile:v main -level 4.0 -pix_fmt yuv420p \
 *        -vf "scale=-2:1280" \
 *        -movflags +faststart \
 *        -c:a aac -b:a 128k \
 *        -crf 23 -preset slow \
 *        output.mp4
 * 2) Положить результат в public/videos/<name>.mp4
 * 3) Указать путь вида "/videos/<name>.mp4" в поле mp4Url нужного объекта
 *    в массиве ITEMS ниже
 *
 * Анимации сетки/лайтбокса — CSS-transition + IntersectionObserver, без
 * дополнительных библиотек.
 */

type AlbumItem = {
  id: string;
  type: "photo" | "video";
  src: string; // фото: путь к изображению; видео: путь к постеру (превью)
  mp4Url?: string; // обязателен для type === "video" — путь к mp4, напр. "/videos/1.mp4"
  alt: string;
  category: string; // напр. "Фундамент", "Кровля", "Отделка"
  date?: string; // напр. "03.2025"
  width: number; // реальные пропорции файла — для next/image и грид-высоты
  height: number;
};

const ITEMS: AlbumItem[] = [
  {
    id: "1",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/1-poster.jpg",
    mp4Url: "/videos/1.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Отделка",
    date: "05.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "2",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/2-poster.jpg",
    mp4Url: "/videos/2.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Фундемент",
    date: "05.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "3",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/3-poster.jpg",
    mp4Url: "/videos/3.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Архитектура",
    date: "12.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "4",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/4-poster.jpg",
    mp4Url: "/videos/4.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Фасад",
    date: "12.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "5",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/5-poster.jpg",
    mp4Url: "/videos/5.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Фундемент",
    date: "7.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "6",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/6-poster.jpg",
    mp4Url: "/videos/6.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Кровля",
    date: "6.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "7",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/7-poster.jpg",
    mp4Url: "/videos/7.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Стяжка",
    date: "1.2024",
    width: 900,
    height: 1200,
  },
  {
    id: "8",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/8-poster.jpg",
    mp4Url: "/videos/8.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Стяжка",
    date: "4.2024",
    width: 900,
    height: 1200,
  },
  {
    id: "9",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/9-poster.jpg",
    mp4Url: "/videos/9.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Кровля",
    date: "8.2024",
    width: 900,
    height: 1200,
  },

  // ...добавляйте остальные объекты по той же схеме
];

const CATEGORIES = [
  "Все",
  ...Array.from(new Set(ITEMS.map((i) => i.category))),
];

export default function AlbumSection() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "Все"
      ? ITEMS
      : ITEMS.filter((i) => i.category === activeCategory);

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex((i) => i.id === id);
    setLightboxIndex(idx);
  };

  return (
    <section className="relative w-full overflow-x-hidden bg-[#162E45] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#CFA779]">
            Наши объекты
          </span>
          <h2 className="mt-3 text-2xl font-semibold text-[#CFCFEA] sm:text-4xl">
            Фото и видео со стройплощадок
          </h2>
        </div>

        {/* Фильтр категорий — горизонтальный скролл на мобильном, без переноса */}
        <div
          className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
          style={{
            overscrollBehaviorX: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors duration-200 ${
                activeCategory === cat
                  ? "border-[#CFA779] bg-[#CFA779] font-medium text-[#162E45]"
                  : "border-[#CFA779]/30 text-[#CFCFEA] hover:border-[#CFA779]/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry на CSS columns: 2 колонки на мобильном, 3 на планшете, 4 на десктопе.
            В отличие от grid, элементы заполняют колонку сверху вниз без выравнивания
            по строкам — поэтому карточки с разными пропорциями не оставляют пустот. */}
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          {filtered.map((item, i) => (
            <AlbumCard
              key={item.id}
              item={item}
              index={i}
              onClick={() => openLightbox(item.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-[#CFCFEA]/60">
            В этой категории пока нет материалов.
          </p>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}

/** Плавное появление элемента при попадании во вьюпорт (без библиотек). */
function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Если пользователь просит меньше движения — показываем сразу
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return { ref, visible };
}

function AlbumCard({
  item,
  index,
  onClick,
}: {
  item: AlbumItem;
  index: number;
  onClick: () => void;
}) {
  // Лёгкий stagger: задержка растёт по индексу, но с потолком, чтобы
  // длинная сетка не «доезжала» аним. долгие секунды
  const delay = Math.min(index % 8, 7) * 60;
  const { ref, visible } = useReveal<HTMLButtonElement>(delay);
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[#CFA779]/25 bg-[#0f2233] text-left transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CFA779] sm:mb-4 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      {/* Skeleton-заглушка, пока картинка реально не загрузилась */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#1c3a56] to-[#0f2233]" />
      )}

      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-cover transition-all duration-500 group-active:scale-105 sm:group-hover:scale-105 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

      {item.type === "video" && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CFA779]/90 shadow-lg transition-transform duration-200 group-active:scale-90 sm:group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-[#162E45]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}

      <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-[#CFCFEA]">
        <span className="rounded bg-[#162E45]/80 px-1.5 py-0.5 backdrop-blur-sm">
          {item.category}
        </span>
        {item.date && (
          <span className="rounded bg-[#162E45]/80 px-1.5 py-0.5 backdrop-blur-sm">
            {item.date}
          </span>
        )}
      </span>
    </button>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: AlbumItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const item = items[index];
  const touchStartX = useRef<number | null>(null);

  // Анимация появления/закрытия: монтируем сразу, но включаем
  // "visible" через кадр — CSS transition отрабатывает переход
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    window.setTimeout(onClose, 200); // ждём завершения fade-out перед размонтированием
  }, [onClose]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + items.length) % items.length;
      onIndexChange(clamped);
    },
    [items.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      // Пока фокус внутри видеоплеера — стрелки принадлежат его перемотке,
      // а не переключению слайдов лайтбокса.
      const withinPlayer = (e.target as HTMLElement | null)?.closest?.(
        "[data-media-player]",
      );
      if (withinPlayer) return;
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, goTo, handleClose]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? index - 1 : index + 1);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-x-hidden transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Фон + блюр вынесены в отдельный слой позади контента. backdrop-blur
          на предке <video> ломает рендер видео на iOS Safari (видео
          рендерится в отдельном аппаратном слое) — поэтому блюр только тут. */}
      <div className="absolute inset-0 -z-10 bg-[#0b1826]/97 backdrop-blur-sm" />

      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-sm text-[#CFCFEA]">
          {item.category}
          {item.date ? ` · ${item.date}` : ""} · {index + 1}/{items.length}
        </span>
        <button
          onClick={handleClose}
          aria-label="Закрыть"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CFA779]/15 text-[#CFA779] transition-colors hover:bg-[#CFA779]/25"
        >
          ✕
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-2 pb-6 sm:px-8">
        <button
          onClick={() => goTo(index - 1)}
          aria-label="Предыдущее"
          className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#CFA779]/15 text-[#CFA779] transition-colors hover:bg-[#CFA779]/25 sm:flex"
        >
          ‹
        </button>

        <div
          key={item.id}
          className={`relative flex max-h-full max-w-full items-center justify-center transition-all duration-300 ease-out ${
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {item.type === "photo" ? (
            <LightboxPhoto item={item} />
          ) : (
            <VideoPlayer item={item} />
          )}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          aria-label="Следующее"
          className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#CFA779]/15 text-[#CFA779] transition-colors hover:bg-[#CFA779]/25 sm:flex"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1.5 pb-4 sm:hidden">
        {items.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-[#CFA779]" : "w-1.5 bg-[#CFA779]/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Большое фото в лайтбоксе со спиннером, пока не догрузилось. */
function LightboxPhoto({ item }: { item: AlbumItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {!loaded && (
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-[#CFA779]/25 border-t-[#CFA779]"
          role="status"
          aria-label="Загрузка"
        />
      )}
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="100vw"
        className={`max-h-[75dvh] w-auto max-w-full rounded-lg object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "absolute opacity-0"
        }`}
        priority
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}


/**
 * Видео — самохостинг mp4 из public/videos, нативный <video>.
 *
 * Обязательные атрибуты для iOS Safari:
 * - playsInline — без него iOS форсит переход в нативный fullscreen-плеер
 *   вместо проигрывания внутри лайтбокса;
 * - muted — обязателен для автоплея (со звуком iOS автоплей блокирует);
 * - preload="metadata" — не тянуть весь файл заранее, только длительность/
 *   размер, экономит трафик на мобильном.
 *
 * data-media-player на обёртке — используется в Lightbox, чтобы стрелки
 * влево/вправо, когда фокус на видео, не переключали слайды.
 *
 * Если видео опять начнёт проигрывать только звук без картинки — почти
 * наверняка причина в кодировании файла, а не в этом компоненте или
 * хостинге. См. ffmpeg-команду в шапке файла.
 */
function VideoPlayer({ item }: { item: AlbumItem }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      data-media-player
      className="relative overflow-hidden rounded-lg bg-[#0b1826]"
      style={{
        aspectRatio: `${item.width} / ${item.height}`,
        height: "75dvh",
        maxHeight: "75dvh",
        width: "auto",
        maxWidth: "100%",
      }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="h-9 w-9 animate-spin rounded-full border-2 border-[#CFA779]/25 border-t-[#CFA779]"
            role="status"
            aria-label="Загрузка видео"
          />
        </div>
      )}
      <video
        src={item.mp4Url}
        poster={item.src}
        controls
        playsInline
        muted
        loop
        autoPlay
        preload="metadata"
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={() => setLoaded(true)}
      />
    </div>
  );
}
