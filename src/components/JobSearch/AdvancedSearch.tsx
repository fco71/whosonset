import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, MapPin, Briefcase, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePerformanceTracking } from '../../utilities/performanceAnalytics';
import { searchCache, CACHE_KEYS } from '../../utilities/cacheManager';
import { toast } from 'react-hot-toast';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'job_title' | 'department' | 'location' | 'company' | 'skill' | 'contractType';
  count?: number;
  relevance: number;
}

interface SearchFilters {
  department?: string;
  location?: string;
  experience?: string;
  contractType?: string;
  salary?: {
    min?: number;
    max?: number;
  };
  datePosted?: string;
  remote?: boolean;
}

interface AdvancedSearchProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = "Search jobs, departments, locations...",
  showFilters = true,
  className = ""
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackSearch } = usePerformanceTracking();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from cache
  useEffect(() => {
    const cached = searchCache.get<string[]>(CACHE_KEYS.SEARCH.RECENT);
    if (cached) {
      setRecentSearches(cached);
    }
  }, []);

  // Load popular searches
  useEffect(() => {
    loadPopularSearches();
  }, []);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPopularSearches = async () => {
    const popular: SearchSuggestion[] = [
      { id: '1', text: 'Camera Operator', type: 'job_title', count: 45, relevance: 0.9 },
      { id: '2', text: 'Sound Engineer', type: 'job_title', count: 32, relevance: 0.8 },
      { id: '3', text: 'Los Angeles', type: 'location', count: 128, relevance: 0.9 },
      { id: '4', text: 'New York', type: 'location', count: 95, relevance: 0.8 },
      { id: '5', text: 'Post-Production', type: 'department', count: 67, relevance: 0.7 },
      { id: '6', text: 'Freelance', type: 'contractType', count: 89, relevance: 0.6 },
    ];
    setPopularSearches(popular);
  };

  const generateSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const startTime = performance.now();
    setIsLoading(true);

    try {
      // Check cache first
      const cacheKey = CACHE_KEYS.SEARCH.SUGGESTIONS(searchQuery.toLowerCase());
      const cached = searchCache.get<SearchSuggestion[]>(cacheKey);
      
      if (cached) {
        setSuggestions(cached);
        setIsLoading(false);
        return;
      }

      // Generate suggestions based on query
      const allSuggestions: SearchSuggestion[] = [
        // Job titles
        { id: 'job1', text: 'Camera Operator', type: 'job_title', count: 45, relevance: 0.9 },
        { id: 'job2', text: 'Sound Engineer', type: 'job_title', count: 32, relevance: 0.8 },
        { id: 'job3', text: 'Lighting Technician', type: 'job_title', count: 28, relevance: 0.7 },
        { id: 'job4', text: 'Production Assistant', type: 'job_title', count: 67, relevance: 0.6 },
        
        // Departments
        { id: 'dept1', text: 'Camera', type: 'department', count: 89, relevance: 0.8 },
        { id: 'dept2', text: 'Sound', type: 'department', count: 56, relevance: 0.7 },
        { id: 'dept3', text: 'Lighting', type: 'department', count: 43, relevance: 0.6 },
        { id: 'dept4', text: 'Post-Production', type: 'department', count: 67, relevance: 0.5 },
        
        // Locations
        { id: 'loc1', text: 'Los Angeles, CA', type: 'location', count: 128, relevance: 0.9 },
        { id: 'loc2', text: 'New York, NY', type: 'location', count: 95, relevance: 0.8 },
        { id: 'loc3', text: 'Atlanta, GA', type: 'location', count: 73, relevance: 0.7 },
        { id: 'loc4', text: 'Vancouver, BC', type: 'location', count: 52, relevance: 0.6 },
        
        // Companies
        { id: 'comp1', text: 'Netflix', type: 'company', count: 23, relevance: 0.8 },
        { id: 'comp2', text: 'Disney', type: 'company', count: 18, relevance: 0.7 },
        { id: 'comp3', text: 'Warner Bros', type: 'company', count: 15, relevance: 0.6 },
        
        // Skills
        { id: 'skill1', text: 'Adobe Premiere', type: 'skill', count: 89, relevance: 0.7 },
        { id: 'skill2', text: 'Final Cut Pro', type: 'skill', count: 67, relevance: 0.6 },
        { id: 'skill3', text: 'Arri Alexa', type: 'skill', count: 45, relevance: 0.8 },
      ];

      // Filter and rank suggestions
      const filtered = allSuggestions
        .filter(suggestion => 
          suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          // Sort by relevance first, then by count
          if (Math.abs(a.relevance - b.relevance) > 0.1) {
            return b.relevance - a.relevance;
          }
          return (b.count || 0) - (a.count || 0);
        })
        .slice(0, 8);

      // Cache the results
      searchCache.set(cacheKey, filtered, 5 * 60 * 1000); // 5 minutes
      
      setSuggestions(filtered);
      
      // Track search performance
      const duration = performance.now() - startTime;
      trackSearch(searchQuery, filtered.length, duration);
      
    } catch (error) {
      console.error('Error generating suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [trackSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim()) {
      generateSuggestions(value);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    performSearch(suggestion.text);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
  };

  const performSearch = (searchQuery: string) => {
    const startTime = performance.now();
    
    // Add to recent searches
    const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updatedRecent);
    searchCache.set(CACHE_KEYS.SEARCH.RECENT, updatedRecent, 24 * 60 * 60 * 1000); // 24 hours

    // Navigate to search results
    const searchParams = new URLSearchParams();
    searchParams.set('q', searchQuery);
    
    // Add filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (typeof value === 'object') {
          if (value.min) searchParams.set('min_salary', value.min.toString());
          if (value.max) searchParams.set('max_salary', value.max.toString());
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });

    const searchUrl = `/jobs?${searchParams.toString()}`;
    navigate(searchUrl);

    // Track search performance
    const duration = performance.now() - startTime;
    trackSearch(searchQuery, 0, duration);

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(searchQuery, filters);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'job_title': return <Briefcase className="w-4 h-4" />;
      case 'department': return <Briefcase className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'company': return <Briefcase className="w-4 h-4" />;
      case 'skill': return <Briefcase className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'job_title': return 'text-blue-600 bg-blue-50';
      case 'department': return 'text-green-600 bg-green-50';
      case 'location': return 'text-purple-600 bg-purple-50';
      case 'company': return 'text-orange-600 bg-orange-50';
      case 'skill': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() && setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          />
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters Toggle */}
        {showFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="mt-2 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.keys(filters).length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {Object.keys(filters).length}
              </span>
            )}
          </Button>
        )}
      </form>

      {/* Filters Panel */}
      {showFiltersPanel && showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value || undefined }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Departments</option>
                <option value="camera">Camera</option>
                <option value="sound">Sound</option>
                <option value="lighting">Lighting</option>
                <option value="art">Art</option>
                <option value="post-production">Post-Production</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                placeholder="City, State"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={filters.experience || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value || undefined }))}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
                Suggestions
              </h3>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <div className={`p-1 rounded ${getSuggestionColor(suggestion.type)}`}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type.replace('_', ' ')}
                      {suggestion.count && ` • ${suggestion.count} jobs`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
                Recent Searches
              </h3>
              {recentSearches.map((searchTerm, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(searchTerm)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{searchTerm}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1">
                Popular Searches
              </h3>
              {popularSearches.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{suggestion.text}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.count} jobs available
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch; 