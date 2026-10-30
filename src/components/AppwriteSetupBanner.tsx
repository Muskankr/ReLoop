'use client';

import React, { useState } from 'react';
import { isAppwriteConfigured, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID } from '@/lib/appwrite';
import { seedAppwriteDatabase } from '@/lib/database';
import { Database, CheckCircle2, AlertCircle, Sparkles, X, ChevronRight, Terminal } from 'lucide-react';

export default function AppwriteSetupBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const configured = isAppwriteConfigured();

  if (dismissed) return null;

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedStatus(null);
    try {
      const res = await seedAppwriteDatabase();
      setSeedStatus(res.message);
    } catch (e: any) {
      setSeedStatus(e?.message || 'Error seeding database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <>
      <div className="w-full bg-[#1b4332] text-white border-b border-[#2d6a4f] py-2.5 px-4 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {configured ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#52b788]/20 text-[#74c69d] font-medium border border-[#52b788]/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#52b788]" />
                Appwrite Cloud Connected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                Appwrite TablesDB Hackathon Mode
              </span>
            )}

            <span className="hidden md:inline text-white/80">
              {configured
                ? `Project: ${APPWRITE_PROJECT_ID.slice(0, 10)}... | DB: ${APPWRITE_DATABASE_ID}`
                : 'Built with Appwrite TablesDB & Auth. Add your Project ID in .env.local to link your live instance.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {configured && (
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2d6a4f] hover:bg-[#40916c] text-white font-medium transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                {isSeeding ? 'Seeding...' : 'Seed Sample Items'}
              </button>
            )}

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
              title="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {seedStatus && (
          <div className="max-w-7xl mx-auto mt-1.5 text-xs text-[#95d5b2] font-medium">
            {seedStatus}
          </div>
        )}
      </div>

      {/* Database Setup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#fdfbf7] text-[#15291e] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e9e4d9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e4d9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#52b788]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1b4332]">Appwrite TablesDB Setup</h3>
                  <p className="text-xs text-[#525c56]">Follow these 3 quick steps to connect your cloud project</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#e9e4d9]/50 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">1</span>
                  Create Appwrite Cloud Project
                </h4>
                <p className="text-xs text-[#525c56] mb-2">
                  Sign in at <a href="https://cloud.appwrite.io" target="_blank" rel="noreferrer" className="text-[#2d6a4f] underline font-medium">cloud.appwrite.io</a> and create a new project named <strong>ReLoop</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 text-xs font-mono">
                  Endpoint: https://cloud.appwrite.io/v1<br />
                  Add Web App Platform: Hostname = * or localhost
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">2</span>
                  TablesDB Tables & Columns Schema
                </h4>
                <p className="text-xs text-[#525c56] mb-2">
                  Create database <code>reloop_db</code> with four tables:
                </p>
                <ul className="text-xs space-y-1.5 text-[#334139] list-disc list-inside">
                  <li><code>users</code> table: userId, name, email, campus, reputation</li>
                  <li><code>items</code> table: ownerId, ownerName, ownerCampus, title, description, category, condition, mode, availability, imageUrl, location</li>
                  <li><code>borrow_requests</code> table: itemId, itemTitle, ownerId, ownerName, borrowerId, borrowerName, borrowerCampus, status, requestDate, dueDate, message, returnedDate</li>
                  <li><code>reviews</code> table: requestId, itemId, reviewerId, reviewerName, revieweeId, rating, comment</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">3</span>
                  Configure Environment Variables
                </h4>
                <p className="text-xs text-[#525c56] mb-2">
                  Create <code>.env.local</code> in the project root:
                </p>
                <pre className="p-3 rounded-lg bg-neutral-900 text-[#52b788] text-xs font-mono overflow-x-auto">
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=reloop_db
NEXT_PUBLIC_APPWRITE_TABLE_USERS=users
NEXT_PUBLIC_APPWRITE_TABLE_ITEMS=items
NEXT_PUBLIC_APPWRITE_TABLE_REQUESTS=borrow_requests
NEXT_PUBLIC_APPWRITE_TABLE_REVIEWS=reviews
                </pre>
              </div>
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-[#ebfbee] border border-[#b7e4c7] text-xs text-[#1b4332] flex items-start gap-2">
                <Terminal className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Automated Setup Script Available</p>
                  <p className="text-neutral-600 mt-0.5">
                    You can run <code>node scripts/setup-appwrite.mjs</code> with your Appwrite API key to generate all database tables, columns, and permissions automatically!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#e9e4d9] flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-semibold transition"
              >
                Got It, Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

