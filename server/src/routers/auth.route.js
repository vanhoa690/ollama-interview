import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = express.Router();

// Step 1: redirect to Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Step 2: callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 👉 redirect về frontend (React)
    const redirectUrl = `http://localhost:5173/login?token=${token}`;

    return res.redirect(redirectUrl);
  },
);

authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default authRouter;
