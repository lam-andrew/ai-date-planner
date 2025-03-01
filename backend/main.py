from http.client import HTTPException
import json
import os
import re
from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import requests
import openai
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from place_mappings import CATEGORY_MAPPING

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Perfect Date Planner API",
    description="An API that generates AI-powered date plans based on location, budget, and preferences.",
    version="1.0",
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

api_router = APIRouter(prefix="/api")

@api_router.get("/health")
def health_check():
    return {"status": "ok"}

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI(api_key=OPENAI_API_KEY)

# Google Places API Key
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")


class DatePreferences(BaseModel):
    """
    Defines the input model for generating a date plan.
    """
    location: str  # City or Zip Code where the date will take place
    date_type: str  # Type of date: Casual, Romantic, First Date, Anniversary
    food_preferences: List[str]  # List of food preferences (e.g., "Italian", "Vegan")
    activity_preferences: List[str]  # List of activity preferences (e.g., "Outdoor", "Movies")

class ItineraryStep(BaseModel):
    step: int
    title: str
    location: str
    address: str
    type: List[str]
    rating: float
    user_rating_count: int
    description: str

class DatePlanResponse(BaseModel):
    itinerary: List[ItineraryStep]
    tips: List[str]


def fetch_places(latitude: float, longitude: float, category: str, radius: int = 5000, max_results: int = 20):
    """
    Fetches nearby places from Google Places API v1 (New) using a POST request.

    :param latitude: Latitude of the location
    :param longitude: Longitude of the location
    :param category: Type of place (e.g., "restaurant", "park")
    :param radius: Search radius in meters (default is 5000m)
    :param max_results: Maximum number of results to return (default is 20)
    :return: List of places with names, addresses, ratings, and types
    """

    mapped_category = CATEGORY_MAPPING.get(category, "restaurant")

    url = "https://places.googleapis.com/v1/places:searchNearby"

    # Construct the request payload
    payload = {
        "languageCode": "en",
        "regionCode": "US",
        "includedTypes": [mapped_category],  # Category type (e.g., "restaurant")
        "maxResultCount": max_results,
        "locationRestriction": {
            "circle": {
                "center": {"latitude": latitude, "longitude": longitude},
                "radius": radius
            }
        },
        "rankPreference": "POPULARITY"
    }

    # Headers for authorization and field selection
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": (
            "places.displayName,places.formattedAddress,places.location,"
            "places.types,places.rating,places.userRatingCount"
        )
    }

    # Make the POST request
    response = requests.post(url, json=payload, headers=headers)

    # Parse the response
    if response.status_code == 200:
        data = response.json()
        places = data.get("places", [])
        return places
    else:
        print(f"Error fetching places: {response.status_code} - {response.text}")
        return []


def generate_ai_plan(places: list, preferences: DatePreferences) -> str:
    """
    Generates a structured date itinerary using OpenAI's GPT-4.

    :param places: List of available places fetched from Google Places API
    :param preferences: User's date preferences
    :return: AI-generated date itinerary (formatted as text)
    """
    prompt = f"""
    Generate a structured date itinerary based on the following preferences:

    - **Location:** {preferences.location}
    - **Date Type:** {preferences.date_type}
    - **Food Preferences:** {', '.join(preferences.food_preferences)}
    - **Activity Preferences:** {', '.join(preferences.activity_preferences)}

    Available Places:
    {json.dumps(places, indent=2)}

    **Instructions:**  
    - Return only a JSON object (no extra text).  
    - Do not include any explanation or commentary.  
    - Ensure the response follows this structure:

    {{
        "itinerary": [
            {{
                "step": 1,
                "title": "Step Title",
                "location": "Place Name",
                "address": "Full Address",
                "type": ["Category 1", "Category 2"],
                "rating": 4.5,
                "user_rating_count": 300,
                "description": "Short description."
            }}
        ],
        "tips": ["Tip 1", "Tip 2", "etc."]
    }}
    """

    try:
        chat_completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        # Extract JSON data by removing unwanted characters
        raw_text = chat_completion.choices[0].message.content.strip()
        cleaned_json = re.sub(r"^```json\n|\n```$", "", raw_text)

        try:
            parsed_response = json.loads(cleaned_json)
        
            if not isinstance(parsed_response, dict):
                raise ValueError("OpenAI response is not a dictionary")

            if "itinerary" not in parsed_response or not isinstance(parsed_response["itinerary"], list):
                raise ValueError("Invalid `itinerary` format from OpenAI")

            if "tips" not in parsed_response or not isinstance(parsed_response["tips"], list):
                parsed_response["tips"] = []  # Ensure `tips` is always a list

            return parsed_response
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response from OpenAI"}

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return "Error generating AI itinerary. Please try again later."


def get_lat_long(location: str):
    """
    Converts a city/ZIP code into latitude and longitude using Google Geocoding API.

    :param location: City or ZIP code
    :return: Tuple (latitude, longitude) or None if not found
    """
    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location}&key={GOOGLE_PLACES_API_KEY}"
    response = requests.get(geocode_url)
    data = response.json()

    if response.status_code == 200 and data["results"]:
        lat_long = data["results"][0]["geometry"]["location"]
        return lat_long["lat"], lat_long["lng"]

    print(f"Error fetching coordinates for {location}: {data}")
    return None


@api_router.post("/generate-date-plan/", response_model=DatePlanResponse, tags=["Date Planning"])
async def generate_date_plan(preferences: DatePreferences):
    """
    Generate an AI-powered date plan based on user preferences.

    - Converts the location (city/ZIP) into latitude & longitude.
    - Fetches restaurants, activities, and views from Google Places API.
    - Uses OpenAI to generate a structured date itinerary.

    Returns:
    - AI-generated itinerary with suggested places and time breakdown.
    """

    # Step 1: Convert location to latitude & longitude
    coordinates = get_lat_long(preferences.location)
    if not coordinates:
        return {"itinerary": "Error: Unable to fetch location coordinates. Please check the location input."}

    latitude, longitude = coordinates
    print(f"COORDINATES: {latitude}, {longitude}")
    # Step 2: Fetch places for different categories
    restaurants = fetch_places(latitude, longitude, preferences.food_preferences[0])  # e.g. "cafe", "bar"
    activities = fetch_places(latitude, longitude, preferences.activity_preferences[0])  # e.g. "museum", "park"

    # Step 3: Combine results
    places = restaurants + activities
    print(f"PLACES: {places}")
    # Step 4: Generate AI-powered itinerary
    ai_plan = generate_ai_plan(places, preferences)
    print(f"AI PLAN: {ai_plan}")
    if not isinstance(ai_plan, dict) or "itinerary" not in ai_plan or "tips" not in ai_plan:
        raise HTTPException(status_code=500, detail="Invalid AI response format")

    return ai_plan


app.include_router(api_router)

# Serve React Frontend
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="frontend")