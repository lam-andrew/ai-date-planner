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
pip freeze > requirements.txt
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



---


# Development Notes
## ⚙️ Backend
- Backend: FastAPI (Python)
- AI Model: OpenAI GPT-4o Mini
- APIs Used:
  - Google Places API (for restaurants & attractions)
  - Google Geocoding API (for latitude & longitude conversion)

### 📌 API Endpoints
#### 1️⃣ Generate Date Plan
Endpoint:
```
POST /generate-date-plan/
```
Request Body (JSON):
```
{
    "location": "San Francisco, CA",
    "date_type": "Romantic",
    "food_preferences": ["Italian", "Sushi"],
    "activity_preferences": ["Outdoor", "Museum"]
}
```
Response Example:
```
{
    "itinerary": "6:30 PM - Dinner at Bella Italia
    8:00 PM - Walk in Golden Gate Park
    9:30 PM - Visit SFMOMA Museum"
}
```

### 📦 Installation & Setup
**1️⃣ Clone Repository**
```
git clone https://github.com/yourusername/perfect-date-planner.git
cd ai-date-planner/backend
```
**2️⃣ Create & Activate Virtual Environment & Install Dependencies**
```
python -m venv venv
source venv/bin/activate  # On Mac
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```
**3️⃣ Set Up API Keys**
Create a .env file in the backend/ directory and add:
```
OPENAI_API_KEY=your_openai_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```
**4️⃣ Run FastAPI Server**
```
uvicorn main:app --reload
```
API will be available at: http://127.0.0.1:8000
Swagger UI: http://127.0.0.1:8000/docs