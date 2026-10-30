'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AppwriteSetupBanner from '@/components/AppwriteSetupBanner';
import {
  RotateCcw,
  LogIn,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Users
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLoginAs, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.message || 'Failed to authenticate. Verify credentials or test in demo mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: 'alex' | 'maya' | 'sarah') => {
    demoLoginAs(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#e9e4d9] p-8 sm:p-10 shadow-xl shadow-[#1b4332]/5 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center mx-auto shadow-md">
              <RotateCcw className="w-6 h-6 text-[#52b788]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#525c56]">
              Sign in to your ReLoop verified campus account
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Campus Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating with Appwrite...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-[#f0ebd8] space-y-3">
            <div className="flex items-center gap-1.5 text-xs text-[#718377] font-semibold justify-center">
              <Users className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span>Instant Persona Login (for Testing):</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('alex')}
                className="p-2 rounded-xl border border-[#e9e4d9] bg-[#fdfbf7] hover:bg-[#ebfbee] text-[#1b4332] text-center font-bold transition flex flex-col items-center"
              >
                <span>Alex</span>
                <span className="text-[10px] text-[#718377] font-normal">Lender</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('maya')}
                className="p-2 rounded-xl border border-[#e9e4d9] bg-[#fdfbf7] hover:bg-[#ebfbee] text-[#1b4332] text-center font-bold transition flex flex-col items-center"
              >
                <span>Maya</span>
                <span className="text-[10px] text-[#718377] font-normal">Borrower</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('sarah')}
                className="p-2 rounded-xl border border-[#e9e4d9] bg-[#fdfbf7] hover:bg-[#ebfbee] text-[#1b4332] text-center font-bold transition flex flex-col items-center"
              >
                <span>Sarah</span>
                <span className="text-[10px] text-[#718377] font-normal">Med Peer</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-[#525c56] pt-2">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-[#2d6a4f] font-bold hover:underline">
              Create a free student profile
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

