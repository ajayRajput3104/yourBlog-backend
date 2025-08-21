import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryService.js";
import { buildUrl } from "cloudinary-build-url";
import env from "../config/env.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No Image uploaded" });

    const result = await uploadToCloudinary(req.file.buffer, "featured_images");
    res.json({ fileId: result.public_id, url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    await deleteFromCloudinary(fileId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getFileView = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const url = buildUrl(fileId, {
      cloud: {
        cloudName: env.cloudinaryCloudName,
      },
    });
    res.json({ url: url });
  } catch (err) {
    next(err);
  }
};
