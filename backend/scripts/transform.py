import json
import os

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPTS_DIR, "..", "data")


def parse_hour(part):
    """Parse '4 AM' or '9 PM' into a 24-hour integer."""
    pieces = part.strip().split()
    hour = int(pieces[0])
    period = pieces[1].upper()
    if period == "AM":
        return 0 if hour == 12 else hour
    else:
        return hour if hour == 12 else hour + 12


def parse_time_window(time_str):
    """Convert an API time string to {start, end, label} or None."""
    if not time_str or time_str.strip().upper() in ("NA", "N/A", ""):
        return None

    # Normalise unicode dashes and non-breaking spaces
    cleaned = (
        time_str
        .replace("–", "-")
        .replace("—", "-")
        .replace(" ", " ")
        .strip()
    )

    if cleaned.lower() == "all day":
        return {"start": 0, "end": 24, "label": "All day"}

    parts = [p.strip() for p in cleaned.split(" - ", 1)]
    if len(parts) == 2:
        start = parse_hour(parts[0])
        end = parse_hour(parts[1])
        return {"start": start, "end": end, "label": f"{parts[0]} - {parts[1]}"}

    return None


def availability_months(availability_array):
    return ", ".join(entry["months"] for entry in availability_array)


def transform_times(times_by_month):
    return {month: parse_time_window(val) for month, val in times_by_month.items()}


def transform_fish(raw):
    out = {
        "name": raw["name"].title(),
        "id": int(raw["number"]),
        "location": raw.get("location", ""),
        "shadow_size": raw.get("shadow_size", ""),
        "sell_nook": int(raw["sell_nook"]),
        "image_url": raw["image_url"],
        "render_url": raw["render_url"],
        "northern": {"times_by_month": transform_times(raw["north"]["times_by_month"]), "months": availability_months(raw["north"]["availability_array"])},
        "southern": {"times_by_month": transform_times(raw["south"]["times_by_month"]), "months": availability_months(raw["south"]["availability_array"])},
    }
    if raw.get("sell_cj") and raw["sell_cj"] != "":
        out["sell_cj"] = int(raw["sell_cj"])
    return out


def transform_bug(raw):
    out = {
        "name": raw["name"].title(),
        "id": int(raw["number"]),
        "location": raw.get("location", ""),
        "sell_nook": int(raw["sell_nook"]),
        "image_url": raw["image_url"],
        "render_url": raw["render_url"],
        "northern": {"times_by_month": transform_times(raw["north"]["times_by_month"]), "months": availability_months(raw["north"]["availability_array"])},
        "southern": {"times_by_month": transform_times(raw["south"]["times_by_month"]), "months": availability_months(raw["south"]["availability_array"])},
    }
    if raw.get("sell_flick") and raw["sell_flick"] != "":
        out["sell_flick"] = int(raw["sell_flick"])
    return out


def transform_sea(raw):
    out = {
        "name": raw["name"].title(),
        "id": int(raw["number"]),
        "shadow_size": raw.get("shadow_size", ""),
        "sell_nook": int(raw["sell_nook"]),
        "image_url": raw["image_url"],
        "render_url": raw["render_url"],
        "northern": {"times_by_month": transform_times(raw["north"]["times_by_month"]), "months": availability_months(raw["north"]["availability_array"])},
        "southern": {"times_by_month": transform_times(raw["south"]["times_by_month"]), "months": availability_months(raw["south"]["availability_array"])},
    }
    return out


def process(input_name, output_name, transform_fn):
    input_path = os.path.join(SCRIPTS_DIR, input_name)
    output_path = os.path.join(DATA_DIR, output_name)
    with open(input_path) as f:
        raw = json.load(f)
    transformed = [transform_fn(item) for item in raw]
    with open(output_path, "w") as f:
        json.dump(transformed, f, indent=4)
    print(f"{output_name}: {len(transformed)} entries written")


if __name__ == "__main__":
    os.makedirs(DATA_DIR, exist_ok=True)
    process("fish.json", "fish.json", transform_fish)
    process("bugs.json", "bugs.json", transform_bug)
    process("sea.json",  "sea.json",  transform_sea)
