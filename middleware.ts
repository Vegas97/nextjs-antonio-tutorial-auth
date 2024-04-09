import authConfig from "@/auth.config";
import NextAuth, { Session } from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/routes";
import { NextRequest } from "next/server";

export const { auth } = NextAuth(authConfig);

export default auth(
  (req: NextRequest & { auth: Session | null }): Response | void => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const info = {
      route: nextUrl.pathname,
      isLoggedIn: isLoggedIn,
    };

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // console.log({
    //   fromMiddleware: {
    //     info,
    //     publicRoutes,
    //     isApiAuthRoute,
    //     isPublicRoute,
    //     isAuthRoute,
    //   },
    // });

    // If the route is an API auth route, do nothing
    if (isApiAuthRoute) {
      return;
    }

    if (isAuthRoute) {
      // If the route is an auth public route and the user is logged in, redirect to the default login redirect
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }
      return;
    }

    // if is not logged in and the route is not public, redirect to the login page
    if (!isLoggedIn && !isPublicRoute) {
      return Response.redirect(new URL("/auth/login", nextUrl));
    }

    // at this point we know that:
    // we are not on an API auth route
    // we are not on an auth route
    // at least one of the following is true:
    // - the user is logged in
    // - the route is public
    // - the user is not logged in and the route is public
    // so we can safely return without doing anything
    // because in any of these cases, we don't need to redirect
    return;
  },
);

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
