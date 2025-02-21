import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.pathname;

  console.log("Token recibido en middleware:", token); // 👀 Verifica si el token tiene el rol

  if (url.startsWith("/admin")) {
    if (!token) {
      console.log("🔴 Token no encontrado, permitiendo acceso momentáneo hasta verificar");
      return NextResponse.next(); // 🔹 Permite que la verificación de sesión termine
    }
    
    if (token.role !== "admin") {
      console.log("🔴 Usuario no autorizado, redirigiendo a /user");
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }
  
}
export const config = {
  matcher: ["/admin/:path*"],
};
