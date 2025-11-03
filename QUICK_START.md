# Quick Start Guide - Admin Dashboard

## ✅ What's Been Set Up

Your admin dashboard is **fully configured** and ready to use! Here's what's been implemented:

### Features Implemented
- ✅ **Authentication System** - NextAuth.js with credentials login
- ✅ **MongoDB Integration** - All conversions tracked in database
- ✅ **Admin Dashboard** - Real-time statistics and analytics
- ✅ **Protected Routes** - Dashboard requires admin login
- ✅ **Automatic Tracking** - Every conversion logged automatically
- ✅ **Session Management** - Secure JWT sessions

### Files Created
```
✅ lib/db/mongodb.ts - MongoDB connection
✅ lib/db/models/User.ts - User model
✅ lib/db/models/Conversion.ts - Conversion tracking model
✅ lib/auth.ts - NextAuth configuration
✅ lib/tracking.ts - Conversion tracking utility
✅ app/api/auth/[...nextauth]/route.ts - Auth endpoints
✅ app/api/auth/init-admin/route.ts - Admin initialization
✅ app/api/dashboard/stats/route.ts - Dashboard API
✅ app/auth/signin/page.tsx - Login page
✅ app/dashboard/page.tsx - Admin dashboard (updated with auth)
✅ app/providers.tsx - Session provider wrapper
✅ app/layout.tsx - Added session provider (updated)
✅ app/api/convert/route.ts - Added tracking (updated)
✅ .env.local - Environment configuration
```

## 🚀 To Start Using the Dashboard

### Step 1: Start MongoDB
```bash
sudo systemctl start mongodb
# OR install if not installed:
sudo pacman -S mongodb-bin
```

### Step 2: Initialize Admin User
```bash
curl -X POST http://localhost:3000/api/auth/init-admin
```

You should see:
```json
{"message":"Admin user created successfully","email":"admin@nextfile.local"}
```

### Step 3: Login to Dashboard
1. Visit: http://localhost:3000/auth/signin
2. Email: `admin@nextfile.local`
3. Password: `admin123`
4. Click "Sign In"

### Step 4: View Dashboard
You'll be redirected to: http://localhost:3000/dashboard

## 📊 What Gets Tracked

Every file conversion automatically logs:
- Conversion type (pdf-to-word, word-to-pdf, etc.)
- File name and size
- Success/failure status
- Duration in milliseconds
- IP address
- Timestamp
- Error messages (if failed)

## 🎯 Dashboard Features

### Real-Time Stats
- Total conversions
- Recent conversions (last 30 days)
- Success rate
- Failed conversions count

### Analytics
- Recent activity (last 10 conversions)
- Popular converters breakdown
- Success vs failure comparison
- Conversion trends

### Live Demo
1. Convert any file through the website
2. Refresh dashboard to see it instantly appear
3. View detailed statistics
4. Monitor success rates

## 🔐 Default Credentials

**⚠️ CHANGE THESE IN PRODUCTION!**

```env
Email: admin@nextfile.local
Password: admin123
```

To change, edit `.env.local`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

Then recreate admin user.

## 🛠️ Troubleshooting

### MongoDB Not Running
```bash
# Check status
sudo systemctl status mongodb

# Start MongoDB
sudo systemctl start mongodb

# Enable on boot
sudo systemctl enable mongodb
```

### "Admin user already exists"
The admin was already created. Just login with existing credentials.

### Cannot Access Dashboard
1. Make sure you're logged in at `/auth/signin`
2. Check browser console for errors
3. Verify MongoDB is running
4. Check `.env.local` configuration

### MongoDB Connection Error
Update `.env.local` if your MongoDB is on a different port:
```env
MONGODB_URI=mongodb://localhost:27017/nextfile
```

## 📝 API Endpoints

### Public
- `POST /api/convert` - Convert files (auto-tracks)

### Authentication Required
- `GET /api/dashboard/stats` - Get statistics (admin only)
- `GET /dashboard` - View dashboard (admin only)

### Setup
- `POST /api/auth/init-admin` - Create admin (one-time)
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Get session

## 🔍 Database Collections

### `users`
Stores admin and user accounts with hashed passwords

### `conversions`
Stores every file conversion with full details

### View Data
```bash
mongosh nextfile

# View all conversions
db.conversions.find().pretty()

# Count conversions
db.conversions.countDocuments()

# View users
db.users.find()
```

## 🎉 You're All Set!

The dashboard is fully functional. Just:
1. Start MongoDB
2. Initialize admin
3. Login
4. Start converting files!

Every conversion will be automatically tracked in the database and visible on your admin dashboard in real-time.

## 📚 Full Documentation

See `DASHBOARD_SETUP.md` for detailed documentation including:
- Advanced configuration
- Security recommendations
- Database schema details
- API documentation
- Additional features

---

**Need Help?** Check server logs with `npm run dev` and MongoDB logs with `sudo journalctl -u mongodb -f`
