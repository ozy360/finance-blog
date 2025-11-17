import connectDB from "@/app/lib/mongodb";
import commentdb from "@/app/models/comment";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { pid, name, date, email, commentId, comment, action, replying } =
      body;

    if (action === "addComment") {
      const ncomment = new commentdb({
        pid: pid,
        name: name || "Anonymous",
        email: email || "",
        date: date,
        comment: comment,
        reply: [],
      });

      const save = await ncomment.save();
      if (save) return NextResponse.json({ message: "Comment saved" });
      else return NextResponse.json({ error: "Comment not saved" });
    }

    if (action === "replyComment") {
      const updatedComment = await commentdb.findByIdAndUpdate(
        commentId,
        {
          $push: {
            replies: {
              name: name || "Anonymous",
              email: email || "",
              date: date,
              comment: comment,
              replying: replying,
            },
          },
        },
        { new: true }
      );

      if (updatedComment) {
        return NextResponse.json({ message: "Replied saved" });
      } else return NextResponse.json({ error: "Replied not saved" });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
