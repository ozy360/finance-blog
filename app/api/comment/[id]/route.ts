import connectDB from "@/app/lib/mongodb";
import commentdb from "@/app/models/comment";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { pid } = body;

    const alldata = await commentdb.find({ pid: pid });

    if (alldata) {
      return NextResponse.json(alldata);
    }

    return NextResponse.json({ error: "Failed to get alldata" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
