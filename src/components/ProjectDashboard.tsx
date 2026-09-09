import React, { useState } from 'react';
import { Project, GamePlan } from '../types';
import { GAME_TEMPLATES, GameTemplate } from '../data/templates';
import {
  FolderPlus,
  Copy,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Cloud,
  ChevronRight,
  FolderOpen
} from 'lucide-react';

interface ProjectDashboardProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onExportProject: (project: Project) => void;
  onSelectTemplate: (template: GameTemplate) => void;
}

export function ProjectDashboard({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onExportProject,
  onSelectTemplate
}: ProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'templates'>('projects');

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-y-auto p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Project Dashboard</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-indigo-950 text-indigo-300 border border-indigo-800">
              Roblox AI Studio
            </span>
          </h2>
          <p className="text-xs text-slate-400">Manage games, start from templates, or create new experiences</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              id="tab-dashboard-projects"
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'projects' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Projects ({projects.length})
            </button>
            <button
              id="tab-dashboard-templates"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'templates' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Game Templates ({GAME_TEMPLATES.length})
            </button>
          </div>

          <button
            id="btn-dashboard-new-proj"
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {activeTab === 'projects' ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            All Projects
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              const fileCount = Object.keys(proj.files).length;
              const dateStr = new Date(proj.lastModified).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={proj.id}
                  className={`flex flex-col justify-between p-4 rounded-lg border text-xs transition-all ${
                    isActive
                      ? 'bg-slate-900/90 border-indigo-500/80 shadow-lg shadow-indigo-950/20'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-200 text-sm truncate" title={proj.name}>
                        {proj.name}
                      </h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
                      {proj.description || 'No description provided.'}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        {fileCount} files
                      </span>
                      <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${proj.robloxConfig.status === 'PUBLISHED' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        Roblox: {proj.robloxConfig.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-800/80">
                    <button
                      id={`btn-open-proj-${proj.id}`}
                      onClick={() => onSelectProject(proj.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        id={`btn-dup-proj-${proj.id}`}
                        onClick={() => onDuplicateProject(proj)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Duplicate project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-export-proj-${proj.id}`}
                        onClick={() => onExportProject(proj)}
                        className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Export project ZIP"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {projects.length > 1 && (
                        <button
                          id={`btn-del-proj-${proj.id}`}
                          onClick={() => onDeleteProject(proj.id)}
                          className="p-1.5 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Choose a Starter Template
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAME_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="flex flex-col justify-between p-4 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-indigo-500/50 text-xs transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-sm">{tmpl.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300 font-mono">
                      {tmpl.badge}
                    </span>
                  </div>

                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {tmpl.description}
                  </p>

                  <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Genre: <strong className="text-slate-300">{tmpl.genre}</strong></span>
                    <span>•</span>
                    <span>3D Elements: <strong className="text-slate-300">{tmpl.previewElements.length}</strong></span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80">
                  <button
                    id={`btn-use-template-${tmpl.id}`}
                    onClick={() => onSelectTemplate(tmpl)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white font-semibold transition-colors border border-indigo-500/40"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create from Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
