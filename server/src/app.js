import express from "express";
import mongoose from "mongoose";
import postRouter from "./routers/post";
import authorRouter from "./routers/author";

import authRouter from "./routers/auth";

const app = express();

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/nodejs")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

app.use("/api/posts", postRouter);

app.use("/api/authors", authorRouter);

app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});
