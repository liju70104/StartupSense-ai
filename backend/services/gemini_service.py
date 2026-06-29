import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_startup_idea_ai(idea_data):
    try:
        prompt = f"""
Analyze this startup idea professionally.

Startup Name: {idea_data.get("startup_name", "N/A")}
Industry: {idea_data.get("industry", "N/A")}
Problem: {idea_data.get("problem", "N/A")}
Solution: {idea_data.get("solution", "N/A")}
Target Audience: {idea_data.get("target_audience", "N/A")}
Revenue Model: {idea_data.get("revenue_model", "N/A")}
Competitors: {idea_data.get("competitors", "N/A")}

Give:
1. Market Potential
2. SWOT Analysis
3. Revenue Potential
4. Risk Analysis
5. Improvement Suggestions
6. Final Verdict
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"AI analysis currently unavailable. Reason: {str(e)}"