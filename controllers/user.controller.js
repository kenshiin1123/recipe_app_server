import AppError from "../util/AppError.js";
import wrapAsync from "../util/wrapAsync.js";
import User from "../models/user.model.js";
import Recipe from "../models/recipe.js";

import bcrypt from "bcrypt";

const getUser = wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("ID is required", 400);
  }

  const user = await User.findById(id)
    .select("-passwordHash -__v -token -_id")
    .populate({
      path: "recipes",
      select: "title description -_id",
    });
  if (!user) {
    throw new AppError("User not found!", 404);
  }

  res.status(200).json({
    message: "Successfully retrieved user",
    success: true,
    data: user,
  });
});

const deleteUser = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!id) {
    throw new AppError("User ID is required!", 400);
  }

  if (!password) {
    throw new AppError("Password needed when deleting user account", 400);
  }

  const user = await User.findById(id);

  // Delay to deter brute-force attempts.
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new AppError(
      "Failed to delete user account. Password incorrect!",
      400
    );
  }

  // Delete user recipes from collection
  await Promise.all(
    user.recipes.map((recipeId) => Recipe.findByIdAndDelete(recipeId))
  );

  // Delete user recipes from user;
  await User.findByIdAndDelete(id);

  res.status(200).json({
    message: "User and all associated recipes deleted successfully.",
    success: true,
  });
});

export { getUser, deleteUser };
