import connectDB from "@/app/lib/mongodb";
import postdb from "@/app/models/post";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    if (typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query parameter" });
    }

    const sanitizedQuery = query.trim();

    // const alldata = await userdb.find();
    const items = await postdb.find({
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },
        // { content: { $regex: sanitizedQuery, $options: "i" } },
        { tags: { $regex: sanitizedQuery, $options: "i" } },
      ],
    });
    // .limit(12);

    if (items.length) return NextResponse.json(items);
    else return NextResponse.json({ error: "Nothing found" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
