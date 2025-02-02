import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true }, // Optional image
    author: { type: String, required: true },  // One-to-Many (User → Posts)
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Users tagged in post
});

export default mongoose.model("Post", PostSchema);
