import userCollectionTemplate from "../models/User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await userCollectionTemplate.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }

  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await userCollectionTemplate.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
  if (existingUser) {
    return res.status(400).json({ message: "User ALready Exists" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  const user = new userCollectionTemplate({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
  return res.status(201).json({ user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userCollectionTemplate.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "Could Not find user by emailId" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  return res
    .status(200)
    .json({ message: "Login SUccessfull", user: existingUser });
};
