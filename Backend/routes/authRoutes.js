import express from "express";
import { registerUser, loginUser, getMe, updateUser } from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes — require valid JWT
router.get("/me", protect, getMe);
router.put("/update", protect, updateUser);

export default router;
