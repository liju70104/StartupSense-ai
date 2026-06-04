import streamlit as st
import requests
import pandas as pd

API_URL = "https://startupsense-ai-backend.onrender.com"

st.title("📜 Startup Idea History")

try:
    response = requests.get(f"{API_URL}/history")

    try:
        data = response.json()
    except Exception:
        data = {
            "success": False,
            "message": "Backend is waking up. Please wait 30 seconds and refresh."
        }

    if data.get("success"):

        history = data.get("history", [])

        if len(history) == 0:
            st.info("No startup ideas found yet.")
        else:
            df = pd.DataFrame(history)
            st.dataframe(df, use_container_width=True)

    else:
        st.warning(data.get("message", "Backend not connected."))

except Exception as e:
    st.error("Backend not connected or /history API missing.")
    st.write(e)