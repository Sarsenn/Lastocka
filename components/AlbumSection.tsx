"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * Секция «Альбом объектов» — сетка фото/видео + лайтбокс + свой видеоплеер.
 * Цвета: фон #162E45, акцент #CFA779, вспомогательный #CFCFEA.
 *
 * Никаких сторонних пакетов не требуется (Plyr убран) — плеер написан на
 * нативном <video> + Pointer Events, поэтому ничего дополнительно
 * устанавливать/импортировать не нужно, компонент самодостаточен.
 *
 * Анимации — CSS-transition + IntersectionObserver, без внешних библиотек.
 *
 * Как подключить:
 * 1) Положить компонент в components/AlbumSection.tsx
 * 2) Заполнить массив ITEMS реальными путями (public/album/...) или URL
 * 3) <AlbumSection /> на странице
 *
 * Для видео: лёгкий постер (jpg/webp) + сжатый mp4 (H.264, до ~6-8 Мбит/с),
 * либо Cloudflare Stream / Mux — тогда вместо <video> в VideoPlayer нужно
 * подставить их embed. preload="metadata" — грузятся только метаданные
 * (длительность/превью-кадр), сам файл — только после нажатия play.
 */

type AlbumItem = {
  id: string;
  type: "photo" | "video";
  src: string; // фото: путь к изображению; видео: путь к постеру (превью)
  videoSrc?: string; // обязателен для type === "video"
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/1.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/2.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/3.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/4.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/5.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/6.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/7.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/8.mp4",
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
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/9.mp4",
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

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// iOS Safari умеет разворачивать на весь экран только сам <video>,
// у контейнеров (div) fullscreen API не поддерживается.
type IOSVideoElement = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

/**
 * Полностью самописный видеоплеер на нативном <video> — никаких сторонних
 * пакетов. Свой прогресс-бар (перетаскивание мышью/пальцем через Pointer
 * Events — единый код для десктопа и мобильных), большая play-кнопка по
 * центру, автоскрытие панели во время воспроизведения, спиннер буферизации,
 * отдельная ветка для fullscreen на iOS Safari.
 */
function VideoPlayer({ item }: { item: AlbumItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false); // метаданные загружены
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);

  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2600);
  }, []);

  const wake = useCallback(() => {
    setShowControls(true);
    if (playing) scheduleHide();
  }, [playing, scheduleHide]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMeta = () => {
      setReady(true);
      setDuration(video.duration || 0);
    };
    const onTimeUpdate = () => {
      setCurrent(video.currentTime);
      if (video.buffered.length) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onPlay = () => {
      setPlaying(true);
      scheduleHide();
    };
    const onPause = () => {
      setPlaying(false);
      setBuffering(false);
      setShowControls(true);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onEnded = () => {
      setPlaying(false);
      setBuffering(false);
      setShowControls(true);
    };

    video.addEventListener("loadedmetadata", onLoadedMeta);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMeta);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", onEnded);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [scheduleHide]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const v = Number(e.target.value);
    video.volume = v;
    video.muted = v === 0;
    setVolume(v);
    setMuted(v === 0);
  };

  const seekToClientX = useCallback(
    (clientX: number) => {
      const bar = progressRef.current;
      const video = videoRef.current;
      if (!bar || !video || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setCurrent(ratio * duration);
    },
    [duration],
  );

  const onProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setScrubbing(true);
    seekToClientX(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scrubbing) seekToClientX(e.clientX);
  };
  const onProgressPointerUp = () => setScrubbing(false);

  const enterFullscreen = () => {
    const video = videoRef.current as IOSVideoElement | null;
    const container = containerRef.current;
    if (!video) return;
    if (typeof video.webkitEnterFullscreen === "function") {
      video.webkitEnterFullscreen();
      return;
    }
    container?.requestFullscreen?.().catch(() => {});
  };

  const onContainerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    }
  };

  const progressPct = duration ? (current / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Видеоплеер"
      tabIndex={0}
      onKeyDown={onContainerKeyDown}
      onPointerMove={wake}
      onPointerDown={wake}
      className="relative select-none overflow-hidden rounded-lg bg-black outline-none"
      style={{
        aspectRatio: `${item.width} / ${item.height}`,
        height: "75dvh",
        maxHeight: "75dvh",
        width: "auto",
        maxWidth: "100%",
      }}
    >
      <video
        ref={videoRef}
        poster={item.src}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        onClick={togglePlay}
      >
        <source src={item.videoSrc} type="video/mp4" />
      </video>

      {/* Спиннер: метаданные ещё не готовы, либо идёт буферизация на паузе воспроизведения */}
      {(!ready || buffering) && (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20"
          role="status"
          aria-label="Загрузка видео"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-[#CFA779]/25 border-t-[#CFA779]" />
        </div>
      )}

      {/* Большая play-кнопка по центру, когда видео на паузе */}
      {ready && !playing && !buffering && (
        <button
          onClick={togglePlay}
          aria-label="Воспроизвести"
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CFA779]/90 shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#162E45]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Нижняя панель управления — автоскрытие во время воспроизведения */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col gap-1.5 bg-gradient-to-t from-[#0b1826]/90 to-transparent px-3 pb-2 pt-8 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          ref={progressRef}
          className="group relative h-4 w-full cursor-pointer touch-none"
          onPointerDown={onProgressPointerDown}
          onPointerMove={onProgressPointerMove}
          onPointerUp={onProgressPointerUp}
          onPointerCancel={onProgressPointerUp}
          role="slider"
          aria-label="Перемотка"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
        >
          <span className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/20" />
          <span
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#CFCFEA]/40"
            style={{ width: `${bufferedPct}%` }}
          />
          <span
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#CFA779]"
            style={{ width: `${progressPct}%` }}
          />
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#CFA779] shadow transition-transform duration-150 group-active:scale-125"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Пауза" : "Воспроизвести"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#CFCFEA] transition-colors hover:bg-white/10 active:bg-white/15"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <span className="shrink-0 text-xs tabular-nums text-[#CFCFEA]">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleMute}
              aria-label={muted ? "Включить звук" : "Выключить звук"}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#CFCFEA] transition-colors hover:bg-white/10 active:bg-white/15"
            >
              {muted || volume === 0 ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M16.5 12a4.5 4.5 0 00-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.943 8.943 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L18.73 21 20 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={onVolumeChange}
              aria-label="Громкость"
              className="hidden h-1 w-16 accent-[#CFA779] sm:block"
            />
            <button
              onClick={enterFullscreen}
              aria-label="Развернуть на весь экран"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#CFCFEA] transition-colors hover:bg-white/10 active:bg-white/15"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
