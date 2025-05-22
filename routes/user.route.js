import express from "express";
const router = express.Router();
import authenticateMiddleware from "../middlewares/auth.middleware.js";
import { getUser } from "../controllers/user.controller.js";

router.use(authenticateMiddleware);
router.get("/:id", getUser);

export default router;
