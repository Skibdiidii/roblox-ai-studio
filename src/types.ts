export type ScriptType = 'server' | 'client' | 'module' | 'config' | 'doc' | 'scene' | 'asset';

export type AppView = 'dashboard' | 'chat' | 'editor' | 'validator' | 'publish';

export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export type DeviceOrientation = 'portrait' | 'landscape';

export interface ProjectFile {
  path: string;
  name: string;
  content: string;
  language: 'luau' | 'lua' | 'json' | 'markdown' | 'glb' | 'obj' | 'fbx' | 'model' | 'image' | 'audio';
  type: ScriptType;
}

export interface PreviewElement {
  id: string;
  name: string;
  type: 'dummy' | 'spawn' | 'arena' | 'npc' | 'building' | 'obstacle' | 'part' | 'coin' | 'boss';
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  shape: 'box' | 'cylinder' | 'sphere';
  label?: string;
}

export interface GamePlan {
  title: string;
  genre: string;
  concept: string;
  gameplayLoop: string[];
  gameSystems: {
    name: string;
    description: string;
    files: string[];
  }[];
  requiredScripts: {
    path: string;
    purpose: string;
    scriptType: ScriptType;
  }[];
  requiredUI: {
    name: string;
    description: string;
  }[];
  remotes: {
    name: string;
    type: 'RemoteEvent' | 'RemoteFunction';
    purpose: string;
  }[];
  dataStores: {
    name: string;
    keys: string[];
  }[];
  mapRequirements: {
    name: string;
    description: string;
    elements: PreviewElement[];
  };
  npcRequirements: {
    name: string;
    role: string;
    count: number;
  }[];
  configurationValues: {
    key: string;
    value: string | number | boolean;
    description: string;
  }[];
}

export interface ValidationResult {
  id: string;
  file: string;
  line: number;
  problem: string;
  suggestedFix: string;
  severity: 'valid' | 'warning' | 'error';
  codeSnippet?: string;
}

export interface RobloxConfig {
  universeId: string;
  placeId: string;
  autoCreatePlace?: boolean;
  apiKeyConfigured: boolean;
  status: 'NEEDS_CONFIGURATION' | 'READY' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  lastPublishMessage: string;
  lastPublishedAt: string | null;
  rawApiDetails?: string;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  data: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  thinking?: string;
  isThinking?: boolean;
  isStreaming?: boolean;
  plan?: GamePlan;
  modifiedFiles?: string[];
  attachments?: ChatAttachment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  templateId?: string;
  stage: number;
  plan: GamePlan | null;
  files: Record<string, ProjectFile>;
  previewElements: PreviewElement[];
  validationIssues: ValidationResult[];
  robloxConfig: RobloxConfig;
  chatHistory: ChatMessage[];
  lastModified: number;
}

export interface PatchNote {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  details: string[];
  tag: 'Major' | 'Feature' | 'Improvement' | 'Hotfix';
}

export interface ApiSettings {
  provider?: 'mistral' | 'gemini';
  mistralApiKey?: string;
  geminiApiKey: string;
  robloxApiKey: string;
  preferredModel: string;
}

