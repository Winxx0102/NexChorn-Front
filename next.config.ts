const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.0.105:3000/:path*', // Tu backend
      },
    ];
  },
};

export default nextConfig;