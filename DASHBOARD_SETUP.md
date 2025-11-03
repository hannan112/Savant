# Admin Dashboard Setup Guide

## Overview
The admin dashboard tracks all file conversions in MongoDB and provides real-time analytics. Only authenticated admin users can access the dashboard.

## Features
- ✅ **Authentication**: Secure login for admin access
- ✅ **Real-time Stats**: Total conversions, success rate, recent activity
- ✅ **Conversion Tracking**: All conversions automatically logged to database
- ✅ **Analytics**: Conversion types breakdown, trends, and popular tools
- ✅ **Activity Log**: Recent conversions with status and timestamps

## Setup Instructions

### 1. MongoDB Setup
Make sure MongoDB is running:
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB if needed
sudo systemctl start mongodb
```

### 2. Environment Variables
The `.env.local` file has been created with default values. Update if needed:
```env
MONGODB_URI=mongodb://localhost:27017/nextfile
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=admin@nextfile.local
ADMIN_PASSWORD=admin123
```

**Important**: Change the `NEXTAUTH_SECRET` and `ADMIN_PASSWORD` in production!

### 3. Initialize Admin User
Create the admin account by visiting:
```
http://localhost:3000/api/auth/init-admin
```

Or use curl:
```bash
curl -X POST http://localhost:3000/api/auth/init-admin
```

You should see: `{"message":"Admin user created successfully","email":"admin@nextfile.local"}`

### 4. Login to Dashboard
1. Visit: http://localhost:3000/auth/signin
2. Email: `admin@nextfile.local`
3. Password: `admin123`
4. Click "Sign In"
5. You'll be redirected to: http://localhost:3000/dashboard

## Usage

### Accessing the Dashboard
- **URL**: http://localhost:3000/dashboard
- **Login**: http://localhost:3000/auth/signin
- **Protected**: Requires admin authentication

### What Gets Tracked
Every conversion automatically logs:
- Conversion type (pdf-to-word, word-to-pdf, etc.)
- Source and target formats
- File name and size
- Success/failure status
- Error messages (if failed)
- Duration in milliseconds
- IP address and user agent
- Timestamp

### Dashboard Features

**Stats Cards:**
- Total Conversions
- Recent (30 days)
- Success Rate
- Failed Conversions

**Charts:**
- Recent Activity (last 10 conversions)
- Popular Converters (breakdown by type)
- Success/Failure comparison

## Testing

### 1. Test Conversion Tracking
```bash
# Upload a file through any converter
# Then check the dashboard to see it logged
```

### 2. Verify Database
```bash
# Connect to MongoDB
mongosh nextfile

# View conversions
db.conversions.find().pretty()

# Count total conversions
db.conversions.countDocuments()

# View by type
db.conversions.aggregate([
  { $group: { _id: "$conversionType", count: { $sum: 1 } } }
])
```

### 3. Test Authentication
- Try accessing `/dashboard` without login → Should redirect to `/auth/signin`
- Login with wrong credentials → Should show error
- Login with correct credentials → Should access dashboard
- Sign out → Should redirect to home page

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/auth/init-admin` - Create admin user

### Dashboard
- `GET /api/dashboard/stats` - Get conversion statistics (requires admin auth)

### Conversions
- `POST /api/convert` - Convert files (automatically tracks to database)

## Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: "admin" | "user",
  createdAt: Date,
  updatedAt: Date
}
```

### Conversions Collection
```javascript
{
  conversionType: String,
  fromFormat: String,
  toFormat: String,
  fileName: String,
  fileSize: Number,
  status: "success" | "failed",
  errorMessage: String (optional),
  userId: String (optional),
  ipAddress: String,
  userAgent: String,
  duration: Number (ms),
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "Admin user already exists"
- Admin has already been created
- Use existing credentials to login
- Or delete the user from MongoDB and recreate

### "Unauthorized" when accessing /api/dashboard/stats
- Make sure you're logged in
- Check that your session is valid
- Verify the user has role: "admin"

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# View MongoDB logs
sudo journalctl -u mongodb -f

# Restart MongoDB
sudo systemctl restart mongodb
```

### NextAuth Issues
- Verify `NEXTAUTH_URL` matches your app URL
- Ensure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

## Security Notes

1. **Change Default Credentials**: Update `ADMIN_PASSWORD` in production
2. **Use Strong Secret**: Generate a secure `NEXTAUTH_SECRET`
3. **HTTPS in Production**: Always use HTTPS for authentication
4. **Environment Variables**: Never commit `.env.local` to git
5. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds)

## Next Steps

- Add more admin users through the database
- Implement password change functionality
- Add user role management
- Export conversion data to CSV
- Add more detailed analytics
- Implement rate limiting
- Add email notifications

## Support

For issues or questions:
1. Check the browser console for errors
2. Check server logs: `npm run dev`
3. Verify MongoDB is running
4. Check `.env.local` configuration
