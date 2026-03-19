import { Router } from "express";

import {
  addCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
// import { checkAuth } from "../middlewares/checkAuth";

const categoryRouter = Router();

// categoryRouter.use(checkAuth);

categoryRouter.get("/", getCategories);

categoryRouter.get("/:id", getCategoryById);

categoryRouter.post("/", addCategory);

categoryRouter.delete("/:id", deleteCategory);

categoryRouter.put("/:id", updateCategory);

export default categoryRouter;
