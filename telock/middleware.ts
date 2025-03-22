// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname.startsWith("/dashboard/school")) {
      const allowedPositions = ["igazgato", "igazgatohelyettes", "rendszergazda"];
      if (typeof token?.position === "string" && !allowedPositions.includes(token.position)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

   
    if (req.nextUrl.pathname.startsWith("/dashboard/school/students")) {
      if (token?.position !== "portas" ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }


    // Példa: Csak az osztályfőnökök férhetnek hozzá a /dashboard/class route-hoz
    if (req.nextUrl.pathname.startsWith("/dashboard/class")) {
      if (token?.osztalyfonok == "nincs") {
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