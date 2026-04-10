import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || "hilo-y-miel-jwt-secret-CHANGE-IN-PRODUCTION";
  return new TextEncoder().encode(secret);
}

async function getRole(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return (payload?.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/login";
  const isAccountRoute = pathname.startsWith("/cuenta");
  const isAccountPublic =
    pathname === "/cuenta/login" || pathname === "/cuenta/registro";

  const token = request.cookies.get("hilo-customer-token")?.value;
  const role = await getRole(token);

  // Rutas del admin panel
  if (isAdminRoute) {
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/cuenta/login";
      return NextResponse.redirect(url);
    }
  }

  // Página de login legacy /login → redirigir a /cuenta/login
  if (isAdminLoginRoute) {
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/cuenta/login";
    return NextResponse.redirect(url);
  }

  // Si ya está autenticado como admin y visita /cuenta/login → al panel
  if (pathname === "/cuenta/login" && role === "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Rutas protegidas de cuenta de clientes
  if (isAccountRoute && !isAccountPublic) {
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = "/cuenta/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
