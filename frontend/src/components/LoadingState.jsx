import React, { useState, useEffect } from "react";
import { Eye, Brain, Sparkles, Network, CheckCircle2 } from "lucide-react";

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Parsing Stated Rationale & Options", desc: "Extracting explicit decision boundaries and priorities..." },
    { title: "Extracting Hidden Assumptions & Grounding", desc: "Evaluating beliefs treated as facts without proof..." },
    { title: "Auditing Priority Conflicts & Risks", desc: "Checking if stated priorities clash with proposed paths..." },
    { title: "Rendering Interactive Blind Spot Map", desc: "Connecting visible thoughts to overlooked perspectives..." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div 
      className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8"
      role="status"
      aria-live="polite"
    >
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 animate-spin">
          <div className="w-full h-full bg-navy-950 rounded-[22px] flex items-center justify-center">
            <Eye className="w-10 h-10 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          Scanning Your Reasoning for Blind Spots
        </h3>
        <p className="text-sm text-slate-400">
          Google Gemini AI is conducting a multi-layered logical audit of your input.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="glass-panel p-6 space-y-4 text-left max-w-lg mx-auto border-indigo-500/20">
        {steps.map((step, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div key={idx} className="flex items-start gap-3 transition-all duration-300">
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="w-5 h-5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin inline-block"></span>
                ) : (
                  <span className="w-5 h-5 rounded-full border border-white/20 inline-block"></span>
                )}
              </div>
              <div className="space-y-0.5 text-xs">
                <span className={`font-semibold block ${isCurrent ? "text-indigo-300" : isDone ? "text-slate-200" : "text-slate-500"}`}>
                  {step.title}
                </span>
                <span className="text-slate-400 text-[11px]">{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-500 italic">
        "Critical thinking is not about finding the right answer; it is about asking the right questions."
      </p>
    </div>
  );
}
