import connectDB from "@/app/lib/mongodb";
import mediadb from "@/app/models/media";

import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const mediadata = await mediadb.find();

    if (mediadata[0]) {
      return NextResponse.json(mediadata[0]);
    }

    return NextResponse.json({ error: "Failed to get mediadata" });
    // }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
