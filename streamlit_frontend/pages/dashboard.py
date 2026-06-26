import streamlit as st
import requests
import plotly.graph_objects as go

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="Dashboard | StartupSense-AI",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="top-nav">
    <div class="brand">📊 StartupSense-AI Dashboard</div>
    <div>
        <span class="nav-pill">Analytics</span>
        <span class="nav-pill">MongoDB Live</span>
        <span class="nav-pill">AI Insights</span>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Startup Analytics Overview</div>
    <p class="hero-subtitle">
        Monitor total ideas, average validation score, and the best performing startup concept.
    </p>
</div>
""", unsafe_allow_html=True)

try:
    response = requests.get(f"{API_URL}/dashboard", timeout=30)

    if response.status_code == 200:
        data = response.json()

        total_ideas = data.get("total_ideas", 0)
        average_score = data.get("average_score", 0)
        highest_score = data.get("highest_score", 0)

        col1, col2, col3 = st.columns(3)

        with col1:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Total Ideas</div>
                <div class="kpi-value">{total_ideas}</div>
                <p>Startup ideas analyzed.</p>
            </div>
            """, unsafe_allow_html=True)

        with col2:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Average Score</div>
                <div class="kpi-value">{average_score}</div>
                <p>Average validation score.</p>
            </div>
            """, unsafe_allow_html=True)

        with col3:
            st.markdown(f"""
            <div class="kpi-card">
                <div class="kpi-label">Highest Score</div>
                <div class="kpi-value">{highest_score}</div>
                <p>Best startup score.</p>
            </div>
            """, unsafe_allow_html=True)

        st.write("")

        fig = go.Figure(
            data=[
                go.Bar(
                    x=["Total Ideas", "Average Score", "Highest Score"],
                    y=[total_ideas, average_score, highest_score]
                )
            ]
        )

        fig.update_layout(
            title="StartupSense-AI Performance Summary",
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            height=420
        )

        st.plotly_chart(fig, use_container_width=True)

    else:
        st.error("Unable to load dashboard data.")

except Exception as e:
    st.error("Backend not connected.")
    st.write(e)