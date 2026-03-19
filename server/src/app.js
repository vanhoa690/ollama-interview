import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routers/auth";
import categoryRouter from "./routers/category.route";
import questionRouter from "./routers/question.route";

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/interviews")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// ROUTES
app.use("/api/categories", categoryRouter);
app.use("/api/questions", questionRouter);
app.use("/api/auth", authRouter);

app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});
