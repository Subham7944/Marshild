"use client";

import { ClerkProvider } from '@clerk/nextjs';

export default function ConditionalClerkProvider({ children }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Check if we have valid Clerk keys
  const hasValidClerkKeys = publishableKey && 
    !publishableKey.includes('your_') && 
    publishableKey.length > 10 &&
    publishableKey.startsWith('pk_');

  if (hasValidClerkKeys) {
    console.log('✅ Clerk authentication enabled');
    return (
      <ClerkProvider>
        {children}
      </ClerkProvider>
    );
  }

  // If no valid Clerk keys, render without ClerkProvider
  console.warn('⚠️  Clerk keys not configured. Running in demo mode.');
  return <>{children}</>;
}
