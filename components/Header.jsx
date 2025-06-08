"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { LayoutDashboard } from 'lucide-react';

export default function Header() {
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
            <img src="/dummy-logo.svg" alt="CursorAI Logo" className="h-8 mr-2" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Marshild
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#hero" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
            Home
          </Link>
          <Link href="#problem-solution" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
            Problem & Solution
          </Link>
          <Link href="#features" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
            Features
          </Link>
          <Link href="#testimonials" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
            Testimonials
          </Link>
          <Link href="#faq" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
            FAQ
          </Link>
          {/* <SignedIn>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
              Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <span className="text-gray-400 cursor-not-allowed" title="Please sign in to access the dashboard">
              Dashboard
            </span>
          </SignedOut> */}
        </nav>
        
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="gap-2">
                <LayoutDashboard size={18}/>
                <span className='hidden md:inline'>Dashboard</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </motion.header>
  );
}
