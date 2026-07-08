import blogModel from "@/models/blog.model";
import { dbConnect } from "@/utils/mongoDb";

const linkedDesignPopulate = [
  {
    path: "linkedDesignId",
    select: "_id title photo category",
  },
  {
    path: "linkedDesignIds",
    select: "_id title photo category",
  },
];

const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const mongoDbGetAllBlogs = async (querySearch, options) => {
  try {
    await dbConnect();
    const blogs = await blogModel.paginate(querySearch || {}, {
      ...options,
      populate: linkedDesignPopulate,
      lean: true,
    });
    return blogs;
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbGetBlogBySlug = async (slug) => {
  try {
    await dbConnect();
    const safeSlug = escapeRegex(slug);
    return await blogModel.findOne({ slug: { $regex: `^${safeSlug}$`, $options: "i" } }).populate(linkedDesignPopulate).lean();
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbGetBlogById = async (id) => {
  try {
    await dbConnect();
    return await blogModel.findById(id).populate(linkedDesignPopulate).lean();
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbCreateBlog = async (data) => {
  try {
    await dbConnect();
    return await blogModel.create(data);
  } catch (error) {
    throw new Error(`error desde dao: ${error}`);
  }
};

export const mongoDbUpdateBlogById = async (id, pack) => {
  try {
    await dbConnect();
    return await blogModel.updateOne({ _id: id }, [{ $set: pack }]);
  } catch (error) {
    throw new Error(error);
  }
};

export const mongoDbDeleteBlogById = async (id) => {
  try {
    await dbConnect();
    return await blogModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error);
  }
};
