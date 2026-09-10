import React, { useState } from 'react';
import { ProjectFile } from '../types';
import {
  Folder,
  Image,
  BoxSelect,
  FileArchive,
  Music,
  FolderOpen,
  FileCode,
  FileText,
  Search,
  Plus,
  Server,
  Monitor,
  Box,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileExplorerProps {
  files: Record<string, ProjectFile>;
  activeFilePath: string | null;
  onSelectFile: (path: string) => void;
  onAddFile: (path: string, type: any) => void;
}

export function FileExplorer({ files, activeFilePath, onSelectFile, onAddFile }: FileExplorerProps) {
  const [search, setSearch] = useState('');
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileFolder, setNewFileFolder] = useState('ServerScriptService/Systems');
  const [newFileType, setNewFileType] = useState<any>('server');

  const toggleFolder = (folder: string) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const fileList = Object.values(files).filter(f =>
    f.path.toLowerCase().includes(search.toLowerCase())
  );

  const folderGroups: Record<string, ProjectFile[]> = {};
  fileList.forEach(f => {
    const parts = f.path.split('/');
    const folder = parts.length > 1 ? parts.slice(0, parts.length - 1).join('/') : 'Root';
    if (!folderGroups[folder]) folderGroups[folder] = [];
    folderGroups[folder].push(f);
  });

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let extension = '.server.lua';
    if (newFileType === 'client') extension = '.client.lua';
    if (newFileType === 'module') extension = '.lua';

    const cleanName = newFileName.replace(/\.(lua|luau|server\.lua|client\.lua)$/, '') + extension;
    const fullPath = `${newFileFolder}/${cleanName}`;

    onAddFile(fullPath, newFileType);
    setNewFileName('');
    setIsAddingFile(false);
  };

    const getFileIcon = (file: ProjectFile) => {
    if (file.path.endsWith('.server.lua')) {
      return <Server className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    }
    if (file.path.endsWith('.client.lua')) {
      return <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    }
    if (file.path.endsWith('.lua') || file.path.endsWith('.luau')) {
      return <Box className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
    }
    if (file.path.endsWith('.md')) {
      return <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    }
    if (file.path.match(/\.(png|jpg|jpeg|gif)$/i)) {
      return <Image className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    }
    if (file.path.match(/\.(glb|obj|fbx|model)$/i)) {
      return <BoxSelect className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
    }
    if (file.path.match(/\.(mp3|wav|ogg)$/i)) {
      return <Music className="w-3.5 h-3.5 text-lime-400 shrink-0" />;
    }
    return <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200 tracking-wide uppercase">
          <Folder className="w-4 h-4 text-indigo-400" />
          <span>Explorer</span>
        </div>
        <button
          id="btn-explorer-new-file"
          onClick={() => setIsAddingFile(!isAddingFile)}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Create New Script"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-slate-800/80">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-500 pointer-events-none" />
          <input
            id="input-explorer-search"
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {isAddingFile && (
        <form onSubmit={handleCreateFile} className="p-3 bg-slate-950/80 border-b border-slate-800 text-xs flex flex-col gap-2">
          <div className="font-medium text-slate-300">New Script</div>
          <select
            value={newFileFolder}
            onChange={(e) => setNewFileFolder(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="ServerScriptService/Systems">ServerScriptService/Systems</option>
            <option value="ServerScriptService/Services">ServerScriptService/Services</option>
            <option value="ReplicatedStorage/Modules">ReplicatedStorage/Modules</option>
            <option value="ReplicatedStorage/Configuration">ReplicatedStorage/Configuration</option>
            <option value="StarterPlayer/StarterPlayerScripts">StarterPlayer/StarterPlayerScripts</option>
            <option value="StarterGui/MainUI">StarterGui/MainUI</option>
          </select>

          <div className="flex gap-2">
            <select
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
            >
              <option value="server">Server (.server.lua)</option>
              <option value="client">Client (.client.lua)</option>
              <option value="module">Module (.lua)</option>
              <option value="asset">Asset (3D/Image)</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="ScriptName"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            autoFocus
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingFile(false)}
              className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto py-1.5 text-xs font-mono">
        {Object.entries(folderGroups).map(([folder, filesInFolder]) => {
          const isCollapsed = collapsedFolders[folder];
          return (
            <div key={folder} className="mb-0.5">
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full flex items-center gap-1.5 px-3 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors text-left font-sans text-xs"
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
                {isCollapsed ? <Folder className="w-3.5 h-3.5 text-indigo-400/80 shrink-0" /> : <FolderOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                <span className="truncate font-medium">{folder}</span>
              </button>

              {!isCollapsed && (
                <div className="ml-3 pl-2 border-l border-slate-800/80 space-y-0.5">
                  {filesInFolder.map(file => {
                    const isActive = file.path === activeFilePath;
                    return (
                      <button
                        key={file.path}
                        onClick={() => onSelectFile(file.path)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-sm text-left transition-colors text-xs ${
                          isActive
                            ? 'bg-indigo-600/20 text-indigo-200 font-medium'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        {getFileIcon(file)}
                        <span className="truncate">{file.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
