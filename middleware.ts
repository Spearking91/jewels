import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// List of authorized admin IDs from environment variables
const AUTHORIZED_ADMIN_IDS = [
  process.env.SUPERADMIN,
  process.env.ADMIN,
].filter(Boolean); // Filters out undefined/empty variables

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const isTryingToAccessAdmin =
    request.nextUrl.pathname === "/sudosu" ||
    request.nextUrl.pathname.startsWith("/sudosu/");

  if (isTryingToAccessAdmin) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    // Check if user ID is included in the admin array
    const isAuthorized = user && AUTHORIZED_ADMIN_IDS.includes(user.id);

    if (!isAuthorized) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = "/";
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/sudosu", "/sudosu/:path*"],
};