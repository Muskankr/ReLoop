'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import BorrowModal from '@/components/BorrowModal';
import CreateItemModal from '@/components/CreateItemModal';
import { fetchItems, fetchCommunityStats } from '@/lib/database';
import { ItemListing, CommunityStats } from '@/types';
import {
  RotateCcw,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  DollarSign,
  Users,
  Package,
  BookOpen,
  Cpu,
  FlaskConical,
  Wrench,
  Coffee,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemListing[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedItem, setSelectedItem] = useState<ItemListing | null>(null);
  const [borrowTargetItem, setBorrowTargetItem] = useState<ItemListing | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [loadedItems, loadedStats] = await Promise.all([
          fetchItems({ availability: true }),
          fetchCommunityStats(),
        ]);
        setItems(loadedItems.slice(0, 6)); // top 6 featured
        setStats(loadedStats);
      } catch (err) {
        console.warn('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/marketplace');
    }
  };

  const categories = [
    { name: 'Textbooks & Notes', icon: BookOpen, count: '320+ items', color: 'bg-emerald-50 text-emerald-800' },
    { name: 'Electronics & Calculators', icon: Cpu, count: '180+ items', color: 'bg-indigo-50 text-indigo-800' },
    { name: 'Lab & Science Gear', icon: FlaskConical, count: '95+ items', color: 'bg-teal-50 text-teal-800' },
    { name: 'Tools & Hardware', icon: Wrench, count: '110+ items', color: 'bg-amber-50 text-amber-800' },
    { name: 'Dorm & Daily Living', icon: Coffee, count: '145+ items', color: 'bg-rose-50 text-rose-800' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-[#52b788] selection:text-[#0d2818]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Subtle eco green background radial glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40">
            <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#52b788]/20 blur-3xl"></div>
            <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-[#b7e4c7]/25 blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebfbee] border border-[#b7e4c7] text-[#1b4332] text-xs font-semibold shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>Campus Circular Economy Marketplace</span>
                <span className="w-1 h-1 rounded-full bg-[#2d6a4f]"></span>
                <span className="text-[#2d6a4f]">Appwrite TablesDB</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#1b4332] leading-[1.1]">
                Borrow More.{' '}
                <span className="text-[#2d6a4f] underline decoration-[#52b788] decoration-wavy decoration-2">
                  Waste Less.
                </span>{' '}
                Build Trust.
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-xl text-[#525c56] leading-relaxed max-w-2xl mx-auto">
                Why buy expensive textbooks, TI-84 calculators, lab coats, and tools for just one semester? Borrow or exchange with verified campus peers and keep usable items out of landfills.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="pt-2 max-w-xl mx-auto flex items-center gap-2 p-2 rounded-2xl bg-white border-2 border-[#e9e4d9] focus-within:border-[#2d6a4f] shadow-lg shadow-[#1b4332]/5 transition-all"
              >
                <Search className="w-5 h-5 text-[#718377] ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search graphing calculators, chemistry kits, textbooks..."
                  className="w-full text-sm text-[#15291e] focus:outline-none placeholder:text-[#718377] bg-transparent"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs sm:text-sm font-bold shrink-0 transition"
                >
                  Find Item
                </button>
              </form>

              {/* Quick links & CTAs */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  <span>Browse Campus Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-[#f7f4ec] text-[#1b4332] text-sm font-bold border-2 border-[#e9e4d9] transition shadow-sm"
                >
                  <Package className="w-4 h-4 text-[#2d6a4f]" />
                  <span>List Your Item</span>
                </button>
              </div>

              {/* Social Proof / Stats Ticker */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
                <div className="p-4 rounded-2xl bg-white border border-[#e9e4d9]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#718377]">
                    <Package className="w-4 h-4 text-[#2d6a4f]" />
                    <span>Items Listed</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1b4332] mt-1">
                    {stats?.totalItems || 10}+
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#e9e4d9]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#718377]">
                    <Leaf className="w-4 h-4 text-[#52b788]" />
                    <span>Waste Diverted</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1b4332] mt-1">
                    {stats?.wasteDivertedKg || 215} kg
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#e9e4d9]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#718377]">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Student Savings</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1b4332] mt-1">
                    ${stats?.moneySavedUsd || 3420}+
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#e9e4d9]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#718377]">
                    <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
                    <span>Peer Trust</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1b4332] mt-1">
                    99.4%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY QUICK BROWSE */}
        <section className="py-12 bg-white border-y border-[#e9e4d9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
                  Campus Categories
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b4332] mt-1">
                  What Are Students Sharing?
                </h2>
              </div>
              <Link
                href="/marketplace"
                className="text-sm font-bold text-[#1b4332] hover:text-[#2d6a4f] inline-flex items-center gap-1"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                    className="p-5 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] hover:border-[#b7e4c7] hover:bg-white transition-all duration-300 group hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#ebfbee] text-[#1b4332] flex items-center justify-center mb-3 group-hover:bg-[#1b4332] group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-[#718377] mt-0.5">{cat.count}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED ITEMS SECTION */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebfbee] text-[#1b4332] text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Available on Campus Right Now</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#1b4332]">
                  Featured Campus Listings
                </h2>
                <p className="text-sm text-[#525c56] mt-1">
                  Verified items from fellow students ready for pick-up this week
                </p>
              </div>

              <Link
                href="/marketplace"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-[#e9e4d9] bg-white text-sm font-bold text-[#1b4332] hover:bg-[#f7f4ec] transition"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-96 rounded-3xl bg-neutral-200/60 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard
                    key={item.$id}
                    item={item}
                    onSelect={(it) => setSelectedItem(it)}
                    onRequestBorrow={(it) => setBorrowTargetItem(it)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#e9e4d9]">
                <Package className="w-12 h-12 text-[#718377] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-[#1b4332]">No listings available yet</h3>
                <p className="text-xs text-[#525c56] mt-1">
                  Be the first to list an item for your campus peers!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-[#1b4332] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#95d5b2]">
                Campus Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                How ReLoop Works
              </h2>
              <p className="text-sm text-[#d8f3dc]/80">
                A simple four-step trust cycle that replaces consumer waste with mutual student community support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-[#0d2818]/60 border border-[#2d6a4f] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#52b788] text-[#0d2818] flex items-center justify-center font-black text-xl">
                  1
                </div>
                <h3 className="font-bold text-lg text-white">Discover & Search</h3>
                <p className="text-xs text-[#d8f3dc]/70 leading-relaxed">
                  Look up equipment or books needed for exams, labs, or dorm life. Filter by campus hall, condition, and availability.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-[#0d2818]/60 border border-[#2d6a4f] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#52b788] text-[#0d2818] flex items-center justify-center font-black text-xl">
                  2
                </div>
                <h3 className="font-bold text-lg text-white">Send Borrow Request</h3>
                <p className="text-xs text-[#d8f3dc]/70 leading-relaxed">
                  Select your proposed return date and message the owner. The request is securely stored in Appwrite TablesDB as Pending.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-[#0d2818]/60 border border-[#2d6a4f] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#52b788] text-[#0d2818] flex items-center justify-center font-black text-xl">
                  3
                </div>
                <h3 className="font-bold text-lg text-white">Approve & Handover</h3>
                <p className="text-xs text-[#d8f3dc]/70 leading-relaxed">
                  Owner approves the request and meets on campus (Library, Student Union). Status updates from Approved to Borrowed.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-3xl bg-[#0d2818]/60 border border-[#2d6a4f] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#52b788] text-[#0d2818] flex items-center justify-center font-black text-xl">
                  4
                </div>
                <h3 className="font-bold text-lg text-white">Return & Build Trust</h3>
                <p className="text-xs text-[#d8f3dc]/70 leading-relaxed">
                  Return on the due date and leave a 5-star review. Your campus reputation score grows, opening more peer lending perks!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* APPWRITE TABLESDB ARCHITECTURE SPOTLIGHT */}
        <section className="py-20 bg-[#f7f4ec] border-b border-[#e9e4d9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1b4332] text-white text-xs font-semibold">
                  <Database className="w-3.5 h-3.5 text-[#52b788]" />
                  <span>Appwrite Cloud Architecture</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b4332] leading-tight">
                  Engineered with Appwrite TablesDB & Row-Level Security
                </h2>
                <p className="text-sm text-[#525c56] leading-relaxed">
                  Every interaction in ReLoop is powered directly by Appwrite Cloud Databases. Four relational tables govern peer exchanges with strict document-level security:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#e9e4d9]">
                    <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm text-[#1b4332]">Strict Owner Permissions:</strong>
                      <p className="text-xs text-[#525c56]">Only the verified item owner can edit their listings, approve requests, or confirm return handovers.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#e9e4d9]">
                    <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm text-[#1b4332]">State Lifecycle Tracking:</strong>
                      <p className="text-xs text-[#525c56]">The borrow lifecycle transitions from <code>pending</code> → <code>approved</code> → <code>borrowed</code> → <code>returned</code>, automatically toggling item availability.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#e9e4d9]">
                    <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-sm text-[#1b4332]">Verifiable Peer Reviews:</strong>
                      <p className="text-xs text-[#525c56]">Reviews are only permitted for confirmed returned exchanges, preventing fake reputation inflation.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schema Visualization Card */}
              <div className="p-6 rounded-3xl bg-neutral-900 text-neutral-200 border border-neutral-800 shadow-2xl font-mono text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-neutral-300 font-bold ml-2">Appwrite TablesDB: reloop_db</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">Connected</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-emerald-400 font-bold">TABLE 1: users</span>
                    <div className="text-[11px] text-neutral-400 pl-3">
                      userId (string), name (string), email (string), campus (string), reputation (int)
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold">TABLE 2: items</span>
                    <div className="text-[11px] text-neutral-400 pl-3">
                      ownerId, title, description, category, condition, mode, availability (bool), imageUrl
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold">TABLE 3: borrow_requests</span>
                    <div className="text-[11px] text-neutral-400 pl-3">
                      itemId, ownerId, borrowerId, status [pending | approved | borrowed | returned], dueDate
                    </div>
                  </div>

                  <div>
                    <span className="text-emerald-400 font-bold">TABLE 4: reviews</span>
                    <div className="text-[11px] text-neutral-400 pl-3">
                      requestId, reviewerId, revieweeId, rating (1-5), comment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-[#1b4332]">
              Ready to Join the Campus Loop?
            </h2>
            <p className="text-base text-[#525c56] max-w-xl mx-auto">
              Start lending your idle equipment, save hundreds on textbooks, and build trusted connections across campus.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="px-8 py-3.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-base shadow-lg transition"
              >
                Create Student Account
              </Link>
              <Link
                href="/marketplace"
                className="px-8 py-3.5 rounded-2xl bg-white hover:bg-[#f7f4ec] text-[#1b4332] font-bold text-base border-2 border-[#e9e4d9] transition"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Item Details Modal */}
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

      {/* Borrow Request Modal */}
      {borrowTargetItem && (
        <BorrowModal
          item={borrowTargetItem}
          isOpen={!!borrowTargetItem}
          onClose={() => setBorrowTargetItem(null)}
          onSuccess={() => {
            setBorrowTargetItem(null);
          }}
        />
      )}

      {/* Create Listing Modal */}
      {isCreateOpen && (
        <CreateItemModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(newItem) => {
            setItems((prev) => [newItem, ...prev]);
            setIsCreateOpen(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
}
