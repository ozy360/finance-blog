import connectDB from "@/app/lib/mongodb";
import commentdb from "@/app/models/comment";

import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const alldata = await commentdb.find();

    if (alldata) {
      return NextResponse.json(alldata);
    }

    return NextResponse.json({ error: "Failed to get alldata" });
    // }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
