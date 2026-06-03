import streamlit as st
import requests
import pandas as pd

API_URL = "http://127.0.0.1:8000"

st.title("📜 Startup Idea History")

try:
    response = requests.get(f"{API_URL}/history")
    data = response.json()

    history = data.get("history", [])

    if len(history) == 0:
        st.warning("No startup ideas analyzed yet.")
    else:
        df = pd.DataFrame(history)

        clean_columns = [
            "startup_name",
            "industry",
            "problem",
            "solution",
            "target_audience",
            "revenue_model",
            "competitors",
            "created_at"
        ]

        available_columns = [
            col for col in clean_columns if col in df.columns
        ]

        df = df[available_columns]

        st.dataframe(df, use_container_width=True)

except Exception as e:
    st.error("Backend not connected or /history API missing.")
    st.write(e)