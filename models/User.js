import mongoose from "mongoose";

const userCollection = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
  ],
});

const userCollectionTemplate = mongoose.model("User", userCollection);

export default userCollectionTemplate;
