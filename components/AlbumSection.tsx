"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * Секция «Альбом объектов» — сетка фото/видео + лайтбокс + свой видеоплеер.
 * Цвета: фон #162E45, акцент #CFA779, вспомогательный #CFCFEA.
 *
 * Анимации — только CSS-transition + IntersectionObserver, без сторонних
 * библиотек (Framer Motion и т.п. здесь не нужны, это лишние килобайты).
 *
 * Как подключить:
 * 1) Положить компонент в components/AlbumSection.tsx
 * 2) Заполнить массив ITEMS реальными путями (public/album/...) или URL
 * 3) <AlbumSection /> на странице
 *
 * Для видео: лёгкий постер (jpg/webp) + сжатый mp4 (H.264, до ~6-8 Мбит/с),
 * либо Cloudflare Stream / Mux — тогда вместо <video> в VideoPlayer нужно
 * подставить их embed. preload="none" — видео не грузится, пока не нажали play.
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
    type: "photo",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/1.webp",
    alt: "Заливка фундамента, объект на ул. Строителей",
    category: "Фундамент",
    date: "03.2025",
    width: 1200,
    height: 900,
  },
  {
    id: "2",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/2.webp",
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/video.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Кровля",
    date: "05.2025",
    width: 1200,
    height: 675,
  },
  {
    id: "3",
    type: "photo",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/3.webp",
    alt: "Черновая отделка, второй этаж",
    category: "Отделка",
    date: "07.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "4",
    type: "photo",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/4.webp",
    alt: "Черновая отделка, второй этаж",
    category: "Отделка",
    date: "07.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "5",
    type: "photo",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/5.webp",
    alt: "Черновая отделка, второй этаж",
    category: "Кровля",
    date: "07.2025",
    width: 900,
    height: 1200,
  },
  {
    id: "6",
    type: "video",
    src: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/4.webp",
    videoSrc: "https://pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev/video2.mp4",
    alt: "Монтаж кровли, таймлапс",
    category: "Фундамент",
    date: "05.2025",
    width: 1200,
    height: 675,
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
          <h2 className="mt-3 text-2xl font-semibold text-[#ffffff] sm:text-4xl">
            Фото и видео со стройплощадок
          </h2>
        </div>

        {/* Фильтр категорий — горизонтальный скролл на мобильном, без переноса */}
        <div
          className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:flex-wrap"
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
                  ? "border-[#CFA779] bg-[#CFA779] text-[#162E45] font-medium"
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

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[#CFA779]/25 bg-[#0f2233] text-left transition-all duration-500 ease-out sm:mb-4 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ aspectRatio: `${item.width} / ${item.height}` }}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-active:scale-105 sm:group-hover:scale-105"
        loading="lazy"
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
  const [playingVideo, setPlayingVideo] = useState(false);

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
      setPlayingVideo(false);
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
      className={`fixed inset-0 z-50 flex flex-col overflow-x-hidden bg-[#0b1826]/97 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
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
          className="absolute left-2 top-1/2 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#CFA779]/15 text-[#CFA779] transition-colors hover:bg-[#CFA779]/25 sm:flex"
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
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="100vw"
              className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              priority
            />
          ) : (
            <VideoPlayer
              item={item}
              playing={playingVideo}
              onPlay={() => setPlayingVideo(true)}
            />
          )}
        </div>

        <button
          onClick={() => goTo(index + 1)}
          aria-label="Следующее"
          className="absolute right-2 top-1/2 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-[#CFA779]/15 text-[#CFA779] transition-colors hover:bg-[#CFA779]/25 sm:flex"
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

/**
 * Свой видеоплеер — без сторонних библиотек.
 * Показывает постер + play-кнопку, после нажатия рендерит <video> со
 * своими контролами (прогресс-бар с перемоткой, время, звук, fullscreen).
 *
 * Если позже понадобятся субтитры / выбор качества / скорость —
 * проще всего поставить Plyr (npm i plyr, ~25кб gzip) и подставить его
 * вместо этого компонента: он темизируется CSS-переменными
 * (--plyr-color-main: #CFA779; --plyr-video-background: #162E45; и т.д.)
 */
function VideoPlayer({
  item,
  playing,
  onPlay,
}: {
  item: AlbumItem;
  playing: boolean;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playing) {
      videoRef.current?.play().catch(() => {});
    }
  }, [playing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrent(v.currentTime);
    setProgress(v.currentTime / v.duration);
  };

  const seek = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const v = videoRef.current;
    const bar = e.currentTarget;
    if (!v || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    v.currentTime = ratio * v.duration;
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen?.();
    }
  };

  const formatTime = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  const wakeControls = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  };

  if (!playing) {
    return (
      <button
        onClick={onPlay}
        className="relative block max-h-[75vh]"
        aria-label="Воспроизвести видео"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          sizes="100vw"
          className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CFA779]/90 shadow-xl transition-transform duration-200 hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#162E45]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </button>
    );
  }

  return (
    <div
      className="group relative max-h-[75vh]"
      onMouseMove={wakeControls}
      onTouchStart={wakeControls}
    >
      <video
        ref={videoRef}
        src={item.videoSrc}
        poster={item.src}
        playsInline
        preload="none"
        className="max-h-[75vh] w-auto max-w-full rounded-lg"
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Play-иконка по центру, когда на паузе */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          aria-label="Воспроизвести"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CFA779]/90 shadow-xl">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-[#162E45]">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Панель управления */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-6 transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-3 flex cursor-pointer items-center"
          onClick={seek}
          onTouchMove={seek}
        >
          <div className="relative h-1 w-full rounded-full bg-[#CFCFEA]/25">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#CFA779]"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-[#CFA779] shadow"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[#CFCFEA]">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#CFCFEA]">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#CFCFEA]">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              aria-label={muted ? "Включить звук" : "Выключить звук"}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#CFCFEA]">
                  <path d="M16.5 12A4.5 4.5 0 0014 8v1.79l2.5 2.5c0-.1.02-.19.02-.29zM3 3.27l3.15 3.15L6 6.5v4H3v6h4l5 5v-6.73l4.25 4.25c-.67.5-1.42.9-2.25 1.11v2.06a8.94 8.94 0 003.69-1.55l1.58 1.58L21 20.72 4.27 4 3 3.27zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#CFCFEA]">
                  <path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2A4.5 4.5 0 0014 8v8a4.47 4.47 0 002.5-4z" />
                </svg>
              )}
            </button>
            <span className="text-xs tabular-nums text-[#CFCFEA]/80">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>
          <button onClick={toggleFullscreen} aria-label="Полный экран">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#CFCFEA]">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
