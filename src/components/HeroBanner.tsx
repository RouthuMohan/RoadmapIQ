import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { CareerGoal, CareerGoalId } from '../types';
import { CAREER_GOALS } from '../data/mockRoadmaps';

interface HeroBannerProps {
  activeGoal: CareerGoal;
  onSelectGoal: (goalId: CareerGoalId) => void;
  onOpenGoalSelector: () => void;
  studentYear: string;
  onOpenAIAdvisor: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  activeGoal,
  onSelectGoal,
  onOpenGoalSelector,
  studentYear,
  onOpenAIAdvisor,
}) => {
  return (
    <section className="mb-6 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-xs">
      <div className="relative z-10 space-y-6">
        {/* Top Status Indicators */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-medium text-slate-400 uppercase tracking-wide">
              CSE Placement Blueprint
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-300 font-medium">
              {studentYear} Cohort
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-md">
              {activeGoal.badge}
            </span>
          </div>
        </div>

        {/* Main Title & Objective */}
        <div className="max-w-3xl space-y-2.5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Curated Skill Roadmap for <span className="text-slate-100 underline decoration-slate-600 underline-offset-4">{activeGoal.title}</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {activeGoal.description} Learn and verify milestones in sequenced order to build verified placement readiness for campus drives.
          </p>
        </div>

        {/* Role Switcher Track */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-slate-400">
              Select career track:
            </span>
            <button
              onClick={onOpenGoalSelector}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium transition"
            >
              <span>View all 6 roles & syllabus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CAREER_GOALS.map((g) => {
              const isSelected = g.id === activeGoal.id;
              return (
                <button
                  key={g.id}
                  onClick={() => onSelectGoal(g.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 font-semibold shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Companies & Timeline Row */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">
              Target employers: <span className="text-slate-200 font-medium">{activeGoal.targetCompanies.slice(0, 4).join(', ')}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Prep timeline: <span className="text-slate-200 font-medium font-mono">{activeGoal.recommendedTimeline}</span></span>
            </div>
            <button
              onClick={onOpenAIAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-xs border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Next priority</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
