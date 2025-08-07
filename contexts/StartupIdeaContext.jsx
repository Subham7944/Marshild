'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const StartupIdeaContext = createContext();

export const useStartupIdea = () => {
  const context = useContext(StartupIdeaContext);
  if (!context) {
    throw new Error('useStartupIdea must be used within a StartupIdeaProvider');
  }
  return context;
};

export const StartupIdeaProvider = ({ children }) => {
  const [ideaData, setIdeaData] = useState({
    industry: '',
    location: '',
    audience: '',
    description: ''
  });
  const [researchId, setResearchId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const searchParams = useSearchParams();

  // Load data from localStorage and URL params on mount
  useEffect(() => {
    try {
      // First, try to get data from URL parameters
      const urlIndustry = searchParams?.get('industry');
      const urlLocation = searchParams?.get('location');
      const urlAudience = searchParams?.get('audience');
      const urlDescription = searchParams?.get('description');
      const urlResearchId = searchParams?.get('researchId');

      // Then, try to get data from localStorage
      const storedIdeaData = localStorage.getItem('startup-idea-data');
      const storedResearchId = localStorage.getItem('current-research-id');

      let finalIdeaData = { industry: '', location: '', audience: '', description: '' };
      let finalResearchId = null;

      // Prioritize URL params over localStorage
      if (urlIndustry || urlLocation || urlAudience || urlDescription) {
        finalIdeaData = {
          industry: urlIndustry || '',
          location: urlLocation || '',
          audience: urlAudience || '',
          description: urlDescription || ''
        };
      } else if (storedIdeaData) {
        finalIdeaData = JSON.parse(storedIdeaData);
      }

      // Set research ID from URL or localStorage
      if (urlResearchId) {
        finalResearchId = urlResearchId;
      } else if (storedResearchId) {
        finalResearchId = storedResearchId;
      }

      setIdeaData(finalIdeaData);
      setResearchId(finalResearchId);
      
    } catch (error) {
      console.error('Error loading startup idea data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [searchParams]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('startup-idea-data', JSON.stringify(ideaData));
      } catch (error) {
        console.error('Error saving startup idea data to localStorage:', error);
      }
    }
  }, [ideaData, isLoaded]);

  useEffect(() => {
    if (isLoaded && researchId) {
      try {
        localStorage.setItem('current-research-id', researchId);
      } catch (error) {
        console.error('Error saving research ID to localStorage:', error);
      }
    }
  }, [researchId, isLoaded]);

  const updateIdeaData = (newData) => {
    setIdeaData(prev => {
      // Check if there are actual changes to prevent unnecessary re-renders
      const hasChanges = 
        prev.industry !== (newData.industry || '') ||
        prev.location !== (newData.location || '') ||
        prev.audience !== (newData.audience || '') ||
        prev.description !== (newData.description || '');
      
      if (!hasChanges) {
        return prev; // Return same object to prevent re-render
      }
      
      return {
        ...prev,
        ...newData
      };
    });
  };

  const updateResearchId = (newResearchId) => {
    setResearchId(newResearchId);
  };

  const clearIdeaData = () => {
    setIdeaData({
      industry: '',
      location: '',
      audience: '',
      description: ''
    });
    setResearchId(null);
    localStorage.removeItem('startup-idea-data');
    localStorage.removeItem('current-research-id');
  };

  const hasIdeaData = () => {
    return ideaData.industry || ideaData.location || ideaData.audience || ideaData.description;
  };

  const isComplete = () => {
    return ideaData.industry && ideaData.location && ideaData.audience;
  };

  const value = {
    ideaData,
    researchId,
    isLoaded,
    updateIdeaData,
    updateResearchId,
    clearIdeaData,
    hasIdeaData,
    isComplete
  };

  return (
    <StartupIdeaContext.Provider value={value}>
      {children}
    </StartupIdeaContext.Provider>
  );
};