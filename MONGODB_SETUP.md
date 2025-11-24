# MongoDB Atlas Setup Guide

Since MongoDB is not installed locally, we'll use **MongoDB Atlas** (free cloud database).

## Quick Setup (5 minutes)

### Option 1: Use Temporary Database (Quick Test)
I've temporarily configured a test database. This will work for immediate testing but should be replaced.

**Current connection**: See `backend/.env`

### Option 2: Create Your Own MongoDB Atlas Account (Recommended)

1. **Sign up for MongoDB Atlas** (free):
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create account with your email
   - Choose FREE tier (M0)

2. **Create a Cluster**:
   - Choose: AWS or Google Cloud
   - Region: Choose closest to you (e.g., US-EAST)
   - Cluster Tier: M0 Sandbox (FREE FOREVER)
   - Cluster Name: SaintPaulHistory

3. **Create Database User**:
   - Click "Database Access" in left menu
   - Add New Database User
   - Username: `stpaul_admin`
   - Password: Generate secure password (save it!)
   - User Privileges: "Read and write to any database"

4. **Whitelist Your IP**:
   - Click "Network Access" in left menu
   - Add IP Address
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IPs

5. **Get Connection String**:
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env file**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/stpaul-history?retryWrites=true&w=majority`

7. **Save to `backend/.env`**:
   ```
   MONGODB_URI=mongodb+srv://stpaul_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/stpaul-history?retryWrites=true&w=majority
   ```

## Alternative: Install MongoDB Locally

If you prefer local development:

```powershell
# Install MongoDB Community Edition
winget install MongoDB.Server

# Start MongoDB service
net start MongoDB

# Update backend/.env:
MONGODB_URI=mongodb://localhost:27017/stpaul-history
```

## Test Connection

After setting up, test your connection:

```powershell
cd backend
npm run dev
```

You should see: "✅ Connected to MongoDB"

## Next Steps

Once database is connected:
1. Import sample data: `npm run import-data`
2. Start the API server: `npm run dev`
3. Test API: http://localhost:3000/api/health
