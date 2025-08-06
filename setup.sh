#!/bin/bash

echo "🚀 Setting up CareLink SaaS..."

# Create all directories
mkdir -p frontend/{css,js,assets}
mkdir -p backend/{config,models,routes,middleware}
mkdir -p database

# Install backend dependencies
cd backend
npm install
cd ..

echo "✅ Setup complete! Follow these steps:"
echo "1. Start MongoDB: brew services start mongodb-community"
echo "2. Start backend: cd backend && npm run dev"
echo "3. Open frontend: open frontend/index.html"