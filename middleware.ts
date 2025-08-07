import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/account(.*)",
  "/transaction(.*)",
]);

// Define auth-related routes where authenticated users shouldn't go
const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Apply Clerk middleware to handle authentication
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathName = new URL(req.url).pathname;
  
  // If user is not authenticated and tries to access protected route
  if (!userId && isProtectedRoute(req)) {
    // Save the original URL they were trying to access for redirect after login
    const signInUrl = new URL('/sign-in', req.url);
    // Store the intended destination to redirect after successful auth
    signInUrl.searchParams.set("redirect_url", pathName);
    return Response.redirect(signInUrl);
  }
  
  // If user is authenticated and tries to access auth pages
  if (userId && isAuthRoute(req)) {
    // Get the redirect URL from query params or default to dashboard
    const redirect = new URL(req.url).searchParams.get("redirect_url");
    const redirectUrl = redirect ? redirect : "/dashboard";
    return Response.redirect(new URL(redirectUrl, req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
