#!/bin/bash

echo "🚀 Starting Hospitable Dashboard..."
echo ""

# Check if backend .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo "📝 Please edit backend/.env and add your HOSPITABLE_PAT token"
    echo ""
fi

# Check if dashboard .env.local exists
if [ ! -f "dashboard/.env.local" ]; then
    echo "Creating dashboard .env.local..."
    cp dashboard/.env.example dashboard/.env.local
fi

# Check if backend dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing backend dependencies..."
    pip install -r backend/requirements.txt
    echo ""
fi

# Check if dashboard dependencies are installed
if [ ! -d "dashboard/node_modules" ]; then
    echo "📦 Installing dashboard dependencies..."
    cd dashboard && npm install && cd ..
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Starting services..."
echo "  - Backend API: http://localhost:8000"
echo "  - Dashboard: http://localhost:3000"
echo ""

# Start backend in background
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
cd dashboard
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Dashboard is running!"
echo "   Open http://localhost:3000 in your browser"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait $FRONTEND_PID $BACKEND_PID
