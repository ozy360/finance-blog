import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";

import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return new NextResponse("Missing 'id' parameter", { status: 400 });
    }

    const alldata = await postdb.findOne({ slug: id });

    if (alldata) {
      return NextResponse.json(alldata);
    }

    return NextResponse.json({ error: "Failed to get alldata" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
