"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SWOTAnalysis, SWOTItem } from '../../../types/swot';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, Target, AlertCircle } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "../../../components/ui/card_";
import { Button } from "../../../components/ui/button_";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs_";

export default function SWOTPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const swotId = searchParams.get('id');
  
  const [swotData, setSwotData] = useState<SWOTAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load SWOT data from localStorage using the ID from URL params
  useEffect(() => {
    if (!swotId) {
      setError('No SWOT analysis ID provided');
      setIsLoading(false);
      return;
    }
    
    try {
      const storedData = localStorage.getItem(`swot-${swotId}`);
      
      if (!storedData) {
        setError('SWOT analysis data not found');
        setIsLoading(false);
        return;
      }
      
      const parsedData = JSON.parse(storedData);
      setSwotData(parsedData);
    } catch (err) {
      console.error('Error loading SWOT data:', err);
      setError('Failed to load SWOT analysis data');
    } finally {
      setIsLoading(false);
    }
  }, [swotId]);
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !swotData) {
    return (
      <div className="p-6">
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-500">Error: {error || "No SWOT analysis data available"}</h2>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="mt-4"
              variant="outline"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render SWOT analysis items as cards
  const renderSWOTItems = (items: SWOTItem[], cardClass: string) => {
    return items.map((item, index) => (
      <Card key={index} className={`${cardClass} shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-primary/10`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </CardContent>
      </Card>
    ));
  };
  
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-500 bg-clip-text text-transparent">SWOT Analysis</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Generated on {formatDate(swotData.timestamp)}
        </div>
      </div>
      
      {/* Two view options: tabs or grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto mb-8 bg-gradient-to-r from-purple-100/80 to-blue-100/80 dark:from-purple-950/50 dark:to-blue-950/50">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="categories">Categories View</TabsTrigger>
        </TabsList>
        
        {/* Grid View - All four quadrants */}
        <TabsContent value="grid" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strengths */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Strengths</h2>
              </div>
              <div className="space-y-4">
                {renderSWOTItems(swotData.strengths, 'border-l-4 border-l-green-500')}
              </div>
            </div>
            
            {/* Weaknesses */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Weaknesses</h2>
              </div>
              <div className="space-y-4">
                {renderSWOTItems(swotData.weaknesses, 'border-l-4 border-l-red-500')}
              </div>
            </div>
            
            {/* Opportunities */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Opportunities</h2>
              </div>
              <div className="space-y-4">
                {renderSWOTItems(swotData.opportunities, 'border-l-4 border-l-blue-500')}
              </div>
            </div>
            
            {/* Threats */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-400">Threats</h2>
              </div>
              <div className="space-y-4">
                {renderSWOTItems(swotData.threats, 'border-l-4 border-l-amber-500')}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Categories View - Tabbed by SWOT category */}
        <TabsContent value="categories">
          <Tabs defaultValue="strengths">
            <TabsList className="flex justify-center mb-8 overflow-x-auto">
              <TabsTrigger value="strengths" className="text-green-600 dark:text-green-400">Strengths</TabsTrigger>
              <TabsTrigger value="weaknesses" className="text-red-600 dark:text-red-400">Weaknesses</TabsTrigger>
              <TabsTrigger value="opportunities" className="text-blue-600 dark:text-blue-400">Opportunities</TabsTrigger>
              <TabsTrigger value="threats" className="text-amber-600 dark:text-amber-400">Threats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strengths">
              <Card className="border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400">Strengths</span>
                  </CardTitle>
                  <CardDescription>Your startup's competitive advantages and internal strong points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderSWOTItems(swotData.strengths, 'bg-white dark:bg-gray-800')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weaknesses">
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400">Weaknesses</span>
                  </CardTitle>
                  <CardDescription>Areas where your startup needs improvement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderSWOTItems(swotData.weaknesses, 'bg-white dark:bg-gray-800')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="opportunities">
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400">Opportunities</span>
                  </CardTitle>
                  <CardDescription>External factors and market conditions your startup can leverage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderSWOTItems(swotData.opportunities, 'bg-white dark:bg-gray-800')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="threats">
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <span className="text-amber-600 dark:text-amber-400">Threats</span>
                  </CardTitle>
                  <CardDescription>External risks and challenges facing your startup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderSWOTItems(swotData.threats, 'bg-white dark:bg-gray-800')}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <Button 
          onClick={() => router.push('/dashboard')}
          variant="outline"
          className="border-primary/20 hover:bg-primary/10"
        >
          Back to Dashboard
        </Button>
        
        <div className="space-x-3">
          <Button 
            variant="gold"
            onClick={() => {
              const swotText = `
SWOT ANALYSIS
============

STRENGTHS:
${swotData.strengths.map(s => `- ${s.title}: ${s.description}`).join('\n')}

WEAKNESSES:
${swotData.weaknesses.map(s => `- ${s.title}: ${s.description}`).join('\n')}

OPPORTUNITIES:
${swotData.opportunities.map(s => `- ${s.title}: ${s.description}`).join('\n')}

THREATS:
${swotData.threats.map(s => `- ${s.title}: ${s.description}`).join('\n')}
`;
              navigator.clipboard.writeText(swotText);
              alert('SWOT analysis copied to clipboard');
            }}
          >
            Copy as Text
          </Button>
          
          <Link href={`/dashboard/market-research?id=${searchParams.get('marketId') || ''}`}>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">View Market Research</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
