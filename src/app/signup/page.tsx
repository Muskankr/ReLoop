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
  UserPlus,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Leaf
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [campus, setCampus] = useState('Engineering Quad - Central Campus');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const campusOptions = [
    'Engineering Quad - Central Campus',
    'Life Sciences Institute',
    'Computer Science Building',
    'Downtown Medical Campus',
    'Arts & Design Hall',
    'South Residential Quad',
    'Main Library Quad',
    'Business & Law School',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long for security.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signup(name, email, password, campus);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err?.message || 'Failed to register account with Appwrite. Check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <AppwriteSetupBanner />
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#e9e4d9] p-8 sm:p-10 shadow-xl shadow-[#1b4332]/5 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center mx-auto shadow-md">
              <Leaf className="w-6 h-6 text-[#52b788]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1b4332]">
              Join the ReLoop Network
            </h1>
            <p className="text-xs text-[#525c56]">
              Borrow and lend across campus with verified student trust
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
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Campus Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maya.chen@campus.edu"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Primary Campus / Hall *
              </label>
              <select
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              >
                {campusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
                Create Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e4d9] text-sm text-[#15291e] focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#ebfbee] border border-[#b7e4c7] text-xs text-[#1b4332] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2d6a4f] shrink-0" />
              <span>
                New student accounts start with 100% initial Trust Score in Appwrite TablesDB.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Creating Account in Appwrite...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#525c56] pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-[#2d6a4f] font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

