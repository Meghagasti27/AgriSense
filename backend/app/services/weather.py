import os
import requests
from dotenv import load_dotenv

load_dotenv()  # make sure env is loaded when this file imports

API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather_by_coords(lat: float, lon: float):
    if not API_KEY:
        print("OPENWEATHER_API_KEY missing in weather.py")
        return None

    url = (
        f"https://api.openweathermap.org/data/2.5/weather?"
        f"lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    )

    try:
        response = requests.get(url, timeout=3)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print("Weather fetch error:", e)
        return None
