from backend.services.scoring import calculate_score


def analyze_startup_idea(data):

    combined_text = (
        data.problem + " " +
        data.solution + " " +
        data.revenue_model + " " +
        data.target_audience
    )

    innovation_score = calculate_score(
        combined_text,
        ["ai", "automation", "smart", "platform"]
    )

    market_score = calculate_score(
        combined_text,
        ["students", "market", "users", "customers"]
    )

    revenue_score = calculate_score(
        combined_text,
        ["subscription", "premium", "ads", "commission"]
    )

    competition_score = calculate_score(
        data.competitors,
        ["low", "few", "none", "unique"]
    )

    overall_score = int(
        (
            innovation_score +
            market_score +
            revenue_score +
            competition_score
        ) / 4
    )

    if overall_score >= 80:
        status = "Excellent"
        risk = "Low"
        recommendation = "Strong idea. Focus on scaling, branding, and investor pitching."

    elif overall_score >= 60:
        status = "Good"
        risk = "Medium"
        recommendation = "Promising idea. Improve market positioning and revenue clarity."

    else:
        status = "Needs Improvement"
        risk = "High"
        recommendation = "Improve uniqueness, customer targeting, revenue model, and competitor differentiation."

    return {
        "innovation_score": innovation_score,
        "market_score": market_score,
        "revenue_score": revenue_score,
        "competition_score": competition_score,
        "overall_score": overall_score,
        "status": status,
        "risk_level": risk,
        "recommendation": recommendation
    }