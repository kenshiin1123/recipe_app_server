import express from "express";
import path from "path";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

import {
  getRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";

import multer from "multer";

// Multer storage configuration for memory
const storage = multer.memoryStorage(); // Store files in memory as Buffers

const upload = multer({
  storage: storage,
  limits: { fileSize: 16 * 1024 * 1024 }, // Limit file size to 16MB (MongoDB BSON limit)
  fileFilter: (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Only JPEG, JPG, PNG, or GIF images are allowed!"));
    }
  },
});

router.use(authMiddleware);
router.get("/:id/recipes/", getRecipes);
router.post("/:id/recipes/", upload.single("img"), addRecipe);
router.post("/:id/recipes/", addRecipe);
router.put("/:id/recipes/:recipeId", updateRecipe);
router.delete("/:id/recipes/:recipeId", deleteRecipe);

export default router;
