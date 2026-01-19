import json

file_path = "data.json"

with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

for item in data:
    if not item["image"].startswith("images/"):
        item["image"] = "images/" + item["image"]

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("已完成：所有 image 路徑都加上 images/ 前綴")
