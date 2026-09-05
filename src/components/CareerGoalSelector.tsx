import React from 'react';
import {
  Code2,
  Globe,
  BarChart3,
  Server,
  BrainCircuit,
  Smartphone,
  Check,
  Building2,
  Clock,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';
import { CareerGoal, CareerGoalId } from '../types';
import { CAREER_GOALS } from '../data/mockRoadmaps';

interface CareerGoalSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGoalId: CareerGoalId;
  onSelectGoal: (goalId: CareerGoalId) => void;
  studentYear: string;
  onSelectYear: (year: string) => void;
}

const getRoleIcon = (iconName: string) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className="w-5 h-5" />;
    case 'Globe':
      return <Globe className="w-5 h-5" />;
    case 'BarChart3':
      return <BarChart3 className="w-5 h-5" />;
    case 'Server':
      return <Server className="w-5 h-5" />;
    case 'BrainCircuit':
      return <BrainCircuit className="w-5 h-5" />;
    case 'Smartphone':
      return <Smartphone className="w-5 h-5" />;
    default:
      return <Code2 className="w-5 h-5" />;
  }
};

export const CareerGoalSelectorModal: React.FC<CareerGoalSelectorProps> = ({
  isOpen,
  onClose,
  selectedGoalId,
  onSelectGoal,
  studentYear,
  onSelectYear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Engineering Specialization Track</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your target placement domain to load verified milestone curriculum and evaluation criteria.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Year selector prompt */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">Academic cohort</span>
              <h4 className="text-xs font-medium text-slate-900 mt-0.5">What year of engineering are you currently in?</h4>
            </div>
            <div className="grid grid-cols-2 sm:flex items-center gap-1.5">
              {['1st Year', '2nd Year', '3rd Year', 'Final Year'].map((year) => (
                <button
                  key={year}
                  onClick={() => onSelectYear(year)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    studentYear === year
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CAREER_GOALS.map((goal) => {
              const isSelected = goal.id === selectedGoalId;
              return (
                <div
                  key={goal.id}
                  onClick={() => {
                    onSelectGoal(goal.id);
                    onClose();
                  }}
                  className={`relative cursor-pointer text-left p-4 sm:p-5 rounded-lg border transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-md flex items-center justify-center border ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-800'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {getRoleIcon(goal.iconName)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{goal.title}</h3>
                          <span className="text-xs text-slate-500">{goal.role}</span>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {goal.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {goal.description}
                    </p>

                    {/* Timeline & Skills count */}
                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{goal.recommendedTimeline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                        <span>{goal.skillsCount} milestones</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {goal.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-600 rounded border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Target Companies */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-600 truncate">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Hiring: {goal.targetCompanies.slice(0, 3).join(', ')}
                      </span>
                    </div>
                    <span className="text-slate-900 font-medium flex items-center gap-0.5 shrink-0 ml-2 font-mono text-[11px]">
                      {isSelected ? '[ ACTIVE ]' : 'Select'} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Curriculum version 2026.1 • Placement verified</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
