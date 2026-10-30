'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import CreateItemModal from '@/components/CreateItemModal';
import ReviewModal from '@/components/ReviewModal';
import { useAuth } from '@/context/AuthContext';
import {
  fetchItems,
  fetchBorrowRequests,
  updateBorrowRequestStatus,
  deleteItemListing,
} from '@/lib/database';
import { ItemListing, BorrowRequest, RequestStatus } from '@/types';
import {
  LayoutDashboard,
  Inbox,
  Send,
  Package,
  PlusCircle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Edit3,
  Trash2,
  Star,
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'incoming' | 'my-borrows' | 'my-listings'>('overview');
  const [myItems, setMyItems] = useState<ItemListing[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<BorrowRequest[]>([]);
  const [myBorrows, setMyBorrows] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemListing | null>(null);
  const [reviewRequest, setReviewRequest] = useState<BorrowRequest | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [items, incoming, outgoing] = await Promise.all([
        fetchItems({ ownerId: user.$id }),
        fetchBorrowRequests(user.$id, 'incoming'),
        fetchBorrowRequests(user.$id, 'outgoing'),
      ]);
      setMyItems(items);
      setIncomingRequests(incoming);
      setMyBorrows(outgoing);
    } catch (err) {
      console.warn('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Request status transitions
  const handleStatusChange = async (requestId: string, newStatus: RequestStatus, itemId?: string) => {
    if (!user) return;
    setActionLoading(requestId);
    try {
      await updateBorrowRequestStatus(requestId, newStatus, user.$id, itemId);
      await loadDashboardData();
    } catch (err: any) {
      alert(err?.message || 'Error updating request status');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete item listing
  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this listing from campus?')) {
      try {
        await deleteItemListing(itemId, user.$id);
        await loadDashboardData();
      } catch (err: any) {
        alert(err?.message || 'Error deleting item');
      }
    }
  };

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;
  const activeBorrowedCount = myBorrows.filter((r) => r.status === 'borrowed' || r.status === 'approved').length;
  const completedCount = incomingRequests.filter((r) => r.status === 'returned').length +
                         myBorrows.filter((r) => r.status === 'returned').length;

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            Pending Approval
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle className="w-3 h-3 text-blue-600" />
            Approved – Ready to Meet
          </span>
        );
      case 'borrowed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Package className="w-3 h-3 text-emerald-600" />
            Currently In Use
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#ebfbee] text-[#1b4332] border border-[#b7e4c7]">
            <CheckCircle className="w-3 h-3 text-[#2d6a4f]" />
            Returned & Complete
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-200 text-neutral-700">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* User Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e9e4d9] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center font-extrabold text-2xl uppercase shadow-md shadow-[#1b4332]/10">
              {(user?.name || 'S').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#1b4332]">
                  {user?.name || 'Student Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ebfbee] text-[#1b4332] text-xs font-bold border border-[#b7e4c7] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#2d6a4f]" />
                  {userProfile?.reputation ?? 100}% Trust
                </span>
              </div>
              <p className="text-xs text-[#525c56] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>{userProfile?.campus || 'Engineering Quad - Central Campus'}</span>
                <span>•</span>
                <span>{user?.email || 'student@campus.edu'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setEditingItem(null);
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition"
            >
              <PlusCircle className="w-4 h-4 text-[#95d5b2]" />
              <span>List New Item</span>
            </button>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#f7f4ec] hover:bg-[#e9e4d9] text-[#1b4332] text-xs sm:text-sm font-bold border border-[#e9e4d9] transition"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="mt-8 flex items-center gap-2 border-b border-[#e9e4d9] overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-[#718377] hover:text-[#1b4332]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Activity Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition whitespace-nowrap relative ${
              activeTab === 'incoming'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-[#718377] hover:text-[#1b4332]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Incoming Requests</span>
            {pendingIncomingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                {pendingIncomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-borrows')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'my-borrows'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-[#718377] hover:text-[#1b4332]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>My Borrow Requests</span>
            {activeBorrowedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#2d6a4f] text-white text-[11px] font-bold">
                {activeBorrowedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('my-listings')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'my-listings'
                ? 'border-[#1b4332] text-[#1b4332]'
                : 'border-transparent text-[#718377] hover:text-[#1b4332]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listed Items ({myItems.length})</span>
          </button>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#e9e4d9]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#718377]">
                  <span>Items Listed By You</span>
                  <Package className="w-4 h-4 text-[#2d6a4f]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1b4332] mt-2">
                  {myItems.length}
                </div>
                <p className="text-[11px] text-[#525c56] mt-1">
                  Active campus catalog items
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e9e4d9]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#718377]">
                  <span>Pending Requests</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-extrabold text-[#1b4332] mt-2">
                  {pendingIncomingCount}
                </div>
                <p className="text-[11px] text-[#525c56] mt-1">
                  Students waiting for your approval
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e9e4d9]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#718377]">
                  <span>Active Borrows</span>
                  <Send className="w-4 h-4 text-[#2d6a4f]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1b4332] mt-2">
                  {activeBorrowedCount}
                </div>
                <p className="text-[11px] text-[#525c56] mt-1">
                  Items currently in your possession
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e9e4d9]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#718377]">
                  <span>Completed Exchanges</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#1b4332] mt-2">
                  {completedCount}
                </div>
                <p className="text-[11px] text-[#525c56] mt-1">
                  Safely returned to peer
                </p>
              </div>
            </div>

            {/* Quick sections: Pending Approvals & Active Borrows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Needs Your Approval */}
              <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#1b4332] flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-[#2d6a4f]" />
                    <span>Requests Needing Approval</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('incoming')}
                    className="text-xs font-bold text-[#2d6a4f] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {incomingRequests.filter((r) => r.status === 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {incomingRequests
                      .filter((r) => r.status === 'pending')
                      .slice(0, 3)
                      .map((req) => (
                        <div
                          key={req.$id}
                          className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-sm text-[#1b4332] block">
                              {req.itemTitle}
                            </span>
                            <span className="text-xs text-[#525c56]">
                              Requested by <strong>{req.borrowerName}</strong> ({req.borrowerCampus})
                            </span>
                            {req.message && (
                              <p className="text-xs text-[#718377] italic mt-1 bg-white p-2 rounded-lg border border-[#f0ebd8]">
                                &ldquo;{req.message}&rdquo;
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleStatusChange(req.$id, 'approved', req.itemId)}
                              className="px-3 py-1.5 rounded-xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(req.$id, 'rejected', req.itemId)}
                              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#e9e4d9]">
                    <CheckCircle className="w-8 h-8 text-[#52b788] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1b4332]">All caught up!</p>
                    <p className="text-xs text-[#718377] mt-0.5">No pending borrower requests right now.</p>
                  </div>
                )}
              </div>

              {/* Active Items You Borrowed */}
              <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#1b4332] flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#2d6a4f]" />
                    <span>Items You Are Borrowing</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('my-borrows')}
                    className="text-xs font-bold text-[#2d6a4f] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {myBorrows.filter((r) => r.status === 'borrowed' || r.status === 'approved').length > 0 ? (
                  <div className="space-y-3">
                    {myBorrows
                      .filter((r) => r.status === 'borrowed' || r.status === 'approved')
                      .slice(0, 3)
                      .map((req) => (
                        <div
                          key={req.$id}
                          className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] flex items-center justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-sm text-[#1b4332] block">
                              {req.itemTitle}
                            </span>
                            <span className="text-xs text-[#525c56]">
                              Owner: <strong>{req.ownerName}</strong>
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-[#2d6a4f] font-semibold mt-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Due: {new Date(req.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div>{getStatusBadge(req.status)}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#fdfbf7] rounded-2xl border border-dashed border-[#e9e4d9]">
                    <Package className="w-8 h-8 text-[#718377] mx-auto mb-2" />
                    <p className="text-xs font-semibold text-[#1b4332]">No active borrows</p>
                    <p className="text-xs text-[#718377] mt-0.5">Need a textbook or tool? Explore the marketplace!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: INCOMING REQUESTS (Items others want to borrow from you) */}
        {activeTab === 'incoming' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#1b4332]">Incoming Borrow Requests</h2>
                <p className="text-xs text-[#525c56]">
                  Review and manage students asking to borrow your listed items
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-neutral-200/60 animate-pulse"></div>
                ))}
              </div>
            ) : incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.$id}
                    className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={req.itemImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                        alt={req.itemTitle}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#f0ebd8]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#1b4332]">{req.itemTitle}</h3>
                          {getStatusBadge(req.status)}
                        </div>

                        <p className="text-xs text-[#525c56]">
                          Borrower: <strong className="text-[#1b4332]">{req.borrowerName}</strong> ({req.borrowerCampus || 'Main Campus'})
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#718377] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#2d6a4f]" />
                            Requested: {new Date(req.requestDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-[#1b4332] font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#2d6a4f]" />
                            Target Return: {new Date(req.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        {req.message && (
                          <div className="mt-2 text-xs text-[#334139] bg-[#fdfbf7] p-3 rounded-xl border border-[#f0ebd8]">
                            <span className="font-semibold text-[#1b4332]">Note from borrower:</span> &ldquo;{req.message}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Owner Action Buttons depending on status */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      {req.status === 'pending' && (
                        <>
                          <button
                            disabled={actionLoading === req.$id}
                            onClick={() => handleStatusChange(req.$id, 'approved', req.itemId)}
                            className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-sm transition"
                          >
                            Approve Request
                          </button>
                          <button
                            disabled={actionLoading === req.$id}
                            onClick={() => handleStatusChange(req.$id, 'rejected', req.itemId)}
                            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {req.status === 'approved' && (
                        <button
                          disabled={actionLoading === req.$id}
                          onClick={() => handleStatusChange(req.$id, 'borrowed', req.itemId)}
                          className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Confirm Handover (Mark Borrowed)</span>
                        </button>
                      )}

                      {req.status === 'borrowed' && (
                        <button
                          disabled={actionLoading === req.$id}
                          onClick={() => handleStatusChange(req.$id, 'returned', req.itemId)}
                          className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#52b788]" />
                          <span>Confirm Item Returned</span>
                        </button>
                      )}

                      {req.status === 'returned' && (
                        <button
                          onClick={() => setReviewRequest(req)}
                          className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Review Borrower</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#e9e4d9]">
                <Inbox className="w-12 h-12 text-[#718377] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1b4332]">No incoming requests yet</h3>
                <p className="text-xs text-[#525c56] mt-1">
                  When students want to borrow items you listed, their requests will appear here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MY BORROW REQUESTS (Items you requested or borrowed) */}
        {activeTab === 'my-borrows' && (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#1b4332]">My Borrowing Activity</h2>
              <p className="text-xs text-[#525c56]">
                Track item requests you have submitted to fellow students
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-neutral-200/60 animate-pulse"></div>
                ))}
              </div>
            ) : myBorrows.length > 0 ? (
              <div className="space-y-4">
                {myBorrows.map((req) => (
                  <div
                    key={req.$id}
                    className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={req.itemImageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                        alt={req.itemTitle}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#f0ebd8]"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-[#1b4332]">{req.itemTitle}</h3>
                          {getStatusBadge(req.status)}
                        </div>

                        <p className="text-xs text-[#525c56]">
                          Lender: <strong className="text-[#1b4332]">{req.ownerName}</strong>
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#718377] pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#2d6a4f]" />
                            Requested: {new Date(req.requestDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-[#1b4332] font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#2d6a4f]" />
                            Due Date: {new Date(req.dueDate).toLocaleDateString()}
                          </span>
                        </div>

                        {req.message && (
                          <div className="mt-2 text-xs text-[#525c56] italic">
                            Your message: &ldquo;{req.message}&rdquo;
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {req.status === 'returned' && (
                        <button
                          onClick={() => setReviewRequest(req)}
                          className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Review Lender</span>
                        </button>
                      )}

                      {req.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(req.$id, 'cancelled', req.itemId)}
                          className="px-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#e9e4d9]">
                <Send className="w-12 h-12 text-[#718377] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1b4332]">No borrow requests yet</h3>
                <p className="text-xs text-[#525c56] mt-1">
                  When you request to borrow books or gear from classmates, you can track their status here.
                </p>
                <div className="mt-4">
                  <Link
                    href="/marketplace"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                  >
                    Browse Items
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: MY LISTED ITEMS */}
        {activeTab === 'my-listings' && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#1b4332]">Your Listed Items</h2>
                <p className="text-xs text-[#525c56]">
                  Manage equipment and textbooks you are currently sharing with campus
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreateOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-[#95d5b2]" />
                <span>Add Item</span>
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 rounded-2xl bg-neutral-200/60 animate-pulse"></div>
                ))}
              </div>
            ) : myItems.length > 0 ? (
              <div className="space-y-4">
                {myItems.map((item) => (
                  <div
                    key={item.$id}
                    className="p-5 rounded-3xl bg-white border border-[#e9e4d9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#f0ebd8]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#ebfbee] text-[#1b4332]">
                            {item.mode}
                          </span>
                          <span className="text-xs text-[#718377] font-medium">{item.category}</span>
                        </div>
                        <h3 className="font-bold text-base text-[#1b4332] mt-0.5">{item.title}</h3>
                        <p className="text-xs text-[#525c56] line-clamp-1 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        {item.availability ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600">
                            Borrowed
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsCreateOpen(true);
                        }}
                        className="p-2 rounded-xl border border-[#e9e4d9] hover:bg-[#f7f4ec] text-[#1b4332]"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.$id)}
                        className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#e9e4d9]">
                <Package className="w-12 h-12 text-[#718377] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#1b4332]">You haven&apos;t listed any items</h3>
                <p className="text-xs text-[#525c56] mt-1">
                  Have a calculator, textbook, or tool sitting in your dorm? Share it with campus!
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setIsCreateOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#1b4332] text-white text-xs font-bold hover:bg-[#2d6a4f]"
                  >
                    <PlusCircle className="w-4 h-4 text-[#95d5b2]" />
                    <span>Create Your First Listing</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create / Edit Item Modal */}
      {isCreateOpen && (
        <CreateItemModal
          isOpen={isCreateOpen}
          editItem={editingItem}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setIsCreateOpen(false);
            setEditingItem(null);
            loadDashboardData();
          }}
        />
      )}

      {/* Review Modal */}
      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          isOpen={!!reviewRequest}
          onClose={() => setReviewRequest(null)}
          onSuccess={() => {
            setReviewRequest(null);
            loadDashboardData();
          }}
        />
      )}

      <Footer />
    </div>
  );
}

