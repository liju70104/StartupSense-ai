import streamlit as st
import requests

API_URL = "https://startupsense-ai-backend.onrender.com"

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">StartupSense-AI Dashboard</div>
    <p class="hero-subtitle">Real-time analytics from your startup idea validation system.</p>
</div>
""", unsafe_allow_html=True)

st.write("")

try:
    response = requests.get(f"{API_URL}/dashboard", timeout=30)

    if response.status_code == 200:
        data = response.json()

        if data.get("success"):
            total_ideas = data.get("total_ideas", 0)
            average_score = data.get("average_score", 0)
            highest_score = data.get("highest_score", 0)

            col1, col2, col3 = st.columns(3)

            with col1:
                st.markdown(f"""
                <div class="kpi-card">
                    <div class="kpi-label">Total Startup Ideas</div>
                    <div class="kpi-value">{total_ideas}</div>
                    <p>Ideas analyzed using AI validation.</p>
                </div>
                """, unsafe_allow_html=True)

            with col2:
                st.markdown(f"""
                <div class="kpi-card">
                    <div class="kpi-label">Average Score</div>
                    <div class="kpi-value">{average_score}</div>
                    <p>Overall average validation score.</p>
                </div>
                """, unsafe_allow_html=True)

            with col3:
                st.markdown(f"""
                <div class="kpi-card">
                    <div class="kpi-label">Highest Score</div>
                    <div class="kpi-value">{highest_score}</div>
                    <p>Best performing startup idea score.</p>
                </div>
                """, unsafe_allow_html=True)

            st.write("")

            c1, c2 = st.columns(2)

            with c1:
                st.markdown("""
                <div class="premium-card">
                    <h3>📈 Analysis Overview</h3>
                    <p>
                    This dashboard summarizes all startup ideas submitted by users.
                    It helps track idea quality, average performance, and top scores.
                    </p>
                </div>
                """, unsafe_allow_html=True)

            with c2:
                st.markdown("""
                <div class="premium-card">
                    <h3>🚀 Project Status</h3>
                    <p>
                    Backend, MongoDB Atlas, API routes, and Streamlit frontend are connected
                    successfully in the deployed version.
                    </p>
                </div>
                """, unsafe_allow_html=True)

        else:
            st.warning(data.get("message", "Dashboard data not available."))
    else:
        st.error("Unable to load dashboard.")

except Exception as e:
    st.error("Backend not connected or /dashboard API missing.")
    st.write(e)