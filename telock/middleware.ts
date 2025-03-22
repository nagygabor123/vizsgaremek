// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname === "/dashboard/school/students") {
      // Csak a "portas" pozícióval rendelkező felhasználók férhetnek hozzá
      if (token?.position !== "portas") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/dashboard/school")) {
      // Csak az "igazgato", "igazgatohelyettes" és "rendszergazda" pozícióval rendelkező felhasználók férhetnek hozzá
      const allowedPositions = ["igazgato", "igazgatohelyettes", "rendszergazda"];
      if (typeof token?.position === "string" && !allowedPositions.includes(token.position)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/dashboard/class")) {
      // Csak akkor engedélyezett a hozzáférés, ha az "osztalyfonok" nem "nincs"
      if (token?.osztalyfonok === "nincs") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Egyéb útvonalak kezelése
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Csak bejelentkezett felhasználók férhetnek hozzá
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"], // Middleware alkalmazása a /dashboard útvonal alatt
};