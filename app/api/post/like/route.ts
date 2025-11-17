import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";

import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, like } = body;

    console.log(id, like);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing post ID" });
    }
    if (typeof like !== "number" || isNaN(like)) {
      return NextResponse.json({ error: "Like must be a valid number" });
    }

    const addLike = await postdb.findOneAndUpdate(
      { _id: id },
      { $set: { likes: like } },
      { new: true } // Return updated document
    );

    if (!addLike) {
      return NextResponse.json({ error: "Post not found" });
    }

    return NextResponse.json({
      message: "Like updated successfully",
      likes: addLike.likes,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
