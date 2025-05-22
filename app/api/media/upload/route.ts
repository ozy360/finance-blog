import connectDB from "@/app/lib/mongodb";
import mediadb from "@/app/models/media";
import { ImgurClient } from "imgur";
import { NextResponse, NextRequest } from "next/server";
import { json } from "stream/consumers";

//   'https://i.imgur.com/Dir70Si.png',
//   'https://i.imgur.com/7Y8fTfe.png',
//   'https://i.imgur.com/EmCGLsO.png'

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    let images = [];
    let deletehash = [];

    const mediadata = await mediadb.find();

    const data = await req.formData();
    const entries = Array.from(data.entries());

    for (const entry of entries) {
      const [name, value] = entry;

      if (value instanceof File) {
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64String = buffer.toString("base64");

        const client = new ImgurClient({
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          //   refreshToken: process.env.REFRESH_TOKEN,
        });
        const response = await client.upload({
          image: base64String as unknown as any,
        });

        images.push(response.data.link);
        deletehash.push(response.data.deletehash);
      }

      if (mediadata.length > 0) {
        if (images.length > 0) {
          const updateMedia = await mediadb.findByIdAndUpdate(
            mediadata[0]._id,
            {
              $push: {
                images: { $each: images },
                deletehash: { $each: deletehash },
              },
            }
          );
          if (updateMedia) return NextResponse.json({ message: "media saved" });
          else return NextResponse.json({ error: "media not saved" });
        }
      } else {
        if (images.length > 0) {
          const npost = new mediadb({
            images: images,
            deletehash: deletehash,
          });
          const save = await npost.save();
          if (save) return NextResponse.json({ message: "media saved" });
          else return NextResponse.json({ error: "media not saved" });
        }
      }
    }
  } catch (err: any) {
    console.log(err);
    return NextResponse.json({ error: err.message });
  }
}
