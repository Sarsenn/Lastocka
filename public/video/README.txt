Добавьте сюда:
- hero-construction.webm (основной формат, компактнее)
- hero-construction.mp4  (fallback для Safari/iOS)

Рекомендации по видео для быстрой загрузки:
- 1920x1080 или 1280x720, 8-15 секунд, зацикленное (loop)
- без звука (муты всё равно на автоплее)
- битрейт ~1.5-2.5 Mbps, итоговый размер до 3-5 МБ
- сжать через ffmpeg, например:
  ffmpeg -i source.mov -vf scale=1920:-2 -an -c:v libvpx-vp9 -b:v 1.5M hero-construction.webm
  ffmpeg -i source.mov -vf scale=1920:-2 -an -c:v libx264 -crf 28 -preset veryslow -movflags +faststart hero-construction.mp4
