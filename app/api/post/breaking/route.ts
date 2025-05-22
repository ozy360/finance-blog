import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, breaking } = body;

    const editPost = await postdb.findOneAndUpdate(
      { _id: id },
      { breaking: breaking }
    );

    if (editPost) return NextResponse.json({ message: "breaking changed" });
    else return NextResponse.json({ error: "error changing breaking" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
