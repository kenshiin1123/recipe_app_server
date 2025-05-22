import AppError from "../util/AppError.js";
import wrapAsync from "../util/wrapAsync.js";

import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";

const getRecipes = wrapAsync(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("ID is required", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found!", 404);
  }

  const recipes = await Promise.all(
    user.recipes.map(async (recipeId) => {
      return await Recipe.findById(recipeId);
    })
  );

  return res.status(200).json({
    message: "Successfully retrieved recipes",
    success: true,
    data: recipes,
  });
});

const addRecipe = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, preparationSteps } = req.body;

  const img = req.file;

  if (!title || !description || !ingredients || !preparationSteps) {
    throw new AppError(
      "Please input these required fields: title, description, ingredients, preparationSteps",
      400
    );
  }

  if (!img) {
    throw new AppError("Image file is required for the recipe!", 400);
  }

  if (!id) {
    throw new AppError("User ID is required!", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Cannot find user!", 404);
  }

  // --- Parse JSON string fields ---
  let parsedIngredients;
  try {
    parsedIngredients = JSON.parse(ingredients);
  } catch (error) {
    throw new AppError(
      "Invalid format for ingredients. Please send as a JSON array.",
      400
    );
  }

  let parsedPreparationSteps;
  try {
    parsedPreparationSteps = JSON.parse(preparationSteps);
  } catch (error) {
    throw new AppError(
      "Invalid format for preparation steps. Please send as a JSON array.",
      400
    );
  }

  const newRecipe = new Recipe({
    title,
    description,
    img: {
      data: img.buffer, // The actual image binary data
      contentType: img.mimetype, // The MIME type of the image
    },
    ingredients: parsedIngredients,
    preparationSteps: parsedPreparationSteps,
  });

  //   Push the new recipe id to the user's recipe array.
  user.recipes.push(newRecipe._id);

  //   Save the new recipe in the recipes collection
  await newRecipe.save();

  //   Save the user to update user's recipes array.
  await user.save();

  res
    .status(200)
    .json({ message: "Successfully added new recipe!", success: true });
});

const updateRecipe = wrapAsync(async (req, res) => {
  const { id, recipeId } = req.params;
  const { recipe } = req.body;
  const { title, description, img, ingredients, preparationSteps } = recipe;

  if (!title || !description || !img || !ingredients || !preparationSteps) {
    throw new AppError(
      "Please fill these required fields: title, description, img, ingredients, preparationSteps, and recipe ID",
      400
    );
  }

  if (!id) {
    throw new AppError("User ID is required!", 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("Cannot find user!", 404);
  }

  const recipeExists = user.recipes.find((t) => t.toString() === recipeId);
  if (!recipeExists) {
    throw new AppError("Cannot find the recipe in user's recipes array.", 404);
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    recipeId,
    { title, description, img, ingredients, preparationSteps },
    { new: true }
  );

  return res.status(200).json({
    message: "Successfully updated the recipe!",
    success: true,
    recipe: updatedRecipe,
  });
});

const deleteRecipe = wrapAsync(async (req, res) => {
  const { id, recipeId } = req.params;

  if (!id || !recipeId) {
    throw new AppError("User ID and recipe ID is required", 400);
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found!", 404);
  }

  // Remove recipe from user's recipes array
  const updatedUserRecipes = user.recipes.filter(
    (recipe) => recipe._id.toString() !== recipeId
  );

  user.recipes = updatedUserRecipes;
  await user.save();

  // Also remove recipe from Recipe collection
  await Recipe.findByIdAndDelete(recipeId);

  return res
    .status(200)
    .json({ message: "Successfully removed recipe", success: true });
});

export { getRecipes, addRecipe, updateRecipe, deleteRecipe };
