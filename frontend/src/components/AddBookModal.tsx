import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Save, BookOpen } from 'lucide-react';
import { Book } from '../types';
import { createBook } from '../services/api';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: (book: Book) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    language: 'English',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    description: '',
    coverImageUrl: '',
    totalCopies: 1,
    availableCopies: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance',
    'Thriller', 'Biography', 'History', 'Science', 'Technology', 'Business',
    'Self-Help', 'Health', 'Travel', 'Children', 'Young Adult', 'Poetry'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear()) {
      newErrors.publicationYear = 'Please enter a valid publication year';
    }
    if (formData.pageCount < 1) newErrors.pageCount = 'Page count must be at least 1';
    if (formData.totalCopies < 1) newErrors.totalCopies = 'Total copies must be at least 1';
    if (formData.availableCopies > formData.totalCopies) {
      newErrors.availableCopies = 'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newBook = await createBook({
        ...formData,
        averageRating: 0,
        ratingCount: 0
      });
      
      onBookAdded(newBook);
      onClose();
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        language: 'English',
        publisher: '',
        publicationYear: new Date().getFullYear(),
        pageCount: 0,
        description: '',
        coverImageUrl: '',
        totalCopies: 1,
        availableCopies: 1
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating book:', error);
      setErrors({ submit: 'Failed to create book. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Add New Book</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.isbn ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="978-0-123456-78-9"
              />
              {errors.isbn && <p className="text-red-500 text-xs mt-1">{errors.isbn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter publisher name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Year
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                min="1000"
                max={new Date().getFullYear()}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.publicationYear ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.publicationYear && <p className="text-red-500 text-xs mt-1">{errors.publicationYear}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Count
              </label>
              <input
                type="number"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.pageCount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pageCount && <p className="text-red-500 text-xs mt-1">{errors.pageCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Copies
              </label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.totalCopies ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.totalCopies && <p className="text-red-500 text-xs mt-1">{errors.totalCopies}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Copies
              </label>
              <input
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleInputChange}
                min="0"
                max={formData.totalCopies}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.availableCopies ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.availableCopies && <p className="text-red-500 text-xs mt-1">{errors.availableCopies}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book description"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Book'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBookModal;
