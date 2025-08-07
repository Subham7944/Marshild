"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { useStartupIdea } from '../../../contexts/StartupIdeaContext.jsx';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import CrossPageNavigation from '../../../components/CrossPageNavigation';

export default function ValidatePage() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Global startup idea context
  const { ideaData, updateIdeaData, isLoaded: contextLoaded, hasIdeaData, isComplete } = useStartupIdea();

  const handleValidation = async () => {
    if (!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience) {
      setError('Please complete your startup idea on the dashboard first');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch('/api/market-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: ideaData.industry,
          location: ideaData.location,
          audience: ideaData.audience,
          description: ideaData.description || '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to validate startup idea');
      }

      const data = await response.json();
      
      // Store the results and redirect to validation results page
      const researchId = Date.now().toString();
      localStorage.setItem(`market-research-${researchId}`, JSON.stringify({
        ...data,
        industry: ideaData.industry,
        location: ideaData.location,
        audience: ideaData.audience,
        description: ideaData.description,
        timestamp: new Date().toISOString()
      }));

      // Redirect to validation results
      router.push(`/dashboard/validation-results?id=${researchId}`);
      
    } catch (error) {
      console.error('Validation error:', error);
      setError(error.message || 'Failed to validate startup idea. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-1">💡 Idea Validation</h1>
        <p className="opacity-90">Validate your startup idea with comprehensive market research</p>
      </div>

      {/* Main Content */}
      {!hasIdeaData ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-yellow-500">⚠️</span>
              Startup Idea Required
            </CardTitle>
            <CardDescription>
              Please go back to the dashboard and fill out your startup idea details to begin validation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Startup Idea Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Your Startup Idea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Industry</h4>
                  <p className="font-medium">{ideaData.industry}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Location</h4>
                  <p className="font-medium">{ideaData.location}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">Target Audience</h4>
                  <p className="font-medium">{ideaData.audience}</p>
                </div>
              </div>
              {ideaData.description && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">Description</h4>
                  <p className="text-sm leading-relaxed">{ideaData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔍</span>
                Market Validation Process
              </CardTitle>
              <CardDescription>
                We'll analyze your startup idea using comprehensive market research and Google Trends data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-500 text-xl">📊</span>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Market Analysis</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Google Trends data and market interest scoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-500 text-xl">🎯</span>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Audience Insights</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Target audience analysis and demographics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-500 text-xl">💰</span>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Market Opportunity</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Market size and revenue potential assessment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-orange-500 text-xl">⚡</span>
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100">Actionable Insights</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">Strategic recommendations and next steps</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">❌</span>
                    <p className="text-red-700 dark:text-red-300 font-medium">Error</p>
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
                </div>
              )}

              <Button 
                onClick={handleValidation}
                disabled={isValidating}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 text-lg"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Validating Your Idea...
                  </>
                ) : (
                  <>
                    🚀 Start Validation Process
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Cross-Page Navigation */}
          <div className="mt-8">
            <CrossPageNavigation 
              currentPage="validate"
              ideaData={ideaData}
            />
          </div>
        </div>
      )}
    </div>
  );
}