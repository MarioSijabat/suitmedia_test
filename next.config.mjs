/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.suitdev.com'], // Biarkan untuk gambar yang bisa diakses langsung
  },
  // Tambahkan konfigurasi untuk proxy image
  experimental: {
    serverActions: true,
  },
  // Izinkan filesystem access untuk cache
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