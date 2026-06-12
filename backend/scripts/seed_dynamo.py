import boto3
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

SOURCES = [
    ("fish", "fish.json"),
    ("bug", "bugs.json"),
]

def main():
    table = boto3.resource("dynamodb").Table("Critters")
    with table.batch_writer() as batch:
        for critter_type, filename in SOURCES:
            path = os.path.join(DATA_DIR, filename)
            with open(path) as f:
                critters = json.load(f)
            for critter in critters:
                batch.put_item(Item={"critter_type": critter_type, **critter})
            print(f"Seeded {len(critters)} {critter_type} from {filename}")

if __name__ == "__main__":
    main()