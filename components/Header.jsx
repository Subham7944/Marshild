"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { LayoutDashboard } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

// Component to handle authentication buttons
function AuthButtons() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidClerkKeys = publishableKey && 
    !publishableKey.includes('your_') && 
    publishableKey.length > 10 &&
    publishableKey.startsWith('pk_');

  if (hasValidClerkKeys) {
    return (
      <>
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <LayoutDashboard size={18}/>
              <span className='hidden md:inline'>Dashboard</span>
            </Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
      </>
    );
  }

  // Demo mode fallback
  return (
    <>
      <Link href="/dashboard">
        <Button variant="outline" className="gap-2">
          <LayoutDashboard size={18}/>
          <span className='hidden md:inline'>Dashboard</span>
        </Button>
      </Link>
      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
        DEMO
      </span>
    </>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (sectionId) => {
    // If we're not on the home page, navigate to home first
    if (pathname !== '/') {
      router.push(`/#${sectionId}`);
      return;
    }
    
    // If we're already on the home page, smooth scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.header 
      className="fixed w-full z-50 bg-white/80 dark:bg-darkbg/80 backdrop-blur-md py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/dummy-logo.svg" alt="Marshild Logo" className="h-8 mr-2" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Marshild
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNavigation('hero')} 
            className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition cursor-pointer"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('problem-solution')} 
            className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition cursor-pointer"
          >
            Problem & Solution
          </button>
          <button 
            onClick={() => handleNavigation('features')} 
            className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => handleNavigation('testimonials')} 
            className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition cursor-pointer"
          >
            Testimonials
          </button>
          <button 
            onClick={() => handleNavigation('faq')} 
            className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition cursor-pointer"
          >
            FAQ
          </button>
        </nav>
        
        <div className="flex items-center space-x-4">
          <AuthButtons />
        </div>
      </div>
    </motion.header>
  );
}