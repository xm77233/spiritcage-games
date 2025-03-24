/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/games',
        destination: 'https://www.onlinegames.io/media/plugins/genGames/embed.json',
      },
    ];
  },
  output: 'export',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  images: {
    domains: ['www.onlinegames.io', 'via.placeholder.com'],
  },
};

module.exports = nextConfig;
