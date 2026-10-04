import React from "react";
import { ShieldAlert, Info } from "lucide-react";

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-navy-900/90 border border-indigo-500/20 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Reflection Tool:</strong> The Blind Spot helps challenge reasoning. The AI never makes decisions for you.
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4 border-l-4 border-l-indigo-500 my-4 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="space-y-1 text-sm">
          <h4 className="font-semibold text-slate-100 flex items-center gap-2">
            Responsible AI & Human Judgment Guarantee
          </h4>
          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
            The Blind Spot is designed exclusively as a critical-thinking reflection workspace to highlight unstated assumptions, 
            overlooked risks, and constructive questions. <strong>This AI will never decide which option you should pick.</strong> All 
            final choices remain 100% in your hands. This platform is not a substitute for professional legal, financial, or medical counsel.
          </p>
        </div>
      </div>
    </div>
  );
}
