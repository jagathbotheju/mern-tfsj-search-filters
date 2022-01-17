const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter new post name"],
    unique: true,
  },
  rating: {
    type: Number,
    required: [true, "Please provide rating for the Post"],
  },
  description: {
    type: String,
    required: [true, "Please provide post description"],
  },
  price: {
    type: Number,
    required: [true, "Please provide post price"],
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
