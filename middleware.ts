import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// MUST match the ID in your page component
const AUTHORIZED_ADMIN_ID = "adf0e995-8175-4631-bfde-0c8a6e26a48a";

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

  console.log("Middleware User ID:", user?.id);
  console.log("Middleware Auth Error:", error?.message);
  console.log("Matches Authorized Admin?", user?.id === AUTHORIZED_ADMIN_ID);

  const isTryingToAccessAdmin =
    request.nextUrl.pathname === "/sudosu" ||
    request.nextUrl.pathname.startsWith("/sudosu/");

  if (isTryingToAccessAdmin) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }

    if (user.id !== AUTHORIZED_ADMIN_ID) {
      const unauthorizedUrl = request.nextUrl.clone();
      unauthorizedUrl.pathname = "/";
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return supabaseResponse;
}

// Ensure both exact route and subpaths are matched
export const config = {
  matcher: ["/sudosu", "/sudosu/:path*"],
};
