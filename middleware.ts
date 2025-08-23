import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';

const supportedLocales = ['en-GB', 'zh-TW'];
const defaultLocale = 'en-GB';

export function middleware(req: NextRequest) {
  // Try to read locale from cookie first
  const cookieLocale = req.cookies.get('locale')?.value?.trim();
  let locale = cookieLocale && supportedLocales.includes(cookieLocale)
    ? cookieLocale
    : defaultLocale;

  // If cookie is not set, read from browser's Accept-Language header
  if (!cookieLocale) {
    const acceptLanguage = req.headers.get('accept-language') || defaultLocale;
    const requestedLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .filter(Boolean) // 移除空字串
      .filter(lang => /^[a-zA-Z-]+$/.test(lang)); // 過濾不合法語言碼

    try {
      locale = match(requestedLocales, supportedLocales, defaultLocale);
    } catch (err) {
      console.warn('Locale parse error:', err);
      locale = defaultLocale;
    }
  }

  // Set locale cookie, valid for 30 days
  const res = NextResponse.next();
  res.cookies.set('locale', locale, { maxAge: 60 * 60 * 24 * 30, path: '/' });

  return res;
}

// Middleware applies to these paths
export const config = {
  matcher: ['/((?!_next).*)'], // Exclude _next static assets
};