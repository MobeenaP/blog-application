"use client";

import { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react";
import { marked } from "marked";
import { useRouter } from "next/navigation";

interface PostFormData {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  urlId?: string;
  active?: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
  general?: string;
}

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit?: (data: PostFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function PostForm({ initialData, onSubmit, isSubmitting = false }: PostFormProps) {
  // Add a loading state
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    tags: "",
    urlId: "",
    active: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const cursorPosition = useRef<{ start: number; end: number }>({ start: 0, end: 0 });
  const router = useRouter();

  // Sync formData with initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        imageUrl: initialData.imageUrl || "",
        tags: initialData.tags || "",
        urlId: initialData.urlId,
        active: typeof initialData.active === "boolean" ? initialData.active : false,
      });
    }
    setLoading(false);
  }, [initialData]);

  // Validation logic
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    console.log("formData:", formData); // Add this
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    else if (formData.description.length > 200) errors.description = "Description is too long. Maximum is 200 characters";
    if (!formData.content.trim()) errors.content = "Content is required";
    if (!formData.imageUrl.trim()) errors.imageUrl = "Image URL is required";
    else if (!formData.imageUrl.trim().includes("http")) errors.imageUrl = "This is not a valid URL";
    if (!formData.tags.trim()) errors.tags = "At least one tag is required";
    console.log("errors:", errors); // Add this
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Input change handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "imageUrl") setImageLoadError(false);
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      if (name === "imageUrl") {
        if (!value.trim()) setFormErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
        else if (!value.trim().includes("http")) return;
        else setFormErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
      } else {
        setFormErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
      }
    }
  };

  const handlePreviewToggle = () => {
    if (!showPreview && contentRef.current) {
      cursorPosition.current = {
        start: contentRef.current.selectionStart,
        end: contentRef.current.selectionEnd,
      };
    }
    setShowPreview((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      setFormErrors((prev) => ({
        ...prev,
        general: "Please fix the errors before saving",
      }));
      return;
    }
    setFormErrors((prev) => ({ ...prev, general: undefined }));

    try {
      let res;
      if (initialData?.urlId) {
        // Edit existing post
        res = await fetch(`/api/post/${initialData.urlId}/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new post
        res = await fetch("/api/posts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      const result = await res.json();
      if (result.success) {
        setSuccessMessage("Post updated successfully");
        setTimeout(() => {
          router.push("/"); // Redirect to homepage after a short delay
        }, 1000); // 1 second delay so user sees the message
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || "Failed to save post",
        }));
      }
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        general: "Failed to save post",
      }));
    }
  };

  const handleToggleActive = async () => {
    try {
      const res = await fetch(`/api/post/${initialData?.urlId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, active: !formData.active }),
      });
      const result = await res.json();
      if (result.success) {
        setFormData((prev) => ({ ...prev, active: !prev.active }));
        router.refresh();
      } else {
        setFormErrors((prev) => ({
          ...prev,
          general: result.error || "Failed to update post status",
        }));
      }
    } catch (err) {
      setFormErrors((prev) => ({
        ...prev,
        general: "Failed to update post status",
      }));
    }
  };

  useEffect(() => {
    if (!showPreview && contentRef.current) {
      const { start, end } = cursorPosition.current;
      contentRef.current.focus();
      contentRef.current.setSelectionRange(start, end);
    }
  }, [showPreview]);

  // Prevent rendering until loading is done
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form className="space-y-6 max-w-3xl mx-auto" onSubmit={handleSubmit}>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
            {successMessage}
          </div>
        )}
        {formErrors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {formErrors.general}
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            placeholder="Post title"
          />
          {formErrors.title && <span className="text-red-500">{formErrors.title}</span>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Short description (max 200 characters)"
          />
          {formErrors.description && <span className="text-red-500">{formErrors.description}</span>}
        </div>

        {/* Content with Preview */}
        <div>
          <label htmlFor="content" className="block mb-2 font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="border rounded-md">
            <div className="flex justify-end bg-gray-50 px-2 py-1 border-b">
              <button
                type="button"
                onClick={handlePreviewToggle}
                className="text-sm text-gray-700 hover:text-blue-600"
              >
                {showPreview ? "Close Preview" : "Preview"}
              </button>
            </div>
            {showPreview ? (
              <div
                className="px-4 py-3 prose max-w-none min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: marked.parse(formData.content) }}
                data-test-id="content-preview"
              />
            ) : (
              <textarea
                id="content"
                name="content"
                ref={contentRef}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full rounded-b-md border-0 focus:ring-blue-500"
                rows={12}
                placeholder="Write your post content here using Markdown..."
              />
            )}
          </div>
          {formErrors.content && <span className="text-red-500">{formErrors.content}</span>}
        </div>

        {/* Image URL and Preview */}
        <div>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
          {formErrors.imageUrl && (
            <span className="text-red-500">{formErrors.imageUrl}</span>
          )}
          {formData.imageUrl && (
            <div style={{ marginTop: "8px" }}>
              <img
                src={formData.imageUrl}
                alt="Post image"
                data-test-id="image-preview"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block mb-2 font-medium text-gray-700">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            placeholder="technology, programming, web development"
          />
          <p className="text-xs text-gray-500">Separate tags with commas</p>
          {formErrors.tags && <span className="text-red-500">{formErrors.tags}</span>}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleToggleActive}
            className={`px-6 py-2 rounded ${formData.active ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 hover:bg-gray-500"} text-white`}
          >
            {formData.active ? "Deactivate" : "Activate"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
