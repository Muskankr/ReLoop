'use client';

import React from 'react';
import { ItemListing } from '@/types';
import { MapPin, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

interface ItemCardProps {
  item: ItemListing;
  onSelect: (item: ItemListing) => void;
  onRequestBorrow?: (item: ItemListing) => void;
  isOwner?: boolean;
}

export default function ItemCard({
  item,
  onSelect,
  onRequestBorrow,
  isOwner = false,
}: ItemCardProps) {
  const modeColors = {
    Borrow: 'bg-[#1b4332] text-white',
    Exchange: 'bg-indigo-600 text-white',
    'Free Giveaway': 'bg-emerald-600 text-white',
  };

  const conditionColors = {
    New: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Like New': 'bg-teal-50 text-teal-800 border-teal-200',
    Good: 'bg-blue-50 text-blue-800 border-blue-200',
    Fair: 'bg-amber-50 text-amber-800 border-amber-200',
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-3xl overflow-hidden border border-[#e9e4d9] hover:border-[#b7e4c7] transition-all duration-300 hover:shadow-xl hover:shadow-[#1b4332]/5 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f0ebd8]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Mode Tag */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
              modeColors[item.mode] || 'bg-[#1b4332] text-white'
            }`}
          >
            {item.mode}
          </span>
        </div>

        {/* Availability indicator */}
        <div className="absolute top-3 right-3 z-10">
          {item.availability ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800/80 text-neutral-200 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              In Use
            </span>
          )}
        </div>

        {/* Condition pill at bottom of image */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border backdrop-blur-md bg-white/95 text-[#1b4332] shadow-sm`}
          >
            {item.condition}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs text-[#525c56] font-medium mb-1.5">
            <Tag className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="truncate">{item.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors line-clamp-1">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#525c56] mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer info: Campus & Owner */}
        <div className="pt-3 border-t border-[#f0ebd8] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-[#718377]">
            <div className="flex items-center gap-1 truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" />
              <span className="truncate">{item.ownerCampus || item.location || 'Campus Quad'}</span>
            </div>
            <div className="flex items-center gap-1 text-[#2d6a4f] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>98% Trust</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#525c56]">
              By <strong className="text-[#1b4332]">{item.ownerName || 'Student'}</strong>
            </span>

            {isOwner ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#ebfbee] text-[#1b4332]">
                Your Listing
              </span>
            ) : item.availability ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRequestBorrow) onRequestBorrow(item);
                  else onSelect(item);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1b4332] group-hover:text-[#2d6a4f] hover:underline"
              >
                <span>Request</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <span className="text-xs font-medium text-neutral-400">
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

