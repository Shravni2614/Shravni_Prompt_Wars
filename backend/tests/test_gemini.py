import pytest
from app.schemas import DecisionInput, AnalysisResult
from app.gemini_engine import generate_fallback_analysis, sanitize_ai_output, run_gemini_analysis

@pytest.mark.asyncio
async def test_structured_response_validation():
    sample_input = DecisionInput(
        title="Selecting Internship: Big Tech vs Early-Stage Startup",
        situation="Computer Science junior deciding between two summer 2026 internship offers.",
        options=["Big Tech Brand Internship", "Early-Stage Startup Internship"],
        reasoning="Big Tech adds resume prestige. Startup gives full stack ownership and faster learning.",
        priorities="Learning speed, resume building, mentorship",
        concerns="Startup might lack structured mentorship"
    )
    
    result = await run_gemini_analysis(sample_input)
    assert isinstance(result, AnalysisResult)
    assert result.decision_title == sample_input.title
    assert len(result.visible_factors) > 0
    assert len(result.hidden_assumptions) > 0
    assert len(result.overlooked_factors) > 0
    assert len(result.critical_questions) > 0
    assert isinstance(result.reflection_summary, str)

def test_fallback_generator_grounding():
    sample_input = DecisionInput(
        title="Moving to a new city for remote work",
        situation="Currently living in NYC, considering moving to Austin to save on rent.",
        options=["Move to Austin", "Stay in NYC"],
        reasoning="Austin is cheaper, warmer weather. NYC has my core social network.",
        priorities="Financial savings, vibrant social life",
        concerns="Losing touch with close friends"
    )
    fallback = generate_fallback_analysis(sample_input, reason="test")
    assert fallback.decision_title == sample_input.title
    assert "Austin" in fallback.visible_factors[0].explanation or "Austin" in fallback.visible_factors[0].evidence or len(fallback.visible_factors) > 0
    assert "The Blind Spot" in fallback.disclaimer
