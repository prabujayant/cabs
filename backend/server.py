from fastapi import FastAPI, HTTPException, Query
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import datetime
import random
import threading
import uvicorn
import ollama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for development purposes (you can restrict this later)
origins = [
    "http://localhost:8081",  # React frontend origin
    # Add any other origins if needed, for example:
    # "http://127.0.0.1:8000",
    # "http://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows CORS for the specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

geolocator = Nominatim(user_agent="uber_clone_geocoder")

pricing_models = {
    "mini": {"base_fare": 30, "cost_per_km": 8, "cost_per_min": 1},
    "sedan": {"base_fare": 50, "cost_per_km": 12, "cost_per_min": 1.5},
    "suv": {"base_fare": 80, "cost_per_km": 15, "cost_per_min": 2}
}

def get_coordinates(location: str):
    place = geolocator.geocode(location)
    return (place.latitude, place.longitude) if place else None

def calculate_distance(pickup: str, dropoff: str):
    pickup_coords = get_coordinates(pickup)
    dropoff_coords = get_coordinates(dropoff)
    if not pickup_coords or not dropoff_coords:
        return None
    return geodesic(pickup_coords, dropoff_coords).kilometers

def ai_surge_pricing():
    current_hour = datetime.datetime.now().hour
    day_of_week = datetime.datetime.today().weekday()
    surge_multiplier = 1.0
    if 7 <= current_hour <= 9 or 17 <= current_hour <= 20:
        surge_multiplier += 0.5
    if day_of_week in [5, 6]:
        surge_multiplier += 0.3
    surge_multiplier += random.uniform(0, 0.5)
    return round(min(surge_multiplier, 2.0), 2)

def calculate_uber_fare(distance: float, cab_type: str):
    if cab_type not in pricing_models:
        return None, None
    model = pricing_models[cab_type]
    estimated_time = distance * 2
    estimated_fare = model["base_fare"] + (model["cost_per_km"] * distance) + (model["cost_per_min"] * estimated_time)
    surge_multiplier = ai_surge_pricing()
    final_fare = estimated_fare * surge_multiplier
    return round(final_fare, 2), surge_multiplier

def suggest_bmtc_routes(pickup_location: str):
    prompt = f"""
    Act as a BMTC bus route expert in Bangalore. Using your knowledge of Bangalore's bus system:
    
    For the location: {pickup_location}
    
    Provide exactly these details in this format do not write anything else to the output:
    Nearest bus stop: [Name the closest BMTC bus stop]
    Bus routes: [List 2-3 major bus numbers that serve this area]
    Frequency: [State typical waiting time between buses in minutes]
    """
    raw_response = ollama.generate(model="llama3.2", prompt=prompt)
    return raw_response.get('response', '')

@app.get("/")
def home():
    return {"message": "Welcome to the Uber Clone API"}

@app.get("/distance")
def get_distance(pickup: str, dropoff: str):
    distance = calculate_distance(pickup, dropoff)
    if distance is None:
        raise HTTPException(status_code=400, detail="Invalid location names.")
    return {"pickup": pickup, "dropoff": dropoff, "distance_km": round(distance, 2)}

@app.get("/fare")
def get_fare(pickup: str, dropoff: str, cab_type: str = Query(..., regex="^(mini|sedan|suv)$")):
    distance = calculate_distance(pickup, dropoff)
    if distance is None:
        raise HTTPException(status_code=400, detail="Invalid location names.")
    fare, surge_multiplier = calculate_uber_fare(distance, cab_type.lower())
    if fare is None:
        raise HTTPException(status_code=400, detail="Invalid cab type.")
    return {
        "pickup": pickup,
        "dropoff": dropoff,
        "distance_km": round(distance, 2),
        "cab_type": cab_type,
        "fare": fare,
        "surge_multiplier": surge_multiplier
    }

@app.get("/bmtc")
def get_bmtc_routes(pickup: str):
    response = suggest_bmtc_routes(pickup)
    if not response:
        raise HTTPException(status_code=400, detail="Could not fetch BMTC routes.")
    return {"pickup": pickup, "bmtc_routes": response}

if __name__ == "__main__":
    server_thread = threading.Thread(target=uvicorn.run, args=(app,), kwargs={"host": "127.0.0.1", "port": 8000})
    server_thread.start()