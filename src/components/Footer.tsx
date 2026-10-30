import React from 'react';
import Link from 'next/link';
import { RotateCcw, Heart, Shield, Sparkles, Leaf, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1b4332] text-white pt-16 pb-12 border-t border-[#2d6a4f] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2d6a4f]">
          {/* Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-[#1b4332] flex items-center justify-center font-bold">
                <RotateCcw className="w-5 h-5 text-[#2d6a4f]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                ReLoop
              </span>
            </Link>
            <p className="text-sm text-[#d8f3dc]/80 leading-relaxed">
              The student-powered circular economy. Borrow textbooks, lab gear, calculators, and tools from peers instead of buying new.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#95d5b2]">
              <Leaf className="w-4 h-4 text-[#52b788]" />
              <span>Campus Sustainability Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#95d5b2]">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-[#d8f3dc]/70">
              <li>
                <Link href="/marketplace?category=Textbooks+%26+Notes" className="hover:text-white transition">
                  Textbooks & Notes
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Electronics+%26+Calculators" className="hover:text-white transition">
                  Calculators & Tech
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Lab+%26+Science+Gear" className="hover:text-white transition">
                  Lab & Medical Equipment
                </Link>
              </li>
              <li>
                <Link href="/marketplace?category=Tools+%26+Hardware" className="hover:text-white transition">
                  Hardware & Drafting Tools
                </Link>
              </li>
              <li>
                <Link href="/marketplace?mode=Free+Giveaway" className="hover:text-white transition">
                  Free Student Giveaways
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Trust & Platform */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#95d5b2]">
              Campus Community
            </h4>
            <ul className="space-y-2 text-sm text-[#d8f3dc]/70">
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Borrower & Lender Dashboard
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition">
                  Live Ecological Impact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition">
                  Reputation & Reviews
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition">
                  Verified Campus Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Appwrite Databases Hackathon Card */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#95d5b2]">
              Technology & Backing
            </h4>
            <div className="p-4 rounded-2xl bg-[#0d2818]/70 border border-[#2d6a4f] space-y-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Database className="w-4 h-4 text-[#52b788]" />
                <span>Appwrite TablesDB</span>
              </div>
              <p className="text-xs text-[#d8f3dc]/70 leading-relaxed">
                Powered by Appwrite Cloud TablesDB for real-time document CRUD, row-level security permissions, and authenticated campus sessions.
              </p>
              <div className="pt-2 border-t border-[#2d6a4f]/50 flex items-center justify-between text-[11px] text-[#95d5b2]">
                <span>Appwrite Hackathon 2026</span>
                <span className="px-2 py-0.5 rounded-full bg-[#52b788]/20 border border-[#52b788]/30 text-[#74c69d]">
                  Cloud Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#d8f3dc]/60">
          <p>© {new Date().getFullYear()} ReLoop. Borrow More. Waste Less. Build Trust.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>for student communities worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

