import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, TrendingUp, Sparkles, Grid, List, Plus } from 'lucide-react';
import BookCard from './components/BookCard';
import SearchBar from './components/SearchBar';
import AddBookModal from './components/AddBookModal';
import BookDetailModal from './components/BookDetailModal';
import { Book, SearchFilters } from './types';
import { bookApi, recommendationApi } from './services/api';
import './index.css';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [publishers, setPublishers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'new' | 'recommendations'>('all');
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailModalOpen, setIsBookDetailModalOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
    loadMetadata();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await bookApi.getBooks(0, 12);
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetadata = async () => {
    try {
      const [categoriesData, languagesData, publishersData] = await Promise.all([
        bookApi.getCategories(),
        bookApi.getLanguages(),
        bookApi.getPublishers(),
      ]);
      setCategories(categoriesData);
      setLanguages(languagesData);
      setPublishers(publishersData);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const loadTrendingBooks = async () => {
    try {
      setIsLoading(true);
      const trending = await recommendationApi.getTrendingBooks(12);
      setTrendingBooks(trending);
    } catch (error) {
      console.error('Error loading trending books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNewArrivals = async () => {
    try {
      setIsLoading(true);
      const newBooks = await recommendationApi.getNewArrivals(12);
      setNewArrivals(newBooks);
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      // Using user ID 1 as default - in real app, this would come from auth
      const userRecommendations = await recommendationApi.getRecommendationsForUser(1, 12);
      setRecommendations(userRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    try {
      setIsLoading(true);
      const response = await bookApi.searchBooks(query, filters, 0, 12);
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(0);
      setActiveTab('all');
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await bookApi.getBooks(page, 12);
      setBooks(response.content);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'all' | 'trending' | 'new' | 'recommendations') => {
    setActiveTab(tab);
    switch (tab) {
      case 'all':
        loadInitialData();
        break;
      case 'trending':
        loadTrendingBooks();
        break;
      case 'new':
        loadNewArrivals();
        break;
      case 'recommendations':
        loadRecommendations();
        break;
    }
  };

  const handleBookAdded = (newBook: Book) => {
    // Add the new book to the current list
    setBooks(prevBooks => [newBook, ...prevBooks]);
    // Switch to 'all' tab to show the new book
    setActiveTab('all');
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailModalOpen(true);
  };

  const handleCloseBookDetail = () => {
    setIsBookDetailModalOpen(false);
    setSelectedBook(null);
  };

  const getCurrentBooks = () => {
    switch (activeTab) {
      case 'trending':
        return trendingBooks;
      case 'new':
        return newArrivals;
      case 'recommendations':
        return recommendations;
      default:
        return books;
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Library</h1>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsAddBookModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Book</span>
              </motion.button>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar
            onSearch={handleSearch}
            categories={categories}
            languages={languages}
            publishers={publishers}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'all', label: 'All Books', icon: BookOpen },
              { id: 'trending', label: 'Trending', icon: TrendingUp },
              { id: 'new', label: 'New Arrivals', icon: Sparkles },
              { id: 'recommendations', label: 'For You', icon: Sparkles },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {renderLoadingSkeleton()}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {getCurrentBooks().map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BookCard book={book} onClick={() => handleBookClick(book)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {!isLoading && activeTab === 'all' && totalPages > 1 && (
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <nav className="flex items-center space-x-2">
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    currentPage === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </nav>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && getCurrentBooks().length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search filters or explore different categories.</p>
          </motion.div>
        )}
      </main>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onBookAdded={handleBookAdded}
      />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={isBookDetailModalOpen}
          onClose={handleCloseBookDetail}
        />
      )}
    </div>
  );
}

export default App;
