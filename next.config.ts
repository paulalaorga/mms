import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Activa el modo estricto de React

  // Configuración para redirecciones, útil para Paycomet
  async redirects() {
    return [
      {
        source: '/payment-success/:orderId',
        destination: '/payments/return?result=success&order=:orderId',
        permanent: true,
      },
      {
        source: '/payment-failed/:orderId',
        destination: '/payments/return?result=error&order=:orderId',
        permanent: true,
      },
    ];
  },
  
  // Headers para permitir solicitudes de webhook
  async headers() {
    return [
      {
        source: '/api/paycomet/webhook',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, X-Paycomet-Signature',
          },
        ],
      },
    ];
  },

  // Configuración de webpack para manejar los errores de importación
  webpack: (config, { isServer }) => {
    // Ignorar los módulos problemáticos durante la compilación
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        // Importaciones de mongodb
        '../../../lib/mongodb.mjs': false,
        '../../../lib/mongodb': false,
        '../../lib/mongodb': false,
        '@/lib/mongodb': false,
        '../../../../lib/mongodb.mjs': false,
        
        // Importaciones de User
        '../../../models/User.mjs': false,
        '../../../models/User': false,
        '../../models/User': false,
        '../../../../models/User.mjs': false,
        '@/models/User': false,
        
        // Importaciones de Purchase
        '../../../models/Purchase.mjs': false,
        '../../../models/Purchase': false,
        '../../../../models/Purchase.mjs': false,
        '@/models/Purchase': false,
      },
    };
    
    return config;
  },
};

export default nextConfig;