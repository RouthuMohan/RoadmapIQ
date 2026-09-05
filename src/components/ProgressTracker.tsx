import React from 'react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
} from 'lucide-react';
import { CareerGoal } from '../types';

interface ProgressTrackerProps {
  completedCount: number;
  totalSkills: number;
  activeGoal: CareerGoal;
  remainingWeeks: number;
  onOpenAIAdvisor: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  completedCount,
  totalSkills,
  activeGoal,
  remainingWeeks,
  onOpenAIAdvisor,
}) => {
  const percentage = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  // Milestone title & description
  let milestoneTitle = 'Initial Phase';
  let milestoneColor = 'text-slate-700 bg-slate-100 border-slate-200';
  let statusMessage = 'Begin with Stage 01 fundamentals to build placement readiness.';

  if (percentage >= 100) {
    milestoneTitle = 'Syllabus Complete';
    milestoneColor = 'text-emerald-800 bg-emerald-50 border-emerald-300';
    statusMessage = 'All syllabus modules completed. Focus on mock interview problem sets.';
  } else if (percentage >= 75) {
    milestoneTitle = 'Interview Ready';
    milestoneColor = 'text-slate-900 bg-slate-100 border-slate-300';
    statusMessage = 'Sufficient depth to clear technical phone screens and on-campus assessments.';
  } else if (percentage >= 40) {
    milestoneTitle = 'Intermediate Track';
    milestoneColor = 'text-slate-800 bg-slate-100 border-slate-200';
    statusMessage = 'Advancing through core algorithms, architecture, and practical portfolio projects.';
  } else if (percentage > 0) {
    milestoneTitle = 'Foundations Active';
    milestoneColor = 'text-slate-800 bg-slate-100 border-slate-200';
    statusMessage = 'Foundations in progress. Complete data structures, syntax mastery, and standard patterns.';
  }

  return (
    <section className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left: Overall placement metric */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
              Readiness index
            </span>
            <span className="text-slate-300">•</span>
            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${milestoneColor}`}>
              {milestoneTitle}
            </span>
          </div>

          <div className="flex items-baseline gap-3 pt-0.5">
            <h3 className="text-3xl sm:text-4xl font-mono font-bold text-slate-900 tracking-tight">
              {percentage}%
            </h3>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">
              <span className="font-mono font-semibold text-slate-900">{completedCount}</span> of <span className="font-mono">{totalSkills}</span> verified skills for <span className="font-semibold text-slate-900">{activeGoal.title}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xl">
            {statusMessage}
          </p>
        </div>

        {/* Right Stats Pills */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-left min-w-[110px]">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Completed
            </span>
            <p className="text-base font-mono font-bold text-slate-900 mt-0.5">
              {completedCount} <span className="text-xs font-normal text-slate-400">/ {totalSkills}</span>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-left min-w-[110px]">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Est. Remaining
            </span>
            <p className="text-base font-mono font-bold text-slate-900 mt-0.5">
              ~{remainingWeeks} <span className="text-xs font-normal text-slate-400">Weeks</span>
            </p>
          </div>

          <button
            id="advisor-tip-shortcut"
            onClick={onOpenAIAdvisor}
            className="flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition text-left border border-slate-800"
          >
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Next target
              </span>
              <p className="text-xs font-medium text-white mt-0.5">Recommend step</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* The Clean Progress Bar */}
      <div className="mt-5 space-y-2">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-slate-900 transition-all duration-500 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        {/* Milestone Steps Markers */}
        <div className="grid grid-cols-4 text-[10px] font-mono text-slate-400 pt-1">
          <div className="text-left">
            <span className={percentage >= 1 ? 'text-slate-900 font-semibold' : ''}>0% Start</span>
          </div>
          <div className="text-center">
            <span className={percentage >= 33 ? 'text-slate-900 font-semibold' : ''}>33% Basics</span>
          </div>
          <div className="text-center">
            <span className={percentage >= 66 ? 'text-slate-900 font-semibold' : ''}>66% Projects</span>
          </div>
          <div className="text-right">
            <span className={percentage >= 100 ? 'text-emerald-700 font-semibold' : ''}>100% Interview</span>
          </div>
        </div>
      </div>
    </section>
  );
};
