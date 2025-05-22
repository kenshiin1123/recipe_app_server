import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../util/AppError.js";
import wrapAsync from "../util/wrapAsync.js";
import User from "../models/user.model.js";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const authenticateMiddleware = wrapAsync(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) throw new AppError("Access denied. No token provided.", 401);

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (decoded.id !== user._id.toString()) {
      throw new AppError("Invalid or expired token.", 403);
    }

    if (!user) {
      throw new AppError("Invalid or expired token.", 403);
    }
  } catch (err) {
    throw new AppError("Invalid or expired token.", 403);
  }

  next();
});

export default authenticateMiddleware;
