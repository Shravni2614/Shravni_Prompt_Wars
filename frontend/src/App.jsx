import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LandingHero from "./components/LandingHero";
import HowItWorks from "./components/HowItWorks";
import SampleScenarios from "./components/SampleScenarios";
import DecisionForm from "./components/DecisionForm";
import LoadingState from "./components/LoadingState";
import BlindSpotMap from "./components/BlindSpotMap";
import AnalysisDashboard from "./components/AnalysisDashboard";
import ReflectionWorkspace from "./components/ReflectionWorkspace";
import InsightCard from "./components/InsightCard";
import DisclaimerBanner from "./components/DisclaimerBanner";
import { analyzeDecision } from "./services/api";
import { AlertCircle, Eye, Sparkles, Layers, PenTool, ArrowRight } from "lucide-react";

export default function App() {
  // Stage management: 'landing' | 'form' | 'loading' | 'analysis' | 'reflection'
  const [activeStage, setActiveStage] = useState("landing");
  
  // Decision Form state
  const [formData, setFormData] = useState(null);
  
  // Analysis Output state
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Detail Modal state
  const [selectedInsight, setSelectedInsight] = useState(null);
  
  // Error handling state
  const [apiError, setApiError] = useState(null);
  
  // View mode inside Analysis stage: 'map' | 'dashboard' | 'reflection'
  const [analysisTab, setAnalysisTab] = useState("map");

  const handleStartForm = (scenarioData = null) => {
    if (scenarioData) {
      setFormData({
        title: scenarioData.title,
        situation: scenarioData.situation,
        options: [...scenarioData.options],
        reasoning: scenarioData.reasoning,
        priorities: scenarioData.priorities,
        concerns: scenarioData.concerns || "",
      });
    }
    setApiError(null);
    setActiveStage("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitDecision = async (cleanPayload) => {
    setFormData(cleanPayload);
    setApiError(null);
    setActiveStage("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const result = await analyzeDecision(cleanPayload);
      setAnalysisResult(result);
      setActiveStage("analysis");
      setAnalysisTab("map");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Analysis submission error:", err);
      setApiError(err.message || "Failed to analyze decision. Please check your backend server.");
      setActiveStage("form");
    }
  };

  const handleNewDecision = () => {
    setFormData(null);
    setAnalysisResult(null);
    setApiError(null);
    setActiveStage("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditReasoning = () => {
    setActiveStage("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      
      {/* Global Navigation Header */}
      <Navbar
        activeStage={activeStage}
        onNavigate={(stage) => {
          if (stage === "form") handleStartForm();
          else setActiveStage(stage);
        }}
        hasAnalysis={!!analysisResult}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pb-16">
        
        {/* Error Notification Banner */}
        {apiError && (
          <div className="max-w-4xl mx-auto px-4 pt-6">
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between text-rose-300 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{apiError}</span>
              </div>
              <button
                onClick={() => setApiError(null)}
                className="text-xs text-rose-400 hover:text-rose-200 underline font-semibold ml-4 shrink-0"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* STAGE A: LANDING PAGE */}
        {activeStage === "landing" && (
          <div className="space-y-12">
            <LandingHero onStart={() => handleStartForm()} />
            <HowItWorks />
            <SampleScenarios onSelectScenario={(scenario) => handleStartForm(scenario)} />
          </div>
        )}

        {/* STAGE B: DECISION INPUT FORM */}
        {activeStage === "form" && (
          <DecisionForm
            initialData={formData}
            onSubmit={handleSubmitDecision}
            isLoading={activeStage === "loading"}
          />
        )}

        {/* STAGE C: LOADING STATE */}
        {activeStage === "loading" && <LoadingState />}

        {/* STAGE D: ANALYSIS WORKSPACE (Blind Spot Map & Dashboard & Reflection) */}
        {activeStage === "analysis" && analysisResult && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Analysis Workspace Sub-Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                  Analysis Workspace
                </span>
                <h1 className="text-2xl font-extrabold text-white">
                  "{analysisResult.decision_title}"
                </h1>
              </div>

              <div className="flex items-center gap-2 bg-navy-900/80 p-1.5 rounded-2xl border border-white/10">
                <button
                  onClick={() => setAnalysisTab("map")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    analysisTab === "map"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Blind Spot Map</span>
                </button>

                <button
                  onClick={() => setAnalysisTab("dashboard")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    analysisTab === "dashboard"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Categorized List</span>
                </button>

                <button
                  onClick={() => setAnalysisTab("reflection")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    analysisTab === "reflection"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Reflection Hub</span>
                </button>
              </div>
            </div>

            <DisclaimerBanner />

            {/* Sub-view switcher */}
            {analysisTab === "map" && (
              <BlindSpotMap
                analysis={analysisResult}
                onSelectInsight={(insight) => setSelectedInsight(insight)}
              />
            )}

            {analysisTab === "dashboard" && (
              <AnalysisDashboard
                analysis={analysisResult}
                onSelectInsight={(insight) => setSelectedInsight(insight)}
                onGoToReflection={() => setAnalysisTab("reflection")}
              />
            )}

            {analysisTab === "reflection" && (
              <ReflectionWorkspace
                analysis={analysisResult}
                originalInput={formData}
                onEditReasoning={handleEditReasoning}
                onNewDecision={handleNewDecision}
              />
            )}

          </div>
        )}

      </main>

      {/* Detail Modal Overlay */}
      {selectedInsight && (
        <InsightCard
          insight={selectedInsight}
          isModal={true}
          onClose={() => setSelectedInsight(null)}
        />
      )}

      {/* Global Footer */}
      <footer className="bg-navy-950 border-t border-white/10 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            <span className="font-extrabold text-slate-200">THE BLIND SPOT</span>
            <span>— See what your reasoning might be missing.</span>
          </div>
          <p className="text-slate-500">
            Powered by Google Gemini API & FastAPI. Built for Human Critical Thinking.
          </p>
        </div>
      </footer>

    </div>
  );
}
