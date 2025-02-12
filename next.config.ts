import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    localeDetection: false, // Next.js espera false como literal
  },
  output: "standalone", // Permite despliegue optimizado
  outputFileTracingRoot: __dirname, // Optimización de archivos en output
};

export default nextConfig;
