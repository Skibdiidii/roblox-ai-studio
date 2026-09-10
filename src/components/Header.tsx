import React, { useState } from 'react';
import { Project, ValidationResult, AppView } from '../types';
import {
  Sparkles,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Download,
  FolderKanban,
  Bell,
  Code2,
  Key,
  Menu,
  X,
  ChevronRight,
  MessageSquare
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
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const errorCount = validationIssues.filter(i => i.severity === 'error').length;

  const stages = [
    { num: 1, label: 'Prompt' },
    { num: 2, label: 'Plan' },
    { num: 3, label: 'Generate' },
    { num: 4, label: 'Editor' },
    { num: 5, label: 'Validate' },
    { num: 6, label: 'Publish' }
  ];

  const navigationItems = [
    {
      id: 'chat' as AppView,
      label: 'AI Assistant',
      description: 'Freeform chat, vision attachments & Luau generator',
      icon: Sparkles,
      iconColor: 'text-amber-300',
      badge: 'Vision AI'
    },
    {
      id: 'editor' as AppView,
      label: 'Luau Editor',
      description: 'Multi-file workspace, syntax highlighting & AI actions',
      icon: FileCode,
      iconColor: 'text-cyan-400'
    },
    {
      id: 'validator' as AppView,
      label: 'Luau Validator',
      description: 'Static analysis, client/server security & runtime checks',
      icon: errorCount > 0 ? AlertTriangle : CheckCircle2,
      iconColor: errorCount > 0 ? 'text-rose-400' : 'text-emerald-400',
      badge: errorCount > 0 ? `${errorCount} Issues` : 'Clean'
    },
    {
      id: 'publish' as AppView,
      label: 'Roblox Open Cloud',
      description: 'One-click universe place allocation and deployment',
      icon: Cloud,
      iconColor: 'text-red-400'
    },
    {
      id: 'dashboard' as AppView,
      label: 'Project Dashboard',
      description: 'Starter templates, project history and exports',
      icon: FolderKanban,
      iconColor: 'text-indigo-400'
    }
  ];

  const handleSelectTab = (view: AppView) => {
    onSelectView(view);
    setIsNavDrawerOpen(false);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 shrink-0 select-none z-30 relative">
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            id="btn-hamburger-tab-menu"
            type="button"
            onClick={() => setIsNavDrawerOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors flex items-center gap-1.5 shrink-0"
            title="Open Tab Switcher Menu"
          >
            <Menu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold hidden md:inline">Tabs</span>
          </button>

          <button
            id="btn-header-brand"
            onClick={() => onSelectView('dashboard')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-red-500 flex items-center justify-center text-white shadow-md shadow-indigo-950">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors">
                  Roblox AI Studio
                </span>
                <span className="px-1.5 py-0.2 bg-red-600/30 border border-red-500/40 text-red-300 text-[9px] font-mono rounded font-bold uppercase">
                  Fast AI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] sm:max-w-[180px] md:max-w-xs">
                {project ? project.name : 'No Project Active'}
              </div>
            </div>
          </button>
        </div>

        <div className="hidden xl:flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[11px]">
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

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="btn-header-api-settings"
            onClick={onOpenApiSettings}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700/80"
            title="Configure Gemini & Roblox API Keys"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">API Keys</span>
          </button>

          <button
            id="btn-header-patch-notes"
            onClick={onOpenPatchNotes}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors border border-slate-700/80"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">What's New</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>

          {project && (
            <button
              id="btn-header-export-zip"
              onClick={onExport}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700/80"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Export ZIP</span>
            </button>
          )}
        </div>
      </div>

      <nav className="px-3 sm:px-4 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1 overflow-x-auto text-xs scrollbar-none">
        <button
          id="nav-tab-chat"
          onClick={() => onSelectView('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors shrink-0 ${
            currentView === 'chat'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Assistant</span>
        </button>

        <button
          id="nav-tab-editor"
          onClick={() => onSelectView('editor')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors shrink-0 ${
            currentView === 'editor'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Luau Editor</span>
        </button>

        <button
          id="nav-tab-validator"
          onClick={() => onSelectView('validator')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors shrink-0 ${
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
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors shrink-0 ${
            currentView === 'publish'
              ? 'bg-red-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-red-400" />
          <span>Roblox Open Cloud</span>
        </button>

        <button
          id="nav-tab-dashboard"
          onClick={() => onSelectView('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors shrink-0 ${
            currentView === 'dashboard'
              ? 'bg-indigo-600 text-white font-medium shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
          <span>Dashboard</span>
        </button>
      </nav>

      {isNavDrawerOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsNavDrawerOpen(false)}
          />

          <div className="relative w-80 sm:w-96 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-red-500 flex items-center justify-center text-white shadow">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Navigation Menu</h3>
                  <p className="text-[11px] text-slate-400 font-mono">Select a tab or view</p>
                </div>
              </div>

              <button
                id="btn-close-hamburger-drawer"
                onClick={() => setIsNavDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Active Project
              </div>
              <div className="text-xs font-bold text-slate-200 truncate">
                {project ? project.name : 'No Project Active'}
              </div>
              {project && (
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {Object.keys(project.files || {}).length} Luau files in workspace
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                Workspace Views
              </div>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all border ${
                      isActive
                        ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow'
                        : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 ${
                        isActive ? 'text-indigo-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
              <button
                id="drawer-btn-api-settings"
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  onOpenApiSettings();
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>API Settings</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                id="drawer-btn-patch-notes"
                type="button"
                onClick={() => {
                  setIsNavDrawerOpen(false);
                  onOpenPatchNotes();
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-between border border-slate-700/80 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>What's New</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

