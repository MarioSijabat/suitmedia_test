/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.suitdev.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
        ...config.resolve.fallback
      };
    }
    return config;
  }
};

export default nextConfig;