"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarketResearchResult } from '../../../types/market-research';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MarketResearchPage() {
  const [researchData, setResearchData] = useState<MarketResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const researchId = searchParams.get('id');

  useEffect(() => {
    // If we have a research ID, fetch the data from localStorage
    if (researchId) {
      try {
        const storedData = localStorage.getItem(`market-research-${researchId}`);
        if (storedData) {
          setResearchData(JSON.parse(storedData));
        } else {
          setError("Research data not found");
        }
      } catch (err) {
        setError("Failed to load research data");
        console.error(err);
      }
    } else {
      setError("No research ID provided");
    }
    
    setIsLoading(false);
  }, [researchId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !researchData) {
    return (
      <div className="p-6">
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-500">Error: {error || "No research data available"}</h2>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md"
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
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 bg-green-50 rounded-full">
          <ArrowLeft className="h-5 w-5 text-green-600" />
        </Link>
        <h1 className="text-3xl font-bold">Market Research Results</h1>
      </div>
      
      {/* Competitors Section */}
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-xl font-semibold leading-none tracking-tight">Top Competitors</h3>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-6">
            {researchData.competitors.map((competitor, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="text-xl font-bold">{competitor.name}</h3>
                {competitor.url && (
                  <a 
                    href={competitor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {competitor.url}
                  </a>
                )}
                <p className="my-2">{competitor.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="font-medium">Founded:</span> {competitor.foundingDate}
                  </div>
                  <div>
                    <span className="font-medium">Funding:</span> {competitor.funding}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Market Trends Section */}
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-xl font-semibold leading-none tracking-tight">Market Trends</h3>
        </div>
        <div className="p-6 pt-0">
          <p className="whitespace-pre-line">{researchData.marketTrends}</p>
        </div>
      </div>
      
      {/* Market Potential Section */}
      <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-xl font-semibold leading-none tracking-tight">Market Potential</h3>
        </div>
        <div className="p-6 pt-0">
          <p className="whitespace-pre-line">{researchData.marketPotential}</p>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
