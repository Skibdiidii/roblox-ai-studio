import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFile, ChatMessage, GamePlan, ValidationResult, PreviewElement } from './types';
import { sampleProject } from './data/sampleProject';
import { GAME_TEMPLATES, GameTemplate } from './data/templates';
import { validateRobloxProject } from './utils/validator';
import { exportProjectZip, downloadBlob, downloadSingleFile } from './utils/exporter';
import { Header } from './components/Header';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { AIChat } from './components/AIChat';
import { Web3DPreview } from './components/Web3DPreview';
import { ValidationPanel } from './components/ValidationPanel';
import { RobloxPublishPanel } from './components/RobloxPublishPanel';
import { ProjectDashboard } from './components/ProjectDashboard';
import { PatchNotesModal } from './components/PatchNotesModal';
import { X, Box } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('roblox_ai_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [sampleProject];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(sampleProject.id);
  const [currentView, setCurrentView] = useState<'dashboard' | 'chat' | 'editor' | 'preview' | 'validator' | 'publish'>('editor');
  const [activeFilePath, setActiveFilePath] = useState<string>('ServerScriptService/Systems/TrainingSystem.server.lua');
  const [openTabs, setOpenTabs] = useState<string[]>([
    'ServerScriptService/Systems/TrainingSystem.server.lua',
    'StarterGui/MainUI/HUD.client.lua'
  ]);
  const [stage, setStage] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTestingRoblox, setIsTestingRoblox] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(true);
  const [showSidePreview, setShowSidePreview] = useState(true);

  const activeProject = useMemo(() => {
    return projects.find(p => p.id === activeProjectId) || projects[0] || sampleProject;
  }, [projects, activeProjectId]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      content: `Welcome to Roblox AI Studio! I am your Luau game architect.
I have scaffolded the "${sampleProject.name}" experience with full client-server separation, leaderstats, training dummies, and rebirth multipliers.

You can ask me to modify existing systems, add quests, bosses, mobile UI, or start a brand new game idea. What would you like to create?`,
      timestamp: Date.now()
    }
  ]);

  const [currentPlan, setCurrentPlan] = useState<GamePlan | null>(null);

  const validationIssues = useMemo(() => {
    return validateRobloxProject(activeProject);
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem('roblox_ai_projects', JSON.stringify(projects));
  }, [projects]);

  const updateActiveProject = (updater: (prev: Project) => Project) => {
    setProjects(prev =>
      prev.map(p => (p.id === activeProjectId ? updater(p) : p))
    );
  };

  const handleUpdateFileContent = (path: string, content: string) => {
    updateActiveProject(prev => {
      const existing = prev.files[path];
      if (!existing) return prev;
      return {
        ...prev,
        lastModified: Date.now(),
        files: {
          ...prev.files,
          [path]: {
            ...existing,
            content
          }
        }
      };
    });
  };

  const handleAddFile = (path: string, type: 'server' | 'client' | 'module') => {
    const parts = path.split('/');
    const name = parts[parts.length - 1];

    let initialCode = '--!strict\n';
    if (type === 'server') {
      initialCode += 'local Players = game:GetService("Players")\n\nprint("[Server] ' + name + ' initialized")\n';
    } else if (type === 'client') {
      initialCode += 'local Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\n\nprint("[Client] ' + name + ' initialized")\n';
    } else {
      initialCode += 'local ' + name.replace(/[^a-zA-Z0-9]/g, '') + ' = {}\n\nreturn ' + name.replace(/[^a-zA-Z0-9]/g, '') + '\n';
    }

    const newFile: ProjectFile = {
      path,
      name,
      content: initialCode,
      language: 'luau',
      type
    };

    updateActiveProject(prev => ({
      ...prev,
      lastModified: Date.now(),
      files: {
        ...prev.files,
        [path]: newFile
      }
    }));

    if (!openTabs.includes(path)) {
      setOpenTabs(prev => [...prev, path]);
    }
    setActiveFilePath(path);
  };

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = openTabs.filter(t => t !== path);
    setOpenTabs(filtered);
    if (activeFilePath === path) {
      setActiveFilePath(filtered[filtered.length - 1] || '');
    }
  };

  const handleSendMessage = async (prompt: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: prompt,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const isModification = stage >= 4 && Object.keys(activeProject.files).length > 2;

      if (isModification) {
        const response = await fetch('/api/ai/modify-game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            project: activeProject
          })
        });

        if (!response.ok) {
          throw new Error(`AI Service returned ${response.status}`);
        }

        const data = await response.json();
        const modifiedFilePaths = data.files ? Object.keys(data.files) : [];

        if (data.files && Object.keys(data.files).length > 0) {
          updateActiveProject(prev => ({
            ...prev,
            lastModified: Date.now(),
            files: {
              ...prev.files,
              ...data.files
            },
            previewElements: data.previewElements || prev.previewElements
          }));

          if (modifiedFilePaths.length > 0) {
            setActiveFilePath(modifiedFilePaths[0]);
            setOpenTabs(prev => Array.from(new Set([...prev, ...modifiedFilePaths])));
          }
        }

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: data.explanation || 'I have updated the game project according to your request.',
          timestamp: Date.now(),
          modifiedFiles: modifiedFilePaths
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        setStage(2);
        const response = await fetch('/api/ai/generate-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
          throw new Error(`AI Service returned ${response.status}`);
        }

        const plan: GamePlan = await response.json();
        setCurrentPlan(plan);

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: `I've created an architectural plan for "${plan.title}". Review the gameplay loop, systems, and remotes below. When you're ready, click "Approve & Generate Files".`,
          timestamp: Date.now(),
          plan
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        content: `Could not reach AI generation engine: ${err.message}. Please check your connection or try again.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprovePlan = async (plan: GamePlan) => {
    setIsGenerating(true);
    setStage(3);

    try {
      const response = await fetch('/api/ai/generate-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      const generatedFiles: Record<string, ProjectFile> = data.files || {};
      const previewElements: PreviewElement[] = data.previewElements || [];

      const newProjectId = `proj-${Date.now()}`;
      const newProject: Project = {
        id: newProjectId,
        name: plan.title,
        description: plan.concept,
        stage: 4,
        plan,
        lastModified: Date.now(),
        files: generatedFiles,
        previewElements: previewElements.length > 0 ? previewElements : sampleProject.previewElements,
        validationIssues: [],
        chatHistory: [],
        robloxConfig: {
          universeId: '',
          placeId: '',
          status: 'NEEDS_CONFIGURATION',
          apiKeyConfigured: false,
          lastPublishMessage: 'Project generated from AI Plan. Ready to publish or export.',
          lastPublishedAt: null
        }
      };

      setProjects(prev => [newProject, ...prev]);
      setActiveProjectId(newProjectId);

      const fileKeys = Object.keys(generatedFiles);
      if (fileKeys.length > 0) {
        setActiveFilePath(fileKeys[0]);
        setOpenTabs(fileKeys.slice(0, 4));
      }

      setStage(4);
      setCurrentView('editor');

      const confirmedMsg: ChatMessage = {
        id: `ai-approved-${Date.now()}`,
        sender: 'ai',
        content: `Generated ${fileKeys.length} Luau source files and 3D preview scene for "${plan.title}". All scripts have been loaded into your editor!`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, confirmedMsg]);
    } catch (err: any) {
      alert(`File generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCodeAction = async (action: string, code: string, filePath: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/code-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, code, filePath })
      });

      if (!response.ok) {
        throw new Error(`AI Code Action returned ${response.status}`);
      }

      const data = await response.json();
      if (data.code) {
        handleUpdateFileContent(filePath, data.code);
      }

      setCurrentView('chat');
      const actionMsg: ChatMessage = {
        id: `ai-action-${Date.now()}`,
        sender: 'ai',
        content: `**Action: ${action.toUpperCase()} on ${filePath}**\n\n${data.explanation || 'Updated the code.'}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, actionMsg]);
    } catch (err: any) {
      alert(`AI action failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFixIssueWithAI = (issue: ValidationResult) => {
    const file = activeProject.files[issue.file];
    if (file) {
      handleCodeAction('fix', file.content, issue.file);
    } else {
      handleSendMessage(`Please fix this project validation issue: ${issue.problem} in ${issue.file}`);
      setCurrentView('chat');
    }
  };

  const handleExportProject = async (proj?: Project) => {
    const target = proj || activeProject;
    try {
      const blob = await exportProjectZip(target);
      const filename = `${target.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roblox-project.zip`;
      downloadBlob(blob, filename);
    } catch (err: any) {
      alert(`Failed to export ZIP: ${err.message}`);
    }
  };

  const handlePublishToRoblox = async () => {
    setIsPublishing(true);
    updateActiveProject(prev => ({
      ...prev,
      robloxConfig: {
        ...prev.robloxConfig,
        status: 'PUBLISHING',
        lastPublishMessage: 'Validating payload and sending request to Roblox Open Cloud Place Publishing API...'
      }
    }));

    try {
      const response = await fetch('/api/roblox/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          placeId: activeProject.robloxConfig.placeId,
          projectName: activeProject.name,
          files: activeProject.files
        })
      });

      const data = await response.json();

      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: data.status,
          lastPublishedAt: new Date().toLocaleString(),
          lastPublishMessage: data.message,
          rawApiDetails: data.details ? JSON.stringify(data.details, null, 2) : undefined
        }
      }));
    } catch (err: any) {
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: 'FAILED',
          lastPublishMessage: `Publishing network error: ${err.message}`
        }
      }));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTestRobloxConnection = async () => {
    setIsTestingRoblox(true);
    try {
      const response = await fetch('/api/roblox/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          placeId: activeProject.robloxConfig.placeId
        })
      });

      const data = await response.json();
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          apiKeyConfigured: data.configured,
          status: data.configured ? 'READY' : 'NEEDS_CONFIGURATION',
          lastPublishMessage: data.message
        }
      }));
    } catch (err: any) {
      alert(`Connection test failed: ${err.message}`);
    } finally {
      setIsTestingRoblox(false);
    }
  };

  const handleSelectTemplate = (template: GameTemplate) => {
    const newId = `template-${template.id}-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name: template.name,
      description: template.description,
      stage: 4,
      plan: template.plan,
      lastModified: Date.now(),
      files: template.files,
      previewElements: template.previewElements,
      validationIssues: [],
      chatHistory: [],
      robloxConfig: {
        universeId: '',
        placeId: '',
        status: 'NEEDS_CONFIGURATION',
        apiKeyConfigured: false,
        lastPublishMessage: `Project initialized from ${template.name} template.`,
        lastPublishedAt: null
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newId);
    const fileKeys = Object.keys(template.files);
    if (fileKeys.length > 0) {
      setActiveFilePath(fileKeys[0]);
      setOpenTabs(fileKeys.slice(0, 3));
    }
    setStage(4);
    setCurrentView('editor');
  };

  const handleNewProject = () => {
    const newId = `proj-blank-${Date.now()}`;
    const blankFiles: Record<string, ProjectFile> = {
      'ServerScriptService/Main.server.lua': {
        path: 'ServerScriptService/Main.server.lua',
        name: 'Main.server.lua',
        content: '--!strict\nlocal Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(player)\n    print("Player joined: " .. player.Name)\nend)\n',
        language: 'luau',
        type: 'server'
      },
      'ReplicatedStorage/Remotes/Placeholder.lua': {
        path: 'ReplicatedStorage/Remotes/Placeholder.lua',
        name: 'Placeholder.lua',
        content: 'return {}\n',
        language: 'luau',
        type: 'module'
      },
      'StarterPlayer/StarterPlayerScripts/ClientLoader.client.lua': {
        path: 'StarterPlayer/StarterPlayerScripts/ClientLoader.client.lua',
        name: 'ClientLoader.client.lua',
        content: '--!strict\nlocal Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\n\nprint("Client initialized for " .. player.Name)\n',
        language: 'luau',
        type: 'client'
      }
    };

    const newBlankProj: Project = {
      id: newId,
      name: 'New Roblox Game',
      description: 'Custom Roblox experience scaffolded with standard directory layout.',
      stage: 1,
      plan: null,
      lastModified: Date.now(),
      files: blankFiles,
      previewElements: [
        {
          id: 'spawn-pad-01',
          name: 'SpawnLocation',
          type: 'spawn',
          position: [0, 0.5, 0],
          size: [10, 1, 10],
          color: '#059669',
          shape: 'box'
        }
      ],
      validationIssues: [],
      chatHistory: [],
      robloxConfig: {
        universeId: '',
        placeId: '',
        status: 'NEEDS_CONFIGURATION',
        apiKeyConfigured: false,
        lastPublishMessage: 'Blank experience ready for development.',
        lastPublishedAt: null
      }
    };

    setProjects(prev => [newBlankProj, ...prev]);
    setActiveProjectId(newId);
    setActiveFilePath('ServerScriptService/Main.server.lua');
    setOpenTabs(['ServerScriptService/Main.server.lua']);
    setStage(1);
    setCurrentView('chat');
  };

  const handleDuplicateProject = (p: Project) => {
    const dupId = `proj-copy-${Date.now()}`;
    const duplicate: Project = {
      ...p,
      id: dupId,
      name: `${p.name} (Copy)`,
      lastModified: Date.now()
    };
    setProjects(prev => [duplicate, ...prev]);
    setActiveProjectId(dupId);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      setActiveProjectId(remaining[0].id);
    }
  };

  const currentActiveFile = activeProject.files[activeFilePath] || null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        stage={stage}
        project={activeProject}
        validationIssues={validationIssues}
        onOpenPatchNotes={() => setIsPatchNotesOpen(true)}
        onExport={() => handleExportProject()}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {currentView === 'dashboard' && (
          <div className="flex-1 p-4 overflow-hidden">
            <ProjectDashboard
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                setActiveProjectId(id);
                setCurrentView('editor');
              }}
              onNewProject={handleNewProject}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onExportProject={handleExportProject}
              onSelectTemplate={handleSelectTemplate}
            />
          </div>
        )}

        {currentView === 'chat' && (
          <div className="flex-1 p-4 overflow-hidden">
            <AIChat
              messages={messages}
              currentPlan={currentPlan}
              stage={stage}
              isGenerating={isGenerating}
              onSendMessage={handleSendMessage}
              onApprovePlan={handleApprovePlan}
            />
          </div>
        )}

        {currentView === 'editor' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-64 shrink-0 hidden md:block">
              <FileExplorer
                files={activeProject.files}
                activeFilePath={activeFilePath}
                onSelectFile={(path) => {
                  if (!openTabs.includes(path)) {
                    setOpenTabs(prev => [...prev, path]);
                  }
                  setActiveFilePath(path);
                }}
                onAddFile={handleAddFile}
              />
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
              {openTabs.length > 0 && (
                <div className="flex items-center bg-slate-900/90 border-b border-slate-800 overflow-x-auto px-2 pt-1 gap-1 text-xs">
                  {openTabs.map(tabPath => {
                    const file = activeProject.files[tabPath];
                    const isActive = tabPath === activeFilePath;
                    if (!file) return null;
                    return (
                      <div
                        key={tabPath}
                        onClick={() => setActiveFilePath(tabPath)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer border-t border-x transition-colors text-xs ${
                          isActive
                            ? 'bg-slate-950 text-slate-100 border-slate-800 border-b-transparent font-medium'
                            : 'bg-slate-900 text-slate-400 border-transparent hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate max-w-[140px]">{file.name}</span>
                        <button
                          onClick={(e) => handleCloseTab(tabPath, e)}
                          className="hover:text-rose-400 text-slate-500 rounded p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  <div className="ml-auto flex items-center pr-2">
                    <button
                      id="btn-toggle-side-preview"
                      onClick={() => setShowSidePreview(!showSidePreview)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                        showSidePreview
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle Split 3D View"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Split 3D</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                <div className="flex-1 min-w-0 h-full p-2">
                  <CodeEditor
                    file={currentActiveFile}
                    onUpdateContent={handleUpdateFileContent}
                    onCodeAction={handleCodeAction}
                    onDownloadFile={downloadSingleFile}
                  />
                </div>

                {showSidePreview && (
                  <div className="h-64 lg:h-full lg:w-[420px] shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800 p-2 flex flex-col">
                    <div className="text-[11px] font-mono text-slate-400 pb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Box className="w-3 h-3 text-emerald-400" />
                        <span>Interactive 3D Arena</span>
                      </span>
                      <button
                        onClick={() => setCurrentView('preview')}
                        className="text-indigo-400 hover:text-indigo-300 text-[10px]"
                      >
                        Full Screen →
                      </button>
                    </div>
                    <div className="flex-1 rounded-lg overflow-hidden border border-slate-800">
                      <Web3DPreview elements={activeProject.previewElements} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'preview' && (
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden border border-slate-800">
              <Web3DPreview elements={activeProject.previewElements} />
            </div>
          </div>
        )}

        {currentView === 'validator' && (
          <div className="flex-1 p-4 overflow-hidden">
            <ValidationPanel
              issues={validationIssues}
              onFixWithAI={handleFixIssueWithAI}
              onOpenFile={(file) => {
                if (activeProject.files[file]) {
                  setActiveFilePath(file);
                  if (!openTabs.includes(file)) setOpenTabs(prev => [...prev, file]);
                  setCurrentView('editor');
                }
              }}
              onRevalidate={() => {
                setProjects(prev => [...prev]);
              }}
              isValidating={false}
            />
          </div>
        )}

        {currentView === 'publish' && (
          <div className="flex-1 p-4 overflow-hidden">
            <RobloxPublishPanel
              config={activeProject.robloxConfig}
              project={activeProject}
              onUpdateConfig={(updated) => {
                updateActiveProject(prev => ({
                  ...prev,
                  robloxConfig: {
                    ...prev.robloxConfig,
                    ...updated
                  }
                }));
              }}
              onTestConnection={handleTestRobloxConnection}
              onPublish={handlePublishToRoblox}
              onExport={() => handleExportProject()}
              isPublishing={isPublishing}
              isTesting={isTestingRoblox}
              validationErrorCount={validationIssues.filter(i => i.severity === 'error').length}
            />
          </div>
        )}
      </main>

      <PatchNotesModal
        isOpen={isPatchNotesOpen}
        onClose={() => setIsPatchNotesOpen(false)}
      />
    </div>
  );
}
