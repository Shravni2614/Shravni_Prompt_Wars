import pytest
from app.schemas import DecisionInput, AnalysisResult
from app.gemini_engine import sanitize_ai_output, generate_fallback_analysis

def test_ai_does_not_make_final_decision():
    input_data = DecisionInput(
        title="Career Path: Product Management vs Software Engineering",
        situation="Deciding between shifting to PM or remaining an IC Engineer.",
        options=["Transition to PM", "Remain Software Engineer"],
        reasoning="PM allows high-level strategy. SWE allows deep technical craft.",
        priorities="Impact, autonomy, high compensation",
        concerns="PM meetings overhead vs SWE context switching"
    )
    analysis = generate_fallback_analysis(input_data, reason="test")
    analysis.reflection_summary = "You should choose Option A because it aligns better with your long-term goals."
    sanitized = sanitize_ai_output(analysis)
    
    forbidden_terms = ["you should choose", "i recommend", "you must select", "the best option is"]
    summary_lower = sanitized.reflection_summary.lower()
    for term in forbidden_terms:
        assert term not in summary_lower, f"Forbidden term '{term}' found in AI summary!"

def test_conflict_detection_requires_evidence():
    input_data = DecisionInput(
        title="Selecting Internship Work Environment",
        situation="Evaluating two internship offers.",
        options=["Option A: 80hr Grind Startup", "Option B: 40hr Stable Corporate"],
        reasoning="Option A requires extreme grind and 80hr work weeks with constant crunch.",
        priorities="Strict work-life balance, low stress, peace of mind",
        concerns="Burnout"
    )
    analysis = generate_fallback_analysis(input_data, reason="conflict_test")
    assert len(analysis.reasoning_conflicts) > 0
    conflict = analysis.reasoning_conflicts[0]
    assert conflict.category == "conflict"
