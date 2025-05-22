import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, title, imageUrl, date, content } = body;

    const editPost = await postdb.findByIdAndUpdate(id, {
      title,
      imageUrl,
      date: date,
      content,
      slug: title
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .join("-"),
    });

    if (editPost) return NextResponse.json({ message: "post edited" });
    else return NextResponse.json({ error: "post not edited" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
