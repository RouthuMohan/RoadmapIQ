import React from 'react';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Github,
  Globe,
  Database,
  Code2,
  Terminal,
  Cpu,
  Layers,
  BookOpen,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero Intro */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">
                Specification & Documentation
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              RoadmapIQ Architecture & Curriculum
            </h1>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Deterministic milestone curriculum designed for computer science engineering placement preparation. Eliminates unstructured video browsing by sequencing core competencies with strict prerequisite stages.
        </p>
      </div>

      {/* 5 Core Features Audit */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-sm sm:text-base font-semibold text-slate-900">Core Functional Modules</h2>
          <p className="text-xs text-slate-500">
            Formal requirements implemented for engineering placement evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                01
              </span>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Engineering Specialization Track</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeted roles including SDE, Full-Stack, Data Analyst, DevOps/Cloud, AI/ML, and Mobile Engineering with verified hiring timelines.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                02
              </span>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Sequential Milestone Hierarchy</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly ordered prerequisite phases. Each stage includes estimated completion time, complexity rating, and interview context.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                03
              </span>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Status Verification Engine</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic state updates with instant percentage recalculation, persisted reliably in client-side storage.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                04
              </span>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Telemetry & Readiness Analytics</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Category competency bars, domain-level completion metrics, and interview stage qualification scores.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                05
              </span>
              <h3 className="font-semibold text-slate-900 text-xs sm:text-sm">Curriculum Index & Resource Attachment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated documentation and interactive tutorials from open-source references, plus student study logs and custom links.
            </p>
          </div>
        </div>
      </div>

      {/* Free & Open-Source Compliance Verification */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-200 pb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-semibold">Infrastructure & Compliance Audit</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Engineered for 100% free operation with zero vendor lock-in or recurring cloud fees:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-900">Zero Mandatory API Key</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                AI advisor operates via free Gemini endpoint with a guaranteed offline deterministic rule engine fallback.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-900">Client-Side Persistence</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Data persists in standard browser LocalStorage with zero database provisioning costs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-900">Static Host Compatibility</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Builds cleanly to static HTML/JS/CSS assets ready for Vercel, Cloudflare Pages, or GitHub Pages.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-900">Zero Auth Dependency</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Fully functional immediately without login walls or external authentication services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Instructions */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-700" />
          <span>Local Development & Static Deployment</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-1 border border-slate-800">
            <p className="text-slate-500"># 1. Clone repository</p>
            <p>git clone https://github.com/your-username/RoadmapIQ.git</p>
            <p>cd RoadmapIQ</p>
            <br />
            <p className="text-slate-500"># 2. Install dependencies</p>
            <p>npm install</p>
            <br />
            <p className="text-slate-500"># 3. Start local development server</p>
            <p>npm run dev</p>
            <br />
            <p className="text-slate-500"># 4. Compile production distribution</p>
            <p>npm run build</p>
          </div>
        </div>
      </div>
    </div>
  );
};
