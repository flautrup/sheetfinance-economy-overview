export { default } from "next-auth/middleware";

export const config = {
  // Protect all pages but exclude /api, static assets, and icon files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
