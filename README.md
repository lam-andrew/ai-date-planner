# Perfect Date Planner 💖 | AI-Powered Date Itinerary Generator
🚀 Plan the perfect date effortlessly with AI! This web app uses React (Frontend) + FastAPI (Backend) + OpenAI API to generate personalized date plans based on location, budget, food preferences, and activity types.

## 🌟 Features
✅ AI-Generated Itineraries – Get a full date plan tailored to your inputs
✅ Google Places API Integration – Fetch restaurants, attractions, and sights
✅ Budget & Time Optimization – Plans fit within your budget and schedule
✅ User-Friendly UI – Simple input form with real-time suggestions
✅ Scalable Architecture – React frontend, FastAPI backend, PostgreSQL/MongoDB storage

## 🔧 Tech Stack
- Frontend: React.js, Axios
- Backend: FastAPI, OpenAI API, Google Places API
- Database: PostgreSQL or MongoDB
- APIs: Google Places, OpenWeather, Yelp, OpenAI GPT

## 🛠 Setup & Installation
### Backend (FastAPI)
```
git clone https://github.com/yourusername/perfect-date-planner.git
cd perfect-date-planner/backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload
```
📌 Visit API Docs: http://127.0.0.1:8000/docs

### Frontend (React)
```
cd ../frontend
npm install
npm start
```

## 🎯 How It Works
Enter your preferences (Location, Budget, Date Type, etc.)
Backend fetches restaurants & activities from Google Places API
AI generates an optimized itinerary based on all inputs
View & save your perfect date plan!

## 🚀 Future Enhancements
🔹 User authentication (Google OAuth)
🔹 Save & retrieve favorite date plans
🔹 AI-powered personalized suggestions
🔹 In-app reservations for restaurants & events
