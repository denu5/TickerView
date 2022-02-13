/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  serverRuntimeConfig: {
    // Will be available only on server
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    POLYGON_KEY: process.env.POLYGON_KEY,
  },
  images: {
    domains: ['api.polygon.io'],
  },
}

module.exports = nextConfig
