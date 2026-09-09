import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFile, ChatMessage, GamePlan, ValidationResult, ApiSettings, AppView, ChatAttachment } from './types';
import { GAME_TEMPLATES, GameTemplate } from './data/templates';
import { validateRobloxProject } from './utils/validator';
import { exportProjectZip, downloadBlob, downloadSingleFile } from './utils/exporter';
import { Header } from './components/Header';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { AIChat } from './components/AIChat';
import { ValidationPanel } from './components/ValidationPanel';
import { RobloxPublishPanel } from './components/RobloxPublishPanel';
import { ProjectDashboard } from './components/ProjectDashboard';
import { PatchNotesModal } from './components/PatchNotesModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { X, Sparkles } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('roblox_ai_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => p && p.id && p.id !== 'anime-sim-01');
        }
      } catch (e) {}
    }
    return [];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('roblox_ai_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const valid = Array.isArray(parsed) ? parsed.filter(p => p && p.id && p.id !== 'anime-sim-01') : [];
        if (valid.length > 0) return valid[0].id;
      } catch (e) {}
    }
    return '';
  });

  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('roblox_ai_api_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.preferredModel || parsed.preferredModel === 'gemini-3.6-flash' || parsed.preferredModel === 'gemini-3.8-flash') {
          parsed.preferredModel = 'gemini-flash-latest';
        }
        return parsed;
      } catch (e) {}
    }
    return {
      geminiApiKey: '',
      robloxApiKey: '',
      preferredModel: 'gemini-flash-latest'
    };
  });

  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('chat');
  const [activeFilePath, setActiveFilePath] = useState<string>('');
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [stage, setStage] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTestingRoblox, setIsTestingRoblox] = useState(false);
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(true);

  const activeProject = useMemo(() => {
    if (!projects.length) return null;
    return projects.find(p => p.id === activeProjectId) || projects[0] || null;
  }, [projects, activeProjectId]);

  useEffect(() => {
    if (activeProject && Object.keys(activeProject.files).length > 0) {
      const keys = Object.keys(activeProject.files);
      if (!activeFilePath || !activeProject.files[activeFilePath]) {
        setActiveFilePath(keys[0]);
        setOpenTabs(keys.slice(0, 3));
      }
    }
  }, [activeProject, activeFilePath]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      content: `Welcome to Roblox AI Studio! I am your AI Luau game architect powered by Gemini.

You can chat freely, upload images or screenshots, ask Luau scripting questions, or describe any Roblox game to build. I will architect the complete client-server project structure, Luau scripts, and data systems with high performance.`,
      timestamp: Date.now()
    }
  ]);

  const [currentPlan, setCurrentPlan] = useState<GamePlan | null>(null);

  const validationIssues = useMemo(() => {
    if (!activeProject) return [];
    return validateRobloxProject(activeProject);
  }, [activeProject]);

  useEffect(() => {
    localStorage.setItem('roblox_ai_projects', JSON.stringify(projects));
  }, [projects]);

  const handleSaveApiSettings = (newSettings: ApiSettings) => {
    setApiSettings(newSettings);
    localStorage.setItem('roblox_ai_api_settings', JSON.stringify(newSettings));
  };

  const updateActiveProject = (updater: (prev: Project) => Project) => {
    if (!activeProject) return;
    setProjects(prev =>
      prev.map(p => (p.id === activeProject.id ? updater(p) : p))
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

  const handleSendMessage = async (prompt: string, attachments?: ChatAttachment[]) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: prompt,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      timestamp: Date.now()
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      content: '',
      thinking: '',
      isThinking: true,
      isStreaming: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg, initialAiMsg]);
    setIsGenerating(true);

    const isModification = Boolean(activeProject && stage >= 4 && Object.keys(activeProject.files).length > 2);
    if (!isModification) {
      setStage(2);
    }

    try {
      const response = await fetch('/api/ai/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.geminiApiKey ? { 'x-gemini-api-key': apiSettings.geminiApiKey } : {})
        },
        body: JSON.stringify({
          prompt,
          mode: isModification ? 'modify' : 'plan',
          project: isModification ? activeProject : undefined,
          attachments: attachments || [],
          preferredModel: apiSettings.preferredModel
        })
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
          const trimmed = block.trim();
          if (!trimmed) continue;

          let eventName = 'message';
          const dataLines: string[] = [];

          const lines = trimmed.split('\n');
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventName = line.replace(/^event:\s*/, '').trim();
            } else if (line.startsWith('data:')) {
              dataLines.push(line.replace(/^data:\s*/, ''));
            }
          }

          const payloadStr = dataLines.join('\n').trim();
          if (!payloadStr) continue;

          try {
            const data = JSON.parse(payloadStr);

            if (eventName === 'thinking') {
              const thoughtText = data.thought || data.step || '';
              if (thoughtText) {
                setMessages(prev =>
                  prev.map(m =>
                    m.id === aiMsgId
                      ? {
                          ...m,
                          thinking: m.thinking ? `${m.thinking}\n${thoughtText}` : thoughtText,
                          isThinking: true
                        }
                      : m
                  )
                );
              }
            } else if (eventName === 'thinking_done') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsgId
                    ? { ...m, isThinking: false }
                    : m
                )
              );
            } else if (eventName === 'answer_chunk') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        content: (m.content || '') + (data.chunk || ''),
                        isThinking: false
                      }
                    : m
                )
              );
            } else if (eventName === 'result') {
              if (data.plan || data.type === 'plan') {
                const plan = data.plan;
                if (plan) {
                  setCurrentPlan(plan);
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === aiMsgId
                        ? {
                            ...m,
                            content: data.explanation || m.content || `Architectural plan ready for "${plan.title}". Review the specifications below and approve to generate the Luau code.`,
                            plan: plan,
                            isThinking: false,
                            isStreaming: false
                          }
                        : m
                    )
                  );
                }
              }
              if (data.files || data.type === 'modify') {
                const modifiedFilePaths = data.files ? Object.keys(data.files) : [];
                if (data.files && Object.keys(data.files).length > 0) {
                  updateActiveProject(prev => ({
                    ...prev,
                    lastModified: Date.now(),
                    files: {
                      ...prev.files,
                      ...data.files
                    }
                  }));

                  if (modifiedFilePaths.length > 0) {
                    setActiveFilePath(modifiedFilePaths[0]);
                    setOpenTabs(prevTabs => Array.from(new Set([...prevTabs, ...modifiedFilePaths])));
                  }
                }

                setMessages(prev =>
                  prev.map(m =>
                    m.id === aiMsgId
                      ? {
                          ...m,
                          content: data.explanation || m.content || 'I have updated the game project according to your request.',
                          modifiedFiles: modifiedFilePaths.length > 0 ? modifiedFilePaths : m.modifiedFiles,
                          isThinking: false,
                          isStreaming: false
                        }
                      : m
                  )
                );
              }
            } else if (eventName === 'error') {
              throw new Error(data.message || 'Error occurred during streaming');
            } else if (eventName === 'done') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === aiMsgId
                    ? { ...m, isThinking: false, isStreaming: false }
                    : m
                )
              );
            }
          } catch (e) {}
        }
      }
    } catch (err: any) {
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId
            ? {
                ...m,
                content: m.content
                  ? `${m.content}\n\n[Error occurred: ${err.message}]`
                  : `Could not reach AI generation engine: ${err.message}. Please verify your Gemini API key in API Settings or try again.`,
                isThinking: false,
                isStreaming: false
              }
            : m
        )
      );
    } finally {
      setIsGenerating(false);
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId
            ? { ...m, isThinking: false, isStreaming: false }
            : m
        )
      );
    }
  };

  const handleApprovePlan = async (plan: GamePlan) => {
    setIsGenerating(true);
    setStage(3);

    try {
      const response = await fetch('/api/ai/generate-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.geminiApiKey ? { 'x-gemini-api-key': apiSettings.geminiApiKey } : {})
        },
        body: JSON.stringify({
          plan,
          preferredModel: apiSettings.preferredModel
        })
      });

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      const generatedFiles: Record<string, ProjectFile> = data.files || {};

      const newProjectId = `proj-${Date.now()}`;
      const newProject: Project = {
        id: newProjectId,
        name: plan.title,
        description: plan.concept,
        stage: 4,
        plan,
        lastModified: Date.now(),
        files: generatedFiles,
        previewElements: [],
        validationIssues: [],
        chatHistory: [],
        robloxConfig: {
          universeId: '',
          placeId: '',
          autoCreatePlace: true,
          status: 'NEEDS_CONFIGURATION',
          apiKeyConfigured: false,
          lastPublishMessage: 'Project generated from AI Plan. Ready to publish or export.',
          lastPublishedAt: null
        }
      };

      setProjects(prev => [newProject, ...prev]);
      setActiveProjectId(newProjectId);
      setStage(4);

      const filePaths = Object.keys(generatedFiles);
      if (filePaths.length > 0) {
        setActiveFilePath(filePaths[0]);
        setOpenTabs(filePaths.slice(0, 4));
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-files-${Date.now()}`,
          sender: 'ai',
          content: `All production-ready Luau scripts and architecture for "${plan.title}" have been successfully created (${filePaths.length} files).\n\nYou can switch to the Code Editor from the hamburger menu to inspect scripts, validate logic, or publish directly to Roblox Open Cloud.`,
          modifiedFiles: filePaths,
          timestamp: Date.now()
        }
      ]);

      setCurrentView('editor');
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          sender: 'ai',
          content: `Failed to generate project files: ${err.message}. Please try again or check your API key in API Settings.`,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCodeAction = async (action: string, prompt?: string) => {
    if (!activeProject || !activeFilePath) return;
    const currentFile = activeProject.files[activeFilePath];
    if (!currentFile) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/code-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.geminiApiKey ? { 'x-gemini-api-key': apiSettings.geminiApiKey } : {})
        },
        body: JSON.stringify({
          action,
          prompt,
          currentFile,
          allFiles: activeProject.files,
          preferredModel: apiSettings.preferredModel
        })
      });

      if (!response.ok) throw new Error('Code action failed');
      const data = await response.json();

      if (data.modifiedContent) {
        handleUpdateFileContent(activeFilePath, data.modifiedContent);
      }

      if (data.explanation) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-action-${Date.now()}`,
            sender: 'ai',
            content: `**${action.toUpperCase()}** on \`${currentFile.name}\`:\n\n${data.explanation}`,
            modifiedFiles: [activeFilePath],
            timestamp: Date.now()
          }
        ]);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFixIssueWithAI = async (issue: ValidationResult) => {
    if (!activeProject || !issue.file) return;
    const file = activeProject.files[issue.file];
    if (!file) return;

    setActiveFilePath(issue.file);
    if (!openTabs.includes(issue.file)) setOpenTabs(prev => [...prev, issue.file]);
    setCurrentView('editor');

    await handleCodeAction('fix', `Fix this validation issue: ${issue.problem} at line ${issue.line || 1}`);
  };

  const handleNewProject = () => {
    setStage(1);
    setCurrentPlan(null);
    setCurrentView('chat');
  };

  const handleDuplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      name: `${project.name} (Copy)`,
      lastModified: Date.now()
    };
    setProjects(prev => [duplicated, ...prev]);
    setActiveProjectId(duplicated.id);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setActiveProjectId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const handleExportProject = async (projectOrFormat?: Project | 'zip' | 'rojo' | 'rbxlx') => {
    const targetProject = (typeof projectOrFormat === 'object' && projectOrFormat !== null) ? projectOrFormat : activeProject;
    if (!targetProject) return;
    const blob = await exportProjectZip(targetProject);
    downloadBlob(blob, `${targetProject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-project.zip`);
  };

  const handleSelectTemplate = (template: GameTemplate) => {
    const newProjectId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newProjectId,
      name: template.name,
      description: template.description,
      stage: 4,
      plan: template.plan,
      lastModified: Date.now(),
      files: template.files,
      previewElements: [],
      validationIssues: [],
      chatHistory: [],
      robloxConfig: {
        universeId: '',
        placeId: '',
        autoCreatePlace: true,
        status: 'NEEDS_CONFIGURATION',
        apiKeyConfigured: false,
        lastPublishMessage: 'Initialized from template: ' + template.name,
        lastPublishedAt: null
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProjectId);
    setStage(4);

    const fileKeys = Object.keys(template.files);
    if (fileKeys.length > 0) {
      setActiveFilePath(fileKeys[0]);
      setOpenTabs(fileKeys.slice(0, 4));
    }

    setCurrentView('editor');
  };

  const handleTestRobloxConnection = async () => {
    if (!activeProject) return;
    setIsTestingRoblox(true);
    try {
      const response = await fetch('/api/roblox/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.robloxApiKey ? { 'x-roblox-api-key': apiSettings.robloxApiKey } : {})
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId
        })
      });

      const data = await response.json();
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: data.success ? 'READY' : 'FAILED',
          apiKeyConfigured: data.configured,
          lastPublishMessage: data.message
        }
      }));
    } catch (err: any) {
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: 'FAILED',
          lastPublishMessage: `Connection test error: ${err.message}`
        }
      }));
    } finally {
      setIsTestingRoblox(false);
    }
  };

  const handleCreatePlaceNow = async () => {
    if (!activeProject) return;
    setIsCreatingPlace(true);
    try {
      const response = await fetch('/api/roblox/create-place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.robloxApiKey ? { 'x-roblox-api-key': apiSettings.robloxApiKey } : {})
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          title: activeProject.name,
          description: activeProject.description
        })
      });

      const data = await response.json();
      if (data.success && data.placeId) {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            placeId: String(data.placeId),
            lastPublishMessage: `Place created successfully! Place ID: ${data.placeId}`
          }
        }));
      } else {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            lastPublishMessage: data.error || 'Failed to auto-create place'
          }
        }));
      }
    } catch (err: any) {
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          lastPublishMessage: `Create Place error: ${err.message}`
        }
      }));
    } finally {
      setIsCreatingPlace(false);
    }
  };

  const handlePublishToRoblox = async (versionType: 'Saved' | 'Published' = 'Published') => {
    if (!activeProject) return;
    setIsPublishing(true);

    try {
      const response = await fetch('/api/roblox/publish-place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.robloxApiKey ? { 'x-roblox-api-key': apiSettings.robloxApiKey } : {})
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          placeId: activeProject.robloxConfig.placeId,
          versionType,
          project: activeProject,
          autoCreatePlace: activeProject.robloxConfig.autoCreatePlace
        })
      });

      const data = await response.json();
      if (data.success) {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            status: 'PUBLISHED',
            placeId: data.placeId ? String(data.placeId) : prev.robloxConfig.placeId,
            lastPublishedAt: new Date().toLocaleTimeString(),
            lastPublishMessage: `Published successfully! VersionNumber: ${data.versionNumber || 1} (Place ID: ${data.placeId || prev.robloxConfig.placeId})`
          }
        }));
      } else {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            status: 'FAILED',
            lastPublishMessage: `Publish failed: ${data.error || 'Check permissions or API key'}`
          }
        }));
      }
    } catch (err: any) {
      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: 'FAILED',
          lastPublishMessage: `Publish exception: ${err.message}`
        }
      }));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSimulateRobloxPublish = async () => {
    if (!activeProject) return;
    setIsPublishing(true);

    await new Promise(r => setTimeout(r, 1200));

    const simulatedPlaceId = activeProject.robloxConfig.placeId || String(Math.floor(1000000000 + Math.random() * 9000000000));

    updateActiveProject(prev => ({
      ...prev,
      robloxConfig: {
        ...prev.robloxConfig,
        status: 'PUBLISHED',
        placeId: simulatedPlaceId,
        lastPublishedAt: new Date().toLocaleTimeString(),
        lastPublishMessage: `[Demo Mode] Simulated upload of ${Object.keys(activeProject.files).length} Luau scripts to Place ${simulatedPlaceId}. VersionNumber: 2 (Simulated Success)`
      }
    }));

    setIsPublishing(false);
  };

  const currentActiveFile = useMemo(() => {
    if (!activeProject || !activeFilePath) return null;
    return activeProject.files[activeFilePath] || null;
  }, [activeProject, activeFilePath]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        stage={stage}
        project={activeProject as any}
        validationIssues={validationIssues}
        onOpenPatchNotes={() => setIsPatchNotesOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
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
          <div className="flex-1 p-3 sm:p-4 overflow-hidden">
            <AIChat
              messages={messages}
              currentPlan={currentPlan}
              stage={stage}
              isGenerating={isGenerating}
              onSendMessage={handleSendMessage}
              onApprovePlan={handleApprovePlan}
              onOpenCodeInEditor={(path) => {
                if (activeProject && activeProject.files[path]) {
                  setActiveFilePath(path);
                  if (!openTabs.includes(path)) setOpenTabs(prev => [...prev, path]);
                  setCurrentView('editor');
                }
              }}
            />
          </div>
        )}

        {currentView === 'editor' && (
          <div className="flex-1 flex overflow-hidden">
            {!activeProject ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h3 className="text-base font-bold text-slate-200">No Project Open</h3>
                  <p className="text-xs text-slate-400">
                    Create a project using the AI Generator or start with a template to view the Luau editor.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentView('chat')}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Open AI Generator
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
                  >
                    Select Template
                  </button>
                </div>
              </div>
            ) : (
              <>
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
                    </div>
                  )}

                  <div className="flex-1 min-w-0 h-full p-2">
                    <CodeEditor
                      file={currentActiveFile}
                      onUpdateContent={handleUpdateFileContent}
                      onCodeAction={handleCodeAction}
                      onDownloadFile={downloadSingleFile}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'validator' && (
          <div className="flex-1 p-4 overflow-hidden">
            {activeProject ? (
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
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <p className="text-slate-400 text-xs">No project active to validate. Please select or create a project.</p>
                <button
                  onClick={() => setCurrentView('chat')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Create Game
                </button>
              </div>
            )}
          </div>
        )}

        {currentView === 'publish' && (
          <div className="flex-1 p-4 overflow-hidden">
            {activeProject ? (
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
                onSimulatePublish={handleSimulateRobloxPublish}
                onCreatePlaceNow={handleCreatePlaceNow}
                onExport={() => handleExportProject()}
                isPublishing={isPublishing}
                isTesting={isTestingRoblox}
                isCreatingPlace={isCreatingPlace}
                validationErrorCount={validationIssues.filter(i => i.severity === 'error').length}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <p className="text-slate-400 text-xs">No project active to publish. Please select or create a project.</p>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
                >
                  Choose a Project
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <PatchNotesModal
        isOpen={isPatchNotesOpen}
        onClose={() => setIsPatchNotesOpen(false)}
      />

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        settings={apiSettings}
        onSaveSettings={handleSaveApiSettings}
      />
    </div>
  );
}
