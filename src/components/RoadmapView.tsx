import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Plus,
  Compass,
  ArrowUpDown,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { CareerGoal, Resource, Skill, SkillCategory } from '../types';
import { SkillCard } from './SkillCard';

interface RoadmapViewProps {
  activeGoal: CareerGoal;
  skills: Skill[];
  completedSkills: Record<string, boolean>;
  onToggleComplete: (skillId: string) => void;
  customResources: Record<string, Resource[]>;
  onOpenAddResource: (skill: Skill) => void;
  onDeleteCustomResource: (skillId: string, resourceId: string) => void;
  userNotes: Record<string, string>;
  onSaveNote: (skillId: string, note: string) => void;
  recommendedNextSkillId?: string;
  onOpenGoalSelector: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  activeGoal,
  skills,
  completedSkills,
  onToggleComplete,
  customResources,
  onOpenAddResource,
  onDeleteCustomResource,
  userNotes,
  onSaveNote,
  recommendedNextSkillId,
  onOpenGoalSelector,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || skill.category === selectedCategory;

      const isCompleted = Boolean(completedSkills[skill.id]);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isCompleted) ||
        (statusFilter === 'pending' && !isCompleted);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [skills, searchQuery, selectedCategory, statusFilter, completedSkills]);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Category Filter, Status Filter */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="roadmap-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus by keyword (e.g. Arrays, Docker, SQL, React)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 self-start md:self-auto border border-slate-200/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All <span className="font-mono text-[11px] text-slate-400">({skills.length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending <span className="font-mono text-[11px] text-slate-400">({skills.filter((s) => !completedSkills[s.id]).length})</span>
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                statusFilter === 'completed'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed <span className="font-mono text-[11px] text-slate-400">({skills.filter((s) => completedSkills[s.id]).length})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wide shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md whitespace-nowrap text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feature 2: Ordered List / Path of Skills */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white rounded-xl p-10 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-400 mx-auto flex items-center justify-center border border-slate-200">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="text-base font-semibold text-slate-900">No syllabus milestones match your search</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting search keyword "{searchQuery}" or switch back to "All" categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setStatusFilter('all');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                Sequenced Curriculum ({filteredSkills.length} milestones)
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Click checkbox to toggle verification
            </span>
          </div>

          <div className="space-y-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isCompleted={Boolean(completedSkills[skill.id])}
                onToggleComplete={onToggleComplete}
                customResources={customResources[skill.id] || []}
                onOpenAddResource={onOpenAddResource}
                onDeleteCustomResource={onDeleteCustomResource}
                userNote={userNotes[skill.id] || ''}
                onSaveNote={onSaveNote}
                isNextRecommended={skill.id === recommendedNextSkillId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
