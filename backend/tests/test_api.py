import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "environment" in data
    assert "gemini_configured" in data

def test_valid_decision_submission():
    payload = {
        "title": "Should I accept the startup offer or stay at my current job?",
        "situation": "I have been working at a mid-sized tech company for 3 years. Received an offer from a Series A startup.",
        "options": ["Option A: Accept Startup Offer", "Option B: Stay at Current Job"],
        "reasoning": "Startup offers higher equity and potential rapid growth. Staying offers stability and clear WLB.",
        "priorities": "Career growth, high financial upside, work-life balance",
        "concerns": "Risk of startup failing within 18 months, potential for high stress"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["decision_title"] == payload["title"]
    assert "visible_factors" in data
    assert "hidden_assumptions" in data
    assert "potential_risks" in data
    assert "reflection_summary" in data
    assert "disclaimer" in data

def test_empty_input_validation():
    payload = {
        "title": "",
        "situation": "",
        "options": [],
        "reasoning": "",
        "priorities": ""
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422

def test_invalid_request_data():
    payload = {
        "title": "Ab",
        "situation": "Short",
        "options": ["  "],
        "reasoning": "Too short",
        "priorities": "P"
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 422

def test_oversized_payload():
    huge_text = "A" * 600 * 1024
    payload = {
        "title": "Huge Title Test",
        "situation": huge_text,
        "options": ["Option A"],
        "reasoning": "Reasoning context",
        "priorities": "Priorities"
    }
    response = client.post(
        "/api/analyze",
        json=payload,
        headers={"content-length": str(len(huge_text))}
    )
    assert response.status_code == 413
