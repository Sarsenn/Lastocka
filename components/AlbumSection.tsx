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
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-[#CFA779]/25 bg-[#0f2233] text-left transition-all duration-500 ease-out sm:mb-4 ${
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
            <LightboxPhoto item={item} />
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
        className={`max-h-[75vh] w-auto max-w-full rounded-lg object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "absolute opacity-0"
        }`}
        priority
        onLoad={() => setLoaded(true)}
      />
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
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playing) {
      setIsBuffering(true);
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

  // Фиксированный размер блока по объявленным пропорциям видео —
  // задаётся СРАЗУ, до загрузки постера/видео, поэтому при переключении
  // между роликами (и пока превью ещё грузится) блок не "прыгает" и
  // кнопка play не съезжает. Раньше size брался из реального img без
  // явного контейнера — если у видео другие пропорции, чем указано в
  // ITEMS, был layout shift и кнопка оказывалась не там, где кликали.
  // height задан абсолютной величиной (vh) — она всегда конкретна,
  // в отличие от "100%", который не резолвится, если у родителя нет
  // явной высоты (именно из-за этого видео пропадало: height схлопывался в 0).
  const boxStyle: React.CSSProperties = {
    aspectRatio: `${item.width} / ${item.height}`,
    height: "75vh",
    maxHeight: "75vh",
    width: "auto",
    maxWidth: "100%",
  };

  if (!playing) {
    return (
      <button
        onClick={onPlay}
        className="relative block overflow-hidden rounded-lg"
        style={boxStyle}
        aria-label="Воспроизвести видео"
      >
        {!posterLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#0f2233]"
            role="status"
            aria-label="Загрузка превью"
          >
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-[#CFA779]/25 border-t-[#CFA779]" />
          </div>
        )}
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 90vw, 70vh"
          className={`object-contain transition-opacity duration-200 ${
            posterLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setPosterLoaded(true)}
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
      className="group relative overflow-hidden rounded-lg"
      style={boxStyle}
      onMouseMove={wakeControls}
      onTouchStart={wakeControls}
    >
      {/* Постер-подложка под видео. Живёт, пока не начался реальный playback,
          чтобы не было пустого/чёрного кадра во время буферизации — раньше
          на это место полагался только нативный атрибут poster у <video>,
          а он показывается с задержкой или не показывается вовсе. */}
      {!isPlaying && (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 90vw, 70vh"
          className="absolute inset-0 object-contain"
        />
      )}

      {isBuffering && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20"
          role="status"
          aria-label="Буферизация"
        >
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-[#CFA779]/25 border-t-[#CFA779]" />
        </div>
      )}
      <video
        ref={videoRef}
        src={item.videoSrc}
        poster={item.src}
        playsInline
        preload="metadata"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-150 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      {/* Play-иконка по центру, когда на паузе. Скрыта во время буферизации —
          иначе она накладывается на спиннер загрузки (баг: видно и то, и другое). */}
      {!isPlaying && !isBuffering && (
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
