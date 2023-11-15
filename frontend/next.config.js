/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // assetPrefix: process.env.BASE_PATH || "",
  // basePath: process.env.BASE_PATH || "",
  assetPrefix: '/ced-iot',
  basePath: '/ced-iot', 
  trailingSlash: true,
  publicRuntimeConfig: {
    // root: process.env.BASE_PATH || "",
    root: '/ced-iot'
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
