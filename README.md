# THE BLIND SPOT

> **Tagline:** *See what your reasoning might be missing.*

![The Blind Spot](https://img.shields.io/badge/AI_Engine-Google_Gemini-6366F1?style=for-the-badge&logo=google)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss)
![Tests](https://img.shields.io/badge/Tests-9_Passed_Pytest-10B981?style=for-the-badge&logo=pytest)

---

## 1. Problem Statement & Core Vision

People frequently make high-stakes decisions based solely on the information most visible to them. In doing so, they overlook unstated assumptions, fail to recognize trade-offs, and ignore internal conflicts within their reasoning.

**The Blind Spot** is an intelligent decision-analysis workspace powered by Google Gemini API. It acts as an objective, reflective critical-thinking partner—helping users examine hidden assumptions, evaluate trade-offs, and explore constructive questions before committing to a choice.

> [!IMPORTANT]
> **Human Judgment Guarantee:** The AI **never makes decisions for the user**. Its purpose is strictly to improve human critical thinking, not replace human judgment.

---

## 2. Key Features & User Journey

### A. Premium Landing Page
- Product vision, problem explanation, and interactive 3-step visualization.
- **Example Decision Scenarios:** Pre-loaded real-world scenarios covering Education, Career, Finances, and Everyday Life.
- **Sample Internship Scenario:** One-click demo loading the CS Internship dilemma (Big Tech vs. Early-Stage AI Startup).

### B. Structured Decision Input Form
- Fields for Decision Title, Background/Situation, Options under consideration, Current Rationale, Stated Priorities, and Concerns.
- Real-time client-side validation with helpful error indicators.

### C. The Blind Spot Map (Key Differentiating Feature)
- An interactive visual graph/canvas mapping user thoughts against AI observations across 6 core clusters:
  1. **Visible Rationale:** What you have explicitly considered.
  2. **Hidden Assumptions:** Beliefs treated as facts without sufficient proof.
  3. **Overlooked Factors:** Considerations missing from your reasoning.
  4. **Potential Risks:** Negative consequences and trade-offs.
  5. **Reasoning Conflicts:** Direct clashes between stated priorities and reasoning.
  6. **Critical Questions & Missing Information:** Empirical facts and questions to investigate before deciding.
- Clicking any node opens a grounded detail modal with reflective questions and direct citations from the user's input.

### D. Reflection Workspace & Action Hub
- Private notes editor for recording personal insights.
- Interactive **"Questions to Investigate"** checklist to track items requiring empirical verification.
- Options to revise original reasoning or analyze new decisions.

---

## 3. Technology Stack & Architecture

```
the-blind-spot/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entry point, CORS, security middleware
│   │   ├── config.py              # Environment configuration (GEMINI_API_KEY)
│   │   ├── schemas.py             # Pydantic v2 request & structured output models
│   │   ├── gemini_engine.py       # Google Gemini API client & fallback reasoning system
│   │   └── security.py            # XSS sanitization & 500KB payload limit middleware
│   ├── tests/
│   │   ├── test_api.py            # API integration tests (200, 422, 413, health)
│   │   ├── test_gemini.py         # AI structured output & fallback grounding tests
│   │   └── test_rules.py          # Responsible AI non-decision rule tests
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header & active stage switcher
│   │   │   ├── LandingHero.jsx          # Hero section with CTA
│   │   │   ├── HowItWorks.jsx           # 3-step workflow explanation
│   │   │   ├── SampleScenarios.jsx      # Scenario selector cards
│   │   │   ├── DecisionForm.jsx         # Input form with prefill capabilities
│   │   │   ├── BlindSpotMap.jsx         # Interactive visual map canvas
│   │   │   ├── InsightCard.jsx          # Cards & grounded evidence modal
│   │   │   ├── AnalysisDashboard.jsx    # Categorized list breakdown
│   │   │   ├── ReflectionWorkspace.jsx   # Reflection notes & investigation checklist
│   │   │   ├── DisclaimerBanner.jsx     # AI non-decision disclaimer
│   │   │   └── LoadingState.jsx         # Accessible progress skeleton
│   │   ├── services/
│   │   │   └── api.js                   # REST client targeting FastAPI backend
│   │   ├── data/
│   │   │   └── sampleScenarios.js       # Preloaded sample decision scenarios
│   │   ├── App.jsx                      # Main app container & router state
│   │   └── index.css                    # Tailwind CSS design system & glassmorphism
│   ├── index.html                       # Semantic HTML5 root with meta tags
│   └── package.json
├── .gitignore
└── README.md
```

---

## 4. Google Services Integration

| Service | Role in Application | Validation Mechanism | Resilience & Fallback |
| :--- | :--- | :--- | :--- |
| **Google Gemini API** (`gemini-1.5-flash`) | Core AI Reasoning Engine performing evidence-grounded logical audits. | Pydantic v2 schemas (`AnalysisResult`, `Insight`) enforce strict JSON parsing. | Integrated deterministic fallback generator activates if API key is omitted or rate limited. |

---

## 5. Security & Responsible AI Implementation

- **No Secret Exposure:** `GEMINI_API_KEY` is loaded strictly on the backend. Frontend code makes no direct calls to Google APIs.
- **XSS & Input Sanitization:** All incoming text strings pass through `security.sanitize_text` to strip malicious HTML tags.
- **Payload Limits:** FastAPI middleware restricts body size to 500 KB (`HTTP 413`).
- **CORS Control:** Whitelisted origins configured in `settings.CORS_ORIGINS`.
- **Non-Decision Enforcement:** `gemini_engine.sanitize_ai_output` audits and strips any imperative statements (e.g., "You should choose option A"), guaranteeing that final choices remain 100% in human hands.
- **Secrets Protection:** `.gitignore` excludes `.env`, secrets, virtual environments, and node_modules.

---

## 6. Automated Testing Suite & Verification Results

### Backend Automated Test Suite (`pytest`)
To run the automated backend tests:
```bash
cd backend
python -m pytest -v
```

**Actual Executed Test Results:**
```text
============================= test session starts =============================
platform win32 -- Python 3.13.5, pytest-9.1.1, pluggy-1.6.0
collected 9 items

tests/test_api.py::test_health_check PASSED                              [ 11%]
tests/test_api.py::test_valid_decision_submission PASSED                 [ 22%]
tests/test_api.py::test_empty_input_validation PASSED                    [ 33%]
tests/test_api.py::test_invalid_request_data PASSED                      [ 44%]
tests/test_api.py::test_oversized_payload PASSED                         [ 55%]
tests/test_gemini.py::test_structured_response_validation PASSED         [ 66%]
tests/test_gemini.py::test_fallback_generator_grounding PASSED           [ 77%]
tests/test_rules.py::test_ai_does_not_make_final_decision PASSED         [ 88%]
tests/test_rules.py::test_conflict_detection_requires_evidence PASSED    [100%]

======================== 9 passed in 0.66s ========================
```

### Frontend Production Build Verification
To verify the frontend build:
```bash
cd frontend
npm run build
```
**Result:** Vite production build succeeded cleanly (`dist/assets/index-DUWccBwJ.js 213.70 kB`).

---

## 7. Accessibility Features

- **Semantic HTML5:** Built using `<header>`, `<main>`, `<nav>`, `<section>`, `<label>`, `<button>`, and `<footer>`.
- **Form Association:** Every input field is explicitly bound to a `<label htmlFor="...">`.
- **Focus Indicators:** Visible indigo focus rings (`focus-visible:ring-indigo-500`) across interactive elements.
- **Screen Reader Support:** ARIA live region (`role="status"`, `aria-live="polite"`) for real-time loading updates.
- **High Contrast:** Tailored obsidian and deep navy theme (`#0B0F19`) ensuring strong contrast ratios.

---

## 8. Local Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Run Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
*Backend runs at:* `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)

### Step 2: Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

---

## 9. Deployment Steps

### Frontend Deployment (Vercel)
1. Push project to GitHub repository.
2. Import repository in Vercel.
3. Set Root Directory to `frontend`.
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Environment Variable: `VITE_API_URL=https://your-backend-app.onrender.com`.

### Backend Deployment (Render)
1. Create a New Web Service on Render.
2. Set Root Directory to `backend`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Environment Variable: `GEMINI_API_KEY=your_google_gemini_key`.
