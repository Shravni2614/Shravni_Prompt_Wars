import React from "react";
import { Eye, Shield, Compass, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingHero({ onStart }) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 text-center sm:text-left">
      {/* Background glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Google Gemini AI Reasoning Partner</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              See what your reasoning might be <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">missing.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              When making high-stakes choices, we tend to fixate on the information right in front of us. 
              <strong> The Blind Spot</strong> exposes hidden assumptions, unexamined risks, and priority conflicts—giving 
              you the critical clarity needed to decide with confidence.
            </p>

            {/* Core Values Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 bg-navy-900/60 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero AI Bias or Decision Forcing</span>
              </div>
              <div className="flex items-center gap-1.5 bg-navy-900/60 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Interactive Blind Spot Map</span>
              </div>
              <div className="flex items-center gap-1.5 bg-navy-900/60 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Evidence-Grounded Insights</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onStart}
                className="glass-button-primary px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-3 group shadow-xl shadow-indigo-500/20"
                id="explore-blind-spots-cta"
              >
                <span>Explore Your Blind Spots</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#sample-scenarios"
                className="glass-button-secondary px-6 py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>View Sample Scenarios</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 sm:p-8 relative border-indigo-500/30 shadow-2xl space-y-6 animate-float">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Live Decision Analysis</h3>
                    <p className="text-xs text-slate-400">Sample: Startup Offer vs Big Tech</p>
                  </div>
                </div>
                <span className="badge-category bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                  Interactive Node
                </span>
              </div>

              {/* Sample Nodes Preview */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-navy-800/80 border border-emerald-500/30 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-300 block">Visible Factor</span>
                    <span className="text-slate-300">Evaluating $10k/mo stipend vs $120k equity upside.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-800/80 border border-amber-500/30 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <div className="text-xs">
                    <span className="font-semibold text-amber-300 block">Hidden Assumption</span>
                    <span className="text-slate-300">Assuming startup CTO will have dedicated time for mentorship.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-navy-800/80 border border-rose-500/30 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                  <div className="text-xs">
                    <span className="font-semibold text-rose-300 block">Reasoning Conflict</span>
                    <span className="text-slate-300">Prioritizing work-life balance while choosing a 12-person startup.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
                <span>Click any insight on the map to reveal reflective questions & evidence</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
