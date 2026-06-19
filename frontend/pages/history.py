import streamlit as st
import requests
import pandas as pd

API_URL = "https://startupsense-ai-backend.onrender.com"

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Idea History</div>
    <p class="hero-subtitle">Review all startup ideas analyzed through StartupSense-AI.</p>
</div>
""", unsafe_allow_html=True)

st.write("")

try:
    response = requests.get(f"{API_URL}/history", timeout=30)

    if response.status_code == 200:
        data = response.json()
        history = data.get("history", [])

        if len(history) == 0:
            st.markdown("""
            <div class="premium-card">
                <h3>No startup ideas analyzed yet</h3>
                <p>Go to the Analyze page and submit your first startup idea.</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="premium-card">
                <h3>Analyzed Startup Ideas</h3>
                <p>Your submitted ideas and AI validation history are shown below.</p>
            </div>
            """, unsafe_allow_html=True)

            df = pd.DataFrame(history)
            st.dataframe(df, use_container_width=True)

    else:
        st.error("Unable to fetch history.")

except Exception as e:
    st.error("Backend not connected or /history API missing.")
    st.write(e)