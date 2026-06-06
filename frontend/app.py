import streamlit as st
import requests
import base64

API_URL = "https://startupsense-ai-backend.onrender.com"

def safe_json(response):
    try:
        return response.json()
    except Exception:
        return {
            "success": False,
            "message": "Backend is waking up or not responding. Please wait 30 seconds and try again."
        }
def get_base64(file_path):
    with open(file_path, "rb") as f:
        data = f.read()
    return base64.b64encode(data).decode()

logo_base64 = get_base64("frontend/assets/LOGO.png")

st.set_page_config(
    page_title="StartupSense-AI",
    page_icon="🚀",
    layout="wide"
)
st.sidebar.markdown("""
# 🚀 StartupSense-AI

### AI Startup Validation Platform

Built with:
- FastAPI
- Streamlit
- MongoDB
- Gemini AI
""")


st.markdown(f"""
<style>
.stApp {{
    background: linear-gradient(135deg, #020617, #0f172a, #111827, #1e1b4b);
}}

[data-testid="stAppViewContainer"]::before {{
    content: "";
    position: fixed;
    top: 50%;
    left: 50%;
    width: 750px;
    height: 750px;
    transform: translate(-50%, -50%);
    background-image: url("data:image/png;base64,{logo_base64}");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.08;
    filter: drop-shadow(0 0 40px rgba(255,215,0,0.30));
    z-index: 0;
    pointer-events: none;
}}

.block-container {{
    position: relative;
    z-index: 1;
    padding-top: 4rem;
}}

h1, h2, h3, p, label {{
    color: white !important;
}}

.hero {{
    text-align: center;
    padding: 40px;
}}

.hero-title {{
    font-size: 60px;
    font-weight: 900;
    background: linear-gradient(90deg, #FFD700, #FACC15, #FFF176);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}}

.hero-subtitle {{
    font-size: 20px;
    color: #d1d5db;
}}

.card {{
    background: rgba(255,255,255,0.08);
    border-radius: 22px;
    padding: 25px;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 25px rgba(255,215,0,0.08);
}}

.stButton button {{
    border-radius: 14px;
    background: linear-gradient(90deg, #FFD700, #FACC15);
    color: black;
    font-weight: 800;
    border: none;
}}
</style>
""", unsafe_allow_html=True)

if "logged_in" not in st.session_state:
    st.session_state.logged_in = False

if "user" not in st.session_state:
    st.session_state.user = None

if st.session_state.logged_in:
    st.title("🚀 StartupSense-AI Dashboard")
    st.success(f"Welcome, {st.session_state.user['name']}")

    st.write("Use the sidebar to access Dashboard, Analyze, History, and Reports.")

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("<div class='card'><h3>AI Validation</h3><p>Analyze startup ideas instantly.</p></div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class='card'><h3>Analytics</h3><p>View scores, charts, and history.</p></div>", unsafe_allow_html=True)

    with col3:
        st.markdown("<div class='card'><h3>Reports</h3><p>Download project-ready analysis reports.</p></div>", unsafe_allow_html=True)

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
            AI-Powered Startup Idea Validation and Analytics Dashboard
        </p>
    </div>
    """, unsafe_allow_html=True)

    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("<div class='card'><h3>🚀 Idea Analysis</h3><p>Validate startup ideas using intelligent scoring.</p></div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class='card'><h3>📊 Dashboard</h3><p>Track scores, history, and startup performance.</p></div>", unsafe_allow_html=True)

    with col3:
        st.markdown("<div class='card'><h3>🤖 AI Insights</h3><p>Get SWOT analysis, suggestions, and verdicts.</p></div>", unsafe_allow_html=True)

st.write("")

col1, col2, col3 = st.columns(3)

with col1:
    if st.button("🚀 Open Analyzer"):
        st.switch_page("pages/analyze.py")

with col2:
    if st.button("📊 Open Dashboard"):
        st.switch_page("pages/dashboard.py")

with col3:
    if st.button("🤖 Open AI Insights"):
        st.switch_page("pages/analyze.py")

    
    st.write("---")

    tab1, tab2 = st.tabs(["Login", "Register"])

    with tab1:
        email = st.text_input("Email", key="login_email")
        password = st.text_input("Password", type="password", key="login_password")

        if st.button("Login"):
            if not email or not password:
                st.warning("Please enter email and password.")
            else:
                response = requests.post(
                    f"{API_URL}/login",
                    json={"email": email, "password": password}
                )

                data = safe_json(response)

                if data["success"]:
                    st.session_state.logged_in = True
                    st.session_state.user = data["user"]
                    st.rerun()
                else:
                    st.error(data["message"])

    with tab2:
        name = st.text_input("Full Name", key="reg_name")
        reg_email = st.text_input("Email", key="reg_email")
        reg_password = st.text_input("Password", type="password", key="reg_password")

        if st.button("Create Account"):
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

                if data["success"]:
                    st.success("Account created successfully. Now login.")
                else:
                    st.error(data["message"])