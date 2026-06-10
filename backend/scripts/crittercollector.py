import requests
import json

url = "https://acnhapi.com/v1a/fish/"
response = requests.get(url + "1")
data = response.json()
print(json.dumps(data, indent=4))
