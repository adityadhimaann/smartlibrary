# Smart Library Book Search and Recommendation System

A modern full-stack library management system with intelligent book search and personalized recommendations, built with Java Spring Boot backend and React TypeScript frontend.

## 🚀 Features

### Backend Features
- **RESTful API** with Spring Boot 3.2.0
- **Intelligent Search** - Search books by title, author, genre, or ISBN
- **Smart Recommendations** - Multiple recommendation algorithms:
  - Genre-based recommendations
  - Author-based recommendations
  - Rating-based recommendations
- **User Management** - User registration and profile management
- **Rating System** - Users can rate books (1-5 stars)
- **Borrowing System** - Track book borrowing and returns
- **Data Persistence** - H2 in-memory database for development
- **API Documentation** - Interactive Swagger UI
- **Pre-loaded Data** - Sample books, users, and ratings for testing

### Frontend Features
- **Modern UI** - Built with React 18 and TypeScript
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion for enhanced user experience
- **Beautiful Icons** - Lucide React icon library
- **Advanced Search** - Multi-criteria book search with filters
- **Book Recommendations** - Personalized book suggestions
- **Interactive Rating** - Star rating system for books
- **Tab Navigation** - Clean interface with Books and Recommendations tabs

## 🛠️ Technology Stack

### Backend
- **Java 17+** - Programming language
- **Spring Boot 3.2.0** - Main framework
- **Spring Data JPA** - Data access layer
- **H2 Database** - In-memory database
- **Spring Validation** - Input validation
- **Maven** - Dependency management
- **Swagger/OpenAPI 3** - API documentation

### Frontend
- **React 18** - UI library
- **TypeScript 4.9.5** - Type safety
- **Tailwind CSS 3.0** - Styling framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Create React App** - Build tooling

## 📋 Prerequisites

- **Java 17 or higher**
- **Node.js 16 or higher**
- **Maven 3.6 or higher**
- **npm or yarn**

## � Quick Start

### Option 1: Use the Startup Script (Recommended)

1. **Clone or navigate to the project directory**
   ```bash
   cd smart-library-system
   ```

2. **Run the startup script**
   ```bash
   ./start-services.sh
   ```

   This will automatically:
   - Start the backend server on port 8080
   - Start the frontend development server on port 3000
   - Handle graceful shutdown when you press Ctrl+C

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies and compile**
   ```bash
   mvn clean compile
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The backend will be available at: `http://localhost:8080`

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   The frontend will be available at: `http://localhost:3000`

## 🌐 Application URLs

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:librarydb`
  - Username: `sa`
  - Password: *(leave empty)*

## 📚 API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `GET /api/books/search` - Search books
  - Query parameters: `title`, `author`, `genre`, `isbn`
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Recommendations
- `GET /api/books/recommendations/{userId}` - Get personalized recommendations
- `GET /api/books/recommendations/genre/{genre}` - Get recommendations by genre
- `GET /api/books/recommendations/author/{author}` - Get recommendations by author

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user

### Ratings
- `POST /api/ratings` - Submit book rating
- `GET /api/ratings/book/{bookId}` - Get ratings for a book
- `GET /api/ratings/user/{userId}` - Get user's ratings

## 🏗️ Project Structure

```
smart-library-system/
├── backend/
│   ├── src/main/java/com/smartlibrary/
│   │   ├── SmartLibraryApplication.java
│   │   ├── model/
│   │   │   ├── Book.java
│   │   │   ├── User.java
│   │   │   ├── Rating.java
│   │   │   └── BorrowRecord.java
│   │   ├── repository/
│   │   │   ├── BookRepository.java
│   │   │   ├── UserRepository.java
│   │   │   ├── RatingRepository.java
│   │   │   └── BorrowRecordRepository.java
│   │   ├── service/
│   │   │   ├── BookService.java
│   │   │   └── RecommendationService.java
│   │   ├── controller/
│   │   │   └── BookController.java
│   │   └── config/
│   │       └── DataLoader.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── start-services.sh
└── README.md
```

## 🎯 Key Features Explained

### Intelligent Search
The search functionality supports multiple criteria:
- **Title search**: Find books by partial or full title
- **Author search**: Search by author name
- **Genre filtering**: Filter books by genre categories
- **ISBN lookup**: Direct book lookup by ISBN

### Recommendation Engine
Multiple recommendation algorithms provide diverse suggestions:

1. **Genre-based**: Recommends books from user's preferred genres
2. **Author-based**: Suggests books by authors the user has rated highly
3. **Rating-based**: Recommends highly-rated books the user hasn't read
4. **Hybrid approach**: Combines multiple strategies for best results

### User Experience
- **Responsive design**: Works seamlessly on desktop and mobile
- **Real-time search**: Instant search results as you type
- **Smooth animations**: Enhanced with Framer Motion
- **Interactive ratings**: Click stars to rate books
- **Clean interface**: Intuitive tab-based navigation

## 🔧 Development

### Backend Development
- Uses Spring Boot DevTools for hot reloading
- H2 console available for database inspection
- Comprehensive API documentation with Swagger
- Input validation with Bean Validation

### Frontend Development
- TypeScript for type safety
- Component-based architecture
- Tailwind CSS for rapid styling
- Axios for API communication

### Testing
- Backend: JUnit tests (can be added)
- Frontend: Jest and React Testing Library (can be added)

## � Deployment

### Production Build
1. **Backend**:
   ```bash
   cd backend
   mvn clean package
   java -jar target/smart-library-backend-1.0.0.jar
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run build
   # Serve the build folder with your preferred web server
   ```

### Environment Configuration
- Backend: Configure `application.properties` for production database
- Frontend: Set API base URL in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## � License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Maven not found**: Install Maven using `brew install maven` (macOS)
2. **Node.js not found**: Install Node.js from nodejs.org
3. **Port conflicts**: Ensure ports 3000 and 8080 are available
4. **Frontend build issues**: Run `npm install --legacy-peer-deps`

### Support
For issues or questions, please check the console logs and API documentation at http://localhost:8080/swagger-ui.html

---

Built with ❤️ using Java Spring Boot and React TypeScript
