import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Zap,
  BookOpen,
  Clock,
  Award,
  RefreshCw,
} from 'lucide-react';
import { AIAdviceResult, CareerGoal, Skill } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGoal: CareerGoal;
  studentYear: string;
  onSelectYear: (year: string) => void;
  advice: AIAdviceResult | null;
  isLoading: boolean;
  onRefreshAdvice: (customQuestion?: string) => void;
  onJumpToSkill: (skillId: string) => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  activeGoal,
  studentYear,
  onSelectYear,
  advice,
  isLoading,
  onRefreshAdvice,
  onJumpToSkill,
}) => {
  const [customQuestion, setCustomQuestion] = useState('');

  if (!isOpen) return null;

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoading) return;
    onRefreshAdvice(customQuestion.trim());
    setCustomQuestion('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900">Placement Assessment & Advisor</h3>
                {advice && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-medium rounded border uppercase tracking-wider ${
                      advice.source === 'gemini-ai'
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {advice.source === 'gemini-ai' ? 'Gemini AI Model' : 'CSE Placement Syllabus Engine'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Placement evaluation criteria and sequence recommendations for {activeGoal.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Controls: Target Role & Student Year */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                Current evaluation context
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                Target track: <span className="text-slate-900 underline underline-offset-2">{activeGoal.title}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Cohort:</label>
              <select
                value={studentYear}
                onChange={(e) => {
                  onSelectYear(e.target.value);
                  setTimeout(() => onRefreshAdvice(), 50);
                }}
                className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="1st Year">1st Year CSE</option>
                <option value="2nd Year">2nd Year CSE</option>
                <option value="3rd Year">3rd Year CSE</option>
                <option value="Final Year">Final Year (Graduating)</option>
              </select>

              <button
                onClick={() => onRefreshAdvice()}
                disabled={isLoading}
                title="Recalculate recommendation"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg border border-slate-200 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-slate-900' : ''}`} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-10 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Evaluating syllabus milestones & campus hiring benchmarks...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Synthesizing optimal milestone progression and interview focus areas.
              </p>
            </div>
          )}

          {/* Advice Results */}
          {!isLoading && advice && (
            <div className="space-y-5">
              {/* Recommended Next Skill Card */}
              <div className="p-5 rounded-lg bg-slate-50 border border-slate-300">
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500 uppercase tracking-wide mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Next syllabus target</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {advice.recommendedNextSkillName}
                </h4>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {advice.whyItMattersNow}
                </p>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-mono">
                    Evaluation status: <span className="font-semibold text-slate-800">{advice.readinessEvaluation.stage}</span>
                  </span>
                  <button
                    onClick={() => {
                      onJumpToSkill(advice.recommendedNextSkillId);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition"
                  >
                    <span>Jump to milestone in syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Placement Strategy Note */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-600 uppercase tracking-wide">
                  <Award className="w-4 h-4 text-slate-700" />
                  <span>Mentor advice for {studentYear}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {advice.placementTip}
                </p>
                <div className="text-xs text-slate-800 pt-1 font-medium">
                  Key benchmark this week: {advice.readinessEvaluation.actionableStep}
                </div>
              </div>

              {/* Suggested Study Order Table / List */}
              <div>
                <h4 className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                  <span>Curriculum progression order</span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {advice.suggestedStudyOrder.map((item, idx) => (
                    <div
                      key={item.skillId}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 font-mono text-slate-400 font-semibold text-xs">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.rationale}</p>
                        </div>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] shrink-0 ml-2">
                        {item.estimatedWeeks} wks
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ask Specific Question Form */}
          <form onSubmit={handleAskQuestion} className="pt-3 border-t border-slate-200">
            <label className="block text-xs font-mono font-medium text-slate-500 uppercase tracking-wider mb-1.5">
              Specific career query
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Ask placement query (e.g. 'How many DSA problems before campus hiring drives?')..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50 font-mono"
              />
              <button
                type="submit"
                disabled={isLoading || !customQuestion.trim()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Engine: CSE syllabus criteria + Gemini fallback</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
