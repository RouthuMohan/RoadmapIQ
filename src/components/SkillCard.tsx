import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Video,
  GraduationCap,
  Code,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Award,
  FileEdit,
  Save,
} from 'lucide-react';
import { Resource, ResourceType, Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
  isCompleted: boolean;
  onToggleComplete: (skillId: string) => void;
  customResources: Resource[];
  onOpenAddResource: (skill: Skill) => void;
  onDeleteCustomResource: (skillId: string, resourceId: string) => void;
  userNote: string;
  onSaveNote: (skillId: string, note: string) => void;
  isNextRecommended?: boolean;
}

const getResourceTypeBadge = (type: ResourceType) => {
  switch (type) {
    case 'video':
      return { label: 'Video', icon: Video, color: 'text-slate-700 bg-slate-100 border-slate-200' };
    case 'docs':
      return { label: 'Docs', icon: BookOpen, color: 'text-slate-700 bg-slate-100 border-slate-200' };
    case 'course':
      return { label: 'Course', icon: GraduationCap, color: 'text-slate-700 bg-slate-100 border-slate-200' };
    case 'practice':
      return { label: 'Practice', icon: Code, color: 'text-slate-700 bg-slate-100 border-slate-200' };
    default:
      return { label: 'Guide', icon: BookOpen, color: 'text-slate-700 bg-slate-100 border-slate-200' };
  }
};

const getImportanceBadge = (importance: string) => {
  switch (importance) {
    case 'essential':
      return { label: 'Core essential', color: 'bg-slate-900 text-white font-mono text-[10px]' };
    case 'high':
      return { label: 'High priority', color: 'bg-slate-100 text-slate-800 border-slate-300 font-mono text-[10px]' };
    default:
      return null;
  }
};

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  isCompleted,
  onToggleComplete,
  customResources,
  onOpenAddResource,
  onDeleteCustomResource,
  userNote,
  onSaveNote,
  isNextRecommended,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(userNote);

  const allResources = [...skill.resources, ...customResources];
  const importanceBadge = getImportanceBadge(skill.importance);

  const handleSaveNote = () => {
    onSaveNote(skill.id, noteDraft);
    setIsEditingNote(false);
  };

  return (
    <div
      id={`skill-card-${skill.id}`}
      className={`relative rounded-xl border transition-all duration-150 bg-white overflow-hidden ${
        isCompleted
          ? 'border-emerald-200 bg-slate-50/50'
          : isNextRecommended
          ? 'border-slate-900 shadow-sm ring-1 ring-slate-900/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Recommended Next Flag */}
      {isNextRecommended && !isCompleted && (
        <div className="bg-slate-900 text-white text-[11px] font-mono px-4 py-1 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span className="tracking-wide">RECOMMENDED NEXT TARGET</span>
          </div>
          <span className="text-[10px] text-slate-400">Step {skill.orderIndex}</span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Checkbox Toggle Button */}
          <button
            id={`toggle-skill-${skill.id}`}
            onClick={() => onToggleComplete(skill.id)}
            className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-300 text-transparent hover:border-slate-900 hover:text-slate-300'
            }`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Skill Title & Meta Header */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-slate-600">
                STAGE {String(skill.orderIndex).padStart(2, '0')}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {skill.category}
              </span>

              {importanceBadge && (
                <span className={`px-2 py-0.5 rounded ${importanceBadge.color}`}>
                  {importanceBadge.label}
                </span>
              )}

              <span className="font-mono text-xs text-slate-400 ml-auto">
                {skill.estimatedWeeks} wks
              </span>
            </div>

            <h3
              className={`text-base sm:text-lg font-semibold tracking-tight transition ${
                isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}
            >
              {skill.name}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-normal">
              {skill.description}
            </p>

            {/* Why This Skill Matters Technical Callout */}
            <div className="mt-3 p-3 rounded-lg bg-slate-50 border-l-2 border-slate-800 text-xs">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">
                Evaluation criterion
              </span>
              <p className="text-slate-700 leading-relaxed">
                {skill.whyItMatters}
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 transition"
            >
              <span>
                {isExpanded ? 'Collapse' : 'Syllabus'} resources ({allResources.length})
              </span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {userNote && !isExpanded && (
              <span className="text-xs text-slate-500 italic truncate max-w-xs font-mono">
                Note: {userNote}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAddResource(skill)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition"
            >
              <Plus className="w-3 h-3" />
              <span>Attach link</span>
            </button>

            <button
              onClick={() => onToggleComplete(skill.id)}
              className={`px-3 py-1 rounded-md font-medium text-xs border transition ${
                isCompleted
                  ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isCompleted ? 'Mark pending' : 'Verify complete'}
            </button>
          </div>
        </div>

        {/* Expandable Resource Panel & Study Notes */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in duration-100">
            {/* Curated Resources List */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                  Verified syllabus resources ({allResources.length})
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Free access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allResources.map((res) => {
                  const badge = getResourceTypeBadge(res.type);
                  const Icon = badge.icon;
                  const isCustom = res.id.startsWith('custom-');

                  return (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition bg-white"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-1 rounded bg-slate-100 border border-slate-200 shrink-0 text-slate-700 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-xs text-slate-900 hover:underline transition flex items-center gap-1 truncate"
                          >
                            <span className="truncate">{res.title}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                          </a>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-mono">
                            <span>{res.platform}</span>
                            {res.duration && <span>• {res.duration}</span>}
                            {isCustom && (
                              <span className="bg-slate-100 text-slate-700 px-1 rounded text-[10px]">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {isCustom && (
                        <button
                          onClick={() => onDeleteCustomResource(skill.id, res.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition ml-2"
                          title="Remove custom resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Placement Relevance Breakdown */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-0.5">
                Placement assessment note
              </span>
              <p className="text-slate-800 leading-relaxed">{skill.placementRelevance}</p>
            </div>

            {/* Personal Study Notes */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileEdit className="w-3.5 h-3.5 text-slate-600" />
                  <span>Technical study notes & problem log</span>
                </label>
                {isEditingNote ? (
                  <button
                    onClick={handleSaveNote}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save note</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setNoteDraft(userNote);
                      setIsEditingNote(true);
                    }}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    {userNote ? 'Edit note' : '+ Add note'}
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="e.g. Practiced 10 problems on LeetCode; review edge cases for 0 and null pointers..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white font-mono"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingNote(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNote}
                      className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : userNote ? (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 whitespace-pre-wrap font-mono">
                  {userNote}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No notes recorded yet. Record interview patterns, test case edge cases, or reference links.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
