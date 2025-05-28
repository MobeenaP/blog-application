'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import { RichTextEditor } from "../Editor/RichTextEditor";

interface FormProps {
  post?: {
    title: string;
    description: string;
    content: string;
    imageUrl: string;
    category: string;
    tags: string;
    active?: boolean;
  };
}

export function Form({ post }: FormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [form, setForm] = useState({
        title: post?.title || "",
        description: post?.description || "",
        content: post?.content || "",
        imageUrl: post?.imageUrl || "",
        category: post?.category || "",
        tags: post?.tags || "",
    });

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [showPreview, setShowPreview] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [generalError, setGeneralError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // For cursor restore
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const cursorPosition = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

    useEffect(() => {
        if (post) {
            setForm({
                title: post.title,
                description: post.description,
                content: post.content,
                imageUrl: post.imageUrl,
                category: post.category,
                tags: post.tags,
            });
        }
    }, [post]);

    // Handle form field changes
    const handleFormChange = (field: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Restore cursor position after closing preview
    useEffect(() => {
        if (!showPreview && contentRef.current) {
            const { start, end } = cursorPosition.current;
            contentRef.current.focus();
            contentRef.current.setSelectionRange(start, end);
        }
    }, [showPreview]);

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!form.title.trim()) {
            errors.title = "Title is required";
        }

        if (!form.description.trim()) {
            errors.description = "Description is required";
        } else if (form.description.length > 200) {
            errors.description = "Description is too long. Maximum is 200 characters";
        }

        if (!form.content.trim()) {
            errors.content = "Content is required";
        }

        if (!form.imageUrl.trim()) {
            errors.imageUrl = "Image URL is required";
        } else if (!form.imageUrl.trim().includes("http")) {
            errors.imageUrl = "This is not a valid URL";
        }

        if (!form.tags.trim()) {
            errors.tags = "At least one tag is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setGeneralError(false);
        setIsSubmitting(true);
        if (!validateForm()) {
            setGeneralError(true);
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create post");
            }

            if (!data.success) {
                throw new Error(data.error || "Failed to create post");
            }

            router.push("/");
        } catch (error) {
            console.error("Error creating post:", error);
            setGeneralError(true);
            setFormErrors(prev => ({
                ...prev,
                server: error instanceof Error ? error.message : "An unexpected error occurred"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle preview toggle and save cursor position
    const handlePreviewToggle = () => {
        if (!showPreview && contentRef.current) {
            cursorPosition.current = {
                start: contentRef.current.selectionStart,
                end: contentRef.current.selectionEnd,
            };
        }
        setShowPreview((prev) => !prev);
    };

    return (
        <div className="w-full max-w-full px-4 mx-auto">
            <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md p-5 w-full max-w-3xl mx-auto"
            >
                <h2 className="mb-5 text-gray-800 border-b border-gray-200 pb-3 text-2xl font-semibold">
                    {post?.title ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
            
                <div className="mb-4 w-full">
                    <label htmlFor="title" className="block mb-2 font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={form.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter post title"
                        data-testid="title"
                    />
                    {formErrors.title && <div className="text-red-500 text-sm">{formErrors.title}</div>}
                </div>
                
                <div className="mb-4 w-full">
                    <label htmlFor="content" className="block mb-2 font-medium text-gray-700">Content</label>
                    {!showPreview ? (
                        <RichTextEditor
                            initialValue={form.content}
                            onChange={(content) => handleFormChange('content', content)}
                        />
                    ) : (
                        <div
                            data-test-id="content-preview"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[150px] bg-gray-50"
                        >
                            <ReactMarkdown>{form.content}</ReactMarkdown>
                        </div>
                    )}
                    {formErrors.content && <div className="text-red-500 text-sm">{formErrors.content}</div>}
                </div>

                <div className="mb-4 w-full">
                    <label htmlFor="description" className="block mb-2 font-medium text-gray-700">Description</label>
                    <input
                        id="description"
                        type="text"
                        value={form.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief summary of your post"
                        data-testid="description"
                    />
                    {formErrors.description && <div className="text-red-500 text-sm">{formErrors.description}</div>}
                </div>
                
                <div className="mb-4 w-full">
                    <p className="text-sm text-gray-500 mb-1">Image</p>
                    <input
                        id="imageUrl"
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => {
                            handleFormChange('imageUrl', e.target.value);
                            setImageLoadError(false);
                        }}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                        data-testid="imageUrl"
                    />
                    {formErrors.imageUrl && <div className="text-red-500 text-sm">{formErrors.imageUrl}</div>}
                    {form.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={form.imageUrl}
                            alt="Post image"
                            data-test-id="image-preview"
                            className="mt-2 max-h-48 rounded"
                            onError={() => setImageLoadError(true)}
                        />
                    )}
                    {imageLoadError && (
                        <div className="text-red-500 text-sm">Could not load image preview.</div>
                    )}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="category" className="block mb-2 font-medium text-gray-700">Category</label>
                        <input
                            id="category"
                            type="text"
                            value={form.category}
                            onChange={(e) => handleFormChange('category', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Post category"
                            data-testid="category"
                        />
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="tags" className="block mb-2 font-medium text-gray-700">Tags</label>
                        <input
                            id="tags"
                            type="text"
                            value={form.tags}
                            onChange={(e) => handleFormChange('tags', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Comma-separated tags"
                            data-testid="tags"
                        />
                        {formErrors.tags && <div className="text-red-500 text-sm">{formErrors.tags}</div>}
                    </div>
                </div>

                {(formErrors.server || generalError) && (
                    <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700">
                        {formErrors.server || "Please fix the errors above and try again."}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6 flex-wrap sm:flex-nowrap">
                    <button 
                        type="button"
                        onClick={handlePreviewToggle}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="preview-button"
                    >
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        data-testid="save-button"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}