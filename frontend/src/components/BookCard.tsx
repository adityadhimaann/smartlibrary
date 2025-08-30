import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen, Users, Calendar } from 'lucide-react';
import { Book } from '../types';
import { generatePlaceholderCover } from '../utils/bookCover';
import OptimizedImage from './OptimizedImage';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="book-card bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Book Cover */}
      <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden book-cover-container">
        <OptimizedImage
          src={book.coverImageUrl || ''}
          alt={book.title}
          fallback={generatePlaceholderCover(book.title, book.author)}
          className="group-hover:scale-105 transition-transform duration-300"
          onLoad={() => setImageLoaded(true)}
          lazy={true}
          retryCount={2}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              book.availableCopies > 0
                ? 'bg-green-100/90 text-green-800'
                : 'bg-red-100/90 text-red-800'
            }`}
          >
            {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
          </motion.div>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
        
        {/* Rating */}
        {book.averageRating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(book.averageRating)}
            </div>
            <span className="text-sm text-gray-500">
              {book.averageRating.toFixed(1)} ({book.ratingCount})
            </span>
          </div>
        )}

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {book.category}
          </span>
        </div>

        {/* Book Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{book.availableCopies}/{book.totalCopies}</span>
          </div>
          
          {book.publicationYear && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{book.publicationYear}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {book.description && (
          <p className="text-gray-600 text-sm mt-3 line-clamp-2">
            {book.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
