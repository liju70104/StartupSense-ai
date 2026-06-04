import streamlit as st
import requests
import plotly.graph_objects as go

API_URL = "https://startupsense-ai-backend.onrender.com"

st.title("📊 StartupSense-AI Dashboard")

try:
    response = requests.get(f"{API_URL}/dashboard")
    data = response.json()

    total_ideas = data.get("total_ideas", 0)
    average_score = data.get("average_score", 0)
    highest_score = data.get("highest_score", 0)

    col1, col2, col3 = st.columns(3)

    col1.metric("Total Ideas", total_ideas)
    col2.metric("Average Score", average_score)
    col3.metric("Highest Score", highest_score)

    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=average_score,
        title={"text": "Average Startup Score"},
        gauge={"axis": {"range": [0, 100]}}
    ))

    fig.update_layout(template="plotly_dark")
    st.plotly_chart(fig, use_container_width=True)

except Exception as e:
    st.error("Backend not connected or /dashboard API missing.")
    st.write(e)