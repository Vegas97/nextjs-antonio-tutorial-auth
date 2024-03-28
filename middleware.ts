import authConfig from "./auth.config";
import NextAuth from "next-auth";

export const { auth } = NextAuth(authConfig);

// middleware works on the edge.
// but prisma don't support it, we can't use prism adapter in middleware
// BUT there is a solution.

export default auth((req) => {
  const route = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;

  const info = {
    route: route,
    isLoggedIn: isLoggedIn,
  };

  console.log("middleware ", info);
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
