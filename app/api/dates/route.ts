import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const posts = await postdb.find({});
    let updated = [];

    for (const post of posts) {
      const parsedDate = new Date(post.date);
      if (!isNaN(parsedDate.getTime())) {
        // Convert to YYYY-MM-DD
        post.date = parsedDate.toISOString().split("T")[0]; // e.g., "2025-03-15"
        await post.save();
        updated.push(post._id.toString());
      } else {
        console.warn(`⚠️ Invalid date string: ${post.date} on ${post._id}`);
      }
    }

    return NextResponse.json({
      message: "✅ Conversion complete",
      updatedCount: updated.length,
      updatedIds: updated,
    });
  } catch (err) {
    console.error("❌ Error converting dates:", err);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
