import json
import streamlit as st
import requests
import plotly.graph_objects as go

API_URL = "https://startupsense-ai-backend.onrender.com"

st.set_page_config(
    page_title="Analyze | StartupSense-AI",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="top-nav">
    <div class="brand">🚀 StartupSense-AI Analyzer</div>
    <div>
        <span class="nav-pill">AI Scoring</span>
        <span class="nav-pill">SWOT</span>
        <span class="nav-pill">Report</span>
    </div>
</div>
""", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">Analyze Your Startup Idea</div>
    <p class="hero-subtitle">
        Enter your idea details and get AI-powered startup validation, scores, risks, and recommendations.
    </p>
</div>
""", unsafe_allow_html=True)

col_left, col_right = st.columns([1.1, 0.9])

with col_left:
    startup_name = st.text_input("Startup Name")

    industry = st.selectbox(
        "Industry",
        [
            "Artificial Intelligence",
            "FinTech",
            "Healthcare",
            "Education",
            "E-Commerce",
            "Cybersecurity",
            "Social Media",
            "Other"
        ]
    )

    problem = st.text_area("Problem Statement")
    solution = st.text_area("Your Solution")
    target_audience = st.text_input("Target Audience")
    revenue_model = st.text_input("Revenue Model")
    competitors = st.text_area("Competitors")

with col_right:
    st.markdown("""
    <div class="premium-card">
        <h3>What AI Evaluates</h3>
        <p>• Innovation strength</p>
        <p>• Market potential</p>
        <p>• Revenue feasibility</p>
        <p>• Competition level</p>
        <p>• Risk and recommendation</p>
    </div>
    """, unsafe_allow_html=True)

if st.button("Analyze Startup", key="analyze_btn"):
    if not startup_name or not problem or not solution or not target_audience or not revenue_model or not competitors:
        st.warning("Please fill all fields before analyzing.")
    else:
        payload = {
            "startup_name": startup_name,
            "industry": industry,
            "problem": problem,
            "solution": solution,
            "target_audience": target_audience,
            "revenue_model": revenue_model,
            "competitors": competitors
        }

        try:
            response = requests.post(f"{API_URL}/analyze", json=payload, timeout=60)
            result = response.json()

            if result.get("success"):
                analysis = result["analysis"]

                st.success("Analysis completed successfully")

                c1, c2, c3 = st.columns(3)

                with c1:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Overall Score</div>
                        <div class="kpi-value">{analysis.get("overall_score", 0)}</div>
                    </div>
                    """, unsafe_allow_html=True)

                with c2:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Startup Status</div>
                        <div class="kpi-value" style="font-size:30px;">{analysis.get("status", "N/A")}</div>
                    </div>
                    """, unsafe_allow_html=True)

                with c3:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Risk Level</div>
                        <div class="kpi-value" style="font-size:30px;">{analysis.get("risk_level", "N/A")}</div>
                    </div>
                    """, unsafe_allow_html=True)

                labels = ["Innovation", "Market", "Revenue", "Competition"]
                values = [
                    analysis.get("innovation_score", 0),
                    analysis.get("market_score", 0),
                    analysis.get("revenue_score", 0),
                    analysis.get("competition_score", 0)
                ]

                fig = go.Figure(data=[go.Bar(x=labels, y=values)])
                fig.update_layout(
                    title="Startup Score Breakdown",
                    yaxis=dict(range=[0, 100]),
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)",
                    height=420
                )

                st.plotly_chart(fig, use_container_width=True)

                st.markdown(f"""
                <div class="premium-card">
                    <h3>Final Recommendation</h3>
                    <p>{analysis.get("recommendation", "No recommendation available.")}</p>
                </div>
                """, unsafe_allow_html=True)

                st.info(analysis.get("ai_analysis", "AI analysis not available."))

                report_text = json.dumps(analysis, indent=4)

                st.download_button(
                    label="Download Analysis Report",
                    data=report_text,
                    file_name="startup_analysis_report.txt",
                    mime="text/plain"
                )
            else:
                st.error(result.get("message", "Analysis failed."))

        except Exception as e:
            st.error("Backend is not connected or analysis failed.")
            st.write(e)