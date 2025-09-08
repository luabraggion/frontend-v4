import { NextResponse, type NextRequest } from 'next/server';

// Função para verificar se o usuário está autenticado
function isAuthenticated(request: NextRequest): boolean {
  const token =
    request.cookies.get('portal-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Em produção, validar o token JWT aqui
  // Por agora, apenas verificar se existe
  return !!token;
}

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/api/user', '/api/campaigns', '/(admin)'];

// Rotas que só devem ser acessíveis por usuários não autenticados
const authRoutes = ['/auth/login', '/auth/register'];

// Rotas da API que não precisam de autenticação
const publicApiRoutes = ['/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isUserAuthenticated = isAuthenticated(request);

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) || pathname.includes(route),
  );

  // Verificar se é uma rota de autenticação
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Verificar se é uma API pública
  const isPublicApi = publicApiRoutes.some((route) => pathname.startsWith(route));

  // Se é uma rota protegida e o usuário não está autenticado
  if (isProtectedRoute && !isUserAuthenticated && !isPublicApi) {
    if (pathname.startsWith('/api/')) {
      // Para APIs, retornar 401
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token de autenticação necessário',
          },
        },
        { status: 401 },
      );
    } else {
      // Para páginas, redirecionar para login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Se é uma rota de autenticação e o usuário já está autenticado
  if (isAuthRoute && isUserAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Aplicar headers de segurança
  const response = NextResponse.next();

  // Headers de segurança básicos
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Para APIs, adicionar headers específicos
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-API-Version', '1.0');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
}

// Configurar em quais rotas o middleware deve executar
export const config = {
  matcher: [
    // Aplicar a todas as rotas exceto:
    '/((?!_next/static|_next/image|favicon.ico|public|images|icons).*)',
    // Incluir todas as rotas de API
    '/api/:path*',
    // Incluir rotas específicas
    '/dashboard/:path*',
    '/auth/:path*',
    '/(admin)/:path*',
  ],
};
