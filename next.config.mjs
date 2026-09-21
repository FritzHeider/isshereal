/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: '*.cdninstagram.com' },
      { protocol: 'https', hostname: 'scontent-*.cdninstagram.com' },
      { protocol: 'https', hostname: '*.ytimg.com' },
      { protocol: 'https', hostname: '*.ggpht.com' },
      { protocol: 'https', hostname: '*.tiktokcdn.com' },
      { protocol: 'https', hostname: 'p16-sign-sg.tiktokcdn.com' },
    ],
  },
  // Security: prevent source map exposure in production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
