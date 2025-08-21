import express from "express";
import { signup, login,refreshAccessToken,logout } from "../controllers/authControllers.js";

import {
  validateSignup,
  validateLogin,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/token", refreshAccessToken);
router.delete("/logout", logout);

export default router;
