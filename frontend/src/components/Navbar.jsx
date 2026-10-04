import React from "react";
import { Eye, Sparkles, Brain, ArrowRight } from "lucide-react";

export default function Navbar({ activeStage, onNavigate, hasAnalysis }) {
  return (
    <header className="sticky top-0 z-40 bg-navy-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-3 group focus-visible:ring-indigo-500 rounded-lg p-1 text-left"
          aria-label="Go to landing page"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-navy-950 animate-pulse"></span>
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              THE BLIND SPOT
            </span>
            <span className="block text-[10px] font-medium text-indigo-300 tracking-wide uppercase">
              See what your reasoning might be missing
            </span>
          </div>
        </button>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("landing")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeStage === "landing"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-navy-800/60"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onNavigate("form")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeStage === "form"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-300 hover:text-white hover:bg-navy-800/60"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>Input Decision</span>
          </button>

          {hasAnalysis && (
            <button
              onClick={() => onNavigate("analysis")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeStage === "analysis"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "text-purple-300 hover:bg-purple-500/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Blind Spot Map</span>
            </button>
          )}

          <button
            onClick={() => onNavigate("form")}
            className="glass-button-primary px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md ml-2"
          >
            <span>Analyze Decision</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
