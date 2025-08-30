package com.smartlibrary.config;

import com.smartlibrary.model.Book;
import com.smartlibrary.model.User;
import com.smartlibrary.model.Rating;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.UserRepository;
import com.smartlibrary.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Override
    public void run(String... args) throws Exception {
        loadSampleData();
    }
    
    private void loadSampleData() {
        if (bookRepository.count() > 0) {
            return; // Data already loaded
        }
        
        // Create sample users
        List<User> users = Arrays.asList(
            new User("alice_reader", "alice@example.com", "password123", "Alice", "Johnson"),
            new User("bob_student", "bob@example.com", "password123", "Bob", "Smith"),
            new User("carol_prof", "carol@example.com", "password123", "Carol", "Brown")
        );
        
        users.forEach(user -> user.setRole(User.Role.USER));
        userRepository.saveAll(users);
        
        // Create sample books
        List<Book> books = Arrays.asList(
            new Book("The Great Gatsby", "F. Scott Fitzgerald", "978-0-7432-7356-5", "Fiction", 3, 5),
            new Book("To Kill a Mockingbird", "Harper Lee", "978-0-06-112008-4", "Fiction", 2, 4),
            new Book("1984", "George Orwell", "978-0-452-28423-4", "Dystopian Fiction", 4, 6),
            new Book("Pride and Prejudice", "Jane Austen", "978-0-14-143951-8", "Romance", 3, 5),
            new Book("The Catcher in the Rye", "J.D. Salinger", "978-0-316-76948-0", "Fiction", 2, 4),
            new Book("Lord of the Flies", "William Golding", "978-0-571-05686-2", "Fiction", 3, 5),
            new Book("The Hobbit", "J.R.R. Tolkien", "978-0-547-92822-7", "Fantasy", 4, 6),
            new Book("Fahrenheit 451", "Ray Bradbury", "978-1-4516-7331-9", "Science Fiction", 3, 5),
            new Book("Jane Eyre", "Charlotte Brontë", "978-0-14-144114-6", "Romance", 2, 4),
            new Book("The Chronicles of Narnia", "C.S. Lewis", "978-0-06-623851-0", "Fantasy", 3, 5),
            new Book("Brave New World", "Aldous Huxley", "978-0-06-085052-4", "Science Fiction", 2, 4),
            new Book("The Lord of the Rings", "J.R.R. Tolkien", "978-0-547-92819-7", "Fantasy", 3, 5),
            new Book("Animal Farm", "George Orwell", "978-0-452-28424-1", "Political Satire", 4, 6),
            new Book("Of Mice and Men", "John Steinbeck", "978-0-14-017739-8", "Fiction", 3, 5),
            new Book("The Grapes of Wrath", "John Steinbeck", "978-0-14-303943-3", "Fiction", 2, 4),
            new Book("Wuthering Heights", "Emily Brontë", "978-0-14-143955-6", "Romance", 2, 4),
            new Book("The Picture of Dorian Gray", "Oscar Wilde", "978-0-14-143957-0", "Gothic Fiction", 3, 5),
            new Book("Dracula", "Bram Stoker", "978-0-14-143984-6", "Horror", 2, 4),
            new Book("Frankenstein", "Mary Shelley", "978-0-14-143947-1", "Gothic Fiction", 3, 5),
            new Book("The Strange Case of Dr. Jekyll and Mr. Hyde", "Robert Louis Stevenson", "978-0-14-143987-7", "Gothic Fiction", 4, 6)
        );
        
        // Set additional properties for books
        for (int i = 0; i < books.size(); i++) {
            Book book = books.get(i);
            book.setLanguage("English");
            book.setPublicationYear(1900 + (i * 5) % 120 + 1900); // Random years between 1900-2020
            book.setPageCount(200 + (i * 50) % 400); // Random page counts between 200-600
            book.setDescription("A classic literary work that has captivated readers for generations.");
            book.setCoverImageUrl("https://via.placeholder.com/300x400?text=" + book.getTitle().replace(" ", "+"));
        }
        
        bookRepository.saveAll(books);
        
        // Create sample ratings
        List<Book> savedBooks = bookRepository.findAll();
        List<User> savedUsers = userRepository.findAll();
        
        for (int i = 0; i < savedBooks.size() && i < 10; i++) {
            Book book = savedBooks.get(i);
            User user = savedUsers.get(i % savedUsers.size());
            
            Rating rating = new Rating(user, book, 4 + (i % 2)); // Ratings between 4-5
            rating.setReview("This is a wonderful book! Highly recommended.");
            ratingRepository.save(rating);
            
            // Update book average rating
            book.setAverageRating(4.0 + (i % 2) * 0.5);
            book.setRatingCount(1);
            bookRepository.save(book);
        }
        
        System.out.println("Sample data loaded successfully!");
        System.out.println("Books loaded: " + bookRepository.count());
        System.out.println("Users loaded: " + userRepository.count());
        System.out.println("Ratings loaded: " + ratingRepository.count());
    }
}
