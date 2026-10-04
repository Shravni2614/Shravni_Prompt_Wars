import React from "react";
import { SAMPLE_SCENARIOS } from "../data/sampleScenarios";
import { Sparkles, ArrowRight, BookOpen, Briefcase, DollarSign, GraduationCap } from "lucide-react";

export default function SampleScenarios({ onSelectScenario }) {
  const getIcon = (id) => {
    switch(id) {
      case "internship": return GraduationCap;
      case "career-management": return Briefcase;
      case "finances-property": return DollarSign;
      default: return BookOpen;
    }
  };

  return (
    <section id="sample-scenarios" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              Explore Real-World Dilemmas
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Example Decision Scenarios
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Click any scenario to prefill the decision form and test the AI reasoning engine in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_SCENARIOS.map((scenario) => {
            const Icon = getIcon(scenario.id);
            const isInternship = scenario.id === "internship";
            
            return (
              <div 
                key={scenario.id}
                className={`glass-panel p-6 space-y-4 relative flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 ${
                  isInternship ? "border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-navy-900/70" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="badge-category bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                      <Icon className="w-3.5 h-3.5" />
                      {scenario.badge}
                    </span>
                    {isInternship && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full animate-pulse">
                        Featured Demo
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">
                    {scenario.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {scenario.description}
                  </p>

                  <div className="p-3 rounded-lg bg-navy-950/60 border border-white/5 space-y-1 text-xs text-slate-400">
                    <div><strong className="text-slate-200">Options:</strong> {scenario.options.join(" vs ")}</div>
                    <div className="line-clamp-2"><strong className="text-slate-200">Stated Priority:</strong> {scenario.priorities}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => onSelectScenario(scenario)}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isInternship 
                        ? "glass-button-primary" 
                        : "glass-button-secondary"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze This Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
