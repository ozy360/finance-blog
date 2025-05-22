import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, imageUrl, date, content, tags } = body;

    const npost = new postdb({
      title: title,
      imageUrl: imageUrl,
      date: date,
      content: content,
      tags: tags,
      slug: title
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .join("-"),
    });

    const save = await npost.save();
    if (save) return NextResponse.json({ message: "post saved" });
    else return NextResponse.json({ error: "post not saved" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
