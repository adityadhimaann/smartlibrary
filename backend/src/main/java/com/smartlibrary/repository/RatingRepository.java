package com.smartlibrary.repository;

import com.smartlibrary.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    
    Optional<Rating> findByUserIdAndBookId(Long userId, Long bookId);
    
    List<Rating> findByBookIdOrderByCreatedAtDesc(Long bookId);
    
    List<Rating> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.book.id = :bookId")
    Double findAverageRatingByBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.book.id = :bookId")
    Long countRatingsByBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT r FROM Rating r WHERE r.book.id = :bookId AND r.review IS NOT NULL AND r.review != '' ORDER BY r.createdAt DESC")
    List<Rating> findReviewsByBookId(@Param("bookId") Long bookId);
}
