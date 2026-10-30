
'use client';

import React, { useEffect, useState } from 'react';
import {
  isAppwriteConfigured,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
} from '@/lib/appwrite';
import { seedAppwriteDatabase } from '@/lib/database';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export default function AppwriteSetupBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);
  const [seedError, setSeedError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const configured = isAppwriteConfigured();

  useEffect(() => {
    if (!showModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showModal]);

  if (dismissed) return null;

  const handleSeed = async () => {
    if (isSeeding) return;

    setIsSeeding(true);
    setSeedStatus(null);
    setSeedError(false);

    try {
      const res = await seedAppwriteDatabase();
      setSeedStatus(res.message);
    } catch (error) {
      setSeedError(true);
      setSeedStatus(
        error instanceof Error
          ? error.message
          : 'Error seeding database.'
      );
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
                Appwrite Configuration Detected
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                Appwrite Setup Required
              </span>
            )}

            <span className="hidden md:inline text-white/80">
              {configured
                ? `Project: ${APPWRITE_PROJECT_ID.slice(0, 10)}... | Database: ${APPWRITE_DATABASE_ID}`
                : 'Add your Appwrite credentials in .env.local to configure your project.'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {configured && (
              <button
                type="button"
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#2d6a4f] hover:bg-[#40916c] text-white font-medium transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                {isSeeding ? 'Seeding...' : 'Seed Sample Items'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
              title="Dismiss banner"
              aria-label="Dismiss setup banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {seedStatus && (
          <div
            role="status"
            className={`max-w-7xl mx-auto mt-1.5 text-xs font-medium ${
              seedError ? 'text-amber-300' : 'text-[#95d5b2]'
            }`}
          >
            {seedStatus}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appwrite-setup-title"
            className="bg-[#fdfbf7] text-[#15291e] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#e9e4d9] max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#e9e4d9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center">
                  <Database className="w-5 h-5 text-[#52b788]" />
                </div>

                <div>
                  <h3
                    id="appwrite-setup-title"
                    className="font-bold text-lg text-[#1b4332]"
                  >
                    Appwrite TablesDB Setup
                  </h3>
                  <p className="text-xs text-[#525c56]">
                    Follow these steps to configure your cloud database.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#e9e4d9]/50 text-neutral-500"
                aria-label="Close setup guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  Create Appwrite Cloud Project
                </h4>

                <p className="text-xs text-[#525c56] mb-2">
                  Open{' '}
                  <a
                    href="https://cloud.appwrite.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2d6a4f] underline font-medium"
                  >
                    Appwrite Cloud
                  </a>{' '}
                  and open your ReLoop project.
                </p>

                <div className="p-2.5 rounded-lg bg-neutral-900 text-neutral-200 text-xs font-mono">
                  Endpoint: https://cloud.appwrite.io/v1
                  <br />
                  Add Web Platform: localhost and your deployed domain.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  Create TablesDB Database and Tables
                </h4>

                <p className="text-xs text-[#525c56] mb-2">
                  Create one database and these four tables. Use the exact
                  table IDs configured in your environment variables.
                </p>

                <div className="space-y-3 text-xs text-[#334139]">
                  <div>
                    <strong>users</strong>
                    <p>
                      userId, name, email, campus, reputation, totalBorrows,
                      totalLends, avatarUrl
                    </p>
                  </div>

                  <div>
                    <strong>items</strong>
                    <p>
                      ownerId, ownerName, ownerCampus, title, description,
                      category, condition, mode, availability, imageUrl,
                      location
                    </p>
                  </div>

                  <div>
                    <strong>borrow_requests</strong>
                    <p>
                      itemId, itemTitle, itemCategory, itemImageUrl, ownerId,
                      ownerName, borrowerId, borrowerName, borrowerCampus,
                      status, requestDate, dueDate, message, returnedDate
                    </p>
                  </div>

                  <div>
                    <strong>reviews</strong>
                    <p>
                      requestId, itemId, itemTitle, reviewerId, reviewerName,
                      revieweeId, rating, comment
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-amber-700">
                  Important: Use the actual Appwrite Database ID and Table IDs,
                  not just their display names. Column types must match the
                  values written by your application.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#e9e4d9]">
                <h4 className="font-semibold text-[#1b4332] flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">
                    3
                  </span>
                  Configure Environment Variables
                </h4>

                <p className="text-xs text-[#525c56] mb-2">
                  Create or update <code>.env.local</code> in your project root.
                  Replace the placeholders with your real Appwrite IDs.
                </p>

                <pre className="p-3 rounded-lg bg-neutral-900 text-[#52b788] text-xs font-mono overflow-x-auto whitespace-pre">
{`NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
NEXT_PUBLIC_APPWRITE_TABLE_USERS=YOUR_USERS_TABLE_ID
NEXT_PUBLIC_APPWRITE_TABLE_ITEMS=YOUR_ITEMS_TABLE_ID
NEXT_PUBLIC_APPWRITE_TABLE_REQUESTS=YOUR_REQUESTS_TABLE_ID
NEXT_PUBLIC_APPWRITE_TABLE_REVIEWS=YOUR_REVIEWS_TABLE_ID`}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-[#ebfbee] border border-[#b7e4c7] text-xs text-[#1b4332] flex items-start gap-2">
                <Terminal className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />

                <div>
                  <p className="font-semibold">
                    Restart Your Development Server
                  </p>
                  <p className="text-neutral-600 mt-0.5">
                    After saving .env.local, stop the running server and start
                    it again so Next.js loads the updated environment variables.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#e9e4d9] flex justify-end">
              <button
                type="button"
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
