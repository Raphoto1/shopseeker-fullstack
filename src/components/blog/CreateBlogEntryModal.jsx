"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BlogContentEditor, { htmlToText } from "@/components/blog/BlogContentEditor";
import LinkedDesignSelector from "@/components/blog/LinkedDesignSelector";

const createSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CreateBlogEntryModal({ availableDesigns = [] }) {
  const router = useRouter();
  const modalId = "createBlogEntryModal";
  const [selectedDesignIds, setSelectedDesignIds] = useState([]);
  const [isRichTextMode, setIsRichTextMode] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Design");
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [featured, setFeatured] = useState(false);
  const [showLinkedDesign, setShowLinkedDesign] = useState(false);
  const [plainContent, setPlainContent] = useState("");
  const [richContent, setRichContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDesigns = useMemo(
    () => availableDesigns.filter((design) => selectedDesignIds.includes(String(design?._id))),
    [availableDesigns, selectedDesignIds]
  );

  useEffect(() => {
    setSlug(createSlug(title));
  }, [title]);

  const openModal = () => {
    const modal = document.getElementById(modalId);
    if (modal?.showModal) {
      modal.showModal();
    }
  };

  const resetForm = () => {
    setSelectedDesignIds([]);
    setIsRichTextMode(true);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCategory("Design");
    setCover("");
    setTags("");
    setPublishDate("");
    setFeatured(false);
    setShowLinkedDesign(false);
    setPlainContent("");
    setRichContent("");
  };

  const closeModal = () => {
    const modal = document.getElementById(modalId);
    if (modal?.close) modal.close();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resolvedCover = String(cover || "").trim() || String(selectedDesigns?.[0]?.photo || "").trim();
    const shouldPublish = Boolean(publishDate);

    if (!title.trim() || !excerpt.trim() || !resolvedCover) {
      alert("Title, excerpt and cover are required. If cover is empty, select a design with image.");
      return;
    }

    const contentHtml = isRichTextMode ? richContent : "";
    const contentText = isRichTextMode ? htmlToText(richContent) : plainContent.trim();

    if (!contentText) {
      alert("Content is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("slug", slug || createSlug(title));
      formData.append("excerpt", excerpt.trim());
      formData.append("category", category);
      formData.append("cover", resolvedCover);
      formData.append("contentHtml", contentHtml);
      formData.append("contentText", contentText);
      formData.append("tags", tags);
      formData.append("status", shouldPublish ? "published" : "draft");
      formData.append("featured", String(featured));
      formData.append("showLinkedDesign", String(showLinkedDesign));
      formData.append("linkedDesignIds", JSON.stringify(selectedDesignIds));
      formData.append("linkedDesignId", selectedDesignIds[0] || "");

      if (publishDate) {
        formData.append("publishedAt", new Date(publishDate).toISOString());
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create blog post");
      }

      const createdSlug = data?.payload?.slug;
      resetForm();
      closeModal();

      if (createdSlug) {
        router.push(`/blog/${createdSlug}`);
      } else {
        router.refresh();
      }
    } catch (error) {
      alert(error.message || "Error creating blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button className='btn btn-sm btn-ghost w-full text-xs' onClick={openModal}>
        New Blog Post
      </button>

      <dialog id={modalId} className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box w-full max-w-3xl'>
          <button
            type='button'
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
            onClick={closeModal}
          >
            x
          </button>

          <h3 className='text-2xl font-bold'>Create Blog Entry</h3>
          <p className='py-2 text-sm opacity-75'>
            UI draft only. This modal prepares the structure for publishing flow.
          </p>

          <form onSubmit={handleSubmit} className='grid gap-4 py-3'>
            <div>
              <label className='label' htmlFor='blogTitle'>
                <span className='label-text font-semibold'>Title</span>
              </label>
              <input
                id='blogTitle'
                type='text'
                placeholder='How I built this design pipeline'
                className='input input-bordered w-full'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='label' htmlFor='blogSlug'>
                  <span className='label-text font-semibold'>Slug</span>
                </label>
                <input
                  id='blogSlug'
                  type='text'
                  placeholder='design-pipeline-breakdown'
                  className='input input-bordered w-full'
                  value={slug}
                  onChange={(event) => setSlug(createSlug(event.target.value))}
                />
              </div>

              <div>
                <label className='label' htmlFor='blogCategory'>
                  <span className='label-text font-semibold'>Category</span>
                </label>
                <select id='blogCategory' className='select select-bordered w-full' value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option>Design</option>
                  <option>Development</option>
                  <option>Process</option>
                  <option>Tutorial</option>
                  <option>News</option>
                </select>
              </div>
            </div>

            <div>
              <label className='label' htmlFor='blogExcerpt'>
                <span className='label-text font-semibold'>Excerpt</span>
              </label>
              <textarea
                id='blogExcerpt'
                rows='3'
                className='textarea textarea-bordered w-full'
                placeholder='Short summary for previews and SEO snippets.'
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
              ></textarea>
            </div>

            <div>
              <label className='label' htmlFor='blogCover'>
                <span className='label-text font-semibold'>Cover Image URL</span>
              </label>
              <input
                id='blogCover'
                type='url'
                placeholder='https://...'
                className='input input-bordered w-full'
                value={cover}
                onChange={(event) => setCover(event.target.value)}
              />
            </div>

            <LinkedDesignSelector
              idPrefix='createLinkedDesign'
              availableDesigns={availableDesigns}
              selectedDesignIds={selectedDesignIds}
              setSelectedDesignIds={setSelectedDesignIds}
              showLinkedDesign={showLinkedDesign}
              setShowLinkedDesign={setShowLinkedDesign}
              sectionTitle='Link Available Design'
              sectionBadge='Optional'
              selectLabel='Select One or More Designs'
              showToggleLabel='Show linked design cards in blog layouts'
              emptyDesignMessage='No available designs found.'
            />

            <BlogContentEditor
              idPrefix='createBlogContent'
              isRichTextMode={isRichTextMode}
              setIsRichTextMode={setIsRichTextMode}
              richContent={richContent}
              setRichContent={setRichContent}
              plainContent={plainContent}
              setPlainContent={setPlainContent}
              plainTextRows={9}
            />

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='label' htmlFor='blogTags'>
                  <span className='label-text font-semibold'>Tags</span>
                </label>
                <input
                  id='blogTags'
                  type='text'
                  placeholder='design, redbubble, workflow'
                  className='input input-bordered w-full'
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                />
              </div>

              <div>
                <label className='label' htmlFor='publishDate'>
                  <span className='label-text font-semibold'>Publish Date</span>
                </label>
                <input
                  id='publishDate'
                  type='datetime-local'
                  className='input input-bordered w-full'
                  value={publishDate}
                  onChange={(event) => setPublishDate(event.target.value)}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label cursor-pointer justify-start gap-3'>
                <input
                  type='checkbox'
                  className='checkbox checkbox-primary checkbox-sm'
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                />
                <span className='label-text'>Feature this post on homepage</span>
              </label>
            </div>

            <div className='modal-action'>
              <button className='btn btn-ghost mr-2' type='button' onClick={closeModal}>Cancel</button>
              <button type='submit' className='btn btn-outline' disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : publishDate ? "Publish" : "Save Draft"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
