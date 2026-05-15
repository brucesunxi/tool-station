/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', '@google-analytics/data'],
  },
}

module.exports = nextConfig
