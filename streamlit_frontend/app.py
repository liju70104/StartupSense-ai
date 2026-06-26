import streamlit as st
import requests
import base64

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="StartupSense-AI",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)


def safe_json(response):
    try:
        return response.json()
    except Exception:
        return {
            "success": False,
            "message": "Backend is waking up. Please wait 30 seconds and try again."
        }


if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "user" not in st.session_state:
    st.session_state.user = None


st.markdown("""
<div class="top-nav">
    <div class="brand">🚀 StartupSense-AI</div>
    <div>
        <span class="nav-pill">AI Validation</span>
        <span class="nav-pill">Analytics</span>
        <span class="nav-pill">Reports</span>
    </div>
</div>
""", unsafe_allow_html=True)


if st.session_state.logged_in:
    st.markdown("""
    <div class="hero">
        <div class="hero-title">Your AI Startup Command Center</div>
        <p class="hero-subtitle">
            Validate ideas, track performance, review history, and generate reports
            from one modern SaaS-style workspace.
        </p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.markdown("""
        <div class="premium-card">
            <h3>🚀 Analyze</h3>
            <p>Submit your idea and receive AI-powered business validation.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open Analyze", key="go_analyze"):
            st.switch_page("pages/analyze.py")

    with col2:
        st.markdown("""
        <div class="premium-card">
            <h3>📊 Dashboard</h3>
            <p>View startup scores, total ideas, and project analytics.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open Dashboard", key="go_dashboard"):
            st.switch_page("pages/dashboard.py")

    with col3:
        st.markdown("""
        <div class="premium-card">
            <h3>📜 History</h3>
            <p>Review your previously analyzed startup ideas.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open History", key="go_history"):
            st.switch_page("pages/history.py")

    with col4:
        st.markdown("""
        <div class="premium-card">
            <h3>📄 Reports</h3>
            <p>Access report generation details and download-ready outputs.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open Reports", key="go_reports"):
            st.switch_page("pages/reports.py")

    st.write("")

    if st.button("Logout", key="logout_btn"):
        st.session_state.logged_in = False
        st.session_state.user = None
        st.rerun()

else:
    st.markdown("""
    <div class="hero">
        <div class="hero-title">Validate Startup Ideas with AI</div>
        <p class="hero-subtitle">
            StartupSense-AI helps students, founders, and innovators analyze business ideas
            using AI scoring, market feasibility, SWOT-style insights, and dashboards.
        </p>
    </div>
    """, unsafe_allow_html=True)

    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown("""
        <div class="premium-card">
            <h3>🤖 AI Business Insights</h3>
            <p>Generate recommendations, risk levels, market potential, and final verdicts.</p>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="premium-card">
            <h3>📈 SaaS Dashboard</h3>
            <p>Track analyzed ideas, average scores, and highest performing startup concepts.</p>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="premium-card">
            <h3>☁️ Full Stack Cloud</h3>
            <p>Built with Streamlit, FastAPI, MongoDB Atlas, Render, and Streamlit Cloud.</p>
        </div>
        """, unsafe_allow_html=True)

    st.write("---")

    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        email = st.text_input("Email", key="login_email")
        password = st.text_input("Password", type="password", key="login_password")

        if st.button("Login", key="login_btn"):
            response = requests.post(
                f"{API_URL}/login",
                json={"email": email, "password": password},
                timeout=30
            )
            data = safe_json(response)

            if data.get("success"):
                st.session_state.logged_in = True
                st.session_state.user = data.get("user")
                st.rerun()
            else:
                st.error(data.get("message", "Login failed."))

    with tab2:
        name = st.text_input("Full Name", key="reg_name")
        reg_email = st.text_input("Email", key="reg_email")
        reg_password = st.text_input("Password", type="password", key="reg_password")

        if st.button("Create Account", key="register_btn"):
            response = requests.post(
                f"{API_URL}/register",
                json={
                    "name": name,
                    "email": reg_email,
                    "password": reg_password
                },
                timeout=30
            )
            data = safe_json(response)

            if data.get("success"):
                st.success("Account created successfully. Now login.")
            else:
                st.error(data.get("message", "Registration failed."))