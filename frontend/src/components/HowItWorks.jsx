import React from "react";
import { PenTool, Network, CheckSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: PenTool,
      title: "Frame Your Situation",
      description: "Describe the decision, the options you are considering, your current reasoning, and what matters most to you.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      number: "02",
      icon: Network,
      title: "Map Your Blind Spots",
      description: "Google Gemini AI scans your explanation to uncover unstated assumptions, overlooked risks, and priority conflicts.",
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      icon: CheckSquare,
      title: "Reflect & Decide",
      description: "Interact with grounded questions, test alternative lenses, and reach a confident, well-reasoned decision on your own terms.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <section className="py-16 border-t border-white/5 bg-navy-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How The Blind Spot Works
          </h2>
          <p className="text-sm text-slate-400">
            A 3-step structured workspace built to enhance human critical thinking without taking away your autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="glass-card p-6 sm:p-8 relative space-y-4 hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} p-3 text-white shadow-lg`}>
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="text-3xl font-black text-white/10 tracking-widest">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
