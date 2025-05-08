/** @type {import('next').NextConfig} */

// 使用 next-intl v4
const nextIntlPlugin = require('next-intl/plugin');
const intlConfig = require('./next-intl.config');

const withNextIntl = nextIntlPlugin({
  // 这些是语言配置
  locales: intlConfig.locales,
  defaultLocale: intlConfig.defaultLocale
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withNextIntl(nextConfig);
