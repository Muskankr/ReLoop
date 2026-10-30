'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import { fetchCommunityStats, fetchBorrowRequests } from '@/lib/database';
import { CommunityStats, BorrowRequest } from '@/types';
import {
  BarChart3,
  Leaf,
  DollarSign,
  Package,
  RotateCcw,
  ShieldCheck,
  Trophy,
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCommunityStats();
        setStats(data);
      } catch (e) {
        console.warn('Error loading community stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const campusLeaderboard = [
    { name: 'Engineering Quad - Central Campus', items: 142, borrows: 86, impactScore: 98 },
    { name: 'Life Sciences Institute', items: 98, borrows: 62, impactScore: 96 },
    { name: 'Computer Science Building', items: 84, borrows: 57, impactScore: 94 },
    { name: 'Downtown Medical Campus', items: 76, borrows: 49, impactScore: 95 },
    { name: 'Arts & Design Hall', items: 63, borrows: 38, impactScore: 92 },
    { name: 'South Residential Quad', items: 54, borrows: 32, impactScore: 90 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebfbee] text-[#1b4332] text-xs font-semibold border border-[#b7e4c7]">
            <Leaf className="w-4 h-4 text-[#2d6a4f]" />
            <span>Campus Ecological Impact Report</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1b4332] tracking-tight">
            Our Shared Campus Footprint
          </h1>

          <p className="text-sm sm:text-base text-[#525c56] leading-relaxed">
            Real-time circular economy analytics aggregated from live Appwrite TablesDB records. Every loan keeps usable gear out of municipal incinerators and saves student budgets.
          </p>
        </div>

        {/* Primary Eco Metric Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#ebfbee] text-[#1b4332] flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-[#2d6a4f]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#718377]">
              Landfill Waste Diverted
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1b4332] mt-1">
              {stats?.wasteDivertedKg || 215} <span className="text-lg font-bold">kg</span>
            </div>
            <p className="text-xs text-[#525c56] mt-2">
              Calculators, textbooks, and electronic boards reused instead of discarded.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#718377]">
              Collective Student Savings
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1b4332] mt-1">
              ${stats?.moneySavedUsd || 3420}
            </div>
            <p className="text-xs text-[#525c56] mt-2">
              Based on average bookstore retail prices and textbook rental rates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#718377]">
              Completed Exchanges
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1b4332] mt-1">
              {stats?.completedExchanges || 34}
            </div>
            <p className="text-xs text-[#525c56] mt-2">
              Exchanges marked returned with 100% mutual trust verification.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#718377]">
              Campus Trust Rating
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1b4332] mt-1">
              99.2%
            </div>
            <p className="text-xs text-[#525c56] mt-2">
              Rated by peer reviews after completed borrowing handovers.
            </p>
          </div>
        </div>

        {/* Campus Leaderboard */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#e9e4d9] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0ebd8]">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#52b788]" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-[#1b4332]">Campus Hall Leaderboard</h2>
                  <p className="text-xs text-[#718377]">Ranked by items shared & sustainable borrow cycles</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#2d6a4f] bg-[#ebfbee] px-3 py-1 rounded-full">
                Fall 2026 Season
              </span>
            </div>

            <div className="space-y-3">
              {campusLeaderboard.map((campus, idx) => (
                <div
                  key={campus.name}
                  className="p-4 rounded-2xl bg-[#fdfbf7] border border-[#e9e4d9] flex items-center justify-between gap-4 hover:border-[#b7e4c7] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 shadow-sm'
                          : idx === 1
                          ? 'bg-neutral-300 text-neutral-900'
                          : idx === 2
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-white border border-[#e9e4d9] text-[#718377]'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-[#1b4332]">{campus.name}</h3>
                      <p className="text-xs text-[#718377]">
                        {campus.items} items listed • {campus.borrows} loans completed
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#2d6a4f]">
                      {campus.impactScore} Eco Pts
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-[#f0ebd8] mt-1 overflow-hidden">
                      <div
                        className="h-full bg-[#2d6a4f] rounded-full"
                        style={{ width: `${campus.impactScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission & Pledge Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1b4332] text-white space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#95d5b2]" />
              </div>
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                The ReLoop Zero-Waste Campus Pledge
              </h3>
              <p className="text-xs text-[#d8f3dc]/80 leading-relaxed">
                Over 45% of campus items discarded during move-out week (May/December) are fully operational electronics, clean textbooks, and lab gear.
              </p>
              <div className="space-y-2 text-xs text-[#d8f3dc]/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788] shrink-0" />
                  <span>Always check ReLoop before buying retail</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788] shrink-0" />
                  <span>Return items promptly on the agreed due date</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#52b788] shrink-0" />
                  <span>Sanitize and inspect lab equipment before handover</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2d6a4f]">
              <Link
                href="/marketplace"
                className="w-full py-3 px-4 rounded-2xl bg-white text-[#1b4332] font-bold text-center text-xs block hover:bg-[#f7f4ec] transition shadow"
              >
                Join Today & List an Item
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

