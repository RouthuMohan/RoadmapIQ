import React from 'react';
import {
  Compass,
  Sparkles,
  RotateCcw,
  Play,
  BarChart3,
  MapPin,
  Info,
  ChevronDown,
} from 'lucide-react';
import { CareerGoal, ViewTab } from '../types';

interface NavbarProps {
  activeGoal: CareerGoal;
  completedCount: number;
  totalSkills: number;
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  onOpenGoalSelector: () => void;
  onOpenAIAdvisor: () => void;
  onSeedDemo: () => void;
  onResetProgress: () => void;
  studentYear: string;
  onSelectYear: (year: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeGoal,
  completedCount,
  totalSkills,
  activeTab,
  onSelectTab,
  onOpenGoalSelector,
  onOpenAIAdvisor,
  onSeedDemo,
  onResetProgress,
  studentYear,
  onSelectYear,
}) => {
  const percentage = totalSkills > 0 ? Math.round((completedCount / totalSkills) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Brand Mark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white border border-slate-800">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-slate-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  Roadmap<span className="text-slate-500 font-mono">IQ</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium bg-slate-100 text-slate-600 rounded border border-slate-200">
                  v2.4
                </span>
              </div>
            </div>
          </div>

          {/* Center: Target Career & Student Year */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              id="navbar-career-goal-btn"
              onClick={onOpenGoalSelector}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition text-left text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <span className="text-slate-500 text-[10px] block leading-none mb-0.5">Target career</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  {activeGoal.title}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Student Year Selector */}
            <select
              id="navbar-student-year-select"
              value={studentYear}
              onChange={(e) => onSelectYear(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 transition"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="Final Year">Final Year</option>
            </select>
          </div>

          {/* Center/Right Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-lg border border-slate-200/80">
            <button
              id="tab-roadmap-btn"
              onClick={() => onSelectTab('roadmap')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'roadmap'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              id="tab-analytics-btn"
              onClick={() => onSelectTab('analytics')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Readiness</span>
              <span className="sm:hidden">Stats</span>
            </button>

            <button
              id="tab-about-btn"
              onClick={() => onSelectTab('about')}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition ${
                activeTab === 'about'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* AI Advisor Trigger Button */}
            <button
              id="ai-advisor-trigger-btn"
              onClick={onOpenAIAdvisor}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition active:scale-[0.98] border border-slate-800 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden md:inline">Placement Advisor</span>
              <span className="md:hidden">Advisor</span>
            </button>

            {/* Presentation Utilities */}
            <div className="hidden sm:flex items-center">
              <button
                id="btn-seed-demo"
                onClick={onSeedDemo}
                title="Seed realistic sample progress for demo"
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-reset-progress"
                onClick={onResetProgress}
                title="Reset progress to 0%"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
