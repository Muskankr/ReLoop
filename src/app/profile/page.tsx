'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import { useAuth } from '@/context/AuthContext';
import { fetchItems, fetchReviewsForUser, fetchBorrowRequests } from '@/lib/database';
import { ItemListing, Review, BorrowRequest } from '@/types';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import BorrowModal from '@/components/BorrowModal';
import {
  ShieldCheck,
  Star,
  MapPin,
  Mail,
  Calendar,
  Package,
  RotateCcw,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();

  const [items, setItems] = useState<ItemListing[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<ItemListing | null>(null);
  const [borrowTargetItem, setBorrowTargetItem] = useState<ItemListing | null>(null);

  useEffect(() => {
    async function loadProfileData() {
      if (!user) return;
      try {
        setLoading(true);
        const [userItems, userReviews, userRequests] = await Promise.all([
          fetchItems({ ownerId: user.$id }),
          fetchReviewsForUser(user.$id),
          fetchBorrowRequests(user.$id, 'all'),
        ]);
        setItems(userItems);
        setReviews(userReviews);
        setBorrowHistory(userRequests);
      } catch (e) {
        console.warn('Error loading profile data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [user]);

  const completedLoans = borrowHistory.filter((r) => r.status === 'returned').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-[#1b4332] text-white flex items-center justify-center font-black text-3xl uppercase shadow-xl shadow-[#1b4332]/10 border-2 border-[#52b788]">
                {(user?.name || 'S').slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332]">
                    {user?.name || 'Student Member'}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-[#ebfbee] text-[#1b4332] text-xs font-bold border border-[#b7e4c7] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    Verified Student
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#525c56]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    {userProfile?.campus || 'Engineering Quad - Central Campus'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    {user?.email || 'student@campus.edu'}
                  </span>
                  <span className="flex items-center gap-1 text-[#718377]">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation Score Metric */}
            <div className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] flex items-center gap-4 self-stretch sm:self-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#718377]">
                  Campus Trust Score
                </span>
                <div className="text-2xl font-black text-[#1b4332]">
                  {userProfile?.reputation ?? 100}%
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Top 5% Peer Borrower
                </span>
              </div>
            </div>
          </div>

          {/* Badges strip */}
          <div className="mt-8 pt-6 border-t border-[#f0ebd8] flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-[#525c56] uppercase tracking-wider">
              Earned Badges:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ebfbee] text-[#1b4332] text-xs font-semibold border border-[#b7e4c7]">
              <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
              Zero-Waste Pioneer
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold border border-blue-200">
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              Prompt Returner
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-800 text-xs font-semibold border border-purple-200">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              Certified Tech Lender
            </span>
          </div>
        </div>

        {/* Content Tabs / Columns */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Peer Reviews & Ratings */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0ebd8]">
                <h3 className="font-extrabold text-base text-[#1b4332] flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Peer Reviews ({reviews.length})</span>
                </h3>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.$id}
                      className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#1b4332]">
                          {rev.reviewerName}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#525c56] italic leading-relaxed">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      {rev.itemTitle && (
                        <div className="text-[10px] text-[#718377]">
                          Exchange item: {rev.itemTitle}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#718377]">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  No reviews received yet. Reviews are posted once exchanges are marked Returned!
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: Items Listed by this Student */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#1b4332]">
                  Items Listed ({items.length})
                </h2>
                <p className="text-xs text-[#525c56]">
                  Active equipment and gear offered to the campus community
                </p>
              </div>
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {items.map((item) => (
                  <ItemCard
                    key={item.$id}
                    item={item}
                    onSelect={(it) => setSelectedItem(it)}
                    onRequestBorrow={(it) => setBorrowTargetItem(it)}
                    isOwner={true}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#e9e4d9]">
                <Package className="w-12 h-12 text-[#718377] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1b4332]">No active listings</h3>
                <p className="text-xs text-[#525c56] mt-1">
                  You haven&apos;t listed any items for lending yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onRequestBorrow={(it) => {
            setSelectedItem(null);
            setBorrowTargetItem(it);
          }}
        />
      )}

      {/* Borrow Modal */}
      {borrowTargetItem && (
        <BorrowModal
          item={borrowTargetItem}
          isOpen={!!borrowTargetItem}
          onClose={() => setBorrowTargetItem(null)}
          onSuccess={() => setBorrowTargetItem(null)}
        />
      )}

      <Footer />
    </div>
  );
}

