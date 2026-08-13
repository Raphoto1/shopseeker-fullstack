"use client";

import { useEffect, useRef } from "react";

export const htmlToText = (html) =>
  String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function QuillEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (!containerRef.current || quillRef.current) return;

      const QuillModule = await import("quill");
      const Quill = QuillModule.default;

      if (!isMounted || !containerRef.current) return;

      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      quillRef.current.on("text-change", () => {
        onChange(quillRef.current.root.innerHTML);
      });
    };

    initEditor();

    return () => {
      isMounted = false;
    };
  }, [onChange, value]);

  useEffect(() => {
    if (!quillRef.current) return;
    const current = quillRef.current.root.innerHTML;
    if (value !== current) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return <div ref={containerRef} className='bg-base-100 text-base-content' />;
}

export default function BlogContentEditor({
  idPrefix = "blogContent",
  isRichTextMode,
  setIsRichTextMode,
  richContent,
  setRichContent,
  plainContent,
  setPlainContent,
  plainTextRows = 9,
  errorMessage = "",
  onClearError,
  richModeHelp = "HTML editor enabled.",
  plainModeHelp = "Plain text content used for reading view.",
}) {
  const resolvedText = isRichTextMode ? htmlToText(richContent) : String(plainContent || "").trim();
  const wordCount = resolvedText ? resolvedText.split(/\s+/).length : 0;

  const handleRichContentChange = (nextHtml) => {
    setRichContent(nextHtml);
    if (typeof onClearError === "function") onClearError();
  };

  const handlePlainContentChange = (event) => {
    setPlainContent(event.target.value);
    if (typeof onClearError === "function") onClearError();
  };

  return (
    <div>
      <label className='label' htmlFor={idPrefix}>
        <span className='label-text font-semibold'>Content</span>
      </label>

      <div className='mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-200/40 px-3 py-2'>
        <p className='text-xs font-semibold uppercase tracking-[0.12em] text-base-content/70'>Editor Mode</p>
        <div className='join'>
          <button
            type='button'
            className={`btn btn-xs join-item ${isRichTextMode ? "btn-primary" : "btn-outline"}`}
            onClick={() => setIsRichTextMode(true)}
          >
            Rich Text
          </button>
          <button
            type='button'
            className={`btn btn-xs join-item ${!isRichTextMode ? "btn-primary" : "btn-outline"}`}
            onClick={() => setIsRichTextMode(false)}
          >
            Plain Text
          </button>
        </div>
      </div>

      {isRichTextMode ? (
        <div className='rounded-xl border border-base-300 bg-base-100'>
          <div className='p-2'>
            <QuillEditor value={richContent} onChange={handleRichContentChange} />
          </div>
        </div>
      ) : (
        <textarea
          id={idPrefix}
          rows={plainTextRows}
          className='textarea textarea-bordered w-full'
          placeholder='Write your blog entry content here...'
          value={plainContent}
          onChange={handlePlainContentChange}
        />
      )}

      <div className='mt-1 flex items-center justify-between text-xs opacity-65'>
        <span>{isRichTextMode ? richModeHelp : plainModeHelp}</span>
        <span>{wordCount} words</span>
      </div>

      {errorMessage ? <p className='mt-1 text-xs text-error'>{errorMessage}</p> : null}
    </div>
  );
}
