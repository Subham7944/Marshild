// Utility functions for caching analysis results based on startup idea data

/**
 * Generate a unique cache key based on startup idea data
 * @param {Object} ideaData - The startup idea data
 * @param {string} analysisType - Type of analysis (risk, swot, brainstorm, competitor)
 * @returns {string} Unique cache key
 */
export const generateCacheKey = (ideaData, analysisType) => {
    if (!ideaData || !ideaData.industry || !ideaData.location || !ideaData.audience) {
      return null;
    }
    
    // Create a normalized string from the idea data
    const normalizedData = {
      industry: ideaData.industry.toLowerCase().trim(),
      location: ideaData.location.toLowerCase().trim(),
      audience: ideaData.audience.toLowerCase().trim(),
      description: (ideaData.description || '').toLowerCase().trim()
    };
    
    // Create a hash-like string (simple but effective for our use case)
    const dataString = `${normalizedData.industry}-${normalizedData.location}-${normalizedData.audience}-${normalizedData.description}`;
    
    // Use a safer hash generation method to avoid btoa issues with special characters
    let hash = '';
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert to positive string and limit length
    hash = Math.abs(hash).toString(36).substring(0, 16);
    
    return `${analysisType}-${hash}`;
  };
  
  /**
   * Get cached analysis result
   * @param {Object} ideaData - The startup idea data
   * @param {string} analysisType - Type of analysis
   * @returns {Object|null} Cached result or null if not found
   */
  export const getCachedAnalysis = (ideaData, analysisType) => {
    const cacheKey = generateCacheKey(ideaData, analysisType);
    if (!cacheKey) return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedData = JSON.parse(cached);
        // Check if cache is still valid (optional: add expiration logic here)
        return parsedData;
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    
    return null;
  };
  
  /**
   * Cache analysis result
   * @param {Object} ideaData - The startup idea data
   * @param {string} analysisType - Type of analysis
   * @param {Object} result - Analysis result to cache
   */
  export const setCachedAnalysis = (ideaData, analysisType, result) => {
    const cacheKey = generateCacheKey(ideaData, analysisType);
    if (!cacheKey) return;
    
    try {
      const cacheData = {
        ...result,
        cachedAt: new Date().toISOString(),
        ideaData: ideaData
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };
  
  /**
   * Clear all cached analysis for a specific idea
   * @param {Object} ideaData - The startup idea data
   */
  export const clearCachedAnalysisForIdea = (ideaData) => {
    const analysisTypes = ['risk', 'swot', 'brainstorm', 'competitor'];
    
    analysisTypes.forEach(type => {
      const cacheKey = generateCacheKey(ideaData, type);
      if (cacheKey) {
        try {
          localStorage.removeItem(cacheKey);
        } catch (error) {
          console.error('Error clearing cache:', error);
        }
      }
    });
  };