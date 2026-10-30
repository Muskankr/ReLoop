'use client';

import React, { useState } from 'react';
import { BorrowRequest } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { createReview } from '@/lib/database';
import { X, Star, MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  request: BorrowRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  request,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  // The reviewer is current user; the reviewee is the other party
  const isBorrower = user?.$id === request.borrowerId;
  const revieweeId = isBorrower ? request.ownerId : request.borrowerId;
  const revieweeName = isBorrower
    ? request.ownerName || 'Lender'
    : request.borrowerName || 'Borrower';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be signed in to submit a review.');
      return;
    }

    if (!comment.trim()) {
      setError('Please provide feedback on the exchange.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createReview(
        {
          requestId: request.$id,
          itemId: request.itemId,
          itemTitle: request.itemTitle,
          reviewerId: user.$id,
          reviewerName: user.name || 'Campus Peer',
          revieweeId,
          rating,
          comment: comment.trim(),
        },
        user.$id
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#e9e4d9] relative animate-in fade-in zoom-in-95">
        <div className="p-6 bg-white border-b border-[#e9e4d9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#1b4332]">
                Review Peer Exchange
              </h3>
              <p className="text-xs text-[#718377]">Help build campus trust & reputation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0ebd8] text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Item details */}
          <div className="p-3 rounded-xl bg-white border border-[#e9e4d9] text-xs">
            <span className="text-[#718377]">Exchange for:</span>{' '}
            <strong className="text-[#1b4332]">{request.itemTitle}</strong>
            <p className="text-neutral-500 mt-0.5">
              Reviewing: <span className="font-semibold text-[#2d6a4f]">{revieweeName}</span>
            </p>
          </div>

          {/* Star Rating */}
          <div className="text-center space-y-2">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-[#525c56] font-medium">
              {rating === 5 && '🌟 Outstanding & Prompt Peer Exchange'}
              {rating === 4 && '👍 Great experience, returned in good shape'}
              {rating === 3 && '👌 Good exchange, as expected'}
              {rating === 2 && '⚠️ Minor delays or issues'}
              {rating === 1 && '❌ Unsatisfactory exchange'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Feedback Comment *
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share how ${revieweeName} handled the exchange, punctuality, and condition of item...`}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] resize-none"
            ></textarea>
          </div>

          <div className="p-3 rounded-xl bg-[#ebfbee] border border-[#b7e4c7] text-xs text-[#1b4332] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" />
            <span>
              This rating directly influences {revieweeName}&apos;s verified Campus Trust Score.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#e9e4d9] text-xs font-semibold text-[#525c56] hover:bg-[#f0ebd8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

