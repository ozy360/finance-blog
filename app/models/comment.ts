import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema({
  name: { type: String, required: true },
  replying: { type: String, required: true },
  email: { type: String },
  date: { type: String },
  comment: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
  pid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String },
  date: { type: String },
  replies: [ReplySchema],
  comment: {
    type: String,
    required: true,
  },
});

const commentdb =
  mongoose.models.comment || mongoose.model("comment", commentSchema);
export default commentdb;
