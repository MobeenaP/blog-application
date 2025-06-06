/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow any HTTPS domain
      },
      {
        protocol: 'http',
        hostname: '**', // Allow any HTTP domain (optional, if you want to support http)
      },
    ],
  },
};

export default nextConfig;