import json
import re

with open("public/assets/images/car/Car2.json", "r", encoding="utf-8") as f:
    data = json.load(f)

new_frames = {}

for key, value in data["frames"].items():
    match = re.search(r"(\d+)\.png$", key)

    if match:
        new_key = match.group(1)
        new_frames[new_key] = value

data["frames"] = new_frames

with open("public/assets/images/car/Car_cleaned2.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("Done!")