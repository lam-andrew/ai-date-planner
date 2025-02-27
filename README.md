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


## 📜 Frontend
### Overview
The frontend is a React application that provides a step-by-step wizard interface for users to input their date preferences and receive an AI-generated date plan from the backend.

- Framework: React.js
- UI Library: Material-UI
- State Management: React Hooks (useState, useRef)
- API Calls: Axios
- Google API Integration: Places Autocomplete for location selection

### 🛠 Components
**1️⃣ `DatePlannerForm.js` - The Core Component**
📂 `src/components/DatePlannerForm.js`
This component handles user input using a multi-step form with a Material-UI Stepper.

🚀 Features:
✅ Location Selection → Uses Google Places Autocomplete
✅ Food & Activity Selection → Uses Material-UI Chips
✅ Stepper Navigation → Guides users through the input process
✅ Final Confirmation Step → Users review their choices before submission

**2️⃣ `api.js` - API Handling**
📂 `src/api.js`
This file handles API requests between the frontend and backend.

Function:
```
export const generateDatePlan = async (preferences) => {
    try {
        const response = await axios.post("http://127.0.0.1:8000/generate-date-plan/", preferences, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching date plan:", error);
        return { itinerary: "Error generating itinerary. Please try again later." };
    }
};
```
- Sends user preferences to FastAPI
- Receives an AI-generated itinerary
- Handles errors gracefully

**3️⃣ `App.js` - Root Component**
📂 `src/App.js`
This is the entry point of the app, where we load Google Maps API and render DatePlannerForm.

Functionality:
```
import React from "react";
import { LoadScript } from "@react-google-maps/api";
import DatePlannerForm from "./components/DatePlannerForm";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

function App() {
    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
            <DatePlannerForm />
        </LoadScript>
    );
}

export default App;
```
- Loads Google Maps API only once
- Wraps the DatePlannerForm to provide location autocomplete support

### ⚡ Key Features & Functionality
**1️⃣ Multi-Step Form with Stepper Navigation**
- Uses Stepper from Material-UI
- Each step collects different user preferences
- Users can navigate back and forth

**2️⃣ Google Places Autocomplete for Location Selection**
- Allows users to search and select a city
- Extracts city, state, and country

**3️⃣ Food & Activity Selection with Clickable Chips**
- Replaces dropdowns with Material-UI Chip components
- Clicking a chip toggles selection

**4️⃣ Confirmation Page Before Submission**
- Users can review their choices before finalizing
- Prevents mistakes

### 🎯 Running the Frontend
```
npm start
```