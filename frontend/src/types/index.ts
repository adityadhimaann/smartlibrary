export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  category: string;
  publisher?: string;
  publicationYear?: number;
  pageCount?: number;
  language?: string;
  coverImageUrl?: string;
  availableCopies: number;
  totalCopies: number;
  averageRating?: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'USER' | 'LIBRARIAN' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: number;
  user: User;
  book: Book;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowRecord {
  id: number;
  user: User;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE' | 'LOST';
  fineAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  title?: string;
  author?: string;
  category?: string;
  language?: string;
  isbn?: string;
  publisher?: string;
  minYear?: number;
  maxYear?: number;
  minRating?: number;
  maxRating?: number;
  availableOnly?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
  };
}

export interface RecommendationDashboard {
  recommendations: Book[];
  trending: Book[];
  newArrivals: Book[];
  categoryRecommendations: { [category: string]: Book[] };
}
