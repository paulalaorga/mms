import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;

  console.log("Token recibido en middleware:", token); // 👀 Verifica si el token tiene el rol

  if (url.startsWith("/admin") && (!token || token.role !== "admin")) {
    console.log("🔒 Redirigiendo a /login, usuario sin acceso.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
