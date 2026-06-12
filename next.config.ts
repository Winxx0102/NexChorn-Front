/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://nex-chorn-back.vercel.app; style-src 'self' 'unsafe-inline'; img-src 'self' data:;`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;