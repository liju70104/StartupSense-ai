import json
import streamlit as st
import requests
import plotly.graph_objects as go

API_URL = "https://startupsense-ai-backend.onrender.com"
st.title("🚀 AI Startup Analyzer")
st.markdown("### Analyze your startup idea using AI")

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
                json=data
            )

            result = response.json()

            if result["success"]:

                analysis = result["analysis"]

                st.success("Analysis Completed Successfully")

                col1, col2, col3 = st.columns(3)

                col1.metric(
                    "Overall Score",
                    analysis["overall_score"]
                )

                col2.metric(
                    "Startup Status",
                    analysis["status"]
                )

                col3.metric(
                    "Risk Level",
                    analysis["risk_level"]
                )

                st.subheader("📌 Recommendation")
                st.info(
                    analysis["recommendation"]
                )

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
                    template="plotly_dark",
                    yaxis=dict(range=[0, 100])
                )

                st.plotly_chart(
                    fig,
                    use_container_width=True
                )

                st.subheader("🤖 AI Business Analysis")

                st.info(
                    analysis["ai_analysis"]
                )

                report_text = json.dumps(
                    analysis,
                    indent=4
                )

                st.download_button(
                    label="📄 Download Analysis Report",
                    data=report_text,
                    file_name="startup_analysis_report.txt",
                    mime="text/plain"
                )

            else:
                st.error("Analysis failed. Please try again.")

        except Exception as e:
            st.error("Backend is not connected or analysis failed.")
            st.write(e)