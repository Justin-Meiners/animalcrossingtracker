import os
import requests
import json

API_KEY = os.getenv("NOOKIPEDIA_API_KEY")
BASE_URL = "https://api.nookipedia.com"
critter = "sea"
 
HEADERS = {
    "X-API-Key": API_KEY,
    "Accept-Version": "2.0.0"
}

def fetch(endpoint):
    url = f"{BASE_URL}/{endpoint}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching {endpoint}: {response.status_code}")
        return None

def main():
    data = fetch("/nh/" + critter)
    if data:
        with open(critter + ".json", "w") as f:
            json.dump(data, f, indent=4)

if __name__ == "__main__":
    main()