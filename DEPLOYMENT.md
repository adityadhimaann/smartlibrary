# Smart Library System - Deployment Guide

## Vercel Deployment Instructions

### Prerequisites
1. Vercel account (https://vercel.com)
2. Vercel CLI installed globally: `npm i -g vercel`
3. Backend deployed separately (see Backend Deployment section)

### Frontend Deployment to Vercel

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy the project**
   ```bash
   cd /path/to/smart-library-system
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - Project name: `smart-library-system`
   - In which directory is your code located? `./`

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel dashboard
   - Navigate to Environment Variables
   - Add: `REACT_APP_API_BASE_URL` = `your-backend-url/api`

### Backend Deployment Options

Since Vercel primarily supports frontend and serverless functions, you'll need to deploy your Java Spring Boot backend separately:

#### Option 1: Heroku (Recommended for Java Spring Boot)
1. Create a Heroku account
2. Install Heroku CLI
3. Deploy backend:
   ```bash
   cd backend
   heroku create your-app-name-backend
   git init
   git add .
   git commit -m "Initial commit"
   heroku git:remote -a your-app-name-backend
   git push heroku main
   ```

#### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Deploy the backend folder
3. Configure environment variables

#### Option 3: AWS/Google Cloud
1. Use container deployment with Docker
2. Deploy to AWS ECS, Google Cloud Run, or similar services

### Environment Variables Required

#### Frontend (.env.production)
```
REACT_APP_API_BASE_URL=https://your-backend-url.com/api
REACT_APP_ENVIRONMENT=production
GENERATE_SOURCEMAP=false
```

#### Backend (application-prod.properties)
```
spring.datasource.url=jdbc:postgresql://your-db-host:5432/your-db-name
spring.datasource.username=your-db-username
spring.datasource.password=your-db-password
spring.jpa.hibernate.ddl-auto=update
```

### Database Setup
1. Use a cloud PostgreSQL service (ElephantSQL, AWS RDS, etc.)
2. Update your backend configuration with the database URL
3. Ensure your database is accessible from your deployed backend

### Post-Deployment Steps
1. Update the `vercel.json` routes to point to your actual backend URL
2. Test all API endpoints
3. Verify book cover images are loading correctly
4. Check CORS configuration in your backend

### Troubleshooting
- If API calls fail, check CORS settings in Spring Boot
- Ensure environment variables are set correctly
- Check Vercel function logs for any errors
- Verify database connection in backend logs

## Quick Deployment Commands

```bash
# Deploy frontend to Vercel
vercel

# Deploy with production environment
vercel --prod

# Check deployment status
vercel ls
```
