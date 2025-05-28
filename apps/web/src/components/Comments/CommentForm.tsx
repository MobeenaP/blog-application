'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!authorName.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          parentId,
          authorName: authorName.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      // Clear form
      setAuthorName('');
      setContent('');
      
      // Call onSuccess callback if provided
      onSuccess?.();

      // Refresh the page to show new comment
      router.refresh();
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error instanceof Error ? error.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="comment-form">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          maxLength={50}
          placeholder="Your name"
          data-testid="author-name-input"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          rows={3}
          maxLength={1000}
          placeholder="Write your comment here..."
          data-testid="comment-input"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        data-testid="submit-comment"
      >
        {isSubmitting ? 'Posting...' : parentId ? 'Post Reply' : 'Post Comment'}
      </button>
    </form>
  );
} 