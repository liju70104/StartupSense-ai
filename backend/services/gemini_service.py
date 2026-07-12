import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_startup_idea_ai(idea_data):
    try:
        prompt = f"""
Analyze this startup idea professionally.

Startup Name: {idea_data.get("startup_name", "")}
Industry: {idea_data.get("industry", "")}
Problem: {idea_data.get("problem", "")}
Solution: {idea_data.get("solution", "")}
Target Audience: {idea_data.get("target_audience", "")}
Revenue Model: {idea_data.get("revenue_model", "")}
Competitors: {idea_data.get("competitors", "")}

Provide:
1. Market Potential
2. SWOT Analysis
3. Revenue Potential
4. Risk Analysis
5. Improvement Suggestions
6. Final Verdict
"""

        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        return response.text

    except Exception as error:
        print("Gemini error:", error)
        return "AI analysis is temporarily unavailable. Please try again later."