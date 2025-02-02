import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    auth0Id: { type: String, required: true, unique: true },
    profilePicture: { type: String, default: '' },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],  // One-to-Many (User → Posts)
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }], // Many-to-Many (User → Followers)
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
