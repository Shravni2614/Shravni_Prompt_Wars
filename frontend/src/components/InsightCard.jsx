import React from "react";
import { 
  Eye, HelpCircle, AlertTriangle, Flame, 
  HelpCircle as QuestionIcon, FileText, CheckCircle2, 
  X, ArrowRight, Sparkles, MessageSquareQuote
} from "lucide-react";

export const CATEGORY_CONFIG = {
  visible: {
    label: "Visible Factor",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
    desc: "What you have already explicitly considered."
  },
  assumption: {
    label: "Hidden Assumption",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    icon: HelpCircle,
    desc: "Beliefs treated as facts without proof."
  },
  overlooked: {
    label: "Overlooked Factor",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    badgeClass: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    icon: Eye,
    desc: "Important considerations missing from reasoning."
  },
  risk: {
    label: "Potential Risk",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    badgeClass: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    icon: AlertTriangle,
    desc: "Negative consequences & trade-offs."
  },
  conflict: {
    label: "Reasoning Conflict",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    icon: Flame,
    desc: "Contradictions between priorities & rationale."
  },
  perspective: {
    label: "Alternative Lens",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    badgeClass: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    icon: Sparkles,
    desc: "Other valid ways to view the situation."
  },
  question: {
    label: "Critical Question",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    icon: QuestionIcon,
    desc: "Specific questions to investigate."
  },
  missing: {
    label: "Missing Fact",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    badgeClass: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    icon: FileText,
    desc: "Concrete facts you should gather."
  }
};

export default function InsightCard({ insight, isSelected, onClick, isModal = false, onClose }) {
  if (!insight) return null;

  const config = CATEGORY_CONFIG[insight.category] || CATEGORY_CONFIG.overlooked;
  const CategoryIcon = config.icon;

  const severityBadge = {
    high: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    medium: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    low: "bg-slate-500/20 text-slate-300 border-slate-500/40"
  }[insight.severity || "medium"];

  // Modal Render Mode
  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-modal-title"
      >
        <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 space-y-6 relative border-indigo-500/30 max-h-[90vh] overflow-y-auto shadow-2xl">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`badge-category ${config.badgeClass}`}>
                  <CategoryIcon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase tracking-wider ${severityBadge}`}>
                  {insight.severity} Priority
                </span>
                {insight.related_option && (
                  <span className="px-2 py-0.5 text-[10px] bg-navy-800 text-slate-300 rounded border border-white/10">
                    Option: {insight.related_option}
                  </span>
                )}
              </div>
              <h3 id="insight-modal-title" className="text-xl font-bold text-white pt-1">
                {insight.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-400 hover:text-white border border-white/10 transition-colors"
              aria-label="Close detail modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-5 text-sm">
            
            {/* Grounded Explanation */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Grounded Explanation
              </h4>
              <p className="text-slate-200 leading-relaxed bg-navy-950/60 p-4 rounded-xl border border-white/5">
                {insight.explanation}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Why This Matters to Your Decision
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {insight.why_it_matters}
              </p>
            </div>

            {/* Reflective Question */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-navy-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <QuestionIcon className="w-4 h-4 text-indigo-400" />
                <span>Reflective Question for You</span>
              </div>
              <p className="text-base font-semibold text-white italic">
                "{insight.reflective_question}"
              </p>
            </div>

            {/* Supporting Evidence Reference */}
            {insight.evidence && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MessageSquareQuote className="w-4 h-4 text-purple-400" />
                  <span>Grounding Evidence from Your Explanation</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-950 border border-white/10 font-mono text-xs text-indigo-200">
                  "{insight.evidence}"
                </div>
              </div>
            )}

          </div>

          {/* Footer Close */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="glass-button-primary px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Continue Reflecting
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Card Grid Render Mode
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 space-y-3 cursor-pointer transition-all duration-300 relative group ${
        isSelected ? "border-indigo-500 ring-2 ring-indigo-500/30 bg-navy-850/90 shadow-lg shadow-indigo-500/10" : ""
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick && onClick()}
      aria-label={`View insight: ${insight.title}`}
    >
      <div className="flex items-center justify-between">
        <span className={`badge-category ${config.badgeClass}`}>
          <CategoryIcon className="w-3.5 h-3.5" />
          {config.label}
        </span>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${severityBadge}`}>
          {insight.severity}
        </span>
      </div>

      <h4 className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors text-sm sm:text-base leading-snug">
        {insight.title}
      </h4>

      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
        {insight.explanation}
      </p>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
        <span>Click for reflective question & evidence</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
