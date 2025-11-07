/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*',
        port: '8000', // Ensure the port matches your backend server
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'http',
        hostname: '*',
        port: '8500', // Ensure the port matches your backend server
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'affari-doro-backend.shubhexchange.com',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'backend.affaredoro.com',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https',
        hostname: 'test-backend.affaredoro.com',
        pathname: '/**', // Allow all paths
      },
    ],
  },
};

module.exports = nextConfig;