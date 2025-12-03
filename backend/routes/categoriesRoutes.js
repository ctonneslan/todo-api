import express from "express";
import * as categoriesController from "../controllers/categoriesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", categoriesController.createCategory);
router.delete("/:id", categoriesController.deleteCategory);
router.put("/:id", categoriesController.updateCategory);
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategory);

export default router;
