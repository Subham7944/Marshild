"use client";

import { useAuth, useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Settings, CreditCard, User } from 'lucide-react';

export default function Dashboard() {
  // Client-side auth check using hooks
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  
  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, redirect to sign-in (this is a backup to middleware protection)
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.firstName || "User"}!</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Account Settings" 
          description="Manage your account details and preferences"
          icon={<Settings className="h-8 w-8 text-primary" />}
          link="/account"
        />
        <DashboardCard 
          title="Billing" 
          description="View and manage your subscription and payment methods"
          icon={<CreditCard className="h-8 w-8 text-primary" />}
          link="/account/billing"
        />
        <DashboardCard 
          title="Profile" 
          description="Update your profile information"
          icon={<User className="h-8 w-8 text-primary" />}
          link="/account/profile"
        />
      </div>
    </div>
  );
}

// Dashboard card component
function DashboardCard({ title, description, icon, link }) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div>{icon}</div>
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          <a 
            href={link} 
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            Manage <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
