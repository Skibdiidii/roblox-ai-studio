import React, { useState } from 'react';
import { RobloxConfig, Project } from '../types';
import {
  Cloud,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Shield,
  ExternalLink,
  Download,
  Key,
  Globe,
  Radio,
  RefreshCw
} from 'lucide-react';

interface RobloxPublishPanelProps {
  config: RobloxConfig;
  project: Project;
  onUpdateConfig: (updated: Partial<RobloxConfig>) => void;
  onTestConnection: () => Promise<void>;
  onPublish: () => Promise<void>;
  onExport: () => void;
  isPublishing: boolean;
  isTesting: boolean;
  validationErrorCount: number;
}

export function RobloxPublishPanel({
  config,
  project,
  onUpdateConfig,
  onTestConnection,
  onPublish,
  onExport,
  isPublishing,
  isTesting,
  validationErrorCount
}: RobloxPublishPanelProps) {
  const [universeId, setUniverseId] = useState(config.universeId);
  const [placeId, setPlaceId] = useState(config.placeId);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({ universeId, placeId });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getStatusBadge = () => {
    switch (config.status) {
      case 'PUBLISHED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PUBLISHED</span>
          </div>
        );
      case 'PUBLISHING':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 border border-blue-700 text-blue-400 font-bold text-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>PUBLISHING</span>
          </div>
        );
      case 'READY':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold text-xs">
            <Radio className="w-3.5 h-3.5" />
            <span>READY TO PUBLISH</span>
          </div>
        );
      case 'FAILED':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-rose-400 font-bold text-xs">
            <XCircle className="w-3.5 h-3.5" />
            <span>FAILED</span>
          </div>
        );
      case 'NEEDS_CONFIGURATION':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-700 text-amber-400 font-bold text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>NEEDS CONFIGURATION</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-y-auto p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Roblox Open Cloud Integration</h2>
            <p className="text-xs text-slate-400">Official Creator Open Cloud v1 Publishing & Asset Management</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security Notice: Official Open Cloud Protocols Only</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          This studio never requests or stores Roblox passwords or .ROBLOSECURITY cookies. All Open Cloud operations are dispatched via server-side HTTPS proxy directly to <code className="text-slate-300">apis.roblox.com</code>.
        </p>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${config.apiKeyConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            Server API Key: {config.apiKeyConfigured ? 'Configured (Server-Side)' : 'Demo / Unconfigured'}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${validationErrorCount === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            Validation: {validationErrorCount === 0 ? 'Passed (0 Errors)' : `${validationErrorCount} Unresolved Error(s)`}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Target Experience Identifiers</span>
          </h3>
          <a
            href="https://create.roblox.com/dashboard/creations"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Roblox Creator Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Universe ID (Experience ID)</label>
            <input
              id="input-roblox-universe-id"
              type="text"
              placeholder="e.g. 1234567890"
              value={universeId}
              onChange={(e) => setUniverseId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Found in Experience Settings on Roblox Creator Dashboard</p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Place ID (Starter Place ID)</label>
            <input
              id="input-roblox-place-id"
              type="text"
              placeholder="e.g. 9876543210"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">The primary starter place in your universe</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-roblox-save-config"
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Save Identifiers
            </button>
            {savedSuccess && <span className="text-xs text-emerald-400 font-medium">✓ Saved</span>}
          </div>

          <button
            id="btn-roblox-test-conn"
            type="button"
            onClick={onTestConnection}
            disabled={isTesting || (!universeId && !config.universeId)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Open Cloud Connection</span>
          </button>
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Cloud className="w-4 h-4 text-red-400" />
          <span>Publish Pipeline</span>
        </h3>

        <div className="p-3.5 rounded-md bg-slate-950 border border-slate-800/90 text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span>Last Response / Log:</span>
            {config.lastPublishedAt && (
              <span className="text-[11px] text-slate-500 font-mono">{config.lastPublishedAt}</span>
            )}
          </div>
          <div className="font-mono text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800/80 break-all text-[11px]">
            {config.lastPublishMessage}
          </div>
          {config.rawApiDetails && (
            <pre className="text-[10px] text-slate-500 bg-slate-900/80 p-2 rounded overflow-x-auto">
              {config.rawApiDetails}
            </pre>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="btn-roblox-publish-now"
            type="button"
            onClick={onPublish}
            disabled={isPublishing || validationErrorCount > 0}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            <span>{isPublishing ? 'Publishing to Roblox Open Cloud...' : 'Publish to Roblox Open Cloud'}</span>
          </button>

          <button
            id="btn-roblox-export-fallback"
            type="button"
            onClick={onExport}
            className="flex items-center gap-2 py-2.5 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            <span>Export Project (ZIP)</span>
          </button>
        </div>

        {validationErrorCount > 0 && (
          <p className="text-xs text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Resolve the {validationErrorCount} validation error(s) before publishing.</span>
          </p>
        )}
      </div>
    </div>
  );
}
