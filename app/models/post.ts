import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, required: true },
  tags: { type: String, required: true },
  likes: { type: Number, default: 0 },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  breaking: { type: Boolean, default: false },
});

const postdb = mongoose.models.post || mongoose.model("post", postSchema);
export default postdb;
