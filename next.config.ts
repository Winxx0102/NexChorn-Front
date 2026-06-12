/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Añadimos 'unsafe-inline' para permitir los scripts que Next.js necesita
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://nex-chorn-back.vercel.app;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;