'use client';

import React from 'react';
import { ItemListing } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  MapPin,
  ShieldCheck,
  Calendar,
  CheckCircle,
  Tag,
  Share2,
  Trash2,
  Edit3,
  ArrowRight
} from 'lucide-react';

interface ItemModalProps {
  item: ItemListing | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestBorrow: (item: ItemListing) => void;
  onEdit?: (item: ItemListing) => void;
  onDelete?: (itemId: string) => void;
}

export default function ItemModal({
  item,
  isOpen,
  onClose,
  onRequestBorrow,
  onEdit,
  onDelete,
}: ItemModalProps) {
  const { user } = useAuth();

  if (!isOpen || !item) return null;

  const isOwner = user ? user.$id === item.ownerId : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#e9e4d9] relative animate-in fade-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-neutral-600 hover:text-black shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative aspect-video w-full bg-[#f0ebd8]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b4332] text-white uppercase tracking-wider shadow">
              {item.mode}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#1b4332] shadow border border-[#e9e4d9]">
              Condition: {item.condition}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            {item.availability ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                Available Now
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-800 text-neutral-200 shadow">
                Currently In Use
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#2d6a4f] font-semibold mb-2">
              <Tag className="w-4 h-4" />
              <span>{item.category}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#1b4332] leading-tight">
              {item.title}
            </h2>
          </div>

          {/* Owner details card */}
          <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-base uppercase">
                {(item.ownerName || 'S').slice(0, 2)}
              </div>
              <div>
                <p className="text-xs text-[#718377]">Item Listed By</p>
                <p className="font-bold text-sm text-[#1b4332]">{item.ownerName || 'Campus Student'}</p>
                <div className="flex items-center gap-1 text-xs text-[#525c56]">
                  <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>{item.ownerCampus || 'Main Campus'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ebfbee] text-[#1b4332] font-semibold text-xs border border-[#b7e4c7]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                98% Peer Reputation
              </span>
              <span className="text-[11px] text-[#718377] mt-1">Verified Student ID</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#525c56] uppercase tracking-wider">
              Item Description & Terms
            </h4>
            <p className="text-sm text-[#334139] leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Pickup location */}
          {item.location && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f7f4ec] text-xs text-[#334139]">
              <MapPin className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#1b4332]">Suggested Meetup / Pickup Spot:</span>{' '}
                {item.location}
              </div>
            </div>
          )}

          {/* Loan Agreement Notice */}
          <div className="p-4 rounded-2xl bg-[#ebfbee]/60 border border-[#b7e4c7] text-xs text-[#1b4332] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#2d6a4f]" />
              ReLoop Campus Pledge
            </p>
            <p className="text-neutral-600">
              By requesting this item, you agree to treat peer belongings with utmost care, adhere to the agreed return date, and maintain mutual trust.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#f0ebd8] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e9e4d9] text-sm font-semibold text-[#525c56] hover:bg-[#f7f4ec] transition"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {isOwner ? (
                <>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#b7e4c7] bg-[#ebfbee] text-[#1b4332] text-sm font-semibold hover:bg-[#d8f3dc] transition"
                    >
                      <Edit3 className="w-4 h-4 text-[#2d6a4f]" />
                      Edit Listing
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.$id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold hover:bg-rose-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </>
              ) : item.availability ? (
                <button
                  onClick={() => onRequestBorrow(item)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <span>Request to {item.mode === 'Free Giveaway' ? 'Claim' : item.mode}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled
                  className="px-6 py-2.5 rounded-xl bg-neutral-200 text-neutral-400 text-sm font-semibold cursor-not-allowed"
                >
                  Currently Borrowed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

