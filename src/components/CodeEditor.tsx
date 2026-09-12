import React, { useState, useMemo } from 'react';
import { ProjectFile } from '../types';
import {
  Copy,
  Check,
  Download,
  Search,
  Wand2,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileCode,
  RotateCw,
  Sparkles,
  Bug
} from 'lucide-react';

interface CodeEditorProps {
  file: ProjectFile | null;
  onUpdateContent: (path: string, content: string) => void;
  onCodeAction: (action: string, code: string, filePath: string) => void;
  onDownloadFile: (file: ProjectFile) => void;
}

export function CodeEditor({ file, onUpdateContent, onCodeAction, onDownloadFile }: CodeEditorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!file) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-500 border border-slate-900 rounded-lg">
        <FileCode className="w-16 h-16 mb-4 text-slate-700" />
        <p className="text-sm font-medium">Select a file from the explorer to view and edit Luau code</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = useMemo(() => file.content.split('\n').length, [file.content]);

  const highlightLuau = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      let highlighted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      highlighted = highlighted.replace(
        /\b(local|function|end|if|then|else|elseif|return|for|in|do|while|repeat|until|not|and|or|true|false|nil)\b/g,
        '<span class="text-purple-400 font-semibold">$1</span>'
      );

      highlighted = highlighted.replace(
        /\b(game|workspace|script|Enum|Vector3|CFrame|Color3|UDim2|UDim|Instance|task|math|string|table|os)\b/g,
        '<span class="text-cyan-400">$1</span>'
      );

      highlighted = highlighted.replace(
        /(:[a-zA-Z0-9_]+)/g,
        '<span class="text-blue-300 font-medium">$1</span>'
      );

      highlighted = highlighted.replace(
        /(".*?"|'.*?')/g,
        '<span class="text-emerald-300">$1</span>'
      );

      highlighted = highlighted.replace(
        /\b(\d+(\.\d+)?)\b/g,
        '<span class="text-amber-300">$1</span>'
      );

      if (searchQuery && searchQuery.trim().length > 0) {
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark class="bg-yellow-500/40 text-white rounded px-0.5">$1</mark>');
      }

      return (
        <div key={idx} className="table-row leading-6 hover:bg-slate-900/40">
          <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-xs w-12">
            {idx + 1}
          </span>
          <span
            className="table-cell font-mono text-xs text-slate-200 whitespace-pre"
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div className="px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-indigo-950 text-indigo-300 border border-indigo-800">
            {file.type}
          </div>
          <span className="text-xs font-mono font-medium text-slate-200 truncate" title={file.path}>
            {file.path}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-500 pointer-events-none" />
            <input
              id="input-code-search"
              type="text"
              placeholder="Search code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 w-32 md:w-44"
            />
          </div>

          <button
            id="btn-code-copy"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            title="Copy entire code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            id="btn-code-download-single"
            onClick={() => onDownloadFile(file)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            title="Download this file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto text-xs">
        <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> AI Actions:
        </span>
        <button
          id="btn-code-action-explain"
          onClick={() => onCodeAction('explain', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3 text-sky-400" /> Explain
        </button>
        <button
          id="btn-code-action-fix"
          onClick={() => onCodeAction('fix', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Bug className="w-3 h-3 text-amber-400" /> Fix
        </button>
        <button
          id="btn-code-action-optimize"
          onClick={() => onCodeAction('optimize', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-yellow-400" /> Optimize
        </button>
        <button
          id="btn-code-action-secure"
          onClick={() => onCodeAction('secure', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure
        </button>
        <button
          id="btn-code-action-regenerate"
          onClick={() => onCodeAction('regenerate', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <RotateCw className="w-3 h-3 text-purple-400" /> Regenerate
        </button>
        <button
          id="btn-code-action-addfeature"
          onClick={() => onCodeAction('add-feature', file.content, file.path)}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
        >
          <Wand2 className="w-3 h-3 text-pink-400" /> Add Feature
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex">
        <textarea
          id="textarea-code-editor"
          value={file.content}
          onChange={(e) => onUpdateContent(file.path, e.target.value)}
          spellCheck={false}
          className="flex-1 h-full p-4 font-mono text-xs text-slate-200 bg-slate-950 resize-none focus:outline-none border-none leading-6 selection:bg-indigo-500/30 overflow-auto"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
        <div>Lines: {lineCount} | Chars: {file.content.length}</div>
        <div className="flex items-center gap-3">
          <span>Luau (Strict Typechecking)</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Editable
          </span>
        </div>
      </div>
    </div>
  );
}
