import axios from 'axios';
import { Book, PaginatedResponse, SearchFilters, RecommendationDashboard } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Book API
export const bookApi = {
  // Get all books with pagination
  getBooks: async (page = 0, size = 12, sortBy = 'title', sortDir = 'asc'): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books', {
      params: { page, size, sortBy, sortDir }
    });
    return response.data;
  },

  // Get book by ID
  getBook: async (id: number): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Search books
  searchBooks: async (
    query: string,
    filters: SearchFilters = {},
    page = 0,
    size = 12,
    sortBy = 'title',
    sortDir = 'asc'
  ): Promise<PaginatedResponse<Book>> => {
    const params: any = { page, size, sortBy, sortDir };
    
    if (query) {
      params.q = query;
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    const response = await api.get('/books/search', { params });
    return response.data;
  },

  // Get available books
  getAvailableBooks: async (page = 0, size = 12): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books/available', {
      params: { page, size }
    });
    return response.data;
  },

  // Get top rated books
  getTopRatedBooks: async (page = 0, size = 12): Promise<PaginatedResponse<Book>> => {
    const response = await api.get('/books/top-rated', {
      params: { page, size }
    });
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/books/categories');
    return response.data;
  },

  // Get all languages
  getLanguages: async (): Promise<string[]> => {
    const response = await api.get('/books/languages');
    return response.data;
  },

  // Get all publishers
  getPublishers: async (): Promise<string[]> => {
    const response = await api.get('/books/publishers');
    return response.data;
  },

  // Get books by category
  getBooksByCategory: async (category: string): Promise<Book[]> => {
    const response = await api.get(`/books/category/${category}`);
    return response.data;
  },

  // Check book availability
  checkAvailability: async (id: number): Promise<boolean> => {
    const response = await api.get(`/books/${id}/availability`);
    return response.data;
  },

  // Create new book
  createBook: async (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> => {
    const response = await api.post('/books', book);
    return response.data;
  },

  // Update book
  updateBook: async (id: number, book: Partial<Book>): Promise<Book> => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },

  // Delete book
  deleteBook: async (id: number): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

// Recommendation API
export const recommendationApi = {
  // Get recommendations for user
  getRecommendationsForUser: async (userId: number, limit = 10): Promise<Book[]> => {
    const response = await api.get(`/recommendations/user/${userId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get similar books
  getSimilarBooks: async (bookId: number, limit = 5): Promise<Book[]> => {
    const response = await api.get(`/recommendations/similar/${bookId}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get trending books
  getTrendingBooks: async (limit = 10): Promise<Book[]> => {
    const response = await api.get('/recommendations/trending', {
      params: { limit }
    });
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit = 10): Promise<Book[]> => {
    const response = await api.get('/recommendations/new-arrivals', {
      params: { limit }
    });
    return response.data;
  },

  // Get popular books in category
  getPopularInCategory: async (category: string, limit = 10): Promise<Book[]> => {
    const response = await api.get(`/recommendations/popular/${category}`, {
      params: { limit }
    });
    return response.data;
  },

  // Get personalized dashboard
  getPersonalizedDashboard: async (userId: number): Promise<RecommendationDashboard> => {
    const response = await api.get(`/recommendations/dashboard/${userId}`);
    return response.data;
  },
};

export default api;

// Export individual functions for convenience
export const {
  getBooks,
  getBook,
  searchBooks,
  getAvailableBooks,
  getTopRatedBooks,
  getCategories,
  getLanguages,
  getBooksByCategory,
  checkAvailability,
  createBook,
  updateBook,
  deleteBook
} = bookApi;
