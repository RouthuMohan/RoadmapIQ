import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle2, Link as LinkIcon, BookOpen, Video, Code, GraduationCap } from 'lucide-react';
import { Resource, ResourceType, Skill } from '../types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill | null;
  onAddResource: (skillId: string, resource: Omit<Resource, 'id'>) => void;
}

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  skill,
  onAddResource,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('');
  const [type, setType] = useState<ResourceType>('docs');
  const [duration, setDuration] = useState('');

  const [errors, setErrors] = useState<{ title?: string; url?: string; platform?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !skill) return null;

  const validate = () => {
    const newErrors: { title?: string; url?: string; platform?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Resource title is required (e.g. FreeCodeCamp Full Course).';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long.';
    }

    if (!url.trim()) {
      newErrors.url = 'Resource link URL is required.';
    } else {
      try {
        const parsed = new URL(url.trim());
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          newErrors.url = 'URL must start with http:// or https://';
        }
      } catch {
        newErrors.url = 'Please enter a valid website URL (e.g. https://youtube.com/...).';
      }
    }

    if (!platform.trim()) {
      newErrors.platform = 'Platform name is required (e.g. YouTube, Official Docs, GitHub, LeetCode).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate brief save delay for clean UI feedback
    setTimeout(() => {
      onAddResource(skill.id, {
        title: title.trim(),
        url: url.trim(),
        platform: platform.trim(),
        type,
        isFree: true,
        duration: duration.trim() || undefined,
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setUrl('');
        setPlatform('');
        setDuration('');
        setErrors({});
        onClose();
      }, 900);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Attach Curriculum Resource
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-sm">
              {skill.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation Notification */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Resource Attached Successfully</h4>
            <p className="text-xs text-slate-500 font-mono">
              Persisted to local curriculum index and browser storage.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
            {/* Resource Type Buttons */}
            <div>
              <label className="block text-xs font-mono font-medium text-slate-600 uppercase tracking-wider mb-1.5">
                Resource Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'video', label: 'Video', icon: Video },
                  { key: 'docs', label: 'Docs', icon: BookOpen },
                  { key: 'course', label: 'Course', icon: GraduationCap },
                  { key: 'practice', label: 'Practice', icon: Code },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = type === item.key;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => setType(item.key as ResourceType)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-xs font-medium transition ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Resource Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder="e.g. Harvard CS50 Lecture on Memory & Pointers"
                className={`w-full px-3 py-2 text-xs rounded-lg border ${
                  errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                } focus:outline-none focus:ring-1 focus:ring-slate-900`}
              />
              {errors.title && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* URL */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Resource URL / Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <LinkIcon className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors({ ...errors, url: undefined });
                  }}
                  placeholder="https://..."
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border ${
                    errors.url ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono`}
                />
              </div>
              {errors.url && (
                <p className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.url}</span>
                </p>
              )}
            </div>

            {/* Platform & Optional Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Platform / Source <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    if (errors.platform) setErrors({ ...errors, platform: undefined });
                  }}
                  placeholder="e.g. YouTube, LeetCode, MDN"
                  className={`w-full px-3 py-2 text-xs rounded-lg border ${
                    errors.platform ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  } focus:outline-none focus:ring-1 focus:ring-slate-900`}
                />
                {errors.platform && (
                  <p className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.platform}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duration / Length <span className="text-slate-400 font-mono text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 Hours, 15 Pages"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium rounded-md transition"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach resource</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
