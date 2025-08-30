package com.smartlibrary.service;

import com.smartlibrary.model.Book;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }
    
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
    
    public Optional<Book> getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }
    
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setDescription(bookDetails.getDescription());
        book.setCategory(bookDetails.getCategory());
        book.setPublisher(bookDetails.getPublisher());
        book.setPublicationYear(bookDetails.getPublicationYear());
        book.setPageCount(bookDetails.getPageCount());
        book.setLanguage(bookDetails.getLanguage());
        book.setCoverImageUrl(bookDetails.getCoverImageUrl());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        book.setTotalCopies(bookDetails.getTotalCopies());
        
        return bookRepository.save(book);
    }
    
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
        bookRepository.delete(book);
    }
    
    public Page<Book> searchBooks(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return bookRepository.findAll(pageable);
        }
        return bookRepository.searchBooks(searchTerm.trim(), pageable);
    }
    
    public Page<Book> findBooksWithFilters(String title, String author, String category, 
                                          String language, String isbn, Pageable pageable) {
        return bookRepository.findBooksWithFilters(title, author, category, language, isbn, pageable);
    }
    
    public Page<Book> findBooksWithEnhancedFilters(String title, String author, String category, 
                                                  String language, String isbn, String publisher,
                                                  Integer minYear, Integer maxYear, Integer minRating, 
                                                  Integer maxRating, Boolean availableOnly, Pageable pageable) {
        return bookRepository.findBooksWithEnhancedFilters(title, author, category, language, isbn, 
                publisher, minYear, maxYear, minRating, maxRating, availableOnly, pageable);
    }
    
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }
    
    public List<String> getAllLanguages() {
        return bookRepository.findAllLanguages();
    }
    
    public List<String> getAllPublishers() {
        return bookRepository.findAllPublishers();
    }
    
    public Page<Book> getAvailableBooks(Pageable pageable) {
        return bookRepository.findAvailableBooks(pageable);
    }
    
    public Page<Book> getTopRatedBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("averageRating").descending());
        return bookRepository.findTopRatedBooks(pageable);
    }
    
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }
    
    public List<Book> findBooksByTitleContaining(String title) {
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }
    
    public List<Book> findBooksByAuthorContaining(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }
    
    public void updateBookRating(Long bookId) {
        Double averageRating = ratingRepository.findAverageRatingByBookId(bookId);
        Long ratingCount = ratingRepository.countRatingsByBookId(bookId);
        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        book.setAverageRating(averageRating);
        book.setRatingCount(ratingCount.intValue());
        bookRepository.save(book);
    }
    
    public boolean isBookAvailable(Long bookId) {
        Optional<Book> book = bookRepository.findById(bookId);
        return book.isPresent() && book.get().getAvailableCopies() > 0;
    }
    
    public void decreaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        if (book.getAvailableCopies() > 0) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            throw new RuntimeException("No available copies for this book");
        }
    }
    
    public void increaseAvailableCopies(Long bookId) {
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }
    }
}
