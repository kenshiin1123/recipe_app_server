import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, TOKEN_SECRET, { expiresIn: "30d" });
};

export default generateToken;
