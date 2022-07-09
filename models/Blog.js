import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    requried: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref:"User",
    required: true,
  },
});

const blogSchemaTemplate = mongoose.model("Blog", BlogSchema);

export default blogSchemaTemplate;
