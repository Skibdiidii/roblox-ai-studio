import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectFile, ChatMessage, GamePlan, ValidationResult, PreviewElement, ApiSettings, AppView } from './types';
import { GAME_TEMPLATES, GameTemplate } from './data/templates';
import { validateRobloxProject } from './utils/validator';
import { exportProjectZip, downloadBlob, downloadSingleFile } from './utils/exporter';
import { Header } from './components/Header';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { AIChat } from './components/AIChat';
import { Web3DPreview } from './components/Web3DPreview';
import { ChatAndPreview } from './components/ChatAndPreview';
import { ValidationPanel } from './components/ValidationPanel';
import { RobloxPublishPanel } from './components/RobloxPublishPanel';
import { ProjectDashboard } from './components/ProjectDashboard';
import { PatchNotesModal } from './components/PatchNotesModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { X, Box, Sparkles, FolderPlus } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('roblox_ai_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validProjects = parsed.filter(p => p && p.id && p.id !== 'anime-sim-01');
          return validProjects;
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
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      geminiApiKey: '',
      robloxApiKey: '',
      preferredModel: 'gemini-3.6-flash'
    };
  });

  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('chat-preview');
  const [activeFilePath, setActiveFilePath] = useState<string>('');
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [stage, setStage] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isTestingRoblox, setIsTestingRoblox] = useState(false);
  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(true);
  const [showSidePreview, setShowSidePreview] = useState(true);

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
      content: `Welcome to Roblox AI Studio! I am your AI Luau game architect powered by Gemini 3.6 Flash.

Describe any Roblox game you want to build (e.g., an anime simulator, an obby with moving platforms, a tower defense game, or a survival island), and I will architect the complete client-server project structure, Luau scripts, and 3D preview scene.

You can also browse starter templates in the Dashboard or configure custom API keys in the top bar.`,
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

  const handleSendMessage = async (prompt: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: prompt,
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
                            content: data.explanation || m.content || `I've created an architectural plan for "${plan.title}". Review the gameplay loop, systems, and remotes below. When you're ready, click "Approve & Generate Files".`,
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
                    },
                    previewElements: data.previewElements || prev.previewElements
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
          } catch (e) {
          }
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
      const previewElements: PreviewElement[] = data.previewElements || [
        { id: 'floor-1', name: 'Baseplate', type: 'arena', position: [0, 0.5, 0], size: [60, 1, 60], color: '#3b82f6', shape: 'cylinder' },
        { id: 'spawn-1', name: 'SpawnLocation', type: 'spawn', position: [0, 1.2, -20], size: [6, 0.4, 6], color: '#10b981', shape: 'box', label: 'Spawn' }
      ];

      const newProjectId = `proj-${Date.now()}`;
      const newProject: Project = {
        id: newProjectId,
        name: plan.title,
        description: plan.concept,
        stage: 4,
        plan,
        lastModified: Date.now(),
        files: generatedFiles,
        previewElements,
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
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.geminiApiKey ? { 'x-gemini-api-key': apiSettings.geminiApiKey } : {})
        },
        body: JSON.stringify({
          action,
          code,
          filePath,
          preferredModel: apiSettings.preferredModel
        })
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
    if (!activeProject) return;
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
    if (!target) return;
    try {
      const blob = await exportProjectZip(target);
      const filename = `${target.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-roblox-project.zip`;
      downloadBlob(blob, filename);
    } catch (err: any) {
      alert(`Failed to export ZIP: ${err.message}`);
    }
  };

  const handlePublishToRoblox = async () => {
    if (!activeProject) return;
    setIsPublishing(true);
    updateActiveProject(prev => ({
      ...prev,
      robloxConfig: {
        ...prev.robloxConfig,
        status: 'PUBLISHING',
        lastPublishMessage: prev.robloxConfig.autoCreatePlace
          ? 'Auto-creating new Place in Universe and publishing game payload...'
          : 'Sending request to Roblox Open Cloud Place Publishing API...'
      }
    }));

    try {
      const response = await fetch('/api/roblox/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.robloxApiKey ? { 'x-roblox-api-key': apiSettings.robloxApiKey } : {})
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          placeId: activeProject.robloxConfig.placeId,
          autoCreatePlace: activeProject.robloxConfig.autoCreatePlace ?? true,
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
          placeId: data.placeId || prev.robloxConfig.placeId,
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

  const handleSimulateRobloxPublish = async () => {
    if (!activeProject) return;
    setIsPublishing(true);
    try {
      const response = await fetch('/api/roblox/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId || '1234567890',
          placeId: activeProject.robloxConfig.placeId,
          autoCreatePlace: true,
          projectName: activeProject.name,
          files: activeProject.files,
          simulate: true
        })
      });

      const data = await response.json();

      updateActiveProject(prev => ({
        ...prev,
        robloxConfig: {
          ...prev.robloxConfig,
          status: data.status,
          placeId: data.placeId || prev.robloxConfig.placeId,
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
          lastPublishMessage: `Simulation error: ${err.message}`
        }
      }));
    } finally {
      setIsPublishing(false);
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
          projectName: activeProject.name,
          description: activeProject.description
        })
      });

      const data = await response.json();
      if (data.success && data.placeId) {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            placeId: data.placeId,
            lastPublishMessage: data.message,
            rawApiDetails: data.details ? JSON.stringify(data.details, null, 2) : undefined
          }
        }));
      } else {
        updateActiveProject(prev => ({
          ...prev,
          robloxConfig: {
            ...prev.robloxConfig,
            lastPublishMessage: data.message,
            rawApiDetails: data.details ? JSON.stringify(data.details, null, 2) : undefined
          }
        }));
      }
    } catch (err: any) {
      alert(`Error creating place: ${err.message}`);
    } finally {
      setIsCreatingPlace(false);
    }
  };

  const handleTestRobloxConnection = async () => {
    if (!activeProject) return;
    setIsTestingRoblox(true);
    try {
      const response = await fetch('/api/roblox/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiSettings.robloxApiKey ? { 'x-roblox-api-key': apiSettings.robloxApiKey } : {})
        },
        body: JSON.stringify({
          universeId: activeProject.robloxConfig.universeId,
          placeId: activeProject.robloxConfig.placeId,
          autoCreatePlace: activeProject.robloxConfig.autoCreatePlace ?? true
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
        autoCreatePlace: true,
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
        autoCreatePlace: true,
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
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      const remaining = projects.filter(p => p.id !== id);
      setActiveProjectId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const currentActiveFile = (activeProject && activeProject.files[activeFilePath]) ? activeProject.files[activeFilePath] : null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
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

        {currentView === 'chat-preview' && (
          <div className="flex-1 flex overflow-hidden">
            <ChatAndPreview
              messages={messages}
              currentPlan={currentPlan}
              stage={stage}
              isGenerating={isGenerating}
              onSendMessage={handleSendMessage}
              onApprovePlan={handleApprovePlan}
              previewElements={activeProject?.previewElements || []}
              projectName={activeProject?.name || 'Roblox Game'}
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
                          <Web3DPreview elements={activeProject.previewElements || []} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentView === 'preview' && (
          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            <div className="flex-1 rounded-lg overflow-hidden border border-slate-800">
              <Web3DPreview elements={activeProject?.previewElements || []} />
            </div>
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
