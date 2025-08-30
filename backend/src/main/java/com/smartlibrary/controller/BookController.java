package com.smartlibrary.controller;

import com.smartlibrary.model.Book;
import com.smartlibrary.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Book> books = bookService.getAllBooks(pageable);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Optional<Book> book = bookService.getBookById(id);
        return book.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<Book> getBookByIsbn(@PathVariable String isbn) {
        Optional<Book> book = bookService.getBookByIsbn(isbn);
        return book.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        try {
            Book savedBook = bookService.saveBook(book);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
        try {
            Book updatedBook = bookService.updateBook(id, bookDetails);
            return ResponseEntity.ok(updatedBook);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBook(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<Book>> searchBooks(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String isbn,
            @RequestParam(required = false) String publisher,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(required = false) Boolean availableOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Book> books;
        
        if (q != null && !q.trim().isEmpty()) {
            // General search
            books = bookService.searchBooks(q, pageable);
        } else {
            // Advanced search with filters
            books = bookService.findBooksWithEnhancedFilters(title, author, category, language, isbn, 
                    publisher, minYear, maxYear, minRating, maxRating, availableOnly, pageable);
        }
        
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/available")
    public ResponseEntity<Page<Book>> getAvailableBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookService.getAvailableBooks(pageable);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/top-rated")
    public ResponseEntity<Page<Book>> getTopRatedBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<Book> books = bookService.getTopRatedBooks(page, size);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = bookService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAllLanguages() {
        List<String> languages = bookService.getAllLanguages();
        return ResponseEntity.ok(languages);
    }
    
    @GetMapping("/publishers")
    public ResponseEntity<List<String>> getAllPublishers() {
        List<String> publishers = bookService.getAllPublishers();
        return ResponseEntity.ok(publishers);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Book>> getBooksByCategory(@PathVariable String category) {
        List<Book> books = bookService.getBooksByCategory(category);
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> checkBookAvailability(@PathVariable Long id) {
        boolean isAvailable = bookService.isBookAvailable(id);
        return ResponseEntity.ok(isAvailable);
    }
}
