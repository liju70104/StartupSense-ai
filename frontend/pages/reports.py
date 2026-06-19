import streamlit as st

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.title("Reports Center")

st.markdown("""
### StartupSense-AI Report Module

Your reports are generated from the Analyze page.

Go to:

**Analyze → Fill startup idea → Analyze Startup → Download Analysis Report**
""")

st.success("Report download feature is active")

st.info("""
Current report format:

- Startup scores
- Risk level
- Recommendation
- AI business analysis
- SWOT-style insights
""")