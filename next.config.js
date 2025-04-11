/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000', // Ensure the port matches your backend server
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'affari-doro-backend.shubhexchange.com',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

module.exports = nextConfig;