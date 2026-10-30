'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  RotateCcw,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  Compass,
  BarChart3,
  HelpCircle,
  Users
} from 'lucide-react';
import CreateItemModal from './CreateItemModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, userProfile, logout, demoLoginAs, isConfigured } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);

  const navLinks = [
    { label: 'Marketplace', href: '/marketplace', icon: Compass },
    { label: 'Community', href: '/community', icon: BarChart3 },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-[#e9e4d9] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#1b4332] text-white flex items-center justify-center shadow-md shadow-[#1b4332]/10 group-hover:bg-[#2d6a4f] transition">
                <RotateCcw className="w-5 h-5 text-[#52b788] group-hover:rotate-45 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#1b4332] flex items-center gap-1.5">
                  ReLoop
                  <span className="w-2 h-2 rounded-full bg-[#52b788]"></span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-[#525c56]">
                  Campus Circular Economy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-[#1b4332] text-white shadow-sm'
                        : 'text-[#334139] hover:bg-[#f0ebd8] hover:text-[#1b4332]'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Post Item Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-medium text-sm transition shadow-sm hover:shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#95d5b2]" />
                <span>List an Item</span>
              </button>

              {/* Persona / Demo Testing Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsDemoSwitcherOpen(!isDemoSwitcherOpen)}
                  className="px-2.5 py-1.5 rounded-xl border border-[#e9e4d9] bg-white text-xs font-medium text-[#4a5c51] hover:bg-[#f7f4ec] flex items-center gap-1.5"
                  title="Switch Persona for testing multi-user borrow/lend workflows"
                >
                  <Users className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span className="max-w-[100px] truncate">{userProfile?.name || 'Persona'}</span>
                </button>

                {isDemoSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#e9e4d9] p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#718377] uppercase tracking-wider">
                      Switch Role for Testing
                    </div>
                    <button
                      onClick={() => {
                        demoLoginAs('alex');
                        setIsDemoSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#ebfbee] text-[#1b4332] flex flex-col"
                    >
                      <span className="font-semibold">Alex Rivera (Lender)</span>
                      <span className="text-[10px] text-[#525c56]">Owns TI-84, Physics book</span>
                    </button>
                    <button
                      onClick={() => {
                        demoLoginAs('maya');
                        setIsDemoSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#ebfbee] text-[#1b4332] flex flex-col"
                    >
                      <span className="font-semibold">Maya Chen (Borrower)</span>
                      <span className="text-[10px] text-[#525c56]">Life Sciences student</span>
                    </button>
                    <button
                      onClick={() => {
                        demoLoginAs('sarah');
                        setIsDemoSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#ebfbee] text-[#1b4332] flex flex-col"
                    >
                      <span className="font-semibold">Sarah Jenkins (Lender)</span>
                      <span className="text-[10px] text-[#525c56]">Owns Stethoscope</span>
                    </button>
                    <button
                      onClick={() => {
                        demoLoginAs('new');
                        setIsDemoSwitcherOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#ebfbee] text-[#1b4332] flex flex-col border-t border-[#f0ebd8] mt-1 pt-2"
                    >
                      <span className="font-semibold">Jordan Rivera (New Student)</span>
                      <span className="text-[10px] text-[#525c56]">Fresh borrower account</span>
                    </button>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-full border border-[#e9e4d9] bg-white hover:bg-[#f7f4ec] transition"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-[#1b4332] leading-tight">
                        {user.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-[#52b788] font-semibold flex items-center justify-end gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        {userProfile?.reputation ?? 100}% Trust
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs uppercase">
                      {(user.name || 'S').slice(0, 2)}
                    </div>
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[#e9e4d9] p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="p-3 border-b border-[#f0ebd8]">
                        <p className="text-sm font-bold text-[#1b4332]">{user.name}</p>
                        <p className="text-xs text-[#718377] truncate">{user.email}</p>
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ebfbee] text-[#1b4332] text-[11px] font-medium border border-[#b7e4c7]">
                          <ShieldCheck className="w-3 h-3 text-[#2d6a4f]" />
                          Campus Reputation: {userProfile?.reputation ?? 100}%
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#334139] rounded-xl hover:bg-[#f7f4ec] transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#2d6a4f]" />
                          Student Activity Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#334139] rounded-xl hover:bg-[#f7f4ec] transition"
                        >
                          <User className="w-4 h-4 text-[#2d6a4f]" />
                          Public Profile & History
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#f0ebd8]">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 rounded-xl hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-[#1b4332] hover:bg-[#f0ebd8] transition"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white text-sm font-semibold transition shadow-sm"
                  >
                    Join Campus
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="p-2 rounded-xl bg-[#2d6a4f] text-white"
                title="List Item"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-[#1b4332] hover:bg-[#f0ebd8] transition"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#e9e4d9] bg-[#fdfbf7] px-4 pt-3 pb-6 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-[#1b4332] text-white' : 'text-[#334139] hover:bg-[#f0ebd8]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#e9e4d9] space-y-2">
              {user ? (
                <>
                  <div className="p-3 rounded-xl bg-white border border-[#e9e4d9]">
                    <div className="font-bold text-sm text-[#1b4332]">{user.name}</div>
                    <div className="text-xs text-[#718377]">{user.email}</div>
                    <div className="mt-1 text-xs text-[#2d6a4f] font-semibold">
                      ⭐ {userProfile?.reputation ?? 100}% Trust Score
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full py-2 px-3 text-center rounded-xl bg-white border border-[#e9e4d9] text-sm font-medium text-[#1b4332]"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 text-center rounded-xl border border-[#1b4332] text-sm font-semibold text-[#1b4332]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 text-center rounded-xl bg-[#1b4332] text-sm font-semibold text-white"
                  >
                    Join Campus
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Item Creation Modal */}
      {isCreateModalOpen && (
        <CreateItemModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </>
  );
}

