import { Post } from "../models/postModel.js";
import slugify from "slugify";

// @desc Get all posts
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ status: "active" }).populate("author", "username email");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc Get single post by ID
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!post) {
      return res
        .status(404)
        .json({ message: `No post found with id: ${req.params.id}` });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

//get by slug
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "username email"
    );
    if (!post)
      return res.status(404).json({ message: "No post with that slug" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { title, content, featuredImage, status, userId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "Author (userId) is required" });
    }
    if (!featuredImage?.id) {
      return res.status(400).json({ message: "Featured image ID is required" });
    }
    if (!featuredImage?.url) {
      return res
        .status(400)
        .json({ message: "Featured image URL is required" });
    }
    const slug = slugify(title, {
      lower: true, // convert to lowercase
      strict: true, // remove special characters
      replacement: "-", // replace spaces and removed chars with underscore
      trim: true, // trim leading/trailing replacement chars
    });
    const newPost = await Post.create({
      title,
      slug,
      content,
      featuredImage,
      status: status || "active",
      author: userId,
    });

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// @desc Update a post (full replace)
export const updatePost = async (req, res, next) => {
  try {
    const { title, content, featuredImage, status, userId } = req.body;
    const post=await Post.findById(req.params.id)
    post.title=title ?? post.title;
    post.content=content ?? post.content;
    post.status=status ?? post.status;
    post.author=userId ?? post.author;

    if(featuredImage?.id && featuredImage?.url){
      post.featuredImage=featuredImage;
    }
    const updatedPost=await post.save();

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: `No post found with id: ${req.params.id}` });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
// @desc Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: `No post found with id: ${req.params.id}` });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
