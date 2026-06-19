import streamlit as st
import requests
import base64

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="StartupSense-AI",
    page_icon="🚀",
    layout="wide"
)

with open("frontend/assets/style.css") as f:
    st.markdown(
        f"<style>{f.read()}</style>",
        unsafe_allow_html=True
    )


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
        left: 50%;
        width: 700px;
        height: 700px;
        transform: translate(-50%, -50%);
        background-image: url("data:image/png;base64,{logo_base64}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        opacity: 0.035;
        z-index: 0;
        pointer-events: none;
    }}
    </style>
    """,
    unsafe_allow_html=True
)

st.sidebar.markdown(
    """
    # 🚀 StartupSense-AI
    ### AI Startup Validation

    **Navigation**
    - Home
    - Analyze
    - Dashboard
    - History
    - Reports
    """
)

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "user" not in st.session_state:
    st.session_state.user = None


if st.session_state.logged_in:

    st.markdown(
        """
        <div class="hero">
            <div class="hero-title">Welcome Back</div>
            <p class="hero-subtitle">
                Continue validating startup ideas with AI-powered insights.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.write("")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown(
            """
            <div class="card">
                <h3>🚀 Idea Analyzer</h3>
                <p>Submit your startup idea and receive AI-powered validation scores.</p>
            </div>
            """,
            unsafe_allow_html=True
        )
        if st.button("Open Analyzer", key="open_analyzer"):
            st.switch_page("pages/analyze.py")

    with col2:
        st.markdown(
            """
            <div class="card">
                <h3>📊 Dashboard</h3>
                <p>View startup analytics, score summaries, and performance metrics.</p>
            </div>
            """,
            unsafe_allow_html=True
        )
        if st.button("Open Dashboard", key="open_dashboard"):
            st.switch_page("pages/dashboard.py")

    with col3:
        st.markdown(
            """
            <div class="card">
                <h3>📜 History</h3>
                <p>Access previously analyzed startup ideas and saved results.</p>
            </div>
            """,
            unsafe_allow_html=True
        )
        if st.button("Open History", key="open_history"):
            st.switch_page("pages/history.py")

    st.write("")

    if st.button("Logout", key="logout_btn"):
        st.session_state.logged_in = False
        st.session_state.user = None
        st.rerun()


else:

    st.markdown(
        """
        <div class="hero">
            <div class="hero-title">StartupSense-AI</div>
            <p class="hero-subtitle">
                Validate. Analyze. Launch. Build smarter startup decisions with AI.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.write("")

    c1, c2, c3 = st.columns(3)

    with c1:
        st.markdown(
            """
            <div class="card">
                <h3>🤖 AI Analysis</h3>
                <p>Generate SWOT insights, suggestions, and startup verdicts.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c2:
        st.markdown(
            """
            <div class="card">
                <h3>📈 Smart Analytics</h3>
                <p>Track innovation, market, revenue, and competition scores.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c3:
        st.markdown(
            """
            <div class="card">
                <h3>☁️ Cloud Powered</h3>
                <p>Built with FastAPI, MongoDB Atlas, Render, and Streamlit Cloud.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.write("---")

    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        email = st.text_input("Email", key="login_email")
        password = st.text_input(
            "Password",
            type="password",
            key="login_password"
        )

        if st.button("Login", key="login_btn"):
            if not email or not password:
                st.warning("Please enter email and password.")
            else:
                response = requests.post(
                    f"{API_URL}/login",
                    json={
                        "email": email,
                        "password": password
                    }
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
        reg_password = st.text_input(
            "Password",
            type="password",
            key="reg_password"
        )

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
                    }
                )

                data = safe_json(response)

                if data.get("success"):
                    st.success("Account created successfully. Now login.")
                else:
                    st.error(data.get("message", "Registration failed."))