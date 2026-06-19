import streamlit as st

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Reports Center</div>
    <p class="hero-subtitle">Generate, download, and present startup validation reports.</p>
</div>
""", unsafe_allow_html=True)

st.write("")

col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    <div class="premium-card">
        <h3>📄 Report Module</h3>
        <p>
        StartupSense-AI generates reports from the Analyze page.
        The report includes startup scores, risk level, recommendations,
        and AI business analysis.
        </p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown("""
    <div class="premium-card">
        <h3>✅ Report Status</h3>
        <p>
        Report download feature is active.
        Users can analyze a startup idea and download the generated result
        as a project-ready report.
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