/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push('bull', 'ioredis');
      }
      return config;
    },
  }
  
export default nextConfig;