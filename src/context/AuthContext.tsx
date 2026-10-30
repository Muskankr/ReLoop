'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { account, ID, isAppwriteConfigured } from '@/lib/appwrite';
import { UserProfile } from '@/types';
import { ensureUserProfile, fetchUserProfile } from '@/lib/database';
import { Models } from 'appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string, campus: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLoginAs: (role: 'alex' | 'maya' | 'sarah' | 'new') => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const DEMO_PERSONAS = {
  alex: {
    name: 'Alex Rivera',
    email: 'alex.rivera@reloop-campus.edu',
    password: 'CampusLender@2026',
    campus: 'Engineering Quad - Central Campus',
  },
  maya: {
    name: 'Maya Chen',
    email: 'maya.chen@reloop-campus.edu',
    password: 'CampusBorrower@2026',
    campus: 'Life Sciences Institute',
  },
  sarah: {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@reloop-campus.edu',
    password: 'CampusMed@2026',
    campus: 'Downtown Medical Campus',
  },
  new: {
    name: 'Jordan Rivera',
    email: 'jordan.rivera@reloop-campus.edu',
    password: 'CampusStudent@2026',
    campus: 'Engineering Quad - Central Campus',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isConfigured = isAppwriteConfigured();

  // Load user profile from TablesDB
  const loadProfile = async (currentUserId: string, name: string, email: string) => {
    try {
      let prof = await fetchUserProfile(currentUserId);
      if (!prof) {
        prof = await ensureUserProfile(
          currentUserId,
          name || 'Student Member',
          email || 'student@campus.edu',
          'Engineering Quad - Central Campus'
        );
      }
      setUserProfile(prof);
    } catch (err) {
      console.warn('Failed to load user profile from TablesDB:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.$id, user.name, user.email);
    }
  };

  // Check initial authenticated session
  useEffect(() => {
    async function initSession() {
      setIsLoading(true);
      if (isConfigured) {
        try {
          const currentAccount = await account.get();
          setUser(currentAccount);
          await loadProfile(currentAccount.$id, currentAccount.name, currentAccount.email);
        } catch {
          // No active Appwrite session
          setUser(null);
          setUserProfile(null);
        }
      } else {
        // Fallback demo state when credentials are not yet entered
        const defaultDemo: UserProfile = {
          userId: 'demo-student-alex',
          name: 'Alex Rivera',
          email: 'alex.rivera@campus.edu',
          campus: 'Engineering Quad - Central Campus',
          reputation: 99,
          totalBorrows: 2,
          totalLends: 8,
        };
        setUser({
          $id: defaultDemo.userId,
          name: defaultDemo.name,
          email: defaultDemo.email,
        } as any);
        setUserProfile(defaultDemo);
      }
      setIsLoading(false);
    }

    initSession();
  }, [isConfigured]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        // End any active session first
        await account.deleteSession('current').catch(() => {});
        // Appwrite Authentication
        await account.createEmailPasswordSession(email, pass);
        const currentAccount = await account.get();
        setUser(currentAccount);
        await loadProfile(currentAccount.$id, currentAccount.name, currentAccount.email);
      } else {
        const demoUser: UserProfile = {
          userId: 'user-' + email.split('@')[0],
          name: email.split('@')[0].toUpperCase(),
          email,
          campus: 'Engineering Quad - Central Campus',
          reputation: 100,
        };
        setUser({
          $id: demoUser.userId,
          name: demoUser.name,
          email: demoUser.email,
        } as any);
        setUserProfile(demoUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string, campus: string) => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        const newUserId = ID.unique();
        await account.create(newUserId, email, pass, name);
        await account.deleteSession('current').catch(() => {});
        await account.createEmailPasswordSession(email, pass);
        const currentAccount = await account.get();
        setUser(currentAccount);
        const profile = await ensureUserProfile(newUserId, name, email, campus);
        setUserProfile(profile);
      } else {
        const demoUser: UserProfile = {
          userId: 'user-' + ID.unique().slice(0, 8),
          name,
          email,
          campus: campus || 'Main Campus',
          reputation: 100,
        };
        setUser({
          $id: demoUser.userId,
          name,
          email,
        } as any);
        setUserProfile(demoUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isConfigured) {
        await account.deleteSession('current');
      }
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Genuine Appwrite Persona Switcher
  // When Appwrite is configured, creates/authenticates a REAL Appwrite session!
  const demoLoginAs = async (role: 'alex' | 'maya' | 'sarah' | 'new') => {
    const persona = DEMO_PERSONAS[role];
    if (isConfigured) {
      setIsLoading(true);
      try {
        // Log out existing session
        await account.deleteSession('current').catch(() => {});

        // Attempt login
        try {
          await account.createEmailPasswordSession(persona.email, persona.password);
        } catch {
          // If account doesn't exist yet on Appwrite, create it
          await account.create(ID.unique(), persona.email, persona.password, persona.name);
          await account.createEmailPasswordSession(persona.email, persona.password);
        }

        const currentAccount = await account.get();
        setUser(currentAccount);
        await loadProfile(currentAccount.$id, currentAccount.name, currentAccount.email);
      } catch (err) {
        console.error('Failed to switch persona via Appwrite Authentication:', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      const demoUser: UserProfile = {
        userId: role === 'alex' ? 'demo-student-alex' : role === 'maya' ? 'demo-student-maya' : role === 'sarah' ? 'demo-student-sarah' : 'current-user',
        name: persona.name,
        email: persona.email,
        campus: persona.campus,
        reputation: 98,
        totalLends: role === 'alex' ? 8 : 3,
        totalBorrows: role === 'maya' ? 6 : 2,
      };
      setUser({
        $id: demoUser.userId,
        name: demoUser.name,
        email: demoUser.email,
      } as any);
      setUserProfile(demoUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        isConfigured,
        login,
        signup,
        logout,
        demoLoginAs,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
