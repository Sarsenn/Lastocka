"use client";

import { useEffect } from "react";

/**
 * ВРЕМЕННО для отладки бага на мобильных — удалить, когда разберёмся.
 * Показывает плавающую консоль (eruda) поверх сайта, чтобы видеть
 * JS-ошибки прямо на телефоне, без кабеля/Web Inspector.
 */
export default function ErudaDebug() {
  useEffect(() => {
    import("eruda").then(({ default: eruda }) => {
      eruda.init();
    });
  }, []);

  return null;
}
