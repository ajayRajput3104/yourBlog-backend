import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    featuredImage: {
      id: { type: String, required: true }, 
      url: { type: String, required: true }, 
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        body: String,
        date: { type: Date, default: Date.now },
      },
    ],
    meta: {
      votes: { type: Number, default: 0 },
      favs: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate slug
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, {
          lower: true,       // convert to lowercase
          strict: true,      // remove special characters
          replacement: "-",  // replace spaces and removed chars with underscore
          trim: true         // trim leading/trailing replacement chars
        });
    let slug = baseSlug;
    let count = 1;

    // Ensure uniqueness
    while (await mongoose.models.Post.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
