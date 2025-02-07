import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    localeDetection: false, // Next.js espera false como literal
  },
};

export default nextConfig;
