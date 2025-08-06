"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrainstormingResult } from '../../../types/brainstorming';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, DollarSign, TrendingUp, Users } from 'lucide-react';

export default function BrainstormingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brainstormingId = searchParams.get('id');
  
  const [brainstormingData, setBrainstormingData] = useState<BrainstormingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load brainstorming data from localStorage using the ID from URL params
  useEffect(() => {
    if (!brainstormingId) {
      setError('No brainstorming ID provided');
      setIsLoading(false);
      return;
    }
    
    try {
      const storedData = localStorage.getItem(`brainstorming-${brainstormingId}`);
      
      if (!storedData) {
        setError('Brainstorming data not found');
        setIsLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(storedData);
      
      // Add the ID and timestamp to the retrieved data if they don't exist
      const dataWithMetadata = {
        id: brainstormingId,
        timestamp: Date.now(),
        ...parsedData
      };
      
      setBrainstormingData(dataWithMetadata);
    } catch (err) {
      console.error('Error loading brainstorming data:', err);
      setError('Failed to load brainstorming data');
    } finally {
      setIsLoading(false);
    }
  }, [brainstormingId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  if (error || !brainstormingData) {
    return (
      <div className="p-6">
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-500">Error: {error || "No brainstorming data available"}</h2>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 bg-green-50 rounded-full">
          <ArrowLeft className="h-5 w-5 text-green-600" />
        </Link>
        <h1 className="text-3xl font-bold">Growth & Strategy Analysis</h1>
      </div>
      
      {/* Monetization Models Section */}
      <div className="border rounded-lg bg-amber-50 shadow-sm">
        <div className="flex items-center space-x-3 p-6 border-b">
          <div className="bg-amber-100 p-2 rounded-full">
            <DollarSign className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-yellow-500">Monetization Models</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {brainstormingData.monetizationModels.map((model, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-green-700">{model.name}</h3>
                <p className="text-gray-700 mt-2">{model.description}</p>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-green-600">PROS</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm text-green-600">
                    {model.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-red-600">CONS</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm text-red-600">
                    {model.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Growth Strategies Section */}
      <div className="border rounded-lg bg-blue-50 shadow-sm">
        <div className="flex items-center space-x-3 p-6 border-b">
          <div className="bg-blue-100 p-2 rounded-full">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-blue-600">Growth Strategies</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {brainstormingData.growthStrategies.map((strategy, index) => (
              <div key={index} className="border rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h3 className="text-lg font-bold text-blue-700">{strategy.name}</h3>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mt-2 md:mt-0">
                    {strategy.timeframe}
                  </span>
                </div>
                
                <p className="text-gray-700 mt-3">{strategy.description}</p>
                
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">IMPLEMENTATION STEPS</h4>
                    <ol className="list-decimal pl-5 mt-1 text-sm text-black">
                      {strategy.implementationSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div> 
                  
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600">KEY RESOURCES</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm text-black">
                      {strategy.resources.map((resource, i) => (
                        <li key={i}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Audience Insights Section */}
      <div className="border rounded-lg bg-purple-50 shadow-sm">
        <div className="flex items-center space-x-3 p-6 border-b">
          <div className="bg-purple-100 p-2 rounded-full">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-purple-600">Audience Insights</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brainstormingData.audienceInsights.map((insight, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-purple-700">{insight.segment}</h3>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-purple-600">PAIN POINTS</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm text-black">
                    {insight.painPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-purple-600">PREFERENCES</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm text-black">
                    {insight.preferences.map((preference, i) => (
                      <li key={i}>{preference}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-3">
                  <h4 className="font-semibold text-sm text-purple-600">ACQUISITION CHANNELS</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm text-black">
                    {insight.acquisitionChannels.map((channel, i) => (
                      <li key={i}>{channel}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Dashboard
        </button>
        
        <Link 
          href={`/dashboard/market-research?id=${searchParams.get('marketId') || ''}`}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          View Market Research
        </Link>
      </div>
    </div>
  );
}
