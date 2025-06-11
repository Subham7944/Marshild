"use client";

import { useUser } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "./ui/sidebar.jsx";
import { cn } from "../lib/utils";

export function AppSidebar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Market Research", href: "/dashboard/market", icon: <Search className="h-5 w-5" /> },
    { name: "SWOT Analysis", href: "/dashboard/swot", icon: <FileText className="h-5 w-5" /> },
    { name: "Risk Assessment", href: "/dashboard/risk", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Brainstorm", href: "/dashboard/brainstorm", icon: <Brain className="h-5 w-5" /> },
    { name: "Idea Validation", href: "/dashboard/validate", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "Competitor Analysis", href: "/dashboard/competitors", icon: <Users className="h-5 w-5" /> },
    { name: "Account Settings", href: "/account", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <SidebarHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
        <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
          {!collapsed && <span className="text-xl font-bold">MarShild</span>}
          {collapsed && <span className="text-xl font-bold">M</span>}
        </Link>
      </SidebarHeader>

      {isLoaded && user && (
        <div className={cn(
          "flex border-b border-slate-200 dark:border-slate-800 transition-all duration-300",
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
                <Link href={item.href} passHref>
                  <SidebarMenuButton 
                    className={cn(
                      pathname === item.href && "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-foreground font-medium"
                    )}
                  >
                    {item.icon}
                    <span className={collapsed ? "hidden" : "block"}>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
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
