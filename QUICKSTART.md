# Quick Start Guide - Saint Paul Historical Library & Map

Get up and running in 5 minutes! ⚡

## Prerequisites Check

Make sure you have:
- ✅ Node.js installed (v18+)
- ✅ A code editor (VS Code recommended)
- ✅ Terminal/PowerShell

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (2 min)

Run the automated setup script:

```powershell
.\setup.ps1
```

Or manually:

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
cd ..
```

### Step 2: Configure Environment (1 min)

**Backend Configuration:**

1. Navigate to `backend/.env`
2. For quick testing, use the default local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/saintpaul
   ```
   Or use MongoDB Atlas (free): `mongodb+srv://username:password@cluster.mongodb.net/saintpaul`

**Frontend Configuration:**

1. Navigate to `frontend/.env.local`
2. Add a Mapbox token:
   ```
   VITE_MAPBOX_TOKEN=your_token_here
   ```
   Get a free token at: https://account.mapbox.com/access-tokens/

### Step 3: Start the Application (1 min)

Open two terminal windows:

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 4: View the App (30 sec)

Open your browser to: **http://localhost:3000**

### Step 5: Import Sample Data (Optional - 30 sec)

In a third terminal:

```powershell
cd backend
node scripts/importData.js
```

## ✅ Verification

Test these URLs:

1. **Frontend**: http://localhost:3000 (should show home page)
2. **Backend API**: http://localhost:5000/api/health (should return status: ok)
3. **Map Page**: http://localhost:3000/map (should show interactive map)

## 🎉 You're Done!

You now have:
- ✅ A working backend API
- ✅ A beautiful React frontend
- ✅ Interactive map with Mapbox
- ✅ Sample historical data (if imported)

## 📝 What's Included

### Pages You Can Explore
- **Home** (`/`) - Landing page with feature overview
- **Map** (`/map`) - Interactive map of Saint Paul locations
- **Timeline** (`/timeline`) - Historical events chronologically
- **Library** (`/library`) - Digital archives and collections
- **About** (`/about`) - Project information

### Sample Data (After Import)
- 4 historical locations (State Capitol, Cathedral, Science Museum, Fort Snelling)
- 6 historical events (Territory creation, incorporation, railroad, etc.)

## 🛠️ Common Issues

**MongoDB Connection Error?**
- Make sure MongoDB is running (if using local)
- Or use MongoDB Atlas (free cloud option)

**Mapbox Map Not Loading?**
- Check that your token is correct in `frontend/.env.local`
- Verify the token has proper permissions

**Port Already in Use?**
- Change the port in `backend/.env` or `frontend/vite.config.js`

## 📚 Next Steps

1. **Explore the Code**: Check out the well-commented source files
2. **Add Data**: Create more historical locations and events
3. **Customize**: Update colors, styles, and content
4. **Deploy**: When ready, build for production

## 📖 Additional Documentation

- **Detailed Setup**: See `SETUP.md`
- **API Documentation**: See `README.md`
- **Project Status**: See `PROJECT_STATUS.md`

## 💡 Pro Tips

- The backend has hot-reload with nodemon
- The frontend has hot-reload with Vite
- Changes appear automatically in your browser
- Check the browser console for helpful debug info
- Use MongoDB Compass to visualize your data

## 🎨 Customization Ideas

- Update theme colors in `frontend/src/main.jsx`
- Add your own historical photos
- Create custom map markers
- Expand the timeline with more events
- Add multimedia content

---

**Need Help?** Check the full documentation or create an issue!

Happy exploring! 🏛️🗺️
