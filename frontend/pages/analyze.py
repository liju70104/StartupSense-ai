import json
import streamlit as st
import requests
import plotly.graph_objects as go

API_URL = "https://startupsense-ai-backend.onrender.com"

with open("frontend/assets/style.css", encoding="utf-8") as f:
    st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

st.markdown("""
<div class="hero">
    <div class="hero-title">AI Startup Analyzer</div>
    <p class="hero-subtitle">Submit your startup idea and get AI-powered validation insights.</p>
</div>
""", unsafe_allow_html=True)

st.write("")

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

if st.button("Analyze Startup"):

    if not startup_name or not problem or not solution or not target_audience or not revenue_model or not competitors:
        st.warning("Please fill all fields before analyzing.")

    else:
        data = {
            "startup_name": startup_name,
            "industry": industry,
            "problem": problem,
            "solution": solution,
            "target_audience": target_audience,
            "revenue_model": revenue_model,
            "competitors": competitors
        }

        try:
            response = requests.post(
                f"{API_URL}/analyze",
                json=data,
                timeout=60
            )

            result = response.json()

            if result.get("success"):

                analysis = result["analysis"]

                st.success("Analysis Completed Successfully")

                col1, col2, col3 = st.columns(3)

                with col1:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Overall Score</div>
                        <div class="kpi-value">{analysis["overall_score"]}</div>
                    </div>
                    """, unsafe_allow_html=True)

                with col2:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Startup Status</div>
                        <div class="kpi-value" style="font-size:28px;">{analysis["status"]}</div>
                    </div>
                    """, unsafe_allow_html=True)

                with col3:
                    st.markdown(f"""
                    <div class="kpi-card">
                        <div class="kpi-label">Risk Level</div>
                        <div class="kpi-value" style="font-size:28px;">{analysis["risk_level"]}</div>
                    </div>
                    """, unsafe_allow_html=True)

                st.write("")

                labels = [
                    "Innovation",
                    "Market",
                    "Revenue",
                    "Competition"
                ]

                values = [
                    analysis["innovation_score"],
                    analysis["market_score"],
                    analysis["revenue_score"],
                    analysis["competition_score"]
                ]

                fig = go.Figure(
                    data=[
                        go.Bar(
                            x=labels,
                            y=values
                        )
                    ]
                )

                fig.update_layout(
                    title="Startup Analysis Scores",
                    yaxis=dict(range=[0, 100]),
                    paper_bgcolor="rgba(0,0,0,0)",
                    plot_bgcolor="rgba(0,0,0,0)"
                )

                st.plotly_chart(fig, use_container_width=True)

                st.markdown(f"""
                <div class="premium-card">
                    <h3>Recommendation</h3>
                    <p>{analysis["recommendation"]}</p>
                </div>
                """, unsafe_allow_html=True)

                st.write("")

                st.markdown("""
                <div class="premium-card">
                    <h3>AI Business Analysis</h3>
                </div>
                """, unsafe_allow_html=True)

                st.info(analysis["ai_analysis"])

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