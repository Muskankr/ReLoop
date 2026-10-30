'use client';

import React, { useState } from 'react';
import { ItemListing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { createBorrowRequest } from '@/lib/database';
import {
  X,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface BorrowModalProps {
  item: ItemListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BorrowModal({
  item,
  isOpen,
  onClose,
  onSuccess,
}: BorrowModalProps) {
  const { user, userProfile } = useAuth();

  // Default due date: 7 days ahead
  const defaultDueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [dueDate, setDueDate] = useState<string>(defaultDueDate);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to request an item.');
      return;
    }

    if (user.$id === item.ownerId) {
      setError('You cannot request your own listed item.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createBorrowRequest(
        {
          itemId: item.$id,
          itemTitle: item.title,
          itemCategory: item.category,
          itemImageUrl: item.imageUrl,
          ownerId: item.ownerId,
          ownerName: item.ownerName || 'Student',
          borrowerId: user.$id,
          borrowerName: user.name || userProfile?.name || 'Borrower',
          borrowerCampus: userProfile?.campus || 'Engineering Quad',
          status: 'pending',
          requestDate: new Date().toISOString(),
          dueDate: new Date(dueDate).toISOString(),
          message: message.trim(),
        },
        user.$id
      );

      setSubmitted(true);
      onSuccess();
    } catch (err: any) {
      console.error('Error creating borrow request:', err);
      setError(err?.message || 'Failed to submit borrow request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#e9e4d9] relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#e9e4d9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#ebfbee] text-[#1b4332] flex items-center justify-center">
              <Send className="w-4 h-4 text-[#2d6a4f]" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#1b4332]">
                Request to {item.mode === 'Free Giveaway' ? 'Claim' : item.mode}
              </h3>
              <p className="text-xs text-[#718377]">Direct peer-to-peer campus exchange</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0ebd8] text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#ebfbee] text-[#2d6a4f] flex items-center justify-center mx-auto border border-[#b7e4c7]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#1b4332]">Request Sent to {item.ownerName}!</h4>
            <p className="text-sm text-[#525c56] max-w-sm mx-auto leading-relaxed">
              Your borrow request has been recorded in the database with status <span className="font-bold text-[#1b4332]">Pending</span>. You will see it update in real-time when {item.ownerName} approves it.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/dashboard"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1b4332] text-white text-sm font-semibold hover:bg-[#2d6a4f] transition"
              >
                <span>Track in Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-[#e9e4d9] text-sm font-semibold text-[#525c56] hover:bg-[#f0ebd8]"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Item Mini Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#e9e4d9] flex items-center gap-3.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#f0ebd8]"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] bg-[#ebfbee] px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <h4 className="font-bold text-sm text-[#1b4332] truncate mt-0.5">
                  {item.title}
                </h4>
                <p className="text-xs text-[#718377] truncate">
                  Owner: {item.ownerName} ({item.ownerCampus || 'Campus'})
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Proposed Return Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Proposed Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]"
                />
              </div>
              <p className="text-[11px] text-[#718377]">
                When do you anticipate returning this item to {item.ownerName}?
              </p>
            </div>

            {/* Message to Owner */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Note to Lender
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Hi Alex! I have my physics midterm exam next Wednesday and would take great care of your calculator. Can meet at the campus library!"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] resize-none"
              ></textarea>
            </div>

            {/* Trust badge */}
            <div className="p-3 rounded-xl bg-[#ebfbee] border border-[#b7e4c7] text-xs text-[#1b4332] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" />
              <span>
                Your request includes your verified Campus ID and current trust score ({userProfile?.reputation ?? 98}%).
              </span>
            </div>

            {/* Actions */}
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
                {isLoading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

