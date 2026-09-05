import React from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { CareerGoal, Skill } from '../types';

interface AnalyticsViewProps {
  activeGoal: CareerGoal;
  skills: Skill[];
  completedSkills: Record<string, boolean>;
  studentYear: string;
  onOpenAIAdvisor: () => void;
  onSwitchToRoadmap: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  activeGoal,
  skills,
  completedSkills,
  studentYear,
  onOpenAIAdvisor,
  onSwitchToRoadmap,
}) => {
  const total = skills.length;
  const completed = skills.filter((s) => completedSkills[s.id]).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Group by category
  const categoryStats: Record<string, { total: number; completed: number }> = {};
  skills.forEach((s) => {
    if (!categoryStats[s.category]) {
      categoryStats[s.category] = { total: 0, completed: 0 };
    }
    categoryStats[s.category].total += 1;
    if (completedSkills[s.id]) {
      categoryStats[s.category].completed += 1;
    }
  });

  // Calculate total estimated prep weeks remaining
  const remainingWeeks = skills
    .filter((s) => !completedSkills[s.id])
    .reduce((acc, s) => acc + s.estimatedWeeks, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
            Evaluation & Progress Telemetry
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
            {activeGoal.title} Progress Metrics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            Cohort: {studentYear} CSE • Target: {activeGoal.targetCompanies.slice(0, 3).join(', ')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Export audit</span>
          </button>
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI advisor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>READINESS RATIO</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold text-slate-900">{percentage}%</span>
            <span className="text-xs font-mono text-slate-600">
              {percentage >= 75 ? 'Placement ready' : percentage >= 40 ? 'Intermediate' : 'Foundation'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-slate-900 h-full rounded-full" style={{ width: `${percentage}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>VERIFIED MILESTONES</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold text-slate-900">{completed}</span>
            <span className="text-xs text-slate-500 font-mono">/ {total}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            {total - completed} milestones remaining
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>ESTIMATED TIMELINE</span>
            <Clock className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-semibold text-slate-900">~{remainingWeeks}</span>
            <span className="text-xs text-slate-500 font-mono">wks</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            Standard: {activeGoal.recommendedTimeline}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-mono">
            <span>HIRING ROUND TARGET</span>
            <Award className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-mono font-semibold text-slate-900">
              {percentage >= 100 ? 'Tier-1 Ready' : percentage >= 50 ? 'Technical R1' : 'Screening'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            Targeting {activeGoal.badge}
          </p>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">Competency by Domain Category</h3>
            <p className="text-xs text-slate-500">
              Comprehensive distribution across engineering assessment topics.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {Object.keys(categoryStats).length} Domains
          </span>
        </div>

        <div className="space-y-3.5">
          {Object.entries(categoryStats).map(([catName, stats]) => {
            const catPct = Math.round((stats.completed / stats.total) * 100);
            return (
              <div key={catName} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{catName}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">
                      {stats.completed} / {stats.total}
                    </span>
                    <span className="font-semibold text-slate-900 w-10 text-right">{catPct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      catPct === 100
                        ? 'bg-emerald-600'
                        : catPct > 0
                        ? 'bg-slate-900'
                        : 'bg-slate-200'
                    }`}
                    style={{ width: `${catPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placement Preparation Checklist */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">Syllabus Completion Audit</h3>
            <p className="text-xs text-slate-500">
              Detailed breakdown for {activeGoal.title}
            </p>
          </div>
          <button
            onClick={onSwitchToRoadmap}
            className="text-xs font-medium text-slate-900 hover:underline flex items-center gap-1 font-mono"
          >
            <span>Switch to syllabus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {skills.map((skill) => {
            const isDone = Boolean(completedSkills[skill.id]);
            return (
              <div key={skill.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="truncate">
                    <p className={`font-medium ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      <span className="font-mono text-slate-400 mr-1.5">[{String(skill.orderIndex).padStart(2, '0')}]</span>
                      {skill.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{skill.category}</p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isDone ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
