import { Schema, model, models } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title required"],
      trim: true,
      maxlength: [180, "Title can not be greater than 180 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug required"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt required"],
      trim: true,
      maxlength: [400, "Excerpt can not be greater than 400 characters"],
    },
    category: {
      type: String,
      default: "Design",
    },
    cover: {
      type: String,
      required: [true, "Cover required"],
      trim: true,
    },
    contentHtml: {
      type: String,
      default: "",
    },
    contentText: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: "1 min read",
    },
    author: {
      type: String,
      default: "Creative Rafa",
    },
    owner: {
      type: String,
      required: [true, "Owner required"],
      index: true,
    },
    linkedDesignId: {
      type: Schema.Types.ObjectId,
      ref: "design",
      default: null,
    },
    linkedDesignIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "design" }],
      default: [],
    },
    showLinkedDesign: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

BlogSchema.plugin(mongoosePaginate);

export default models.blog || model("blog", BlogSchema);
