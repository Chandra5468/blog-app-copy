import mongoose from "mongoose";
import blogSchemaTemplate from "../models/Blog.js";
import userCollectionTemplate from "../models/User.js";

// get All Blogs

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await blogSchemaTemplate.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs Found" });
  }

  return res.status(200).json({ blogs });
};

// Add a blog

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;
  try {
    existingUser = await userCollectionTemplate.findById(user);
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(500)
      .json({ message: "Unable to find the user by this id" });
  }

  const blog = new blogSchemaTemplate({
    title,
    description,
    image,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }

  return res.status(200).json({ blog });
};

// update blog

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id;
  let blog;
  try {
    blog = await blogSchemaTemplate.findByIdAndUpdate(blogId, {
      title,
      description,
    });
  } catch (err) {
    return console(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to update the blog" });
  }
  return res.status(200).json({ blog });
};

// get by Id blog

export const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await blogSchemaTemplate.findById(id);
  } catch (err) {
    return console.log(err);
  }

  if (!blog) {
    return res.status(404).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blog });
};

// delete by ID

export const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  let blog;
  try {
    blog = await blogSchemaTemplate.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to Delete" });
  }

  return res.status(200).json({ message: "Successfully Deleted" });
};

// get by user Id

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;

  try {
    userBlogs = await userCollectionTemplate.findById(userId).populate("blogs");
  } catch (err) {
    return console.log(err);
  }

  if (!userBlogs) {
    return res.status(404).json({ Message: "No Blogs found" });
  }

  return res.status(200).json({ user: userBlogs });
};
