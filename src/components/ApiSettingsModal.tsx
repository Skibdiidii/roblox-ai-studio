import React, { useState } from 'react';
import { ApiSettings } from '../types';
import { Key, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles, Shield, Cpu, RefreshCw, X, Bot } from 'lucide-react';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
}

export function ApiSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings
}: ApiSettingsModalProps) {
  const [provider, setProvider] = useState<'mistral' | 'gemini'>(settings.provider || 'mistral');
  const [mistralKey, setMistralKey] = useState(settings.mistralApiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [robloxKey, setRobloxKey] = useState(settings.robloxApiKey || '');
  const [model, setModel] = useState(settings.preferredModel || 'codestral-latest');
  const [showMistralKey, setShowMistralKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showRobloxKey, setShowRobloxKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          mistralApiKey: mistralKey,
          geminiApiKey: geminiKey,
          preferredModel: model
        })
      });

      const data = await response.json();
      if (response.ok && data.ok) {
        setTestResult({
          success: true,
          message: data.message || 'API key verified and connected successfully!'
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Authentication failed. Please verify your credentials.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Network error verifying key: ${err.message}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      provider,
      mistralApiKey: mistralKey.trim(),
      geminiApiKey: geminiKey.trim(),
      robloxApiKey: robloxKey.trim(),
      preferredModel: model
    });
    onClose();
  };

  const handleReset = () => {
    setProvider('mistral');
    setMistralKey('');
    setGeminiKey('');
    setRobloxKey('');
    setModel('codestral-latest');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">API Key & Engine Settings</h2>
              <p className="text-xs text-slate-400">Configure Mistral AI, Gemini, and Roblox Open Cloud credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Active AI Provider</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvider('mistral');
                  setModel('codestral-latest');
                  setTestResult(null);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  provider === 'mistral'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Mistral AI (Codestral)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvider('gemini');
                  setModel('gemini-3.1-flash-lite');
                  setTestResult(null);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                  provider === 'gemini'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Google Gemini</span>
              </button>
            </div>
          </div>

          {provider === 'mistral' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mistral AI API Key</span>
                </label>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  mistralKey
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {mistralKey ? 'Custom Key' : 'Connected'}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showMistralKey ? 'text' : 'password'}
                  value={mistralKey}
                  onChange={(e) => {
                    setMistralKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="B4uCaEJo9ZCuZo... (Leave blank to use preconfigured key)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 pr-20 text-xs text-slate-200 font-mono focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowMistralKey(!showMistralKey)}
                  className="absolute right-2 text-slate-400 hover:text-slate-200 p-1"
                  title={showMistralKey ? 'Hide key' : 'Show key'}
                >
                  {showMistralKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400">
                  Powers Codestral Luau generation, architecture planning, and Pixtral vision.
                </p>
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestKey}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 shrink-0"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Test Key</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Google Gemini API Key</span>
                </label>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  geminiKey
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {geminiKey ? 'Custom Key' : 'System Default'}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="AIzaSy... (Leave blank to use system key)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 pr-20 text-xs text-slate-200 font-mono focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-2 text-slate-400 hover:text-slate-200 p-1"
                  title={showGeminiKey ? 'Hide key' : 'Show key'}
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-slate-400">
                  Alternative Gemini AI reasoning backend.
                </p>
                <button
                  type="button"
                  disabled={isTesting}
                  onClick={handleTestKey}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 shrink-0"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Test Key</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {testResult && (
            <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
              testResult.success
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Reasoning Model</span>
              </label>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none transition-colors"
            >
              {provider === 'mistral' ? (
                <>
                  <option value="codestral-latest">codestral-latest (Specialist in Luau Scripting & Code Generation)</option>
                  <option value="open-mistral-nemo">open-mistral-nemo (Fast & Intelligent General Architecture)</option>
                  <option value="pixtral-12b-2409">pixtral-12b-2409 (Multimodal Vision & UI Inspector)</option>
                  <option value="ministral-8b-latest">ministral-8b-latest (Ultra Low Latency & High Speed)</option>
                </>
              ) : (
                <>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency & High Availability)</option>
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Standard High Performance Flash)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Complex Reasoning)</option>
                </>
              )}
            </select>
            <p className="text-[11px] text-slate-400">
              The AI model used for code synthesis, game planning, and code actions.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Roblox Open Cloud API Key</span>
              </label>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                robloxKey
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {robloxKey ? 'Custom Key' : 'Not Set'}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showRobloxKey ? 'text' : 'password'}
                value={robloxKey}
                onChange={(e) => setRobloxKey(e.target.value)}
                placeholder="Roblox Open Cloud API Key..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 pr-20 text-xs text-slate-200 font-mono focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowRobloxKey(!showRobloxKey)}
                className="absolute right-2 text-slate-400 hover:text-slate-200 p-1"
                title={showRobloxKey ? 'Hide key' : 'Show key'}
              >
                {showRobloxKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Create an API key in the Roblox Creator Dashboard with permissions for Universe & Place Publishing.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Reset Defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
