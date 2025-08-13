from fastapi import FastAPI, Query, HTTPException
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import datetime
import random
import ollama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for development purposes
origins = [
    "http://localhost:8081",
    "http://localhost:19006",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

geolocator = Nominatim(user_agent="uber_clone_geocoder")

def get_coordinates(location: str):
    place = geolocator.geocode(location)
    return (place.latitude, place.longitude) if place else None

@app.get("/")
def home():
    return {"message": "Welcome to the Uber Clone API"}

@app.get("/distance")
def calculate_distance(pickup: str, dropoff: str):
    pickup_coords = get_coordinates(pickup)
    dropoff_coords = get_coordinates(dropoff)
    if not pickup_coords or not dropoff_coords:
        raise HTTPException(status_code=400, detail="Invalid location names.")
    return {"distance_km": round(geodesic(pickup_coords, dropoff_coords).kilometers, 2)}

def ai_surge_pricing():
    current_hour = datetime.datetime.now().hour
    day_of_week = datetime.datetime.today().weekday()
    surge_multiplier = 1.0
    if 7 <= current_hour <= 9 or 17 <= current_hour <= 20:  # Peak hours
        surge_multiplier += 0.5
    if day_of_week in [5, 6]:  # Weekend surge
        surge_multiplier += 0.3
    surge_multiplier += random.uniform(0, 0.5)  # Random fluctuation
    return round(min(surge_multiplier, 2.0), 2)

@app.get("/fare")
def calculate_fare(pickup: str, dropoff: str, cab_type: str = Query(..., pattern="^(mini|sedan|suv)$"), coupon_code: str = None):
    pricing = {
        "mini": {"base_fare": 30, "cost_per_km": 8, "cost_per_min": 1},
        "sedan": {"base_fare": 50, "cost_per_km": 12, "cost_per_min": 1.5},
        "suv": {"base_fare": 80, "cost_per_km": 15, "cost_per_min": 2},
    }

    distance_response = calculate_distance(pickup, dropoff)
    distance = distance_response.get("distance_km", 0)

    # Removed the incorrect check for distance == 0, as this is a valid case
    # when pickup and dropoff are the same location. The original function was
    # raising an unnecessary exception here.

    base_fare, cost_per_km, cost_per_min = (
        pricing[cab_type]["base_fare"],
        pricing[cab_type]["cost_per_km"],
        pricing[cab_type]["cost_per_min"],
    )

    estimated_time = distance * 2  # Assume 2 mins per km
    estimated_fare = base_fare + (cost_per_km * distance) + (cost_per_min * estimated_time)
    surge_multiplier = ai_surge_pricing()
    final_fare = estimated_fare * surge_multiplier

    # Apply coupon code discount
    if coupon_code == "123":
        final_fare = max(0, final_fare - 100)  # Ensure fare doesn't go negative

    return {"fare": round(final_fare, 2), "surge_multiplier": surge_multiplier}

@app.get("/bmtc")
def suggest_bmtc_routes(pickup: str):
    prompt = f"""
    Act as a BMTC bus route expert in Bangalore. Using your knowledge of Bangalore's bus system:

    For the location: {pickup}

    Provide exactly these details in this format:
    - Nearest bus stop: [Closest BMTC stop]
    - Bus routes: [List 2-3 major bus numbers]
    - Frequency: [Average waiting time]
    """

    raw_response = ollama.generate(model="llama3.2", prompt=prompt)
    return {"bmtc_info": raw_response.get("response", "No information available")}

@app.get("/best-route")
def suggest_best_route(pickup: str, dropoff: str):
    prompt = f"""
    Act as a traffic expert in Bangalore. Using your knowledge of Bangalore's traffic patterns and best routes:

    For the trip from {pickup} to {dropoff}, suggest the best possible cab routes to beat traffic.

    Provide exactly these details in this format:
    - Best route: [Description of the best route]
    - Alternative routes: [List 2-3 alternative routes]
    - Traffic tips: [Any additional tips to avoid traffic]
    """

    raw_response = ollama.generate(model="llama3.2", prompt=prompt)
    return {"best_route_info": raw_response.get("response", "No information available")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
