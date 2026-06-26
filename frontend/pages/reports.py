import streamlit as st

st.set_page_config(
    page_title="Reports | StartupSense-AI",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="collapsed"
)

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="top-nav">
    <div class="brand">📄 StartupSense-AI Reports</div>
    <div>
        <span class="nav-pill">Reports</span>
        <span class="nav-pill">Download</span>
        <span class="nav-pill">Insights</span>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Reports Center</div>
    <p class="hero-subtitle">
        Generate and download startup validation reports from your AI analysis results.
    </p>
</div>
""", unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    <div class="premium-card">
        <h3>📄 Report Module</h3>
        <p>
        Reports are generated from the Analyze page after submitting a startup idea.
        Each report contains startup scores, risk level, recommendations, and AI business analysis.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="premium-card">
        <h3>✅ Report Status</h3>
        <p>
        Report download feature is active. Users can analyze a startup idea and download
        the generated result as a project-ready report.
        </p>
    </div>
    """, unsafe_allow_html=True)

st.write("")

st.markdown("""
<div class="premium-card">
    <h3>Report Includes</h3>
    <p>• Startup validation score</p>
    <p>• Innovation, market, revenue, and competition score</p>
    <p>• Risk level and startup status</p>
    <p>• AI-powered SWOT-style business insights</p>
    <p>• Final recommendation and business verdict</p>
</div>
""", unsafe_allow_html=True)