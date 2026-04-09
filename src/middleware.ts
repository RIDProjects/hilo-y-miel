import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET || "hilo-y-miel-jwt-secret-CHANGE-IN-PRODUCTION";
  return new TextEncoder().encode(secret);
}

async function verifyRole(
  token: string | undefined,
  role: "admin" | "customer"
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload?.role === role;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isAccountRoute = pathname.startsWith("/cuenta");
  const isAccountPublic =
    pathname === "/cuenta/login" || pathname === "/cuenta/registro";

  if (isAdminRoute || isLoginRoute) {
    const adminToken = request.cookies.get("hilo-admin-session")?.value;
    const isAdmin = await verifyRole(adminToken, "admin");

    if (isAdminRoute && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (isLoginRoute && isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (isAccountRoute && !isAccountPublic) {
    const customerToken = request.cookies.get("hilo-customer-token")?.value;
    const isCustomer = await verifyRole(customerToken, "customer");

    if (!isCustomer) {
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
