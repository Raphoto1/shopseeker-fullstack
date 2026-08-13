"use client";

import Link from "next/link";
import UseSWR from "swr";
import { useState } from "react";
import BlogContentEditor, { htmlToText } from "@/components/blog/BlogContentEditor";
import LinkedDesignSelector from "@/components/blog/LinkedDesignSelector";

const createSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const fetcher = async (...args) => {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }
  return res.json();
};

export default function BlogAdminPanel({ ownerId }) {
  const [processingId, setProcessingId] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editCategory, setEditCategory] = useState("Design");
  const [editCover, setEditCover] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editRichContent, setEditRichContent] = useState("");
  const [isEditRichTextMode, setIsEditRichTextMode] = useState(true);
  const [editStatus, setEditStatus] = useState("draft");
  const [editShowLinkedDesign, setEditShowLinkedDesign] = useState(false);
  const [editLinkedDesignIds, setEditLinkedDesignIds] = useState([]);
  const [editErrors, setEditErrors] = useState({});
  const [isSlugTouched, setIsSlugTouched] = useState(false);
  const path = ownerId ? `/api/blog?owner=${ownerId}&limit=50&sortField=createdAt&sortQ=-1` : null;
  const { data, error, isLoading, mutate } = UseSWR(path, fetcher);
  const designsPath = ownerId ? `/api/design?limit=300&sortField=title&sortQ=1&userId=${ownerId}` : null;
  const { data: designsData } = UseSWR(designsPath, fetcher);

  const posts = data?.payload?.docs || [];
  const availableDesigns = designsData?.payload?.docs || [];

  const handleDelete = async (postId) => {
    const confirmation = window.confirm("Delete this post?");
    if (!confirmation) return;

    try {
      setProcessingId(postId);
      const response = await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Error deleting post");
      }
      await mutate();
    } catch (err) {
      alert(err.message || "Error deleting post");
    } finally {
      setProcessingId("");
    }
  };

  const handlePublishToggle = async (post) => {
    try {
      setProcessingId(post._id);
      const formData = new FormData();
      formData.append("action", post.status === "published" ? "unpublish" : "publish");

      const response = await fetch(`/api/blog/${post._id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Error updating post status");
      }

      await mutate();
    } catch (err) {
      alert(err.message || "Error updating post status");
    } finally {
      setProcessingId("");
    }
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setEditTitle(post?.title || "");
    setEditSlug(post?.slug || "");
    setEditExcerpt(post?.excerpt || "");
    setEditCategory(post?.category || "Design");
    setEditCover(post?.cover || "");
    setEditTags(Array.isArray(post?.tags) ? post.tags.join(", ") : String(post?.tags || ""));
    setEditContent(post?.contentText || "");
    setEditRichContent(post?.contentHtml || "");
    setIsEditRichTextMode(Boolean(post?.contentHtml));
    setEditStatus(post?.status === "published" ? "published" : "draft");
    setEditShowLinkedDesign(Boolean(post?.showLinkedDesign));
    setEditLinkedDesignIds(
      Array.isArray(post?.linkedDesignIds)
        ? post.linkedDesignIds
            .map((item) => (typeof item === "object" ? String(item?._id || "") : String(item || "")))
            .filter(Boolean)
        : post?.linkedDesignId
          ? [typeof post.linkedDesignId === "object" ? String(post.linkedDesignId._id || "") : String(post.linkedDesignId)]
          : []
    );
    setEditErrors({});
    setIsSlugTouched(false);
  };

  const closeEdit = () => {
    setEditingPost(null);
    setEditTitle("");
    setEditSlug("");
    setEditExcerpt("");
    setEditCategory("Design");
    setEditCover("");
    setEditTags("");
    setEditContent("");
    setEditRichContent("");
    setIsEditRichTextMode(true);
    setEditStatus("draft");
    setEditShowLinkedDesign(false);
    setEditLinkedDesignIds([]);
    setEditErrors({});
    setIsSlugTouched(false);
  };

  const validateEditForm = () => {
    const nextErrors = {};
    const resolvedText = isEditRichTextMode ? htmlToText(editRichContent) : editContent.trim();

    if (!editTitle.trim()) nextErrors.title = "Title is required";
    if (!editSlug.trim()) nextErrors.slug = "Slug is required";
    if (!editExcerpt.trim()) nextErrors.excerpt = "Excerpt is required";
    if (!editCover.trim()) nextErrors.cover = "Cover image URL is required";
    if (!resolvedText) nextErrors.content = "Content is required";

    setEditErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEditSave = async (event) => {
    event.preventDefault();
    if (!editingPost?._id) return;

    if (!validateEditForm()) {
      return;
    }

    try {
      setProcessingId(editingPost._id);

      const resolvedContentHtml = isEditRichTextMode ? editRichContent : "";
      const resolvedContentText = isEditRichTextMode ? htmlToText(editRichContent) : editContent.trim();

      const formData = new FormData();
      formData.append("title", editTitle.trim());
      formData.append("slug", createSlug(editSlug));
      formData.append("excerpt", editExcerpt.trim());
      formData.append("category", editCategory);
      formData.append("cover", editCover.trim());
      formData.append("tags", editTags);
      formData.append("contentHtml", resolvedContentHtml);
      formData.append("contentText", resolvedContentText);
      formData.append("status", editStatus);
      formData.append("showLinkedDesign", String(editShowLinkedDesign));
      formData.append("linkedDesignIds", JSON.stringify(editLinkedDesignIds));
      formData.append("linkedDesignId", editLinkedDesignIds[0] || "");

      const response = await fetch(`/api/blog/${editingPost._id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Error updating post");
      }

      await mutate();
      closeEdit();
    } catch (err) {
      alert(err.message || "Error updating post");
    } finally {
      setProcessingId("");
    }
  };

  if (!ownerId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-2xl mb-4'>Blog Admin</h2>
          <div className='flex h-28 items-center justify-center'>
            <span className='loading loading-infinity loading-lg' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='card bg-base-100 shadow-xl'>
        <div className='card-body'>
          <h2 className='card-title text-2xl mb-4'>Blog Admin</h2>
          <p className='text-error'>Error loading posts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='card bg-base-100 shadow-xl mt-6'>
      <div className='card-body'>
        <div className='flex items-center justify-between'>
          <h2 className='card-title text-2xl'>Blog Admin</h2>
          <span className='badge badge-outline'>{posts.length} posts</span>
        </div>

        {posts.length === 0 ? (
          <div className='rounded-xl border border-base-300 bg-base-200 p-5 text-sm opacity-80'>
            No blog posts yet. Create your first draft from New Blog Post.
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {posts.map((post) => {
              const isProcessing = processingId === String(post._id);
              const isPublished = post.status === "published";

              return (
                <article key={post._id} className='rounded-2xl border border-base-300 bg-base-200/60 p-4'>
                  <div className='flex items-start justify-between gap-3'>
                    <h3 className='font-bold leading-tight'>{post.title}</h3>
                    <span className={`badge ${isPublished ? "badge-success" : "badge-warning"}`}>
                      {isPublished ? "Published" : "Draft"}
                    </span>
                  </div>

                  <p className='mt-2 line-clamp-3 text-sm opacity-80'>{post.excerpt}</p>

                  <div className='mt-3 flex flex-wrap gap-2 text-xs opacity-75'>
                    <span>{post.category || "Design"}</span>
                    <span>•</span>
                    <span>{post.readTime || "1 min read"}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className='mt-4 flex flex-wrap gap-2'>
                    <button
                      type='button'
                      className='btn btn-xs btn-outline'
                      onClick={() => openEdit(post)}
                      disabled={isProcessing}
                    >
                      Edit
                    </button>

                    <button
                      type='button'
                      className='btn btn-xs btn-outline'
                      onClick={() => handlePublishToggle(post)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Working..." : isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      type='button'
                      className='btn btn-xs btn-error btn-outline'
                      onClick={() => handleDelete(post._id)}
                      disabled={isProcessing}
                    >
                      Delete
                    </button>

                    <Link href={`/blog/${post.slug}`} className='btn btn-xs btn-primary btn-outline'>
                      View
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {editingPost && (
        <dialog className='modal modal-open'>
          <div className='modal-box max-h-[90vh] max-w-4xl overflow-y-auto'>
            <h3 className='text-xl font-bold'>Edit Blog Post</h3>
            <p className='mt-1 text-sm opacity-70'>Update content, cover, and publishing status.</p>

            <form className='mt-5 grid gap-5' onSubmit={handleEditSave}>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='label' htmlFor='editTitle'>
                    <span className='label-text font-semibold'>Title</span>
                  </label>
                  <input
                    id='editTitle'
                    type='text'
                    className='input input-bordered w-full'
                    placeholder='Post title'
                    value={editTitle}
                    onChange={(event) => {
                      const nextTitle = event.target.value;
                      setEditTitle(nextTitle);
                      if (!isSlugTouched) {
                        setEditSlug(createSlug(nextTitle));
                      }
                      if (editErrors.title) {
                        setEditErrors((prev) => ({ ...prev, title: undefined }));
                      }
                    }}
                  />
                  {editErrors.title && <p className='mt-1 text-xs text-error'>{editErrors.title}</p>}
                </div>

                <div>
                  <label className='label' htmlFor='editSlug'>
                    <span className='label-text font-semibold'>Slug</span>
                  </label>
                  <input
                    id='editSlug'
                    type='text'
                    className='input input-bordered w-full'
                    placeholder='post-slug'
                    value={editSlug}
                    onChange={(event) => {
                      setIsSlugTouched(true);
                      setEditSlug(createSlug(event.target.value));
                      if (editErrors.slug) {
                        setEditErrors((prev) => ({ ...prev, slug: undefined }));
                      }
                    }}
                  />
                  <p className='mt-1 text-xs opacity-65'>Used in the URL.</p>
                  {editErrors.slug && <p className='mt-1 text-xs text-error'>{editErrors.slug}</p>}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='label' htmlFor='editCategory'>
                    <span className='label-text font-semibold'>Category</span>
                  </label>
                  <select
                    id='editCategory'
                    className='select select-bordered w-full'
                    value={editCategory}
                    onChange={(event) => setEditCategory(event.target.value)}
                  >
                    <option>Design</option>
                    <option>Development</option>
                    <option>Process</option>
                    <option>Tutorial</option>
                    <option>News</option>
                  </select>
                </div>

                <div>
                  <label className='label' htmlFor='editStatus'>
                    <span className='label-text font-semibold'>Status</span>
                  </label>
                  <select
                    id='editStatus'
                    className='select select-bordered w-full'
                    value={editStatus}
                    onChange={(event) => setEditStatus(event.target.value)}
                  >
                    <option value='draft'>Draft</option>
                    <option value='published'>Published</option>
                  </select>
                </div>
              </div>

              <LinkedDesignSelector
                idPrefix='editLinkedDesign'
                availableDesigns={availableDesigns}
                selectedDesignIds={editLinkedDesignIds}
                setSelectedDesignIds={setEditLinkedDesignIds}
                showLinkedDesign={editShowLinkedDesign}
                setShowLinkedDesign={setEditShowLinkedDesign}
                sectionTitle='Linked Designs'
                sectionBadge='Optional'
                selectLabel='Select One or More Designs'
                showToggleLabel='Show linked design cards in blog layouts'
                emptyDesignMessage='No designs available to link.'
              />

              <div>
                <label className='label' htmlFor='editExcerpt'>
                  <span className='label-text font-semibold'>Excerpt</span>
                </label>
                <textarea
                  id='editExcerpt'
                  rows='3'
                  className='textarea textarea-bordered w-full'
                  placeholder='Short summary of the post'
                  value={editExcerpt}
                  onChange={(event) => {
                    setEditExcerpt(event.target.value);
                    if (editErrors.excerpt) {
                      setEditErrors((prev) => ({ ...prev, excerpt: undefined }));
                    }
                  }}
                />
                {editErrors.excerpt && <p className='mt-1 text-xs text-error'>{editErrors.excerpt}</p>}
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-[1.4fr_0.6fr]'>
                <div>
                  <label className='label' htmlFor='editCover'>
                    <span className='label-text font-semibold'>Cover Image URL</span>
                  </label>
                  <input
                    id='editCover'
                    type='url'
                    className='input input-bordered w-full'
                    placeholder='https://...'
                    value={editCover}
                    onChange={(event) => {
                      setEditCover(event.target.value);
                      if (editErrors.cover) {
                        setEditErrors((prev) => ({ ...prev, cover: undefined }));
                      }
                    }}
                  />
                  {editErrors.cover && <p className='mt-1 text-xs text-error'>{editErrors.cover}</p>}
                </div>

                <div>
                  <p className='label'>
                    <span className='label-text font-semibold'>Preview</span>
                  </p>
                  <div className='h-[90px] overflow-hidden rounded-lg border border-base-300 bg-base-200'>
                    {editCover ? (
                      <img
                        src={editCover}
                        alt='Cover preview'
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full items-center justify-center text-xs opacity-60'>No cover image</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className='label' htmlFor='editTags'>
                  <span className='label-text font-semibold'>Tags</span>
                </label>
                <input
                  id='editTags'
                  type='text'
                  className='input input-bordered w-full'
                  placeholder='design, redbubble, workflow'
                  value={editTags}
                  onChange={(event) => setEditTags(event.target.value)}
                />
              </div>

              <BlogContentEditor
                idPrefix='editBlogContent'
                isRichTextMode={isEditRichTextMode}
                setIsRichTextMode={setIsEditRichTextMode}
                richContent={editRichContent}
                setRichContent={setEditRichContent}
                plainContent={editContent}
                setPlainContent={setEditContent}
                plainTextRows={10}
                errorMessage={editErrors.content}
                onClearError={() => {
                  if (editErrors.content) {
                    setEditErrors((prev) => ({ ...prev, content: undefined }));
                  }
                }}
              />

              <div className='modal-action sticky bottom-0 mt-2 border-t border-base-300 bg-base-100 py-3'>
                <button type='button' className='btn btn-ghost' onClick={closeEdit} disabled={processingId === String(editingPost._id)}>
                  Cancel
                </button>
                <button type='submit' className='btn btn-primary' disabled={processingId === String(editingPost._id)}>
                  {processingId === String(editingPost._id) ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
