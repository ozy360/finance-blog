import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

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
