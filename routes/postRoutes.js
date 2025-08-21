import express from "express";
import protect from '../middleware/authMiddleware.js'
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
  getPostBySlug
} from "../controllers/postControllers.js";

const router = express.Router();

//get all users
router.get("/", getPosts);

//get single useruser
router.get("/:id", getPostById);

//get by slug
router.get("/by-slug/:slug",getPostBySlug);

//create new user
router.post("/",protect,createPost);

//update user  replace current instance with new instance completely
router.put("/:id",protect, updatePost);

//delete user
router.delete("/:id",protect, deletePost);

export default router;
