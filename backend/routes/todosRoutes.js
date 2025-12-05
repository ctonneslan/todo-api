import express from "express";
import * as todosController from "../controllers/todosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", todosController.getAllTodos);
router.get("/:id", todosController.getTodo);
router.post("/", todosController.createTodo);
router.put("/:id", todosController.updateTodo);
router.delete("/:id", todosController.deleteTodo);
router.post("/:id/categories", todosController.addTodoCategory);
router.delete(
  "/:id/categories/:categoryId",
  todosController.deleteTodoCategory
);
router.get("/:id/categories", todosController.getTodoCategories);

export default router;
