# Netlify Deployment Instructions

## Quick Netlify Deployment

### Option 1: Drag and Drop (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag the `build` folder from `/Users/aditya/Downloads/LMS/smart-library-system/frontend/build`
3. Your site will be live immediately!

### Option 2: Git-based Deployment
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect your GitHub repository: https://github.com/adityadhimaann/smartlibrary
4. Set build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the build directory
cd /Users/aditya/Downloads/LMS/smart-library-system/frontend
netlify deploy --prod --dir=build
```

## Environment Variables for Netlify
Add these in Netlify dashboard under Site Settings > Environment Variables:
- `REACT_APP_API_BASE_URL`: Your backend URL
- `REACT_APP_ENVIRONMENT`: production
