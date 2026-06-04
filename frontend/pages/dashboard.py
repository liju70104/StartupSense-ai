import streamlit as st
import requests

API_URL = "https://startupsense-ai-backend.onrender.com"

st.title("📊 StartupSense-AI Dashboard")

try:
    response = requests.get(f"{API_URL}/dashboard")

    try:
        data = response.json()
    except Exception:
        data = {
            "success": False,
            "message": "Backend is waking up. Please wait 30 seconds and refresh."
        }

    if data.get("success"):
        col1, col2, col3 = st.columns(3)

        col1.metric("Total Ideas", data.get("total_ideas", 0))
        col2.metric("Average Score", data.get("average_score", 0))
        col3.metric("Highest Score", data.get("highest_score", 0))

    else:
        st.warning(data.get("message", "Backend not connected."))

except Exception as e:
    st.error("Backend not connected or /dashboard API missing.")
    st.write(e)