import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    likesCount: Array,
    author: String,
    imageUrl: String,
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model("Post", PostSchema);