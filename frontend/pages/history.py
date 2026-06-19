import streamlit as st
import requests
import pandas as pd

API_URL = "https://startupsense-ai-backend.onrender.com"

with open("frontend/assets/style.css") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.title("📜 Startup Idea History")

try:
    response = requests.get(f"{API_URL}/history", timeout=30)

    if response.status_code == 200:
        data = response.json()

        history = data.get("history", [])

        if len(history) == 0:
            st.info("No startup ideas analyzed yet.")
        else:
            df = pd.DataFrame(history)
            st.dataframe(df, use_container_width=True)

    else:
        st.error("Unable to fetch history.")

except Exception as e:
    st.error("Backend not connected or /history API missing.")
    st.write(e)