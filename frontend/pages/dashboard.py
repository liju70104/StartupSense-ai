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

        if data.get("success"):
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("Total Ideas", data.get("total_ideas", 0))

            with col2:
                st.metric("Average Score", data.get("average_score", 0))

            with col3:
                st.metric("Highest Score", data.get("highest_score", 0))
        else:
            st.warning(data.get("message", "Dashboard data not available."))
    else:
        st.error("Unable to load dashboard.")

except Exception as e:
    st.error("Backend not connected or /dashboard API missing.")
    st.write(e)