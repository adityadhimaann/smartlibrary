import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  categories: string[];
  languages: string[];
  publishers?: string[];
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  categories, 
  languages, 
  publishers = [],
  isLoading = false 
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    onSearch('', {});
  };

  const updateFilter = (key: keyof SearchFilters, value: string | number | boolean) => {
    const newFilters = { ...filters };
    if (value !== '' && value !== undefined && value !== null) {
      (newFilters as any)[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || query.length > 0;

  // Generate year options for publication year filter
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let year = currentYear; year >= 1800; year--) {
    yearOptions.push(year);
  }

  // Generate rating options
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for books, authors, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
            
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Title Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Book title..."
                value={filters.title || ''}
                onChange={(e) => updateFilter('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Author Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                placeholder="Author name..."
                value={filters.author || ''}
                onChange={(e) => updateFilter('author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={filters.language || ''}
                onChange={(e) => updateFilter('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Publisher Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publisher
              </label>
              <select
                value={filters.publisher || ''}
                onChange={(e) => updateFilter('publisher', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Publishers</option>
                {publishers.map((publisher) => (
                  <option key={publisher} value={publisher}>
                    {publisher}
                  </option>
                ))}
              </select>
            </div>

            {/* Publication Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Year
              </label>
              <select
                value={filters.minYear || ''}
                onChange={(e) => updateFilter('minYear', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Year
              </label>
              <select
                value={filters.maxYear || ''}
                onChange={(e) => updateFilter('maxYear', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Rating
              </label>
              <select
                value={filters.minRating || ''}
                onChange={(e) => updateFilter('minRating', e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating}+ Stars
                  </option>
                ))}
              </select>
            </div>

            {/* ISBN Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                placeholder="ISBN number..."
                value={filters.isbn || ''}
                onChange={(e) => updateFilter('isbn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Availability Filter */}
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="availableOnly"
                checked={filters.availableOnly || false}
                onChange={(e) => updateFilter('availableOnly', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="availableOnly" className="text-sm font-medium text-gray-700">
                Available only
              </label>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
