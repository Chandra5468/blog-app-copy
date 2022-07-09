import express from "express";
import mongoose from "mongoose";
import router from "./routes/user.routes.js";
import cors from "cors";
import blogRouter from "./routes/blog-routes.js";
import dotenv from "dotenv";
import path from "path";
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config({ path: "./config.env" });

app.use("/api/user", router);
app.use("/api/blog", blogRouter);

mongoose.connect(
  "mongodb+srv://blogapp:12345@cluster0.96rde.mongodb.net/blogs-data?retryWrites=true&w=majority",
  () => {
    console.log("DB Connected");
  }
);

// app.use("/api", (req, res, next) => {
//   res.send("Hello WOrld");
// });

// Heroku

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = path;
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running at http://localhost:4000 ");
});
