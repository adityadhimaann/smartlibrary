package com.smartlibrary.service;

import com.smartlibrary.model.Book;
import com.smartlibrary.model.BorrowRecord;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.BorrowRecordRepository;
import com.smartlibrary.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private BorrowRecordRepository borrowRecordRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    private static final int DEFAULT_RECOMMENDATION_SIZE = 10;
    
    public List<Book> getRecommendationsForUser(Long userId) {
        return getRecommendationsForUser(userId, DEFAULT_RECOMMENDATION_SIZE);
    }
    
    public List<Book> getRecommendationsForUser(Long userId, int limit) {
        Set<Book> recommendations = new LinkedHashSet<>();
        
        // 1. Get user's preferred categories based on borrowing history
        List<String> preferredCategories = borrowRecordRepository.findUserPreferredCategories(userId);
        
        // 2. Get highly rated books from preferred categories
        for (String category : preferredCategories) {
            Pageable pageable = PageRequest.of(0, 3);
            List<Book> categoryBooks = bookRepository.findRecommendedBooksByCategory(category, pageable);
            recommendations.addAll(categoryBooks);
            
            if (recommendations.size() >= limit) break;
        }
        
        // 3. If we still need more recommendations, add top-rated books overall
        if (recommendations.size() < limit) {
            Pageable pageable = PageRequest.of(0, limit - recommendations.size());
            List<Book> topRatedBooks = bookRepository.findBooksByMinRating(4.0);
            recommendations.addAll(topRatedBooks.stream()
                .limit(limit - recommendations.size())
                .collect(Collectors.toList()));
        }
        
        // 4. If still need more, add available books
        if (recommendations.size() < limit) {
            Pageable pageable = PageRequest.of(0, limit - recommendations.size());
            List<Book> availableBooks = bookRepository.findAvailableBooks(pageable).getContent();
            recommendations.addAll(availableBooks);
        }
        
        return recommendations.stream()
            .filter(book -> book.getAvailableCopies() > 0)
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    public List<Book> getSimilarBooks(Long bookId) {
        return getSimilarBooks(bookId, 5);
    }
    
    public List<Book> getSimilarBooks(Long bookId, int limit) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (!bookOpt.isPresent()) {
            return Collections.emptyList();
        }
        
        Book book = bookOpt.get();
        Set<Book> similarBooks = new LinkedHashSet<>();
        
        // 1. Books by the same author
        Pageable pageable = PageRequest.of(0, 3);
        List<Book> sameAuthorBooks = bookRepository.findBooksByAuthorExcluding(
            book.getAuthor(), bookId, pageable);
        similarBooks.addAll(sameAuthorBooks);
        
        // 2. Books in the same category
        if (similarBooks.size() < limit) {
            List<Book> sameCategoryBooks = bookRepository.findRecommendedBooksByCategory(
                book.getCategory(), PageRequest.of(0, limit - similarBooks.size()));
            similarBooks.addAll(sameCategoryBooks.stream()
                .filter(b -> !b.getId().equals(bookId))
                .collect(Collectors.toList()));
        }
        
        return similarBooks.stream()
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    public List<Book> getTrendingBooks() {
        return getTrendingBooks(10);
    }
    
    public List<Book> getTrendingBooks(int limit) {
        // Get books with highest ratings and recent activity
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findTopRatedBooks(pageable).getContent();
    }
    
    public List<Book> getNewArrivals() {
        return getNewArrivals(10);
    }
    
    public List<Book> getNewArrivals(int limit) {
        // Get recently added books
        Pageable pageable = PageRequest.of(0, limit, 
            org.springframework.data.domain.Sort.by("createdAt").descending());
        return bookRepository.findAll(pageable).getContent();
    }
    
    public List<Book> getPopularInCategory(String category) {
        return getPopularInCategory(category, 10);
    }
    
    public List<Book> getPopularInCategory(String category, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return bookRepository.findRecommendedBooksByCategory(category, pageable);
    }
    
    public Map<String, Object> getPersonalizedDashboard(Long userId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Personal recommendations
        dashboard.put("recommendations", getRecommendationsForUser(userId, 6));
        
        // Trending books
        dashboard.put("trending", getTrendingBooks(6));
        
        // New arrivals
        dashboard.put("newArrivals", getNewArrivals(6));
        
        // User's preferred categories with popular books
        List<String> preferredCategories = borrowRecordRepository.findUserPreferredCategories(userId);
        Map<String, List<Book>> categoryBooks = new HashMap<>();
        
        for (String category : preferredCategories.stream().limit(3).collect(Collectors.toList())) {
            categoryBooks.put(category, getPopularInCategory(category, 4));
        }
        dashboard.put("categoryRecommendations", categoryBooks);
        
        return dashboard;
    }
}
