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

export default router;
