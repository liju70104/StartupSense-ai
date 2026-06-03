from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["startup_sense_ai"]

users = db["users"]

startup_ideas = db["startup_ideas"]

analysis_results = db["analysis_results"]

print("MongoDB Connected Successfully")