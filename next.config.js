/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    runtime: 'edge',
  },
  async rewrites() {
    return [
      {
        source: '/api/games',
        destination: 'https://www.onlinegames.io/media/plugins/genGames/embed.json',
      },
    ];
  },
};

module.exports = nextConfig;
