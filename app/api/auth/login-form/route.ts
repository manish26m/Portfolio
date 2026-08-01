import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken, createAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Support both JSON and form data
    let username: string;
    let password: string;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      username = formData.get("username") as string;
      password = formData.get("password") as string;
    } else {
      const json = await request.json();
      username = json.username;
      password = json.password;
    }

    if (!username || !password) {
      return NextResponse.redirect(new URL("/admin/login?error=missing", request.url), { status: 303 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), { status: 303 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), { status: 303 });
    }

    const token = signToken({ userId: user.id, username: user.username });
    const cookieOptions = createAuthCookie(token);

    // Redirect to dashboard with cookie set in the SAME response
    const response = NextResponse.redirect(new URL("/admin/dashboard", request.url), { status: 303 });
    response.cookies.set(
      cookieOptions.name,
      cookieOptions.value,
      {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        maxAge: cookieOptions.maxAge,
        path: cookieOptions.path,
      }
    );

    return response;
  } catch (error) {
    console.error("Login form error:", error);
    return NextResponse.redirect(new URL("/admin/login?error=server", request.url), { status: 303 });
  }
}
