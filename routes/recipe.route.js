import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";

router.use(authMiddleware);
router.get("/:id/recipes/", getRecipes);
router.post("/:id/recipes/", addRecipe);
router.put("/:id/recipes/:recipeId", updateRecipe);
router.delete("/:id/recipes/:recipeId", deleteRecipe);

export default router;
