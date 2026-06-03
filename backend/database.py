import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL)

db = client["startup_sense_ai"]

users = db["users"]
startup_ideas = db["startup_ideas"]
analysis_results = db["analysis_results"]
reports = db["reports"]

print("MongoDB Connected Successfully")