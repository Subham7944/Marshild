"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Menu, X } from "lucide-react"
import { cn } from "../../lib/utils"

const SidebarContext = React.createContext({})

const Sidebar = ({ children, className, ...props }) => {
  const { collapsed } = useSidebar();
  
  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-gradient-to-b from-slate-800 to-slate-950 text-white transition-all duration-300 ease-in-out fixed z-50 top-0 left-0",
        collapsed ? "w-16" : "w-64 md:w-64",
        "shadow-xl border-r border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-14 items-center border-b px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center border-t p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef(
  ({ className, title, icon, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("px-2 py-1", className)} {...props}>
        {(title || icon) && (
          <div className="mb-1 flex items-center gap-2 px-3 py-1">
            {icon}
            {title && (
              <span className="text-xs font-medium text-muted-foreground group-[[data-collapsed=true]]:hidden">
                {title}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

const sidebarTriggerVariants = cva(
  "flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50 transition-all",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        active: "bg-muted/50 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SidebarTrigger = React.forwardRef(
  ({ className, variant, ...props }, ref) => {
    const { collapsed, setCollapsed } = useSidebar()
    return (
      <button
        ref={ref}
        onClick={() => setCollapsed(!collapsed)}
        className={cn(sidebarTriggerVariants({ variant }), className)}
        {...props}
      >
        {collapsed ? <Menu size={20} /> : <X size={20} />}
      </button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <nav ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("list-none", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef(
  ({ className, children, asChild, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  // Default to collapsed on mobile
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCollapsed(window.innerWidth < 768);
      const handleResize = () => setCollapsed(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex">
        {/* This div wraps both the sidebar and content */}
        <div style={{ position: 'relative', width: '100%' }}>
          {children}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar
};