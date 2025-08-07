"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from './ui/sidebar';
import {
  BarChart3,
  Brain,
  FileText,
  Home,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  Search,
  Settings,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';

export function AppSidebar() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Market Research", href: "/dashboard/market-research", icon: <Search className="h-5 w-5" /> },
    { name: "SWOT Analysis", href: "/dashboard/swot", icon: <FileText className="h-5 w-5" /> },
    { name: "Risk Assessment", href: "/dashboard/risk", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Brainstorm", href: "/dashboard/brainstorm", icon: <Brain className="h-5 w-5" /> },
    { name: "Idea Validation", href: "/dashboard/validate", icon: <Lightbulb className="h-5 w-5" /> },
    { name: "Competitor Analysis", href: "/dashboard/competitor-analysis", icon: <Users className="h-5 w-5" /> },
    { name: "Account Settings", href: "/account", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <Sidebar className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800">
      {/* Enhanced Header */}
      <SidebarHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-all duration-200 hover:scale-105">
            <div className="flex items-center gap-2">
              {!collapsed && (
                <>
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold">M</span>
                  </div>
                  <span className="text-xl font-bold tracking-wide">MarShild</span>
                </>
              )}
              {collapsed && (
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">M</span>
                </div>
              )}
            </div>
          </Link>
          
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-105 border border-white/20"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu className="h-4 w-4 text-white" />
            ) : (
              <X className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </SidebarHeader>

      {/* Enhanced User Profile Section */}
      {isLoaded && user && (
        <div className={cn(
          "flex border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 transition-all duration-300",
          collapsed ? "flex-col py-6 items-center justify-center" : "p-5 items-center"
        )}>
          <div className={cn(
            "relative rounded-full overflow-hidden ring-3 ring-purple-500/30 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 shadow-lg",
            collapsed ? "w-12 h-12" : "w-16 h-16"
          )}>
            <img 
              src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || '')}&background=6366f1&color=fff`} 
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          </div>
          
          {!collapsed && (
            <div className="ml-4 overflow-hidden flex-1">
              <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Navigation */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!collapsed && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-3">
                Think by yourself
              </h3>
              <div className="h-px bg-gradient-to-r from-purple-500/20 to-blue-500/20 mt-2 mb-4"></div>
            </div>
          )}
          <SidebarMenu className="space-y-1">
            {navItems.map((item, index) => (
              <SidebarMenuItem key={item.name}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton 
                    className={cn(
                      "group relative overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                      "rounded-lg border border-transparent hover:border-purple-200 dark:hover:border-purple-800",
                      pathname === item.href 
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-[1.02]" 
                        : "hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20",
                      collapsed ? "justify-center p-3" : "justify-start p-3"
                    )}
                  >
                    <div className={cn(
                      "flex items-center transition-colors duration-200",
                      pathname === item.href ? "text-white" : "text-slate-600 dark:text-slate-300",
                      collapsed ? "" : "gap-3"
                    )}>
                      <div className={cn(
                        "flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
                        collapsed ? "" : "w-5 h-5"
                      )}>
                        {item.icon}
                      </div>
                      {!collapsed && (
                        <span className="font-medium text-sm truncate">{item.name}</span>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {pathname === item.href && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 pointer-events-none"></div>
                    )}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Enhanced Footer */}
      <SidebarFooter className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-800/30">
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
            "text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400",
            "hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800",
            "border border-transparent hover:shadow-sm hover:scale-[1.02]",
            collapsed ? "justify-center" : "justify-start"
          )}
          onClick={() => signOut({ redirectUrl: '/' })}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium text-sm">Sign out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}