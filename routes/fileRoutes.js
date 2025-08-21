import express from "express";
import { uploadFile, deleteFile, getFileView } from "../controllers/fileControllers.js";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js"; // only logged-in users can upload/delete

const router = express.Router();

router.post("/upload", protect, upload, uploadFile);
router.delete("/delete/:fileId", protect, deleteFile);
router.get("/view/:fileId", getFileView);

export default router;
