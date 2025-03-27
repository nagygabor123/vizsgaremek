import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (req.nextUrl.pathname === "/dashboard/school/students") {

      const allowedPositions = ["igazgato", "igazgatohelyettes", "rendszergazda", "portas"];
      if (typeof token?.position === "string" && !allowedPositions.includes(token.position)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/dashboard/school")) {

      const allowedPositions = ["igazgato", "igazgatohelyettes", "rendszergazda"];
      if (typeof token?.position === "string" && !allowedPositions.includes(token.position)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/dashboard/class")) {

      if (token?.osztalyfonok === "nincs") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else if (req.nextUrl.pathname.startsWith("/dashboard/my-timetable")) {

      const allowedPositions = ["igazgato", "igazgatohelyettes", "Tanár"];
      if (typeof token?.position === "string" && !allowedPositions.includes(token.position)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};