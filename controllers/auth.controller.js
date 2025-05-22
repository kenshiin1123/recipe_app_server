import bcrypt from "bcrypt";
import AppError from "../util/AppError.js";
import wrapAsync from "../util/wrapAsync.js";
import User from "../models/user.model.js";
import generateToken from "../util/genToken.js";
const saltRounds = 10;

const register = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new AppError(
      "All fields are required: username, email, and password.",
      400
    );
  }

  //   Checks if there are existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exist!", 409);
  }

  //   Hash Password
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({ username, email, passwordHash });

  //   Save User
  await user.save();

  res
    .status(201)
    .json({ message: "Successfully registered user", success: true });
});

const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email and password is required!", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Incorrect email or password", 401);
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new AppError("Incorrect email or password", 401);
  }

  const token = generateToken(user._id);
  user.token.push(token);
  await user.save();

  res.status(200).json({ message: "Successfully authenticated!", token });
});

export { register, login };
