// routing.ts
import {defineRouting} from 'next-intl/routing';
import intlConfig from '../../next-intl.config';

export const routing = defineRouting({
  locales: intlConfig.locales,
  defaultLocale: intlConfig.defaultLocale
});
