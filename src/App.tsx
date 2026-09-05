import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProgressTracker } from './components/ProgressTracker';
import { RoadmapView } from './components/RoadmapView';
import { AnalyticsView } from './components/AnalyticsView';
import { AboutView } from './components/AboutView';
import { CareerGoalSelectorModal } from './components/CareerGoalSelector';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { AddResourceModal } from './components/AddResourceModal';
import { CAREER_GOALS, INITIAL_SKILLS } from './data/mockRoadmaps';
import { StorageService } from './services/storage';
import { fetchPlacementAdvice, getLocalPlacementAdvice } from './services/aiAdvisor';
import { CareerGoal, CareerGoalId, Resource, Skill, ViewTab, AIAdviceResult } from './types';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Active Goal & Navigation State
  const [activeGoalId, setActiveGoalId] = useState<CareerGoalId>(() => StorageService.getActiveGoal());
  const [studentYear, setStudentYear] = useState<string>(() => StorageService.getStudentYear());
  const [activeTab, setActiveTab] = useState<ViewTab>('roadmap');

  // Persistence State
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>(() =>
    StorageService.getCompletedSkills()
  );
  const [customResources, setCustomResources] = useState<Record<string, Resource[]>>(() =>
    StorageService.getCustomResources()
  );
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => StorageService.getNotes());

  // Modal Dialogs State
  const [isGoalSelectorOpen, setIsGoalSelectorOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [resourceModalSkill, setResourceModalSkill] = useState<Skill | null>(null);

  // AI Advisor State - pre-initialized with instant placement advice so UI is never empty
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResult>(() => {
    const goal = StorageService.getActiveGoal();
    const year = StorageService.getStudentYear();
    const skills = INITIAL_SKILLS.filter((s) => s.goalId === goal);
    const completed = StorageService.getCompletedSkills();
    const completedIds = skills.filter((s) => completed[s.id]).map((s) => s.id);
    return getLocalPlacementAdvice(goal, year, completedIds, skills);
  });
  const [isAILoading, setIsAILoading] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Current active career goal object
  const activeGoal = useMemo(() => {
    return CAREER_GOALS.find((g) => g.id === activeGoalId) || CAREER_GOALS[0];
  }, [activeGoalId]);

  // Current skills for active goal
  const currentSkills = useMemo(() => {
    return INITIAL_SKILLS.filter((s) => s.goalId === activeGoalId).sort(
      (a, b) => a.orderIndex - b.orderIndex
    );
  }, [activeGoalId]);

  // Completed count for current active goal
  const completedCount = useMemo(() => {
    return currentSkills.filter((s) => completedSkills[s.id]).length;
  }, [currentSkills, completedSkills]);

  // Remaining prep weeks
  const remainingWeeks = useMemo(() => {
    return currentSkills
      .filter((s) => !completedSkills[s.id])
      .reduce((acc, s) => acc + s.estimatedWeeks, 0);
  }, [currentSkills, completedSkills]);

  // Auto-generate or update AI advice when goal or year changes
  const loadAIAdvice = useCallback(
    async (customQuestion?: string) => {
      setIsAILoading(true);
      try {
        const completedIds = currentSkills
          .filter((s) => completedSkills[s.id])
          .map((s) => s.id);

        const result = await fetchPlacementAdvice({
          careerGoal: activeGoal.id,
          studentYear,
          completedSkillIds: completedIds,
          skills: currentSkills,
          customQuestion,
        });
        setAiAdvice(result);
      } catch {
        // Fallback already active; seamlessly retain advice
      } finally {
        setIsAILoading(false);
      }
    },
    [activeGoal.id, studentYear, currentSkills, completedSkills]
  );

  // Load initial AI advice on mount or goal switch
  useEffect(() => {
    loadAIAdvice();
  }, [activeGoalId, studentYear]);

  // Handle Goal Change (Feature 1)
  const handleSelectGoal = (goalId: CareerGoalId) => {
    setActiveGoalId(goalId);
    StorageService.setActiveGoal(goalId);
    const nextSkills = INITIAL_SKILLS.filter((s) => s.goalId === goalId);
    const completed = StorageService.getCompletedSkills();
    const completedIds = nextSkills.filter((s) => completed[s.id]).map((s) => s.id);
    setAiAdvice(getLocalPlacementAdvice(goalId, studentYear, completedIds, nextSkills));
    showToast(`Switched career roadmap to ${CAREER_GOALS.find((g) => g.id === goalId)?.title}`, 'info');
  };

  // Handle Student Year Change
  const handleSelectYear = (year: string) => {
    setStudentYear(year);
    StorageService.setStudentYear(year);
    const completedIds = currentSkills.filter((s) => completedSkills[s.id]).map((s) => s.id);
    setAiAdvice(getLocalPlacementAdvice(activeGoal.id, year, completedIds, currentSkills));
    showToast(`Profile updated to ${year} CSE`, 'info');
  };

  // Handle Skill Completion Toggle (Feature 3)
  const handleToggleSkill = (skillId: string) => {
    const isNowCompleted = StorageService.toggleSkillCompletion(skillId);
    setCompletedSkills({ ...StorageService.getCompletedSkills() });

    const skill = currentSkills.find((s) => s.id === skillId);
    if (skill) {
      if (isNowCompleted) {
        showToast(`✓ Marked "${skill.name}" as Completed!`);
      } else {
        showToast(`Marked "${skill.name}" as Pending`, 'info');
      }
    }
  };

  // Handle Note Save
  const handleSaveNote = (skillId: string, note: string) => {
    StorageService.saveNote(skillId, note);
    setUserNotes({ ...StorageService.getNotes() });
    showToast('Study note saved successfully!');
  };

  // Handle Custom Resource Add (Feature 5)
  const handleAddCustomResource = (skillId: string, resource: Omit<Resource, 'id'>) => {
    StorageService.addCustomResource(skillId, resource);
    setCustomResources({ ...StorageService.getCustomResources() });
    showToast(`Attached "${resource.title}" to learning path!`);
  };

  // Handle Delete Custom Resource
  const handleDeleteCustomResource = (skillId: string, resourceId: string) => {
    StorageService.deleteCustomResource(skillId, resourceId);
    setCustomResources({ ...StorageService.getCustomResources() });
    showToast('Resource removed', 'info');
  };

  // Handle Seed Demo Data (For instant viva presentation)
  const handleSeedDemo = () => {
    StorageService.seedDemoProgress(activeGoalId);
    setCompletedSkills({ ...StorageService.getCompletedSkills() });
    showToast('Loaded realistic demo progress for presentation showcase!');
  };

  // Handle Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('Reset your completed skills for this roadmap?')) {
      StorageService.resetAllProgress();
      setCompletedSkills({});
      setCustomResources({});
      setUserNotes({});
      showToast('All progress has been reset to 0%', 'info');
    }
  };

  // Jump to skill in Roadmap
  const handleJumpToSkill = (skillId: string) => {
    setActiveTab('roadmap');
    setTimeout(() => {
      const el = document.getElementById(`skill-card-${skillId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-indigo-500');
        setTimeout(() => el.classList.remove('ring-4', 'ring-indigo-500'), 2000);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeGoal={activeGoal}
        completedCount={completedCount}
        totalSkills={currentSkills.length}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGoalSelector={() => setIsGoalSelectorOpen(true)}
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        onSeedDemo={handleSeedDemo}
        onResetProgress={handleResetProgress}
        studentYear={studentYear}
        onSelectYear={handleSelectYear}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <HeroBanner
          activeGoal={activeGoal}
          onSelectGoal={handleSelectGoal}
          onOpenGoalSelector={() => setIsGoalSelectorOpen(true)}
          studentYear={studentYear}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        />

        {/* Feature 4: Progress Bar & Milestone Tracker */}
        <ProgressTracker
          completedCount={completedCount}
          totalSkills={currentSkills.length}
          activeGoal={activeGoal}
          remainingWeeks={remainingWeeks}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        />

        {/* View Switcher based on Active Tab */}
        {activeTab === 'roadmap' && (
          <RoadmapView
            activeGoal={activeGoal}
            skills={currentSkills}
            completedSkills={completedSkills}
            onToggleComplete={handleToggleSkill}
            customResources={customResources}
            onOpenAddResource={(skill) => setResourceModalSkill(skill)}
            onDeleteCustomResource={handleDeleteCustomResource}
            userNotes={userNotes}
            onSaveNote={handleSaveNote}
            recommendedNextSkillId={aiAdvice?.recommendedNextSkillId}
            onOpenGoalSelector={() => setIsGoalSelectorOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            activeGoal={activeGoal}
            skills={currentSkills}
            completedSkills={completedSkills}
            studentYear={studentYear}
            onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
            onSwitchToRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">RoadmapIQ</span>
            <span>• Placement curriculum framework</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700">Open-source</span>
            <button
              onClick={() => setActiveTab('about')}
              className="text-slate-900 hover:underline font-medium"
            >
              Curriculum spec
            </button>
          </div>
        </div>
      </footer>

      {/* Modal 1: Career Goal Selector (Feature 1) */}
      <CareerGoalSelectorModal
        isOpen={isGoalSelectorOpen}
        onClose={() => setIsGoalSelectorOpen(false)}
        selectedGoalId={activeGoalId}
        onSelectGoal={handleSelectGoal}
        studentYear={studentYear}
        onSelectYear={handleSelectYear}
      />

      {/* Modal 2: AI Placement Advisor (Feature 8 & 9) */}
      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        activeGoal={activeGoal}
        studentYear={studentYear}
        onSelectYear={handleSelectYear}
        advice={aiAdvice}
        isLoading={isAILoading}
        onRefreshAdvice={loadAIAdvice}
        onJumpToSkill={handleJumpToSkill}
      />

      {/* Modal 3: Add Custom Learning Resource (Feature 5) */}
      <AddResourceModal
        isOpen={Boolean(resourceModalSkill)}
        onClose={() => setResourceModalSkill(null)}
        skill={resourceModalSkill}
        onAddResource={handleAddCustomResource}
      />
    </div>
  );
}
