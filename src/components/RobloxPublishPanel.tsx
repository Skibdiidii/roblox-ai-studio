import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  Sparkles,
  Layers,
  Wand2
} from 'lucide-react';

interface RobloxPublishPanelProps {
  config: RobloxConfig;
  project: Project;
  onUpdateConfig: (updated: Partial<RobloxConfig>) => void;
  onTestConnection: () => Promise<void>;
  onPublish: (universeId: string, placeId: string) => Promise<void>;
  onSimulatePublish: () => Promise<void>;
  onCreatePlaceNow: () => Promise<void>;
  onExport: () => void;
  isPublishing: boolean;
  isTesting: boolean;
  isCreatingPlace: boolean;
  validationErrorCount: number;
}

export function RobloxPublishPanel({
  config,
  project,
  onUpdateConfig,
  onTestConnection,
  onPublish,
  onSimulatePublish,
  onCreatePlaceNow,
  onExport,
  isPublishing,
  isTesting,
  isCreatingPlace,
  validationErrorCount
}: RobloxPublishPanelProps) {
  const [universeId, setUniverseId] = useState(config.universeId || '');
  const [placeId, setPlaceId] = useState(config.placeId || '');
  const [autoCreatePlace, setAutoCreatePlace] = useState(config.autoCreatePlace ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setUniverseId(config.universeId || '');
    setPlaceId(config.placeId || '');
    if (config.autoCreatePlace !== undefined) {
      setAutoCreatePlace(config.autoCreatePlace);
    }
  }, [config]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({ universeId, placeId, autoCreatePlace });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleToggleAutoCreate = (checked: boolean) => {
    setAutoCreatePlace(checked);
    onUpdateConfig({ universeId, placeId, autoCreatePlace: checked });
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
            <span>ATTENTION / ERROR</span>
          </div>
        );
      case 'NEEDS_CONFIGURATION':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-400 font-bold text-xs">
            <Radio className="w-3.5 h-3.5" />
            <span>READY TO PUBLISH</span>
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
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>Roblox Open Cloud Integration</span>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 text-[10px] font-mono uppercase">
                v1 Automation
              </span>
            </h2>
            <p className="text-xs text-slate-400">Automated Place Creation & Cloud Version Publishing</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security & Open Cloud Architecture</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Roblox Open Cloud requires an explicit Universe ID and Place ID to publish versions. Auto-creation of places is not supported by Open Cloud API.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${config.apiKeyConfigured ? 'bg-emerald-400' : 'bg-emerald-400'}`} />
            API Key: {config.apiKeyConfigured ? 'Connected' : 'Ready'}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${validationErrorCount === 0 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            Validation: {validationErrorCount === 0 ? 'Passed (0 Errors)' : `${validationErrorCount} Error(s)`}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Target Experience Configuration</span>
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

        <div className="grid grid-cols-1 gap-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Universe ID (Experience ID)</label>
              <span className="text-[10px] text-rose-400 font-mono">Required</span>
            </div>
            <input
              id="input-roblox-universe-id"
              type="text"
              placeholder="e.g. 1234567890"
              value={universeId}
              onChange={(e) => { setUniverseId(e.target.value); onUpdateConfig({ universeId: e.target.value, placeId }); }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Found in your Creator Dashboard URL for the Experience</p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-medium">Place ID</label>
              <span className="text-[10px] text-rose-400 font-mono">Required</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="input-roblox-place-id"
                type="text"
                placeholder="e.g. 9876543210"
                value={placeId}
                onChange={(e) => { setPlaceId(e.target.value); onUpdateConfig({ universeId, placeId: e.target.value }); }}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Found in your Creator Dashboard under Places</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              id="btn-roblox-save-config"
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Save Configuration
            </button>
            {savedSuccess && <span className="text-xs text-emerald-400 font-medium">✓ Saved</span>}
          </div>

          <button
            id="btn-roblox-test-conn"
            type="button"
            onClick={() => onTestConnection()}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
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
            <span>Last Response / Activity Log:</span>
            {config.lastPublishedAt && (
              <span className="text-[11px] text-slate-500 font-mono">{config.lastPublishedAt}</span>
            )}
          </div>
          <div className="font-mono text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800/80 break-all text-[11px] leading-relaxed">
            {config.lastPublishMessage}
          </div>
          {config.rawApiDetails && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase text-slate-500 font-mono font-semibold">Diagnostic Payload:</span>
              <pre className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded overflow-x-auto font-mono">
                {config.rawApiDetails}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            id="btn-roblox-publish-now"
            type="button"
            onClick={() => onPublish(universeId, placeId)}
            disabled={isPublishing || validationErrorCount > 0}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold transition-colors shadow"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
            <span>
              {isPublishing
                ? 'Auto-creating Place & Publishing...'
                : autoCreatePlace
                ? 'Auto-Create Place & Publish'
                : 'Publish to Place'}
            </span>
          </button>

          <button
            id="btn-roblox-simulate-demo"
            type="button"
            onClick={() => onSimulatePublish()}
            disabled={isPublishing}
            className="flex items-center gap-2 py-2.5 px-4 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors border border-cyan-800/60"
            title="Test the complete auto-create and publishing flow with simulated responses"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Simulate Demo (Example Key)</span>
          </button>

          <button
            id="btn-roblox-export-fallback"
            type="button"
            onClick={() => onExport()}
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
