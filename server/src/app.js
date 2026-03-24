import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import authRouter from "./routers/auth.route";
import categoryRouter from "./routers/category.route";
import questionRouter from "./routers/question.route";
import "./config/passport";
import resultRouter from "./routers/result.route";
const app = express();

app.use(cors());

app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect("mongodb://localhost:27017/interviews")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// ROUTES
app.use("/api/categories", categoryRouter);
app.use("/api/questions", questionRouter);
app.use("/api/auth", authRouter);
app.use("/api/results", resultRouter);

app.listen(3000, () => {
  console.log(`Server is running on port http://localhost:3000`);
});
