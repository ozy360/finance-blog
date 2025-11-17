import connectDB from "@/app/lib/mongodb";
import mediadb from "@/app/models/media";
import { ImgurClient } from "imgur";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const client = new ImgurClient({ clientId: process.env.CLIENT_ID });
    const data = await req.formData();
    const mid = data.get("mid");
    const did = data.get("did");

    const midArray = Array.isArray(mid) ? mid : [mid];
    const didArray = Array.isArray(did) ? did : [did];

    const mediadata = await mediadb.find();
    if (did) client.deleteImage(String(did));

    const updateMedia = await mediadb.findByIdAndUpdate(mediadata[0]._id, {
      $pull: {
        images: { $in: midArray },
        deletehash: { $in: didArray },
      },
    });

    if (updateMedia) {
      return NextResponse.json({ message: "Image deleted" });
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
