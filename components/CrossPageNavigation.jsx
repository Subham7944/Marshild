'use client';

import { useRouter } from 'next/navigation';
// Temporarily bypassing Clerk for development
// import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useStartupIdea } from '../contexts/StartupIdeaContext.jsx';

const CrossPageNavigation = ({ 
  currentPage, 
  ideaData = null, 
  researchId = null,
  showTitle = true,
  className = "" 
}) => {
  const router = useRouter();
  // Mock user data for development
  const user = {
    firstName: 'Dev',
    lastName: 'User',
    emailAddresses: [{ emailAddress: 'dev@marshild.com' }]
  };
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Use global context if local ideaData is not provided
  const { ideaData: contextIdeaData, researchId: contextResearchId } = useStartupIdea();
  const finalIdeaData = ideaData || contextIdeaData;
  const finalResearchId = researchId || contextResearchId;

  // Define all available pages with their metadata
  const pages = [
    {
      id: 'dashboard',
      name: 'Dashboard Home',
      icon: '🏠',
      description: 'Main dashboard with quick actions',
      path: '/dashboard',
      isPremium: false
    },
    {
      id: 'validation-results',
      name: 'Validation Results',
      icon: '✅',
      description: 'Core idea validation with Google Trends',
      path: '/dashboard/validation-results',
      isPremium: false
    },
    {
      id: 'market-research',
      name: 'Market Research',
      icon: '📊',
      description: 'Comprehensive market analysis',
      path: '/dashboard/market-research',
      isPremium: false
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment',
      icon: '⚠️',
      description: 'Legal, technical & market risks',
      path: '/dashboard/risk',
      isPremium: true
    },
    {
      id: 'competitor-analysis',
      name: 'Competitor Analysis',
      icon: '🏢',
      description: 'Real competitor data & insights',
      path: '/dashboard/competitor-analysis',
      isPremium: true
    },
    {
      id: 'brainstorm',
      name: 'Brainstorm & Strategy',
      icon: '🧠',
      description: 'AI-powered business strategy',
      path: '/dashboard/brainstorm',
      isPremium: true
    },
    {
      id: 'swot',
      name: 'SWOT Analysis',
      icon: '⚖️',
      description: 'ML-powered SWOT analysis',
      path: '/dashboard/swot',
      isPremium: true
    }
  ];

  // Filter out current page
  const availablePages = pages.filter(page => page.id !== currentPage);

  const handleNavigation = async (page) => {
    setIsNavigating(true);
    
    try {
      // Check premium access for premium features
      if (page.isPremium) {
        // Check subscription status
        const response = await fetch('/api/subscription/status');
        const subscriptionData = await response.json();
        
        if (!subscriptionData.hasActiveSubscription) {
          // Redirect to premium page
          router.push('/premium');
          return;
        }
      }

      // Navigate with appropriate query parameters
      let targetPath = page.path;
      const queryParams = new URLSearchParams();

      // Add idea data if available
      if (finalIdeaData) {
        queryParams.set('industry', finalIdeaData.industry || '');
        queryParams.set('location', finalIdeaData.location || '');
        queryParams.set('audience', finalIdeaData.audience || '');
        queryParams.set('description', finalIdeaData.description || '');
      }

      // Add research ID if available
      if (finalResearchId) {
        // Use 'id' parameter for validation-results page, 'researchId' for others
        if (page.id === 'validation-results') {
          queryParams.set('id', finalResearchId);
        } else {
          queryParams.set('researchId', finalResearchId);
        }
      }

      // Append query parameters if any
      if (queryParams.toString()) {
        targetPath += `?${queryParams.toString()}`;
      }

      router.push(targetPath);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-lg p-6 ${className}`}>
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Continue Your Analysis</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Explore different aspects of your startup idea with our comprehensive tools
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availablePages.map((page) => (
          <button
            key={page.id}
            onClick={() => handleNavigation(page)}
            disabled={isNavigating}
            className={`
              relative p-4 border rounded-lg text-left transition-all duration-200
              hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isNavigating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}
              ${page.isPremium ? 'border-yellow-200 dark:border-yellow-800' : 'border-gray-200 dark:border-gray-700'}
            `}
          >
            {/* Premium badge */}
            {page.isPremium && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Premium
                </span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="text-2xl">{page.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {page.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {page.description}
                </p>
              </div>
            </div>

            {/* Navigation arrow */}
            <div className="absolute bottom-3 right-3 text-gray-400 group-hover:text-blue-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Quick action buttons */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setIsNavigating(true);
              router.push('/dashboard');
              setTimeout(() => setIsNavigating(false), 1000);
            }}
            disabled={isNavigating}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            🏠 Dashboard Home
          </button>
          <button
            onClick={() => {
              setIsNavigating(true);
              router.push('/');
              setTimeout(() => setIsNavigating(false), 1000);
            }}
            disabled={isNavigating}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            🌟 New Validation
          </button>
          <button
            onClick={() => {
              setIsNavigating(true);
              router.push('/premium');
              setTimeout(() => setIsNavigating(false), 1000);
            }}
            disabled={isNavigating}
            className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800/30 transition-colors disabled:opacity-50"
          >
            ⭐ Upgrade Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrossPageNavigation;