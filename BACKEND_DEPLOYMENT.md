# Backend Deployment Guide

## Option 1: Railway (Recommended) 🚄

Railway is perfect for Java Spring Boot applications with automatic PostgreSQL database.

### Steps:
1. Go to https://railway.app
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `smartlibrary` repository
5. Choose the `backend` folder as root directory
6. Railway will automatically:
   - Detect it's a Java/Maven project
   - Build using the Dockerfile
   - Provide a PostgreSQL database
   - Set environment variables

### Environment Variables (Railway auto-sets):
- `DATABASE_URL`: Auto-provided PostgreSQL connection
- `PORT`: Auto-provided port
- `RAILWAY_ENVIRONMENT`: production

### Expected URL Format:
`https://your-app-name.up.railway.app`

---

## Option 2: Heroku 🟣

### Prerequisites:
```bash
# Install Heroku CLI
brew install heroku/brew/heroku
```

### Deployment Steps:
```bash
cd /Users/aditya/Downloads/LMS/smart-library-system/backend

# Login to Heroku
heroku login

# Create app
heroku create smartlibrary-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a smartlibrary-backend
git push heroku main
```

### Environment Variables:
Heroku automatically sets `DATABASE_URL` and `PORT`.

---

## Option 3: Render 🔄

1. Go to https://render.com
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Select your repository and `/backend` as root directory
5. Configure:
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/smart-library-backend-1.0.0.jar`
   - **Environment**: `production`

### Add PostgreSQL Database:
1. Create a new PostgreSQL database in Render
2. Copy the connection string to `DATABASE_URL` environment variable

---

## Option 4: Google Cloud Run ☁️

### Prerequisites:
```bash
# Install Google Cloud CLI
brew install google-cloud-sdk
gcloud auth login
```

### Steps:
```bash
cd /Users/aditya/Downloads/LMS/smart-library-system/backend

# Build Docker image
docker build -t smartlibrary-backend .

# Tag for Google Cloud
docker tag smartlibrary-backend gcr.io/YOUR_PROJECT_ID/smartlibrary-backend

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/smartlibrary-backend

# Deploy to Cloud Run
gcloud run deploy smartlibrary-backend \
  --image gcr.io/YOUR_PROJECT_ID/smartlibrary-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Quick Deploy Commands

### Railway (Fastest):
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd /Users/aditya/Downloads/LMS/smart-library-system/backend
railway deploy
```

### Heroku:
```bash
cd /Users/aditya/Downloads/LMS/smart-library-system/backend
heroku create smartlibrary-backend
heroku addons:create heroku-postgresql:mini
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a smartlibrary-backend
git push heroku main
```

---

## After Deployment:

1. **Test your API**: 
   ```bash
   curl https://your-backend-url/api/books
   ```

2. **Update Frontend**:
   - Set `REACT_APP_API_BASE_URL` to your backend URL
   - Redeploy frontend to Vercel

3. **Database Setup**:
   - Your app will automatically create tables
   - Data will be loaded via DataLoader.java

## Environment Variables Summary:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Auto-provided | PostgreSQL connection string |
| `PORT` | Auto-provided | Server port (usually 8080) |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |

## Expected Endpoints:

- `GET /api/books` - List all books
- `POST /api/books` - Create new book
- `GET /api/books/{id}` - Get book by ID
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book
- `GET /api-docs` - API documentation
- `GET /swagger-ui.html` - Swagger UI
