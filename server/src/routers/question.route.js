import { Router } from "express";

import {
  createManyQuestions,
  createQuestion,
  deleteQuestion,
  getQuestions,
  getQuestionsByCategory,
} from "../controllers/question.controller";
// import { checkAuth } from "../middlewares/checkAuth";

const questionRouter = Router();

// questionRouter.use(checkAuth);

questionRouter.post("/", createQuestion);
questionRouter.post("/bulk", createManyQuestions);
questionRouter.get("/", getQuestions);
questionRouter.get("/category/:categoryId", getQuestionsByCategory);
questionRouter.delete("/:id", deleteQuestion);

export default questionRouter;
