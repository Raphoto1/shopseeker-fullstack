import {
  mongoDbCreateBlog,
  mongoDbDeleteBlogById,
  mongoDbGetAllBlogs,
  mongoDbGetBlogById,
  mongoDbGetBlogBySlug,
  mongoDbUpdateBlogById,
} from "@/dao/blog.dao";

const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
};

const parseTags = (rawTags) => {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) return rawTags.filter(Boolean);
  return String(rawTags)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const calculateReadTime = (contentText, contentHtml) => {
  const fallbackText = String(contentHtml || "").replace(/<[^>]+>/g, " ");
  const source = String(contentText || fallbackText).trim();
  const words = source ? source.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const normalizeStatus = (status, publishedFlag) => {
  if (publishedFlag === true || status === "published") return "published";
  return "draft";
};

const parseLinkedDesignIds = (rawLinkedDesignIds, rawLinkedDesignId) => {
  let ids = [];

  if (Array.isArray(rawLinkedDesignIds)) {
    ids = rawLinkedDesignIds;
  } else if (typeof rawLinkedDesignIds === "string" && rawLinkedDesignIds.trim()) {
    const rawValue = rawLinkedDesignIds.trim();
    try {
      if (rawValue.startsWith("[")) {
        ids = JSON.parse(rawValue);
      } else {
        ids = rawValue.split(",").map((item) => item.trim());
      }
    } catch {
      ids = rawValue.split(",").map((item) => item.trim());
    }
  }

  if ((!ids || ids.length === 0) && rawLinkedDesignId) {
    ids = [rawLinkedDesignId];
  }

  return ids
    .map((item) => String(item || "").trim())
    .filter(Boolean);
};

const normalizeLinkedDesigns = (blog) => {
  if (!blog) return blog;

  const linkedFromArray = Array.isArray(blog.linkedDesignIds)
    ? blog.linkedDesignIds.filter(Boolean)
    : [];

  const hasLegacyLinked = blog.linkedDesignId && (typeof blog.linkedDesignId !== "object" || blog.linkedDesignId._id || blog.linkedDesignId);

  if (linkedFromArray.length > 0) {
    return { ...blog, linkedDesignIds: linkedFromArray };
  }

  if (hasLegacyLinked) {
    return { ...blog, linkedDesignIds: [blog.linkedDesignId] };
  }

  return { ...blog, linkedDesignIds: [] };
};

export const getAllBlogs = async (limit, page, sortField, sortQ, filterCat, search, published, owner) => {
  const limitIn = limit ? Number(limit) : 12;
  const pageIn = page ? Number(page) : 1;
  const sortFieldIn = sortField || "createdAt";
  const sortIn = sortQ ? { [sortFieldIn]: Number(sortQ) } : { createdAt: -1 };

  const query = {};

  if (filterCat) {
    query.category = filterCat;
  }

  if (search) {
    const regex = RegExp(String(search).toLowerCase(), "i");
    query.$or = [{ title: regex }, { excerpt: regex }, { contentText: regex }];
  }

  if (published !== null && published !== undefined && published !== "") {
    query.status = toBoolean(published, true) ? "published" : "draft";
  }

  if (owner) {
    query.owner = owner;
  }

  const options = { limit: limitIn, page: pageIn, sort: sortIn };
  const blogs = await mongoDbGetAllBlogs(query, options);
  return {
    ...blogs,
    docs: (blogs?.docs || []).map((item) => normalizeLinkedDesigns(item)),
  };
};

export const getBlogBySlug = async (slug) => {
  const normalizedSlug = normalizeSlug(slug);
  const blog = await mongoDbGetBlogBySlug(normalizedSlug);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return normalizeLinkedDesigns(blog);
};

export const getBlogById = async (id) => {
  const blog = await mongoDbGetBlogById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return normalizeLinkedDesigns(blog);
};

export const createBlog = async (formData, sessionUser) => {
  const data = Object.fromEntries(formData);

  const title = String(data.title || "").trim();
  const excerpt = String(data.excerpt || "").trim();
  const cover = String(data.cover || "").trim();

  if (!title || !excerpt || !cover) {
    throw new Error("Missing required fields: title, excerpt or cover");
  }

  const slug = normalizeSlug(data.slug || title);
  if (!slug) {
    throw new Error("Invalid slug");
  }

  const existing = await mongoDbGetBlogBySlug(slug);
  if (existing) {
    throw new Error("Slug already exists");
  }

  const status = normalizeStatus(data.status, false);
  const parsedPublishedAt = data.publishedAt ? new Date(String(data.publishedAt)) : null;
  const publishedAt = status === "published"
    ? (parsedPublishedAt && !Number.isNaN(parsedPublishedAt.getTime()) ? parsedPublishedAt : new Date())
    : null;

  const contentHtml = String(data.contentHtml || "").trim();
  const contentText = String(data.contentText || "").trim();
  const linkedDesignIds = parseLinkedDesignIds(data.linkedDesignIds, data.linkedDesignId);

  const payload = {
    title,
    slug,
    excerpt,
    category: String(data.category || "Design"),
    cover,
    contentHtml,
    contentText,
    tags: parseTags(data.tags),
    readTime: calculateReadTime(contentText, contentHtml),
    author: String(data.author || sessionUser?.name || "Creative Rafa"),
    owner: String(sessionUser?._id || "rafa"),
    linkedDesignId: linkedDesignIds[0] || null,
    linkedDesignIds,
    showLinkedDesign: toBoolean(data.showLinkedDesign, false),
    featured: toBoolean(data.featured, false),
    status,
    publishedAt,
  };

  return await mongoDbCreateBlog(payload);
};

export const updateBlogById = async (id, formData) => {
  const existing = await getBlogById(id);
  const data = Object.fromEntries(formData);

  const patch = {};

  if (data.title) patch.title = String(data.title).trim();
  if (data.excerpt) patch.excerpt = String(data.excerpt).trim();
  if (data.category) patch.category = String(data.category);
  if (data.cover) patch.cover = String(data.cover).trim();
  if (data.contentHtml !== undefined) patch.contentHtml = String(data.contentHtml);
  if (data.contentText !== undefined) patch.contentText = String(data.contentText);
  if (data.tags !== undefined) patch.tags = parseTags(data.tags);
  if (data.author) patch.author = String(data.author).trim();
  if (data.linkedDesignId !== undefined || data.linkedDesignIds !== undefined) {
    const linkedDesignIds = parseLinkedDesignIds(data.linkedDesignIds, data.linkedDesignId);
    patch.linkedDesignId = linkedDesignIds[0] || null;
    patch.linkedDesignIds = linkedDesignIds;
  }
  if (data.showLinkedDesign !== undefined) patch.showLinkedDesign = toBoolean(data.showLinkedDesign);
  if (data.featured !== undefined) patch.featured = toBoolean(data.featured);

  if (data.slug) {
    const slug = normalizeSlug(data.slug);
    if (!slug) throw new Error("Invalid slug");
    const slugTaken = await mongoDbGetBlogBySlug(slug);
    if (slugTaken && String(slugTaken._id) !== String(id)) {
      throw new Error("Slug already exists");
    }
    patch.slug = slug;
  }

  if (data.status !== undefined) {
    const nextStatus = normalizeStatus(data.status, false);
    patch.status = nextStatus;
    patch.publishedAt = nextStatus === "published" ? existing.publishedAt || new Date() : null;
  }

  const contentForReadTimeText = patch.contentText ?? existing.contentText;
  const contentForReadTimeHtml = patch.contentHtml ?? existing.contentHtml;
  patch.readTime = calculateReadTime(contentForReadTimeText, contentForReadTimeHtml);

  await mongoDbUpdateBlogById(id, patch);
  return await getBlogById(id);
};

export const setBlogPublishedState = async (id, publish) => {
  await getBlogById(id);

  const nextStatus = publish ? "published" : "draft";
  const patch = {
    status: nextStatus,
    publishedAt: publish ? new Date() : null,
  };

  await mongoDbUpdateBlogById(id, patch);
  return await getBlogById(id);
};

export const deleteBlogById = async (id) => {
  await getBlogById(id);
  return await mongoDbDeleteBlogById(id);
};
