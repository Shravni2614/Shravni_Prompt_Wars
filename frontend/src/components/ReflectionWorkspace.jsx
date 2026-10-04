import React, { useState } from "react";
import { 
  PenTool, CheckSquare, RotateCcw, Edit3, 
  HelpCircle, ShieldCheck, ArrowRight, Save, Check
} from "lucide-react";

export default function ReflectionWorkspace({ analysis, originalInput, onEditReasoning, onNewDecision }) {
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(false);

  // Extract investigation questions from critical questions and missing information
  const questionsToInvestigate = [
    ...(analysis?.critical_questions || []).map(q => ({ id: q.id, text: q.reflective_question, title: q.title })),
    ...(analysis?.missing_information || []).map(m => ({ id: m.id, text: m.explanation, title: m.title })),
  ];

  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveNotes = () => {
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Workspace Header */}
      <div className="glass-panel p-6 sm:p-8 space-y-4 border-l-4 border-l-emerald-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                Personal Reflection Hub
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Reflection & Action Workspace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onEditReasoning}
              className="glass-button-secondary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edit Original Reasoning</span>
            </button>
            <button
              onClick={onNewDecision}
              className="glass-button-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Analyze Another Decision</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          Synthesize your thoughts, mark questions for further empirical investigation, and record private reflection notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Personal Notepad */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="user-reflection-notes" className="text-sm font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-400" />
                <span>Your Private Reflection Notes</span>
              </label>
              <button
                onClick={handleSaveNotes}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                {savedNotes ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedNotes ? "Saved!" : "Save Notes"}</span>
              </button>
            </div>

            <textarea
              id="user-reflection-notes"
              rows={8}
              value={reflectionNotes}
              onChange={(e) => setReflectionNotes(e.target.value)}
              placeholder="Jot down your initial reactions, key realizations from the Blind Spot Map, people you plan to talk to, or modified assumptions..."
              className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-white/10 focus:border-indigo-500 text-white placeholder-slate-500 text-sm"
            />

            <p className="text-[11px] text-slate-500">
              Notes stay safely stored in your browser turn state during reflection.
            </p>
          </div>
        </div>

        {/* Right Column: Questions to Investigate Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-purple-400" />
                <span>Questions to Investigate</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {Object.values(checkedItems).filter(Boolean).length} / {questionsToInvestigate.length} Resolved
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {questionsToInvestigate.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  All critical questions have been addressed.
                </p>
              ) : (
                questionsToInvestigate.map((q) => {
                  const isChecked = !!checkedItems[q.id];
                  return (
                    <div 
                      key={q.id}
                      onClick={() => toggleCheck(q.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                        isChecked 
                          ? "bg-navy-950/40 border-emerald-500/30 text-slate-400 line-through opacity-70"
                          : "bg-navy-850/80 border-white/10 hover:border-indigo-500/40 text-slate-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-0.5 rounded bg-navy-950 border-white/20 text-indigo-500 focus:ring-indigo-500"
                      />
                      <div className="space-y-0.5">
                        <span className="font-semibold block text-indigo-300">{q.title}</span>
                        <span>{q.text}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Human Judgment Guarantee Statement */}
      <div className="glass-panel p-6 text-center space-y-4 border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-navy-900 to-purple-950/40">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-xl mx-auto">
          <h3 className="text-lg font-bold text-white">
            The Choice Belongs to You
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The AI has audited your reasoning, highlighted unstated assumptions, and presented critical questions. 
            Now that you see what was previously hidden, <strong>you hold total clarity and authority to make your decision.</strong>
          </p>
        </div>
      </div>

    </div>
  );
}
