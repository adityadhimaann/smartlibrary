package com.smartlibrary.repository;

import com.smartlibrary.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    Optional<Book> findByIsbn(String isbn);
    
    List<Book> findByTitleContainingIgnoreCase(String title);
    
    List<Book> findByAuthorContainingIgnoreCase(String author);
    
    List<Book> findByCategory(String category);
    
    List<Book> findByLanguage(String language);
    
    @Query("SELECT DISTINCT b.category FROM Book b ORDER BY b.category")
    List<String> findAllCategories();
    
    @Query("SELECT DISTINCT b.language FROM Book b WHERE b.language IS NOT NULL ORDER BY b.language")
    List<String> findAllLanguages();
    
    @Query("SELECT DISTINCT b.publisher FROM Book b WHERE b.publisher IS NOT NULL ORDER BY b.publisher")
    List<String> findAllPublishers();
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:language IS NULL OR b.language = :language) AND " +
           "(:isbn IS NULL OR b.isbn = :isbn)")
    Page<Book> findBooksWithFilters(@Param("title") String title,
                                   @Param("author") String author,
                                   @Param("category") String category,
                                   @Param("language") String language,
                                   @Param("isbn") String isbn,
                                   Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:category IS NULL OR b.category = :category) AND " +
           "(:language IS NULL OR b.language = :language) AND " +
           "(:isbn IS NULL OR b.isbn = :isbn) AND " +
           "(:publisher IS NULL OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :publisher, '%'))) AND " +
           "(:minYear IS NULL OR b.publicationYear >= :minYear) AND " +
           "(:maxYear IS NULL OR b.publicationYear <= :maxYear) AND " +
           "(:minRating IS NULL OR b.averageRating >= :minRating) AND " +
           "(:maxRating IS NULL OR b.averageRating <= :maxRating) AND " +
           "(:availableOnly IS NULL OR :availableOnly = false OR b.availableCopies > 0)")
    Page<Book> findBooksWithEnhancedFilters(@Param("title") String title,
                                           @Param("author") String author,
                                           @Param("category") String category,
                                           @Param("language") String language,
                                           @Param("isbn") String isbn,
                                           @Param("publisher") String publisher,
                                           @Param("minYear") Integer minYear,
                                           @Param("maxYear") Integer maxYear,
                                           @Param("minRating") Integer minRating,
                                           @Param("maxRating") Integer maxRating,
                                           @Param("availableOnly") Boolean availableOnly,
                                           Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.category) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Book> searchBooks(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.availableCopies > 0")
    Page<Book> findAvailableBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b ORDER BY b.averageRating DESC NULLS LAST")
    Page<Book> findTopRatedBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.averageRating >= :minRating ORDER BY b.averageRating DESC")
    List<Book> findBooksByMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT b FROM Book b WHERE b.category = :category ORDER BY b.averageRating DESC NULLS LAST")
    List<Book> findRecommendedBooksByCategory(@Param("category") String category, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.author = :author AND b.id != :excludeId ORDER BY b.averageRating DESC NULLS LAST")
    List<Book> findBooksByAuthorExcluding(@Param("author") String author, @Param("excludeId") Long excludeId, Pageable pageable);
}
