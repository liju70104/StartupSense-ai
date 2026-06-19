import streamlit as st
import requests

API_URL = "https://startupsense-ai-backend.onrender.com"

with open("frontend/assets/style.css") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.title("📊 StartupSense-AI Dashboard")

try:
    response = requests.get(f"{API_URL}/dashboard", timeout=30)

if response.status_code == 200:

    data = response.json()

    col1,col2,col3 = st.columns(3)

    with col1:
        st.metric("Total Ideas", data["total_ideas"])

    with col2:
        st.metric("Average Score", data["average_score"])

    with col3:
        st.metric("Highest Score", data["highest_score"])

else:
    st.error("Unable to load dashboard")

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