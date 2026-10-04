import React, { useState } from "react";
import { 
  Sparkles, CheckCircle2, HelpCircle, Flame, 
  AlertTriangle, Eye, FileText, Compass, Search, 
  MessageSquare, ShieldCheck
} from "lucide-react";
import InsightCard from "./InsightCard";

export default function AnalysisDashboard({ analysis, onSelectInsight, onGoToReflection }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!analysis) return null;

  const tabs = [
    { id: "all", label: "All Insights", count: 0 },
    { id: "visible", label: "Visible Factors", items: analysis.visible_factors || [] },
    { id: "assumption", label: "Hidden Assumptions", items: analysis.hidden_assumptions || [] },
    { id: "overlooked", label: "Overlooked Factors", items: analysis.overlooked_factors || [] },
    { id: "risk", label: "Potential Risks", items: analysis.potential_risks || [] },
    { id: "conflict", label: "Reasoning Conflicts", items: analysis.reasoning_conflicts || [] },
    { id: "perspective", label: "Alternative Lenses", items: analysis.alternative_perspectives || [] },
    { id: "question", label: "Critical Questions", items: analysis.critical_questions || [] },
    { id: "missing", label: "Missing Facts", items: analysis.missing_information || [] },
  ];

  const allItems = [
    ...(analysis.visible_factors || []),
    ...(analysis.hidden_assumptions || []),
    ...(analysis.overlooked_factors || []),
    ...(analysis.potential_risks || []),
    ...(analysis.reasoning_conflicts || []),
    ...(analysis.alternative_perspectives || []),
    ...(analysis.critical_questions || []),
    ...(analysis.missing_information || []),
  ];

  tabs[0].count = allItems.length;

  const displayedItems = (activeTab === "all" 
    ? allItems 
    : allItems.filter(item => item.category === activeTab)
  ).filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.why_it_matters.toLowerCase().includes(q) ||
      item.reflective_question.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      
      {/* Reflection Synthesis Summary Header */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-l-4 border-l-purple-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                Executive Synthesis
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Reflection Summary for "{analysis.decision_title}"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-navy-950 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>{analysis.engine_used || "Google Gemini"}</span>
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed bg-navy-950/60 p-4 rounded-xl border border-white/5">
          {analysis.reflection_summary}
        </p>
      </div>

      {/* Categorized Tab Bar & Search Filter */}
      <div className="glass-panel p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const count = tab.id === "all" ? tab.count : (tab.items || []).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-navy-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="px-1.5 py-0.2 bg-navy-950 text-[10px] rounded border border-white/10 font-mono">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Insight Cards Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-400">
              No matching insights found in this category or search filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onClick={() => onSelectInsight(insight)}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
