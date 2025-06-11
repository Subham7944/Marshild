"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../../components/ui/sidebar.jsx";
import { AppSidebar } from "../../components/app-sidebar.jsx";

// This component wraps the main content and responds to sidebar state
function DashboardContent({ children }) {
  const { collapsed } = useSidebar();
  
  return (
    <main 
      className="flex-1 min-h-screen overflow-y-auto bg-slate-50 dark:bg-slate-950 w-full transition-all duration-300"
      style={{
        marginLeft: collapsed ? '70px' : '256px'
      }}
    >
      <div className="relative p-4 lg:p-6 w-full">
        <SidebarTrigger className="fixed top-4 left-4 z-50 md:absolute bg-white dark:bg-slate-800 w-10 h-10 flex items-center justify-center rounded-lg shadow-md hover:shadow-lg" />
        <div className="mt-8">
          {children}
        </div>
      </div>
    </main>
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
