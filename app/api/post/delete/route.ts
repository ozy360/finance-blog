import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.formData();
    const id = data.get("id");
    const findId = await postdb.findOne({ _id: id });

    if (findId) {
      await postdb.deleteOne({ _id: id });
      return NextResponse.json({ message: "Post deleted" });
    } else {
      return NextResponse.json({ message: "Post not deleted" });
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
