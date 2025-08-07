"use client";

import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Settings,
  FileText,
  Brain,
  Lightbulb,
  Users,
  LogOut
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar.jsx";
import { cn } from "../lib/utils";

export function AppSidebar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed } = useSidebar();
  
  // State for analysis IDs
  const [marketResearchId, setMarketResearchId] = useState('');
  const [brainstormingId, setBrainstormingId] = useState('');
  const [swotId, setSwotId] = useState('');
  
  // Load IDs from localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    
    // Get Market Research ID
    const existingResearchIds = Object.keys(localStorage).filter(
      key => key.startsWith('market-research-')
    );
    if (existingResearchIds.length > 0) {
      const mostRecentId = existingResearchIds
        .map(key => key.replace('market-research-', ''))
        .sort((a, b) => parseInt(b) - parseInt(a))[0];
      setMarketResearchId(mostRecentId);
    }
    
    // Get Brainstorming ID
    const existingBrainstormingIds = Object.keys(localStorage).filter(
      key => key.startsWith('brainstorming-')
    );
    if (existingBrainstormingIds.length > 0) {
      const mostRecentId = existingBrainstormingIds
        .map(key => key.replace('brainstorming-', ''))
        .sort((a, b) => parseInt(b) - parseInt(a))[0];
      setBrainstormingId(mostRecentId);
    }
    
    // Get SWOT ID
    const existingSwotIds = Object.keys(localStorage).filter(
      key => key.startsWith('swot-')
    );
    if (existingSwotIds.length > 0) {
      const mostRecentId = existingSwotIds
        .map(key => key.replace('swot-', ''))
        .sort((a, b) => parseInt(b) - parseInt(a))[0];
      setSwotId(mostRecentId);
    }
  }, [isLoaded]);

  // Create a function to handle navigation with IDs
  const handleNavigation = (path, id) => {
    if (id) {
      router.push(`${path}?id=${id}`);
    } else {
      router.push(path);
    }
  };
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, id: null },
    { name: "Market Research", href: "/dashboard/market-research", icon: <Search className="h-5 w-5" />, id: marketResearchId },
    { name: "SWOT Analysis", href: "/dashboard/swot", icon: <FileText className="h-5 w-5" />, id: swotId },
    { name: "Risk Assessment", href: "/dashboard/risk", icon: <BarChart3 className="h-5 w-5" />, id: null },
    { name: "Brainstorm", href: "/dashboard/brainstorming", icon: <Brain className="h-5 w-5" />, id: brainstormingId },
    { name: "Idea Validation", href: "/dashboard/validate", icon: <Lightbulb className="h-5 w-5" />, id: null },
    { name: "Competitor Analysis", href: "/dashboard/competitors", icon: <Users className="h-5 w-5" />, id: null },
    { name: "Account Settings", href: "/account", icon: <Settings className="h-5 w-5" />, id: null },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <SidebarHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white h-20">
        <div className="flex items-center justify-center w-full">
          {!collapsed ? (
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-3xl font-bold">MarShild</span>
              </Link>
              <SidebarTrigger className="bg-white/10 text-white w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all duration-200" />
            </div>
          ) : (
            <SidebarTrigger className="bg-white/10 text-white w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/20 transition-all duration-200" />
          )}
        </div>
      </SidebarHeader>

      {/* Enhanced User Profile Section */}
      {isLoaded && user && (
        <div className={cn(
          "flex border-b border-slate-200 dark:border-slate-800 transition-all duration-300 bg-white dark:bg-[#212121]",
          collapsed ? "flex-col py-4 items-center justify-center" : "p-4 items-center"
        )}>
          <div className={cn(
            "relative rounded-full overflow-hidden ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-950",
            collapsed ? "w-10 h-10" : "w-14 h-14"
          )}>
            <img 
              src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || '')}&background=random`} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          )}
        </div>
      )}

      <SidebarContent>
        <SidebarGroup title={collapsed ? "" : "Think by yourself"}>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <div onClick={() => handleNavigation(item.href, item.id)}>
                  <SidebarMenuButton 
                    className={cn(
                      pathname.startsWith(item.href) && "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground font-medium",
                      "cursor-pointer"
                    )}
                  >
                    {item.icon}
                    <span className={collapsed ? "hidden" : "block"}>{item.name}</span>
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SignOutButton>
          <button 
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
}
