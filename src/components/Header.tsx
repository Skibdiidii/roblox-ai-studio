import React from 'react';
import { Project, ValidationResult, AppView } from '../types';
import {
  Sparkles,
  FileCode,
  Box,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Download,
  FolderKanban,
  Bell,
  Code2,
  Key,
  Columns
} from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  stage: number;
  project: Project;
  validationIssues: ValidationResult[];
  onOpenPatchNotes: () => void;
  onOpenApiSettings: () => void;
  onExport: () => void;
}

export function Header({
  currentView,
  onSelectView,
  stage,
  project,
  validationIssues,
  onOpenPatchNotes,
  onOpenApiSettings,
  onExport
}: HeaderProps) {
  const errorCount = validationIssues.filter(i => i.severity === 'error').length;

  const stages = [
    { num: 1, label: 'Prompt' },
    { num: 2, label: 'Plan' },
    { num: 3, label: 'Generate' },
    { num: 4, label: 'Editor' },
    { num: 5, label: '3D Preview' },
    { num: 6, label: 'Publish' }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 shrink-0 select-none z-30">
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            id="btn-header-brand"
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Roblox AI Studio
                </span>
                <span className="px-1.5 py-0.2 bg-red-600/30 border border-red-500/40 text-red-300 text-[9px] font-mono rounded font-bold uppercase">
                  Open Cloud
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[160px] md:max-w-xs">
                {project ? project.name : 'No Project Active'}
              </div>
            </div>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[11px]">
          <span className="text-slate-500 mr-1 text-[10px] uppercase font-semibold">Stage:</span>
          {stages.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                className={`flex items-center gap-1 font-medium ${
                  stage >= s.num ? 'text-indigo-400' : 'text-slate-600'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    stage > s.num
                      ? 'bg-indigo-600 text-white'
                      : stage === s.num
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {stage > s.num ? '✓' : s.num}
                </span>
                <span>{s.label}</span>
              </div>
              {idx < stages.length - 1 && (
                <span className="text-slate-700 px-0.5">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-header-api-settings"
            onClick={onOpenApiSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700/80"
            title="Configure Gemini & Roblox API Keys"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">API Keys</span>
          </button>

          <button
            id="btn-header-patch-notes"
            onClick={onOpenPatchNotes}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700/80"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">What's New</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          {project && (
            <button
              id="btn-header-export-zip"
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/80"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>
          )}
        </div>
      </div>

      <nav className="px-4 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto text-xs">
        <button
          id="nav-tab-dashboard"
          onClick={() => onSelectView('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'dashboard'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          id="nav-tab-chat"
          onClick={() => onSelectView('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'chat'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Generator</span>
        </button>

        <button
          id="nav-tab-chat-preview"
          onClick={() => onSelectView('chat-preview')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'chat-preview'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
          title="Responsive Chat + 3D Preview combined view"
        >
          <Columns className="w-3.5 h-3.5 text-indigo-400" />
          <span>Chat + Preview</span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Dual
          </span>
        </button>

        <button
          id="nav-tab-editor"
          onClick={() => onSelectView('editor')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'editor'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Luau Editor</span>
        </button>

        <button
          id="nav-tab-preview"
          onClick={() => onSelectView('preview')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'preview'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-emerald-400" />
          <span>3D Web Preview</span>
        </button>

        <button
          id="nav-tab-validator"
          onClick={() => onSelectView('validator')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'validator'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          {errorCount > 0 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>Validator</span>
          {errorCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {errorCount}
            </span>
          )}
        </button>

        <button
          id="nav-tab-publish"
          onClick={() => onSelectView('publish')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
            currentView === 'publish'
              ? 'bg-red-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-red-400" />
          <span>Roblox Open Cloud</span>
        </button>
      </nav>
    </header>
  );
}
