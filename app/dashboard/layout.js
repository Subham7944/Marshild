"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "../../components/ui/sidebar.jsx";
import { AppSidebar } from "../../components/app-sidebar.jsx";

// This component wraps the main content and responds to sidebar state
function DashboardContent({ children }) {
  const { collapsed } = useSidebar();
  
  return (
    <main 
      className="flex-1 min-h-screen overflow-y-auto bg-slate-50 dark:bg-[#212121] w-full transition-all duration-300"
      style={{
        marginLeft: collapsed ? '76px' : '256px'
      }}
    >
      <div className="relative p-4 lg:p-6 w-full bg-slate-50 dark:bg-[#212121]">
        <div>
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
