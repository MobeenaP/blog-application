'use client';

import { useState } from 'react';
import { type Comment } from '@repo/db/client';
import { CommentForm } from './CommentForm';

type CommentWithReplies = Comment & {
  replies?: CommentWithReplies[];
};

interface CommentListProps {
  comments: any[];
  postId: number;
}

export function CommentList({ comments, postId }: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: CommentWithReplies, depth = 0) => {
    return (
      <div
        key={comment.id}
        className={`mt-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}
        data-testid={`comment-${comment.id}`}
      >
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="font-medium text-gray-800" data-testid={`comment-author-${comment.id}`}>{comment.authorName}</div>
            <div className="text-sm text-gray-500 ml-2" data-testid={`comment-date-${comment.id}`}>
              {formatDate(comment.createdAt)}
            </div>
          </div>
          <div className="text-gray-700 whitespace-pre-wrap" data-testid={`comment-content-${comment.id}`}>{comment.content}</div>
          <button
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            data-testid={`reply-button-${comment.id}`}
          >
            {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
          </button>
          
          {replyingTo === comment.id && (
            <div className="mt-4" data-testid={`reply-form-${comment.id}`}>
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onSuccess={() => setReplyingTo(null)}
              />
            </div>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2" data-testid={`comment-replies-${comment.id}`}>
            {comment.replies.map((reply: CommentWithReplies) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <CommentForm postId={postId} />
      <div className="mt-8">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
} 