/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-e6ce1628bfe741e8bc850f609e50acf0.r2.dev", // ваш реальный r2.dev-домен
      },
    ],
  },
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
