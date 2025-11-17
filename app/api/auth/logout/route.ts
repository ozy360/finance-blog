import { cookies } from "next/headers";
import { deleteCookie } from "cookies-next";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    // const cookie = cookies();
    // cookie.delete("sessionId");
    deleteCookie("sessionId");
    return NextResponse.json({ message: "logout successful" });
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message });
  }
}
