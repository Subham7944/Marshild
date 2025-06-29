"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  // Don't show header on dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  if (isDashboardPage) {
    return null;
  }
  
  return <Header />;
}
