import streamlit as st
import requests
import base64

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="StartupSense-AI",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
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


def get_base64(file_path):
    try:
        with open(file_path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except Exception:
        return ""


logo_base64 = get_base64("frontend/assets/LOGO.png")

st.markdown(
    f"""
    <style>
    [data-testid="stAppViewContainer"]::before {{
        content: "";
        position: fixed;
        top: 50%;
        left: 55%;
        width: 620px;
        height: 620px;
        transform: translate(-50%, -50%);
        background-image: url("data:image/png;base64,{logo_base64}");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.035;
        z-index: 0;
        pointer-events: none;
    }}
    </style>
    """,
    unsafe_allow_html=True
)

st.sidebar.markdown("""
# 🚀 StartupSense-AI
### Validate. Analyze. Launch.

**Built with**
- FastAPI
- Streamlit
- MongoDB Atlas
- Gemini AI
""")

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "user" not in st.session_state:
    st.session_state.user = None


if st.session_state.logged_in:
    st.markdown("""
    <div class="hero">
        <div class="hero-title">Welcome Back</div>
        <p class="hero-subtitle">
            Continue validating startup ideas with intelligent business insights.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.write("")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("""
        <div class="premium-card">
            <h3>🚀 Idea Analyzer</h3>
            <p>Evaluate your startup idea with AI scoring, market insights, and SWOT analysis.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open Analyzer"):
            st.switch_page("pages/analyze.py")

    with col2:
        st.markdown("""
        <div class="premium-card">
            <h3>📊 Dashboard</h3>
            <p>Track total ideas, average scores, highest performance, and analytics.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open Dashboard"):
            st.switch_page("pages/dashboard.py")

    with col3:
        st.markdown("""
        <div class="premium-card">
            <h3>📜 History</h3>
            <p>Review previously analyzed startup ideas and saved evaluation results.</p>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open History"):
            st.switch_page("pages/history.py")

    st.write("")

    if st.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.user = None
        st.rerun()

else:
    st.markdown("""
    <div class="hero">
        <div class="hero-title">StartupSense-AI</div>
        <p class="hero-subtitle">
            AI-powered startup idea validation platform for smarter business decisions.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.write("")

    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown("""
        <div class="premium-card">
            <h3>🤖 AI Startup Analysis</h3>
            <p>Generate AI-powered business validation, SWOT insights, and recommendations.</p>
        </div>
        """, unsafe_allow_html=True)

    with c2:
        st.markdown("""
        <div class="premium-card">
            <h3>📈 Smart Analytics</h3>
            <p>Track innovation, market potential, revenue model, and risk score.</p>
        </div>
        """, unsafe_allow_html=True)

    with c3:
        st.markdown("""
        <div class="premium-card">
            <h3>☁️ Cloud Deployment</h3>
            <p>Full-stack cloud project using Streamlit, FastAPI, MongoDB Atlas, and Render.</p>
        </div>
        """, unsafe_allow_html=True)

    st.write("---")

    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        email = st.text_input("Email", key="login_email")
        password = st.text_input("Password", type="password", key="login_password")

        if st.button("Login", key="login_btn"):
            if not email or not password:
                st.warning("Please enter email and password.")
            else:
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
            if not name or not reg_email or not reg_password:
                st.warning("Please fill all details.")
            else:
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