import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import recipeRoute from "./routes/recipe.route.js";

dotenv.config();
// Global Variables / Environmental Variables
const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Recipe App Server" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/users", recipeRoute);

// Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    success: false,
    message,
  });
});

// Server Starter
app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening to port", PORT);
  connectDB();
});
