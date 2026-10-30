'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import ItemCard from '@/components/ItemCard';
import ItemModal from '@/components/ItemModal';
import BorrowModal from '@/components/BorrowModal';
import CreateItemModal from '@/components/CreateItemModal';
import { fetchItems, deleteItemListing } from '@/lib/database';
import { ItemListing, ItemCategory } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  Search,
  Filter,
  PlusCircle,
  Package,
  RotateCcw,
  Tag,
  CheckCircle2,
  X,
  SlidersHorizontal
} from 'lucide-react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialMode = searchParams.get('mode') || 'All';

  const [items, setItems] = useState<ItemListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [selectedMode, setSelectedMode] = useState(initialMode);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Modals state
  const [selectedItem, setSelectedItem] = useState<ItemListing | null>(null);
  const [borrowTargetItem, setBorrowTargetItem] = useState<ItemListing | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editItemTarget, setEditItemTarget] = useState<ItemListing | null>(null);

  const categories = [
    'All',
    'Textbooks & Notes',
    'Electronics & Calculators',
    'Lab & Science Gear',
    'Tools & Hardware',
    'Dorm & Daily Living',
    'Other',
  ];

  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  const modes = ['All', 'Borrow', 'Exchange', 'Free Giveaway'];

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchItems({
        search: searchTerm,
        category: selectedCategory,
        condition: selectedCondition,
        mode: selectedMode,
        availability: availableOnly ? true : 'All',
      });
      setItems(data);
    } catch (err) {
      console.warn('Failed to load marketplace items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, selectedCondition, selectedMode, availableOnly]);

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteItemListing(itemId, user?.$id);
        setSelectedItem(null);
        loadData();
      } catch (e: any) {
        alert(e?.message || 'Error deleting item');
      }
    }
  };

  const handleEditItem = (item: ItemListing) => {
    setSelectedItem(null);
    setEditItemTarget(item);
    setIsCreateOpen(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedMode('All');
    setAvailableOnly(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Marketplace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#e9e4d9] gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
              Campus Inventory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1b4332] mt-1">
              Campus Marketplace
            </h1>
            <p className="text-sm text-[#525c56] mt-1">
              Discover and borrow textbooks, calculators, equipment, and gear from peers
            </p>
          </div>

          <button
            onClick={() => {
              setEditItemTarget(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-bold shadow-md hover:shadow-lg transition self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-[#95d5b2]" />
            <span>List an Item</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-[#718377] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items by title, description, or campus..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f] shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#e9e4d9] text-sm font-bold text-[#1b4332]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#2d6a4f]" />
              <span>Filter Options</span>
            </button>
          </div>

          {/* Category Chips Carousel/Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedCategory === cat
                    ? 'bg-[#1b4332] text-white border-[#1b4332] shadow-sm'
                    : 'bg-white text-[#525c56] border-[#e9e4d9] hover:bg-[#f7f4ec] hover:text-[#1b4332]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters (Desktop & Mobile Drawer) */}
          <div
            className={`p-4 rounded-2xl bg-white border border-[#e9e4d9] ${
              isMobileFiltersOpen ? 'block' : 'hidden sm:block'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {/* Condition filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#525c56]">Condition:</span>
                  <div className="flex items-center gap-1">
                    {conditions.map((cond) => (
                      <button
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          selectedCondition === cond
                            ? 'bg-[#2d6a4f] text-white'
                            : 'bg-[#f7f4ec] text-[#525c56] hover:bg-[#e9e4d9]'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode filter */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#525c56]">Mode:</span>
                  <div className="flex items-center gap-1">
                    {modes.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMode(m)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          selectedMode === m
                            ? 'bg-[#2d6a4f] text-white'
                            : 'bg-[#f7f4ec] text-[#525c56] hover:bg-[#e9e4d9]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2d6a4f] focus:ring-[#2d6a4f] accent-[#1b4332]"
                  />
                  <span className="font-semibold text-[#1b4332]">Available Now Only</span>
                </label>
              </div>

              {/* Reset filter button */}
              {(searchTerm ||
                selectedCategory !== 'All' ||
                selectedCondition !== 'All' ||
                selectedMode !== 'All' ||
                availableOnly) && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#718377]">
          <span>
            Showing <strong className="text-[#1b4332]">{items.length}</strong> items in campus loop
          </span>
          <span>Verified Student Community</span>
        </div>

        {/* Items Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl bg-neutral-200/60 animate-pulse"
                ></div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard
                  key={item.$id}
                  item={item}
                  onSelect={(it) => setSelectedItem(it)}
                  onRequestBorrow={(it) => setBorrowTargetItem(it)}
                  isOwner={user ? user.$id === item.ownerId : false}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-3xl border border-[#e9e4d9] max-w-lg mx-auto p-8 space-y-4">
              <Package className="w-12 h-12 text-[#718377] mx-auto" />
              <h3 className="text-xl font-bold text-[#1b4332]">No matching items found</h3>
              <p className="text-xs text-[#525c56] leading-relaxed">
                Try adjusting your search keywords, clear category filters, or list the item you are looking for!
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl border border-[#e9e4d9] text-xs font-semibold text-[#1b4332] hover:bg-[#f7f4ec]"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                >
                  List This Item
                </button>
              </div>
            </div>
          )}
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
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Borrow Modal */}
      {borrowTargetItem && (
        <BorrowModal
          item={borrowTargetItem}
          isOpen={!!borrowTargetItem}
          onClose={() => setBorrowTargetItem(null)}
          onSuccess={() => {
            setBorrowTargetItem(null);
            loadData();
          }}
        />
      )}

      {/* Create / Edit Modal */}
      {isCreateOpen && (
        <CreateItemModal
          isOpen={isCreateOpen}
          editItem={editItemTarget}
          onClose={() => {
            setIsCreateOpen(false);
            setEditItemTarget(null);
          }}
          onSuccess={() => {
            setIsCreateOpen(false);
            setEditItemTarget(null);
            loadData();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading Campus Marketplace...</div>}>
      <MarketplaceContent />
    </Suspense>
  );
}

