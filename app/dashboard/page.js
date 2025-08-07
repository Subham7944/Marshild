"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { Settings, CreditCard, User, Search, BarChart3, FileText, Brain } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";
import CrossPageNavigation from '../../components/CrossPageNavigation';

export default function Dashboard() {
  const { userId } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  // State for form inputs
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [audience, setAudience] = useState('');
  const [description, setDescription] = useState('');
  
  // State for API request handling
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [researchId, setResearchId] = useState('');
  
  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  // Handle unauthorized access
  if (!userId) {
    redirect('/sign-in');
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!industry || !location || !audience) {
      setAnalysisError('Please fill all required fields');
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisError('');
    
    try {
      const response = await fetch('/api/validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, location, audience, description }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze startup idea');
      }
      
      const validationData = await response.json();
      
      // Generate a unique ID for this validation result
      const newResearchId = Date.now().toString();
      
      // Store the result in localStorage
      localStorage.setItem(`validation-${newResearchId}`, JSON.stringify(validationData));
      
      // Update state with the new research ID
      setResearchId(newResearchId);
      
      // Navigate to the validation results page
      router.push(`/dashboard/validation-results?id=${newResearchId}`);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error.message || 'Failed to analyze startup. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pt-16 md:pt-10">
      {/* Gradient welcome header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 p-6 mt-4 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-1">
          Welcome, {user.firstName}! <span className="wave-emoji">👋</span>
        </h1>
        <p className="opacity-90">Let MarShild help crack your startup idea</p>
      </div>

      {/* Input card for startup analysis */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Analyze Your Startup Idea</CardTitle>
          <CardDescription>
            Provide details about your startup concept to get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="analysis-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="industry" className="text-sm font-medium">
                  Industry / Vertical
                </label>
                <Input 
                  id="industry" 
                  placeholder="e.g. Fintech, Healthcare, E-commerce" 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Primary Market / Location
                </label>
                <Input 
                  id="location" 
                  placeholder="e.g. Global, North America, Europe" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="audience" className="text-sm font-medium">
                  Target Audience
                </label>
                <Input 
                  id="audience" 
                  placeholder="e.g. Young professionals, Small businesses" 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Startup Description (Optional)
                </label>
                <textarea 
                  id="description" 
                  placeholder="Describe your startup idea in detail. What problem does it solve? What makes it unique?" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical"
                  rows={3}
                />
              </div>
            </div>
            
            {analysisError && (
              <div className="text-red-500 text-sm mb-4">
                {analysisError}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isAnalyzing}
              className={`rounded-md bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-white font-medium hover:opacity-90 transition-all ${
                isAnalyzing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span> 
                  Analyzing...
                </>
              ) : (
                'Validate Startup Potential'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
      
      {/* Quick action cards */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Research */}
        <Card 
          className={`border-none shadow-sm hover:shadow-md transition-all cursor-pointer ${researchId ? 'ring-2 ring-purple-500' : ''}`}
          onClick={() => {
            if (researchId) {
              router.push(`/dashboard/market-research?id=${researchId}`);
            } else {
              // Scroll to the form
              document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-md">
                <Search className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium">Market Research</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {researchId ? 'View your market research results' : 'Analyze market trends and opportunities'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SWOT Analysis */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">SWOT Analysis</h3>
                <p className="text-sm text-muted-foreground mt-1">Identify strengths, weaknesses, opportunities</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-md">
                <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium">Risk Assessment</h3>
                <p className="text-sm text-muted-foreground mt-1">Evaluate potential risks and mitigations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brainstorming */}
        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-md">
                <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium">Brainstorming</h3>
                <p className="text-sm text-muted-foreground mt-1">Generate creative startup ideas and solutions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Your Analysis Section */}
      {researchId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Continue Your Analysis</h2>
          <CrossPageNavigation 
            currentPage="dashboard"
            startupIdea={{
              industry,
              location,
              audience,
              description
            }}
          />
        </div>
      )}

      <style jsx global>{`
        .wave-emoji {
          animation: wave 2.5s infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }

        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
