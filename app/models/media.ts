import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    },
  ],
  deletehash: [
    {
      type: String,
      required: true,
    },
  ],
});

const mediadb = mongoose.models.media || mongoose.model("media", mediaSchema);
export default mediadb;
