import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ADMIN_ROUTES = ['/admin', '/admin/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get('hadarah_admin_session');
  if (!session?.value) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+'],
};
