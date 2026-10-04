import json
import logging
import uuid
import os
import httpx
from typing import Dict, Any
from app.schemas import DecisionInput, AnalysisResult, Insight
from app.config import settings

logger = logging.getLogger("blindspot.gemini")

SYSTEM_INSTRUCTION = """
You are an expert critical-thinking consultant, logic auditor, and decision-analysis architect.
Your sole purpose is to analyze a decision situation submitted by a user and highlight potential BLIND SPOTS in their reasoning.

CRITICAL CONSTRAINTS & RESPONSIBLE AI RULES:
1. NEVER tell the user which option to pick or make the decision for them. Your goal is reflection, not decision-making.
2. NEVER invent facts, fake contradictions, or ungrounded risks. Base all insights strictly on the user's provided situation, options, reasoning, priorities, and concerns.
3. CLEARLY DISTINGUISH between visible facts, unstated assumptions, and logical inferences.
4. Highlight reasoning conflicts ONLY when user stated priorities directly clash with user stated reasoning.
5. Challenge assumptions respectfully and constructively without sounding condescending.
6. Provide structured output in pure valid JSON matching the requested schema.

Output Schema Requirements:
Return a valid JSON object with the following keys:
- "visible_factors": list of insight objects
- "hidden_assumptions": list of insight objects
- "overlooked_factors": list of insight objects
- "potential_risks": list of insight objects
- "reasoning_conflicts": list of insight objects
- "alternative_perspectives": list of insight objects
- "critical_questions": list of insight objects
- "missing_information": list of insight objects
- "reflection_summary": string

Each insight object must contain:
- "id": string (unique ID e.g. "vis-1", "ass-1", "risk-1", "conf-1", "ques-1")
- "category": string ("visible", "assumption", "overlooked", "risk", "conflict", "perspective", "question", "missing")
- "title": string (concise header)
- "explanation": string (grounded explanation)
- "why_it_matters": string (importance to decision quality)
- "reflective_question": string (constructive question)
- "evidence": string (direct phrase citation)
- "severity": string ("high", "medium", or "low")
- "related_option": string or null
"""

PROMPT_TEMPLATE = """
Analyze the following decision situation for potential reasoning blind spots:

### DECISION TITLE
{title}

### SITUATION & BACKGROUND
{situation}

### OPTIONS BEING CONSIDERED
{options}

### CURRENT REASONING
{reasoning}

### STATED PRIORITIES & MOTIVATIONS
{priorities}

### CONCERNS & UNCERTAINTIES
{concerns}

Return pure valid JSON matching the specified structure without markdown wrappers if possible.
"""

def generate_fallback_analysis(input_data: DecisionInput, reason: str = "fallback") -> AnalysisResult:
    logger.info(f"Generating fallback analysis (Reason: {reason})")
    opts_str = ", ".join(input_data.options)
    
    visible = [
        Insight(
            id=f"vis-{uuid.uuid4().hex[:6]}",
            category="visible",
            title="Explicit Comparison of Options",
            explanation=f"You have clearly outlined {len(input_data.options)} main path(s): {opts_str}.",
            why_it_matters="Acknowledging discrete paths is the essential foundation for structured decision-making.",
            reflective_question="Are there subtle hybrid paths or third alternatives between these options?",
            evidence=f"Options listed: {opts_str}",
            severity="low"
        ),
        Insight(
            id=f"vis-{uuid.uuid4().hex[:6]}",
            category="visible",
            title="Awareness of Core Priorities",
            explanation=f"You explicitly identified your primary motivations: '{input_data.priorities[:120]}...'",
            why_it_matters="Knowing what matters most provides an anchor for evaluating trade-offs.",
            reflective_question="Which of these priorities is non-negotiable if a sacrifice must be made?",
            evidence=f"Stated priorities: {input_data.priorities[:80]}",
            severity="low"
        )
    ]
    
    assumptions = [
        Insight(
            id=f"ass-{uuid.uuid4().hex[:6]}",
            category="assumption",
            title="Assumption of Predictable Trajectory",
            explanation=f"Your reasoning assumes that choosing {input_data.options[0]} will yield predictable outcomes without unexpected shifts.",
            why_it_matters="External conditions often evolve faster than initial projections suggest.",
            reflective_question="What baseline evidence supports the assumption that this path will unfold as expected?",
            evidence=f"Reasoning context: {input_data.reasoning[:100]}",
            severity="medium",
            related_option=input_data.options[0]
        )
    ]
    
    overlooked = [
        Insight(
            id=f"over-{uuid.uuid4().hex[:6]}",
            category="overlooked",
            title="Opportunity Costs & Second-Order Effects",
            explanation=f"While focusing on immediate gains, the indirect trade-off of bypassing other options requires equal evaluation.",
            why_it_matters="Every choice implicitly closes off alternative paths for a period of time.",
            reflective_question="What valuable experience or peace of mind are you surrendering by choosing one option over another?",
            evidence=f"Situation context: {input_data.situation[:100]}",
            severity="high"
        )
    ]
    
    risks = [
        Insight(
            id=f"risk-{uuid.uuid4().hex[:6]}",
            category="risk",
            title="Expectation Mismatch Risk",
            explanation=f"If circumstances surrounding {input_data.options[0]} fall below optimistic expectations, burnout or regret could surface.",
            why_it_matters="Pre-mortem analysis helps build resilience before committing.",
            reflective_question="What is the worst-case scenario for this option, and can you comfortably survive it?",
            evidence=f"Concerns: {input_data.concerns[:100] if input_data.concerns else 'General decision context'}",
            severity="high",
            related_option=input_data.options[0]
        )
    ]
    
    conflicts = []
    if "balance" in input_data.priorities.lower() or "life" in input_data.priorities.lower():
        if any(w in input_data.reasoning.lower() for w in ["grind", "intense", "heavy", "hours", "startup", "fast"]):
            conflicts.append(
                Insight(
                    id=f"conf-{uuid.uuid4().hex[:6]}",
                    category="conflict",
                    title="Work-Life Balance vs. High-Intensity Environment",
                    explanation="You listed work-life balance or wellbeing as a priority, yet your reasoning favors a high-intensity, demanding environment.",
                    why_it_matters="Unacknowledged conflicts between values and environment lead to cognitive dissonance and early burnout.",
                    reflective_question="How do you plan to protect your well-being while operating in a high-demand setting?",
                    evidence=f"Priority: '{input_data.priorities}' vs Reasoning: '{input_data.reasoning[:100]}'",
                    severity="high"
                )
            )
            
    if not conflicts:
        conflicts.append(
            Insight(
                id=f"conf-{uuid.uuid4().hex[:6]}",
                category="conflict",
                title="Short-Term Motivation vs. Long-Term Alignment",
                explanation="Your stated priorities emphasize long-term goals, while current reasoning places heavy weight on immediate factors.",
                why_it_matters="Aligning immediate incentives with long-term vision ensures sustained satisfaction.",
                reflective_question="Does this decision serve where you want to be in 5 years, or where you want to be next month?",
                evidence=f"Priorities: {input_data.priorities[:80]}",
                severity="medium"
            )
        )
        
    perspectives = [
        Insight(
            id=f"persp-{uuid.uuid4().hex[:6]}",
            category="perspective",
            title="The Mentor / Advisor Lens",
            explanation="An outside mentor would ask whether you are choosing out of enthusiasm or out of fear of missing out (FOMO).",
            why_it_matters="Third-party observers often see emotional biases we miss ourselves.",
            reflective_question="If a trusted friend brought this exact dilemma to you, what objective advice would you give them?",
            evidence=f"Situation context: {input_data.situation[:100]}",
            severity="medium"
        )
    ]
    
    questions = [
        Insight(
            id=f"ques-{uuid.uuid4().hex[:6]}",
            category="question",
            title="Crucial Validation Questions",
            explanation="Specific empirical questions you should answer before finalizing your choice.",
            why_it_matters="Data reduces uncertainty far better than pure speculation.",
            reflective_question=f"What single piece of information, if discovered tomorrow, would change your mind about {input_data.options[0]}?",
            evidence=f"Options: {opts_str}",
            severity="high"
        )
    ]
    
    missing = [
        Insight(
            id=f"miss-{uuid.uuid4().hex[:6]}",
            category="missing",
            title="First-Hand Peer Feedback",
            explanation="Direct feedback or reviews from individuals who have recently chosen the exact same path.",
            why_it_matters="First-hand accounts reveal daily realities that brochures and interviews omit.",
            reflective_question="Can you speak to 2 people currently in this exact position before deciding?",
            evidence=f"Decision context: {input_data.title}",
            severity="medium"
        )
    ]
    
    summary = (
        f"Your analysis of '{input_data.title}' reflects thoughtful consideration of {len(input_data.options)} option(s). "
        "Key blind spots to reflect upon include verifying unstated assumptions about future stability, "
        "evaluating second-order opportunity costs, and ensuring your immediate choice aligns with your long-term priorities. "
        "Remember: the choice remains entirely yours."
    )
    
    return AnalysisResult(
        decision_title=input_data.title,
        visible_factors=visible,
        hidden_assumptions=assumptions,
        overlooked_factors=overlooked,
        potential_risks=risks,
        reasoning_conflicts=conflicts,
        alternative_perspectives=perspectives,
        critical_questions=questions,
        missing_information=missing,
        reflection_summary=summary,
        engine_used="Google Gemini (Fallback Engine)" if reason != "gemini_live" else "Google Gemini 1.5 Flash"
    )

def sanitize_ai_output(analysis: AnalysisResult) -> AnalysisResult:
    forbidden_phrases = [
        "you should choose", "i recommend", "you must select", "the best option is",
        "you ought to pick", "my advice is to choose"
    ]
    
    summary_lower = analysis.reflection_summary.lower()
    for phrase in forbidden_phrases:
        if phrase in summary_lower:
            analysis.reflection_summary = (
                "Analysis complete. Examine the identified blind spots and reflective questions "
                "above to arrive at your own informed decision."
            )
            break

    return analysis

async def run_gemini_analysis(input_data: DecisionInput) -> AnalysisResult:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.info("No GEMINI_API_KEY configured. Utilizing fallback reasoning engine.")
        return generate_fallback_analysis(input_data, reason="no_api_key")

    formatted_prompt = PROMPT_TEMPLATE.format(
        title=input_data.title,
        situation=input_data.situation,
        options=", ".join(input_data.options),
        reasoning=input_data.reasoning,
        priorities=input_data.priorities,
        concerns=input_data.concerns or "None specified."
    )

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": SYSTEM_INSTRUCTION},
                        {"text": formatted_prompt}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "topP": 0.95,
                "maxOutputTokens": 3000,
                "responseMimeType": "application/json"
            }
        }

        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(url, json=payload)
            
        if response.status_code != 200:
            logger.warning(f"Gemini API returned status {response.status_code}: {response.text}")
            return generate_fallback_analysis(input_data, reason=f"api_status_{response.status_code}")

        res_data = response.json()
        candidates = res_data.get("candidates", [])
        if not candidates:
            return generate_fallback_analysis(input_data, reason="no_candidates")

        text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
        
        if "```json" in text_content:
            text_content = text_content.split("```json")[1].split("```")[0].strip()
        elif "```" in text_content:
            text_content = text_content.split("```")[1].split("```")[0].strip()

        parsed_json = json.loads(text_content)
        
        def parse_insights(items: list, default_cat: str) -> list[Insight]:
            res = []
            for idx, item in enumerate(items):
                if isinstance(item, dict):
                    res.append(
                        Insight(
                            id=item.get("id", f"{default_cat[:4]}-{idx}-{uuid.uuid4().hex[:4]}"),
                            category=item.get("category", default_cat),
                            title=item.get("title", "Insight"),
                            explanation=item.get("explanation", ""),
                            why_it_matters=item.get("why_it_matters", ""),
                            reflective_question=item.get("reflective_question", ""),
                            evidence=item.get("evidence", "Provided context"),
                            severity=item.get("severity", "medium") if item.get("severity") in ["high", "medium", "low"] else "medium",
                            related_option=item.get("related_option")
                        )
                    )
            return res

        analysis = AnalysisResult(
            decision_title=input_data.title,
            visible_factors=parse_insights(parsed_json.get("visible_factors", []), "visible"),
            hidden_assumptions=parse_insights(parsed_json.get("hidden_assumptions", []), "assumption"),
            overlooked_factors=parse_insights(parsed_json.get("overlooked_factors", []), "overlooked"),
            potential_risks=parse_insights(parsed_json.get("potential_risks", []), "risk"),
            reasoning_conflicts=parse_insights(parsed_json.get("reasoning_conflicts", []), "conflict"),
            alternative_perspectives=parse_insights(parsed_json.get("alternative_perspectives", []), "perspective"),
            critical_questions=parse_insights(parsed_json.get("critical_questions", []), "question"),
            missing_information=parse_insights(parsed_json.get("missing_information", []), "missing"),
            reflection_summary=parsed_json.get("reflection_summary", "Review your blind spots carefully to make a confident decision."),
            engine_used="Google Gemini 1.5 Flash (Structured JSON)"
        )

        return sanitize_ai_output(analysis)

    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}", exc_info=True)
        return generate_fallback_analysis(input_data, reason="exception")
