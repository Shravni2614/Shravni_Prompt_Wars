import React, { useState, useEffect } from "react";
import { SAMPLE_SCENARIOS } from "../data/sampleScenarios";
import DisclaimerBanner from "./DisclaimerBanner";
import { 
  Sparkles, Plus, Trash2, HelpCircle, 
  AlertCircle, ArrowRight, RotateCcw, Lightbulb 
} from "lucide-react";

export default function DecisionForm({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    situation: "",
    options: ["", ""],
    reasoning: "",
    priorities: "",
    concerns: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        situation: initialData.situation || "",
        options: initialData.options && initialData.options.length ? initialData.options : ["", ""],
        reasoning: initialData.reasoning || "",
        priorities: initialData.priorities || "",
        concerns: initialData.concerns || "",
      });
      setErrors({});
    }
  }, [initialData]);

  const handleLoadInternshipSample = () => {
    const sample = SAMPLE_SCENARIOS.find((s) => s.id === "internship") || SAMPLE_SCENARIOS[0];
    setFormData({
      title: sample.title,
      situation: sample.situation,
      options: [...sample.options],
      reasoning: sample.reasoning,
      priorities: sample.priorities,
      concerns: sample.concerns,
    });
    setErrors({});
  };

  const handleClear = () => {
    setFormData({
      title: "",
      situation: "",
      options: ["", ""],
      reasoning: "",
      priorities: "",
      concerns: "",
    });
    setErrors({});
  };

  const handleOptionChange = (index, value) => {
    const updated = [...formData.options];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 1) {
      const updated = formData.options.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, options: updated }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errs.title = "Please provide a decision title (at least 3 characters).";
    }
    if (!formData.situation.trim() || formData.situation.trim().length < 10) {
      errs.situation = "Please describe your situation & background (at least 10 characters).";
    }
    const validOptions = formData.options.filter((opt) => opt.trim().length > 0);
    if (validOptions.length < 1) {
      errs.options = "Please enter at least 1 valid option under consideration.";
    }
    if (!formData.reasoning.trim() || formData.reasoning.trim().length < 10) {
      errs.reasoning = "Please share your current reasoning or rationale (at least 10 characters).";
    }
    if (!formData.priorities.trim() || formData.priorities.trim().length < 3) {
      errs.priorities = "Please state your key priorities & motivations.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const cleanPayload = {
        title: formData.title.trim(),
        situation: formData.situation.trim(),
        options: formData.options.filter((opt) => opt.trim().length > 0),
        reasoning: formData.reasoning.trim(),
        priorities: formData.priorities.trim(),
        concerns: formData.concerns.trim(),
      };
      onSubmit(cleanPayload);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header & Quick Action */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              Step 1 — Frame Your Dilemma
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Describe Your Decision
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              The AI will analyze your stated reasoning against your priorities to uncover hidden blind spots.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLoadInternshipSample}
              className="glass-button-primary px-3.5 py-2 rounded-xl text-xs flex items-center gap-2"
              id="load-sample-internship-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load Sample Internship Scenario</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl border border-white/10 hover:bg-navy-800 text-slate-400 hover:text-slate-200 text-xs"
              title="Clear form"
              aria-label="Clear form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <DisclaimerBanner compact={true} />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Decision Title */}
          <div className="space-y-2">
            <label htmlFor="decision-title" className="block text-sm font-semibold text-slate-200">
              Decision Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="decision-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Should I accept the startup offer or stay at big tech?"
              className={`w-full px-4 py-3 rounded-xl bg-navy-950/80 border ${
                errors.title ? "border-rose-500" : "border-white/10 focus:border-indigo-500"
              } text-white placeholder-slate-500 text-sm transition-colors`}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Situation & Background */}
          <div className="space-y-2">
            <label htmlFor="decision-situation" className="block text-sm font-semibold text-slate-200">
              Background & Situation <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="decision-situation"
              rows={3}
              value={formData.situation}
              onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
              placeholder="Describe the context: your background, current position, timeframe, and why this decision matters now..."
              className={`w-full px-4 py-3 rounded-xl bg-navy-950/80 border ${
                errors.situation ? "border-rose-500" : "border-white/10 focus:border-indigo-500"
              } text-white placeholder-slate-500 text-sm transition-colors`}
            />
            {errors.situation && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.situation}
              </p>
            )}
          </div>

          {/* Options Being Considered */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-200">
                Options Under Consideration <span className="text-rose-400">*</span>
              </label>
              <span className="text-xs text-slate-400">At least 1 option required</span>
            </div>

            <div className="space-y-2.5">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-400 w-6 text-right">
                    {idx + 1}.
                  </span>
                  <input
                    id={`option-field-${idx}`}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1} (e.g. Join Startup as Engineer)`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-navy-950/80 border border-white/10 focus:border-indigo-500 text-white placeholder-slate-500 text-sm"
                  />
                  {formData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="p-2.5 rounded-xl border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400"
                      title="Remove option"
                      aria-label={`Remove option ${idx + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {formData.options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-indigo-500/10"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Option</span>
              </button>
            )}
            {errors.options && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.options}
              </p>
            )}
          </div>

          {/* Current Reasoning */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="decision-reasoning" className="block text-sm font-semibold text-slate-200">
                Current Rationale & Reasoning <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-1 text-[11px] text-indigo-300" title="Why you lean towards a specific path right now">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why lean one way?</span>
              </div>
            </div>
            <textarea
              id="decision-reasoning"
              rows={3}
              value={formData.reasoning}
              onChange={(e) => setFormData({ ...formData, reasoning: e.target.value })}
              placeholder="Explain why you currently favor one option over another, what trade-offs you have evaluated so far..."
              className={`w-full px-4 py-3 rounded-xl bg-navy-950/80 border ${
                errors.reasoning ? "border-rose-500" : "border-white/10 focus:border-indigo-500"
              } text-white placeholder-slate-500 text-sm transition-colors`}
            />
            {errors.reasoning && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.reasoning}
              </p>
            )}
          </div>

          {/* Priorities & Motivations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="decision-priorities" className="block text-sm font-semibold text-slate-200">
                Stated Priorities & Motivations <span className="text-rose-400">*</span>
              </label>
              <input
                id="decision-priorities"
                type="text"
                value={formData.priorities}
                onChange={(e) => setFormData({ ...formData, priorities: e.target.value })}
                placeholder="e.g. Fast career growth, financial security, work-life balance"
                className={`w-full px-4 py-3 rounded-xl bg-navy-950/80 border ${
                  errors.priorities ? "border-rose-500" : "border-white/10 focus:border-indigo-500"
                } text-white placeholder-slate-500 text-sm transition-colors`}
              />
              {errors.priorities && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.priorities}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="decision-concerns" className="block text-sm font-semibold text-slate-200">
                Current Concerns & Doubts <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="decision-concerns"
                type="text"
                value={formData.concerns}
                onChange={(e) => setFormData({ ...formData, concerns: e.target.value })}
                placeholder="e.g. Burnout, lack of structured mentorship, risk of startup failing"
                className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-white/10 focus:border-indigo-500 text-white placeholder-slate-500 text-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Clicking analyze triggers Google Gemini AI evaluation</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="glass-button-primary px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50"
              id="submit-decision-analysis-btn"
            >
              <span>{isLoading ? "Analyzing Reasoning..." : "Generate Blind Spot Map"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
