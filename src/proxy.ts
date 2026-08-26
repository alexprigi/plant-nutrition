import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const RENAMES: [string, string][] = [
  ['chi-sono', 'about'],
  ['contatti', 'contact'],
  ['prenota', 'booking'],
  ['ricette', 'recipes'],
  ['servizi', 'services'],
  ['policy-cancellazione', 'cancellation-policy'],
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const [from, to] of RENAMES) {
    const match = pathname.match(new RegExp(`^/(it|de|en)/${from}(/.*)?$`));
    if (match) {
      const url = request.nextUrl.clone();
      url.pathname = `/${match[1]}/${to}${match[2] ?? ''}`;
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
