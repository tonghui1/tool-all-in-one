import createMiddleware from 'next-intl/middleware';
import intlConfig from '../next-intl.config';

export default createMiddleware({
  locales: intlConfig.locales,
  defaultLocale: intlConfig.defaultLocale,
  localeDetection: true
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};