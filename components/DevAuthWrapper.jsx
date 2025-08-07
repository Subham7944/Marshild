"use client";

import { useAuth, useUser } from '@clerk/nextjs';

// Development mode auth wrapper
export function useDevAuth() {
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  
  if (isDev) {
    return {
      userId: 'dev-user-id',
      isLoaded: true,
      isSignedIn: true
    };
  }
  
  return useAuth();
}

export function useDevUser() {
  const isDev = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
  
  if (isDev) {
    return {
      user: {
        id: 'dev-user-id',
        firstName: 'Dev',
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'dev@marshild.com' }],
        fullName: 'Dev User'
      },
      isLoaded: true
    };
  }
  
  return useUser();
}