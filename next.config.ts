/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname, // Movido fuera de `experimental`
};

export default nextConfig;
