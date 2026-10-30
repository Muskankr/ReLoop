'use client';

import React, { useState, useEffect } from 'react';
import { ItemListing, ItemCategory, ItemCondition, ItemMode } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { createItemListing, updateItemListing } from '@/lib/database';
import {
  X,
  PlusCircle,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Sparkles,
  MapPin,
  Tag
} from 'lucide-react';

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: ItemListing) => void;
  editItem?: ItemListing | null;
}

const PRESET_IMAGES = [
  {
    name: 'Graphing Calculator',
    url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics & Calculators' as ItemCategory,
  },
  {
    name: 'Science / Lab Gear',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    category: 'Lab & Science Gear' as ItemCategory,
  },
  {
    name: 'Textbook / Notes',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'Textbooks & Notes' as ItemCategory,
  },
  {
    name: 'Hardware / Robotics',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics & Calculators' as ItemCategory,
  },
  {
    name: 'Drafting / Architecture',
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    category: 'Tools & Hardware' as ItemCategory,
  },
  {
    name: 'Dorm Essentials',
    url: 'https://images.unsplash.com/photo-1594213114663-dd961d6ecfc2?auto=format&fit=crop&w=800&q=80',
    category: 'Dorm & Daily Living' as ItemCategory,
  },
];

export default function CreateItemModal({
  isOpen,
  onClose,
  onSuccess,
  editItem = null,
}: CreateItemModalProps) {
  const { user, userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics & Calculators');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [mode, setMode] = useState<ItemMode>('Borrow');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [location, setLocation] = useState('Campus Library Lobby');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editItem) {
      setTitle(editItem.title);
      setDescription(editItem.description);
      setCategory(editItem.category);
      setCondition(editItem.condition);
      setMode(editItem.mode);
      setImageUrl(editItem.imageUrl);
      setLocation(editItem.location || 'Campus Quad');
    } else {
      setTitle('');
      setDescription('');
      setCategory('Electronics & Calculators');
      setCondition('Like New');
      setMode('Borrow');
      setImageUrl(PRESET_IMAGES[0].url);
      setLocation(userProfile?.campus || 'Engineering Quad');
    }
    setError(null);
  }, [editItem, isOpen, userProfile]);

  if (!isOpen) return null;

  const categories: ItemCategory[] = [
    'Textbooks & Notes',
    'Electronics & Calculators',
    'Lab & Science Gear',
    'Tools & Hardware',
    'Dorm & Daily Living',
    'Other',
  ];

  const conditions: ItemCondition[] = ['New', 'Like New', 'Good', 'Fair'];
  const modes: ItemMode[] = ['Borrow', 'Exchange', 'Free Giveaway'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in or select a demo user before listing an item.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in both a title and description.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (editItem) {
        const updated = await updateItemListing(
          editItem.$id,
          {
            title: title.trim(),
            description: description.trim(),
            category,
            condition,
            mode,
            imageUrl,
            location: location.trim(),
          },
          user.$id
        );
        onSuccess(updated);
      } else {
        const created = await createItemListing(
          {
            title: title.trim(),
            description: description.trim(),
            category,
            condition,
            mode,
            availability: true,
            imageUrl,
            location: location.trim(),
            ownerId: user.$id,
            ownerName: user.name || userProfile?.name || 'Campus Student',
            ownerCampus: userProfile?.campus || 'Engineering Quad',
          },
          user.$id
        );
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving item:', err);
      setError(err?.message || 'Failed to save item to Appwrite TablesDB.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#fdfbf7] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#e9e4d9] relative animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#e9e4d9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#ebfbee] text-[#1b4332] flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-[#2d6a4f]" />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#1b4332]">
                {editItem ? 'Edit Item Listing' : 'List Item on Campus'}
              </h3>
              <p className="text-xs text-[#718377]">
                Share resources, reduce student expenses, prevent waste
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#f0ebd8] text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. TI-84 Plus CE Graphing Calculator (Black with cable)"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]"
            />
          </div>

          {/* Mode & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Exchange Mode *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {modes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border text-center transition ${
                      mode === m
                        ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm'
                        : 'bg-white text-[#525c56] border-[#e9e4d9] hover:bg-[#f7f4ec]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Condition *
              </label>
              <div className="grid grid-cols-4 gap-1">
                {conditions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2 text-[11px] font-bold rounded-xl border text-center transition ${
                      condition === c
                        ? 'bg-[#2d6a4f] text-white border-[#2d6a4f] shadow-sm'
                        : 'bg-white text-[#525c56] border-[#e9e4d9] hover:bg-[#f7f4ec]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Description & Specifications *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, what is included (cables, manuals), which classes it was used for, and any loan terms."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] resize-none"
            ></textarea>
          </div>

          {/* Pickup spot */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Pickup / Handover Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#718377] absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Library 2nd Floor, Engineering Cafe, or Dorm 4"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          {/* Image Presets & Custom URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Item Photo (Select Preset or Enter URL)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setImageUrl(preset.url);
                    setCategory(preset.category);
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    imageUrl === preset.url
                      ? 'border-[#2d6a4f] ring-2 ring-[#52b788]'
                      : 'border-transparent hover:border-[#b7e4c7]'
                  }`}
                  title={preset.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  {imageUrl === preset.url && (
                    <div className="absolute inset-0 bg-[#1b4332]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste an image URL (https://...)"
              className="w-full mt-2 px-4 py-2 rounded-xl bg-white border border-[#e9e4d9] text-xs text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#e9e4d9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#e9e4d9] text-xs font-semibold text-[#525c56] hover:bg-[#f0ebd8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold shadow-md transition disabled:opacity-50"
            >
              {isLoading ? (
                <span>Saving to Appwrite...</span>
              ) : (
                <>
                  <span>{editItem ? 'Update Listing' : 'Publish to Marketplace'}</span>
                  <Sparkles className="w-4 h-4 text-[#95d5b2]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

