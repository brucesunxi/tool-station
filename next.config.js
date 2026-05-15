const createNextIntlPlugin = require('next-intl/plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', '@google-analytics/data'],
  },
}

module.exports = createNextIntlPlugin('./src/i18n.ts')(nextConfig)
