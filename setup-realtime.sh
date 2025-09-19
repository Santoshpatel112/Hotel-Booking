#!/bin/bash

# Real-time Dashboard Setup Script
# This script sets up and tests the real-time dashboard system

echo "🚀 Starting Real-time Dashboard Setup..."

# Check if we're in the correct directory
if [ ! -d "api" ] || [ ! -d "client" ]; then
    echo "❌ Please run this script from the BOOKINGAPP root directory"
    exit 1
fi

echo "📦 Checking dependencies..."

# Check backend dependencies
cd api
if ! npm list socket.io > /dev/null 2>&1; then
    echo "📦 Installing Socket.IO for backend..."
    npm install socket.io
else
    echo "✅ Socket.IO already installed in backend"
fi

# Check frontend dependencies
cd ../client
if ! npm list socket.io-client > /dev/null 2>&1; then
    echo "📦 Installing Socket.IO client for frontend..."
    npm install socket.io-client
else
    echo "✅ Socket.IO client already installed in frontend"
fi

echo "🔧 Setup completed successfully!"
echo ""
echo "🚀 To start the real-time dashboard:"
echo ""
echo "1. Backend Server (Terminal 1):"
echo "   cd api && npm run dev"
echo ""
echo "2. Frontend Server (Terminal 2):"
echo "   cd client && npm start"
echo ""
echo "3. Access the dashboard:"
echo "   - Login as admin: santoshpatelvns5@gmail.com"
echo "   - Navigate to the admin dashboard"
echo "   - Real-time features will be active automatically"
echo ""
echo "🔔 Real-time Features:"
echo "   ✅ Live booking updates"
echo "   ✅ User registration notifications"
echo "   ✅ Real-time statistics"
echo "   ✅ Activity feed updates"
echo "   ✅ Connection status indicator"
echo ""
echo "📊 Testing the system:"
echo "   1. Open admin dashboard in one browser tab"
echo "   2. Create a booking in another tab"
echo "   3. Watch real-time updates appear instantly"
echo ""
echo "🎉 Real-time dashboard system is ready!"