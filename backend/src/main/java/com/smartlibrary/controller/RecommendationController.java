package com.smartlibrary.controller;

import com.smartlibrary.model.Book;
import com.smartlibrary.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {
    
    @Autowired
    private RecommendationService recommendationService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Book>> getRecommendationsForUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Book> recommendations = recommendationService.getRecommendationsForUser(userId, limit);
        return ResponseEntity.ok(recommendations);
    }
    
    @GetMapping("/similar/{bookId}")
    public ResponseEntity<List<Book>> getSimilarBooks(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "5") int limit) {
        
        List<Book> similarBooks = recommendationService.getSimilarBooks(bookId, limit);
        return ResponseEntity.ok(similarBooks);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<List<Book>> getTrendingBooks(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Book> trendingBooks = recommendationService.getTrendingBooks(limit);
        return ResponseEntity.ok(trendingBooks);
    }
    
    @GetMapping("/new-arrivals")
    public ResponseEntity<List<Book>> getNewArrivals(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Book> newArrivals = recommendationService.getNewArrivals(limit);
        return ResponseEntity.ok(newArrivals);
    }
    
    @GetMapping("/popular/{category}")
    public ResponseEntity<List<Book>> getPopularInCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Book> popularBooks = recommendationService.getPopularInCategory(category, limit);
        return ResponseEntity.ok(popularBooks);
    }
    
    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<Map<String, Object>> getPersonalizedDashboard(@PathVariable Long userId) {
        Map<String, Object> dashboard = recommendationService.getPersonalizedDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }
}
