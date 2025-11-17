import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // await connectDB();
    const data = await req.json();
    const ndata = {
      email: data.email,
      password: data.password,
    };

    if (
      ndata.email === "admin@admin.com" &&
      ndata.password === "admin@admin.com"
    ) {
      const response = NextResponse.json({ message: "admin" });

      response.cookies.set("sessionId", "admin", {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        path: "/admin",
      });

      return response;
    } else {
      return NextResponse.json({ error: "no admin" });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err });
  }
}
