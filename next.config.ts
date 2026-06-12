/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://nex-chorn-back.vercel.app;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;