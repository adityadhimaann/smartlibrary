import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Calendar, BookOpen, User, Hash, Globe, Building } from 'lucide-react';
import { Book } from '../types';
import { generatePlaceholderCover } from '../utils/bookCover';
import OptimizedImage from './OptimizedImage';

interface BookDetailModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden shadow-lg">
                <OptimizedImage
                  src={book.coverImageUrl || ''}
                  alt={book.title}
                  fallback={generatePlaceholderCover(book.title, book.author)}
                  className="rounded-lg"
                  lazy={false}
                  retryCount={3}
                />
              </div>

              {/* Availability */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className={`font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${(book.availableCopies / book.totalCopies) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <User className="w-5 h-5 mr-2" />
                  <span>by {book.author}</span>
                </div>

                {/* Rating */}
                {book.averageRating && (
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {renderStars(book.averageRating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {book.averageRating.toFixed(1)} ({book.ratingCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Book Details Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Category:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {book.category}
                    </span>
                  </div>

                  {book.language && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{book.language}</span>
                    </div>
                  )}

                  {book.publisher && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Publisher:</span>
                      <span className="font-medium">{book.publisher}</span>
                    </div>
                  )}

                  {book.publicationYear && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">{book.publicationYear}</span>
                    </div>
                  )}

                  {book.pageCount && (
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Pages:</span>
                      <span className="font-medium">{book.pageCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  disabled={book.availableCopies === 0}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    book.availableCopies > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {book.availableCopies > 0 ? 'Borrow Book' : 'Not Available'}
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookDetailModal;
