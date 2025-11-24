# Saint Paul Historical Library & Map - Setup Guide

This guide will walk you through setting up the complete project from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Choose one:
  - Local MongoDB - [Download](https://www.mongodb.com/try/download/community)
  - MongoDB Atlas (free cloud option) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Mapbox Account** (free) - [Sign up](https://www.mapbox.com/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Configure Backend Environment

Create a `.env` file in the backend directory:

```powershell
cp .env.example .env
```

Edit `.env` and update:
- `MONGODB_URI` - Your MongoDB connection string
- `PORT` - API port (default: 5000)
- `CORS_ORIGIN` - Frontend URL (default: http://localhost:3000)

Example MongoDB URIs:
- Local: `mongodb://localhost:27017/saintpaul`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/saintpaul`

### 3. Import Sample Data (Optional)

```powershell
# From the backend directory
node scripts/importData.js
```

### 4. Start Backend Server

```powershell
npm run dev
```

The API will be available at `http://localhost:5000`

### 5. Install Frontend Dependencies

Open a new terminal:

```powershell
cd frontend
npm install
```

### 6. Configure Frontend Environment

Create a `.env.local` file in the frontend directory:

```powershell
cp .env.example .env.local
```

Edit `.env.local` and add your Mapbox token:

```
VITE_MAPBOX_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJ5b3VyLXRva2VuIn0
VITE_API_URL=http://localhost:5000/api
```

To get a Mapbox token:
1. Go to [Mapbox](https://www.mapbox.com/)
2. Sign up for a free account
3. Go to Account → Tokens
4. Create a new token or use the default public token

### 7. Start Frontend Development Server

```powershell
npm run dev
```

The application will be available at `http://localhost:3000`

## Verification

Test that everything is working:

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
   - Should return: `{"status":"ok","message":"Saint Paul API is running"}`

2. **Frontend**: Visit `http://localhost:3000`
   - You should see the home page

3. **Database**: Visit `http://localhost:3000/map`
   - If you imported sample data, you should see markers on the map

## Common Issues

### MongoDB Connection Failed

**Problem**: Cannot connect to MongoDB

**Solutions**:
- **Local MongoDB**: Ensure MongoDB service is running
  ```powershell
  # Windows (if installed as service)
  net start MongoDB
  ```
- **MongoDB Atlas**: Check your connection string, username, and password
- **Network**: Ensure your IP is whitelisted in Atlas (use 0.0.0.0/0 for development)

### Mapbox Not Loading

**Problem**: Map not displaying or showing errors

**Solutions**:
- Verify your Mapbox token is correct in `.env.local`
- Ensure the token has the correct permissions
- Clear browser cache and reload

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use`

**Solutions**:
- Change the port in `.env` (backend) or `vite.config.js` (frontend)
- Or stop the process using that port:
  ```powershell
  # Find process on port 5000
  netstat -ano | findstr :5000
  # Kill the process (replace PID with actual process ID)
  taskkill /PID <PID> /F
  ```

## Development Workflow

### Backend Development

1. Make changes to backend code
2. Server will automatically restart (using nodemon)
3. Test API endpoints using:
   - Browser (for GET requests)
   - Postman or similar tool
   - Frontend application

### Frontend Development

1. Make changes to React components
2. Vite will hot-reload changes automatically
3. View changes in browser at `http://localhost:3000`

### Database Management

View and manage your data:
- **MongoDB Compass** (GUI) - [Download](https://www.mongodb.com/products/compass)
- **MongoDB Shell** (CLI)
- **VS Code Extensions**: MongoDB for VS Code

## Production Build

### Backend

```powershell
cd backend
# Production mode uses environment variables without nodemon
npm start
```

### Frontend

```powershell
cd frontend
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in `frontend/dist/`

## Next Steps

1. **Customize Data**: Add your own historical locations and events
2. **Enhance UI**: Customize colors, layouts, and components
3. **Add Features**: Implement additional functionality
4. **Deploy**: Deploy to hosting services (Vercel, Netlify, Heroku, etc.)

## Additional Resources

- [React Documentation](https://react.dev/)
- [Material UI Documentation](https://mui.com/)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Need Help?

- Check the main `README.md` for API documentation
- Review sample data in the `data/` directory
- Explore the codebase - it's well-commented
- Create an issue in the repository

Happy coding! 🚀
