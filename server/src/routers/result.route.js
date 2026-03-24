import express from "express";
import { getResultById } from "../controllers/result.controller.js";

const resultRouter = express.Router();

// 👉 GET result by id (FE polling AI)
resultRouter.get("/:id", getResultById);

export default resultRouter;
