from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Literal
from datetime import datetime, timezone

class DecisionInput(BaseModel):
    title: str = Field(
        ...,
        min_length=3,
        max_length=200,
        description="Short, descriptive title for the decision",
        examples=["Should I accept the startup offer or stay at big tech?"]
    )
    situation: str = Field(
        ...,
        min_length=10,
        max_length=4000,
        description="Background context and current situation",
        examples=["I have 3 years experience as a software engineer. Received an offer from a Series A startup."]
    )
    options: List[str] = Field(
        ...,
        min_length=1,
        max_length=10,
        description="Options under active consideration",
        examples=[["Option A: Join Startup", "Option B: Stay at Big Tech"]]
    )
    reasoning: str = Field(
        ...,
        min_length=10,
        max_length=4000,
        description="Current line of thinking or rationale",
        examples=["Startup offers higher equity and upside. Staying has stability but slower growth."]
    )
    priorities: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="Stated priorities and primary motivations",
        examples=["Fast career growth, high impact, work-life balance"]
    )
    concerns: Optional[str] = Field(
        default="",
        max_length=2000,
        description="Worries, risks, or uncertainties already on your mind",
        examples=["Finances if startup fails, burnout risk"]
    )

    @field_validator("options")
    @classmethod
    def validate_options(cls, v: List[str]) -> List[str]:
        cleaned = [opt.strip() for opt in v if opt.strip()]
        if not cleaned:
            raise ValueError("At least one non-empty option must be provided.")
        return cleaned


class Insight(BaseModel):
    id: str = Field(..., description="Unique identifier for map visualization")
    category: Literal[
        "visible",
        "assumption",
        "overlooked",
        "risk",
        "conflict",
        "perspective",
        "question",
        "missing"
    ] = Field(..., description="Category of reasoning insight")
    title: str = Field(..., description="Concise, insightful title")
    explanation: str = Field(..., description="Grounded explanation based on user input")
    why_it_matters: str = Field(..., description="Why this insight is important to consider")
    reflective_question: str = Field(..., description="Constructive question encouraging reflection")
    evidence: str = Field(..., description="Direct citation or reference to relevant user input")
    severity: Literal["high", "medium", "low"] = Field(default="medium")
    related_option: Optional[str] = Field(default=None, description="Option tied to this insight if applicable")


class AnalysisResult(BaseModel):
    decision_title: str
    visible_factors: List[Insight] = Field(default_factory=list)
    hidden_assumptions: List[Insight] = Field(default_factory=list)
    overlooked_factors: List[Insight] = Field(default_factory=list)
    potential_risks: List[Insight] = Field(default_factory=list)
    reasoning_conflicts: List[Insight] = Field(default_factory=list)
    alternative_perspectives: List[Insight] = Field(default_factory=list)
    critical_questions: List[Insight] = Field(default_factory=list)
    missing_information: List[Insight] = Field(default_factory=list)
    reflection_summary: str = Field(..., description="Balanced synthesis of key takeaways")
    disclaimer: str = Field(
        default=(
            "The Blind Spot is designed for self-reflection and decision clarity. "
            "It does not make decisions for you nor provide professional legal, financial, or medical advice."
        )
    )
    analyzed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    engine_used: str = Field(default="Google Gemini")


class ErrorResponse(BaseModel):
    detail: str
    error_code: str = "BAD_REQUEST"
