import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")


def analyze_startup_idea_ai(data):
    try:
        prompt = f"""
        Analyze this startup idea professionally.

        Startup Name: {data['startup_name']}
        Industry: {data['industry']}
        Problem: {data['problem']}
        Solution: {data['solution']}
        Target Audience: {data['target_audience']}
        Revenue Model: {data['revenue_model']}
        Competitors: {data['competitors']}

        Give SWOT Analysis, Market Potential, Revenue Potential,
        Investor Readiness, Suggestions, and Final Verdict.
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception:
        return """
        AI Analysis Fallback:

        SWOT Analysis:
        Strength: The idea solves a clear user problem.
        Weakness: The business model and differentiation need improvement.
        Opportunity: There is strong potential if the target audience is clearly defined.
        Threat: Competitors may already exist in the market.

        Market Potential:
        Moderate to High, depending on execution and customer acquisition.

        Revenue Potential:
        Can improve with subscription, premium, or B2B pricing model.

        Investor Readiness:
        Medium. Improve traction, market proof, and scalability.

        Suggestions:
        1. Make the solution more unique.
        2. Clearly define target customers.
        3. Improve revenue model.
        4. Add competitor differentiation.
        5. Create a simple MVP demo.

        Final Verdict:
        The idea is valid but needs stronger market positioning.
        """