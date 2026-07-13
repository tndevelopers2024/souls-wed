import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // If MAINTENANCE_MODE is set to 'true', activate maintenance mode.
  // We can also allow a bypass token or check for specific IPs if needed in the future.
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  const isMaintenancePage = request.nextUrl.pathname === '/maintenance';

  if (isMaintenanceMode && !isMaintenancePage) {
    // Let static files, API, and images pass through to allow the maintenance page to render properly
    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/images') ||
      pathname.startsWith('/logo') ||
      pathname.startsWith('/soulswed') ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg)$/)
    ) {
      return NextResponse.next();
    }
    
    // Redirect all other requests to the maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // If maintenance mode is OFF (false), but user tries to access /maintenance directly, redirect to home
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
