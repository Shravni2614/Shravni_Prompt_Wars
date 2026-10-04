import React, { useState } from "react";
import { 
  Eye, HelpCircle, Flame, AlertTriangle, 
  Sparkles, FileText, CheckCircle2, ArrowRight, 
  Layers, Filter, Info, ChevronRight, Compass
} from "lucide-react";
import InsightCard, { CATEGORY_CONFIG } from "./InsightCard";

export default function BlindSpotMap({ analysis, onSelectInsight }) {
  const [filterCategory, setFilterCategory] = useState("all");

  if (!analysis) return null;

  // Flatten insights with map coordinates and clusters
  const allInsights = [
    ...(analysis.visible_factors || []),
    ...(analysis.hidden_assumptions || []),
    ...(analysis.overlooked_factors || []),
    ...(analysis.potential_risks || []),
    ...(analysis.reasoning_conflicts || []),
    ...(analysis.alternative_perspectives || []),
    ...(analysis.critical_questions || []),
    ...(analysis.missing_information || []),
  ];

  const filteredInsights = filterCategory === "all" 
    ? allInsights 
    : allInsights.filter(item => item.category === filterCategory);

  // Group by category for visual clusters
  const categories = [
    { id: "visible", title: "Visible Rationale", items: analysis.visible_factors || [], icon: CheckCircle2, border: "border-emerald-500/40", glow: "from-emerald-500/10" },
    { id: "assumption", title: "Hidden Assumptions", items: analysis.hidden_assumptions || [], icon: HelpCircle, border: "border-amber-500/40", glow: "from-amber-500/10" },
    { id: "overlooked", title: "Overlooked Factors", items: analysis.overlooked_factors || [], icon: Eye, border: "border-indigo-500/40", glow: "from-indigo-500/10" },
    { id: "conflict", title: "Reasoning Conflicts", items: analysis.reasoning_conflicts || [], icon: Flame, border: "border-purple-500/40", glow: "from-purple-500/10" },
    { id: "risk", title: "Potential Risks", items: analysis.potential_risks || [], icon: AlertTriangle, border: "border-rose-500/40", glow: "from-rose-500/10" },
    { id: "question", title: "Critical Questions", items: analysis.critical_questions || [], icon: Sparkles, border: "border-sky-500/40", glow: "from-sky-500/10" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Map Control Bar */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                Key Differentiating Feature
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Interactive Blind Spot Map
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-navy-950/80 px-3 py-1.5 rounded-xl border border-white/10">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Click any node card to examine grounded evidence and reflective questions</span>
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Map:
          </span>
          
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === "all"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "bg-navy-800 text-slate-300 hover:bg-navy-700"
            }`}
          >
            All Nodes ({allInsights.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterCategory === cat.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-navy-800 text-slate-300 hover:bg-navy-700"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span>{cat.title} ({cat.items.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas Representation */}
      <div className="glass-panel p-6 sm:p-8 space-y-8 relative overflow-hidden bg-navy-950/90 border-indigo-500/20">
        
        {/* Central Decision Hub */}
        <div className="flex flex-col items-center justify-center text-center py-6 px-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-navy-900 to-purple-950/80 border border-indigo-500/30 relative">
          <span className="badge-category bg-indigo-500/20 text-indigo-300 border-indigo-500/40 mb-2">
            Subject Decision
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white max-w-xl">
            "{analysis.decision_title}"
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Connected graph of visible considerations, hidden assumptions, and priority conflicts.
          </p>
        </div>

        {/* Categories Cluster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories
            .filter(cat => filterCategory === "all" || filterCategory === cat.id)
            .map((cat) => {
              const Icon = cat.icon;
              const hasItems = cat.items.length > 0;

              return (
                <div 
                  key={cat.id}
                  className={`glass-card p-5 space-y-4 border ${cat.border} bg-gradient-to-b ${cat.glow} to-navy-900/60 relative flex flex-col justify-between`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-navy-800 text-slate-200">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm text-white">{cat.title}</h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-white/10">
                        {cat.items.length}
                      </span>
                    </div>

                    {!hasItems ? (
                      <p className="text-xs text-slate-500 italic py-4 text-center">
                        No critical {cat.title.toLowerCase()} detected in this input.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {cat.items.map((item) => (
                          <InsightCard
                            key={item.id}
                            insight={item}
                            onClick={() => onSelectInsight(item)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

      </div>

    </div>
  );
}
