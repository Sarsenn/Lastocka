"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  poster: string;
  webm: string;
  mp4: string;
};

/**
 * Фоновое видео для Hero-секции с оптимизацией под устройства:
 * - на мобильных (<768px) видео не грузится вообще — только постер
 *   с лёгким CSS-эффектом (Ken Burns), чтобы не тратить трафик и батарею;
 * - при медленном соединении (Data Saver / 2g-3g) видео тоже не грузится;
 * - при prefers-reduced-motion видео и Ken Burns отключаются;
 * - на десктопе видео начинает грузиться после отрисовки главного контента
 *   (requestIdleCallback), чтобы не конкурировать с LCP-текстом заголовка;
 * - preload="none" + poster — до старта видео виден статичный кадр.
 */
export default function HeroVideoBackground({ poster, webm, mp4 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<"poster" | "poster-kenburns" | "video">(
    "poster",
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setMode("poster");
      return;
    }

    const isSmallScreen = window.innerWidth < 768;

    const conn = (
      navigator as unknown as {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const isSlowConnection =
      !!conn?.saveData ||
      ["slow-2g", "2g", "3g"].includes(conn?.effectiveType ?? "");

    if (isSmallScreen || isSlowConnection) {
      setMode("poster-kenburns");
      return;
    }

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const load = () => setMode("video");

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(load, 300);
    }

    return () => {
      if (idleId !== undefined && "cancelIdleCallback" in window)
        window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Постер — всегда в разметке, видео (если грузится) накрывает его сверху */}
      <img
        src={poster}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          mode === "poster-kenburns"
            ? "animate-[kenburns_18s_ease-in-out_infinite_alternate]"
            : ""
        } ${mode === "video" ? "opacity-0" : "opacity-100"}`}
        loading="eager"
        fetchPriority="high"
      />

      {mode === "video" && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          onCanPlay={(e) => {
            e.currentTarget.classList.remove("opacity-0");
            e.currentTarget.classList.add("opacity-100");
          }}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}

      {/* Затемнение для читаемости текста поверх видео/фото */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-700/85 via-navy-500/75 to-navy-700/90" />
      <div className="absolute inset-0 bg-navy-900/20 mix-blend-multiply" />
    </div>
  );
}
