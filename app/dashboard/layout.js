"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, useSidebar } from "../../components/ui/sidebar.jsx";
import { AppSidebar } from "../../components/app-sidebar.jsx";

// This component wraps the main content and responds to sidebar state
function DashboardContent({ children }) {
  const { collapsed } = useSidebar();
  
  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Main Content Area */}
      <main 
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300 ease-in-out max-w-full ${
          collapsed 
            ? 'ml-16 md:ml-16' 
            : 'ml-0 md:ml-64'
        }`}
      >
        {/* Content Container */}
        <div className="relative w-full">
          {/* Header Bar */}
          <div className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center p-3 md:p-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Welcome to your dashboard
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
