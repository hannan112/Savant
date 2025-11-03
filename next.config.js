/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Turbopack configuration for Next.js 16
  turbopack: {},
  // Webpack config for backward compatibility (only used if --webpack flag is used)
  webpack: (config, { isServer }) => {
    // Handle pdfjs-dist for server-side rendering
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig

