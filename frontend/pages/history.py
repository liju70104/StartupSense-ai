import streamlit as st
import requests
import pandas as pd

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="History | StartupSense-AI",
    page_icon="📜",
    layout="wide",
    initial_sidebar_state="collapsed"
)

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="top-nav">
    <div class="brand">📜 StartupSense-AI History</div>
    <div>
        <span class="nav-pill">Saved Ideas</span>
        <span class="nav-pill">MongoDB Records</span>
        <span class="nav-pill">Analysis Logs</span>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Startup Analysis History</div>
    <p class="hero-subtitle">
        Review previously analyzed startup ideas and track your validation records.
    </p>
</div>
""", unsafe_allow_html=True)

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
            df = pd.DataFrame(history)
            st.dataframe(df, use_container_width=True)

    else:
        st.error("Unable to fetch history.")

except Exception as e:
    st.error("Backend not connected.")
    st.write(e)