import React from 'react';
import { ValidationResult } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, RefreshCw, FileCode } from 'lucide-react';

interface ValidationPanelProps {
  issues: ValidationResult[];
  onFixWithAI: (issue: ValidationResult) => void;
  onOpenFile: (file: string, line?: number) => void;
  onRevalidate: () => void;
  isValidating: boolean;
}

export function ValidationPanel({
  issues,
  onFixWithAI,
  onOpenFile,
  onRevalidate,
  isValidating
}: ValidationPanelProps) {
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');
  const isValid = issues.length === 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : errors.length > 0 ? (
            <XCircle className="w-5 h-5 text-rose-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Validator</h3>
            <p className="text-[11px] text-slate-400">
              {isValid
                ? 'All Luau syntax and Roblox security checks passed'
                : `${errors.length} error(s), ${warnings.length} warning(s)`}
            </p>
          </div>
        </div>

        <button
          id="btn-revalidate"
          onClick={onRevalidate}
          disabled={isValidating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
          <span>Run Check</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isValid ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200 mb-1">✓ Luau Code Valid</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              All scripts adhere to Roblox Luau specifications, client/server boundaries are clean, and no infinite loops or deprecated calls were detected.
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3.5 rounded-lg border text-xs flex flex-col gap-2 ${
                issue.severity === 'error'
                  ? 'bg-rose-950/20 border-rose-900/60'
                  : 'bg-amber-950/20 border-amber-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {issue.severity === 'error' ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 font-bold font-mono text-[10px]">
                      ✕ ERROR
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 font-bold font-mono text-[10px]">
                      ⚠ WARNING
                    </span>
                  )}
                  <button
                    onClick={() => onOpenFile(issue.file, issue.line)}
                    className="font-mono text-slate-300 hover:text-white underline decoration-slate-600 flex items-center gap-1"
                  >
                    <FileCode className="w-3.5 h-3.5 text-slate-500" />
                    <span>{issue.file}:{issue.line}</span>
                  </button>
                </div>

                <button
                  id={`btn-fix-ai-${issue.id}`}
                  onClick={() => onFixWithAI(issue)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold transition-colors shrink-0"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Fix with AI</span>
                </button>
              </div>

              <div className="font-semibold text-slate-200">
                {issue.problem}
              </div>

              {issue.codeSnippet && (
                <div className="bg-slate-950 p-2 rounded font-mono text-[11px] text-rose-300/90 border border-slate-800 overflow-x-auto">
                  {issue.codeSnippet}
                </div>
              )}

              <div className="text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                <strong className="text-slate-300">Suggested Fix: </strong>
                {issue.suggestedFix}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
