/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: '/ced-iot',
  basePath: '/ced-iot', 
  trailingSlash: true,
  publicRuntimeConfig: {
    root: '/ced-iot'
  },
  optimizeFonts: false,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,   // 毎秒1回ファイルの変更を確認
      aggregateTimeout: 300, // 300ms待機して変更を確認
    };
    return config;
  },
};

module.exports = nextConfig;
