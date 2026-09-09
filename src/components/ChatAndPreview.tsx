import React, { useState } from 'react';
import { AIChat } from './AIChat';
import { Web3DPreview } from './Web3DPreview';
import { ChatMessage, GamePlan, PreviewElement } from '../types';
import {
  Sparkles,
  Box,
  Columns,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Sliders
} from 'lucide-react';

interface ChatAndPreviewProps {
  messages: ChatMessage[];
  currentPlan: GamePlan | null;
  stage: number;
  isGenerating: boolean;
  onSendMessage: (prompt: string) => void;
  onApprovePlan: (plan: GamePlan) => void;
  previewElements: PreviewElement[];
  projectName?: string;
}

export function ChatAndPreview({
  messages,
  currentPlan,
  stage,
  isGenerating,
  onSendMessage,
  onApprovePlan,
  previewElements,
  projectName = 'Roblox Game'
}: ChatAndPreviewProps) {
  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'preview' | 'split'>('split');
  const [splitRatio, setSplitRatio] = useState<'50-50' | '40-60' | '60-40'>('50-50');
  const [fullscreenPane, setFullscreenPane] = useState<'none' | 'chat' | 'preview'>('none');

  const getChatWidthClass = () => {
    if (fullscreenPane === 'chat') return 'w-full h-full';
    if (fullscreenPane === 'preview') return 'hidden';
    if (splitRatio === '40-60') return 'w-full lg:w-[40%]';
    if (splitRatio === '60-40') return 'w-full lg:w-[60%]';
    return 'w-full lg:w-1/2';
  };

  const getPreviewWidthClass = () => {
    if (fullscreenPane === 'preview') return 'w-full h-full';
    if (fullscreenPane === 'chat') return 'hidden';
    if (splitRatio === '40-60') return 'w-full lg:w-[60%]';
    if (splitRatio === '60-40') return 'w-full lg:w-[40%]';
    return 'w-full lg:w-1/2';
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-slate-950 p-2 sm:p-3 gap-2">
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Columns className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs font-bold text-slate-200">Chat + 3D Preview</h2>
            <span className="hidden md:inline text-[11px] text-slate-400 font-mono">
              Live AI Luau Architecture & Instant 3D World Feedback
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex md:hidden items-center bg-slate-950 p-0.5 rounded-md border border-slate-800">
            <button
              id="btn-mobile-tab-chat"
              type="button"
              onClick={() => setActiveTabMobile('chat')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                activeTabMobile === 'chat'
                  ? 'bg-indigo-600 text-white font-medium shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Chat</span>
            </button>
            <button
              id="btn-mobile-tab-split"
              type="button"
              onClick={() => setActiveTabMobile('split')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                activeTabMobile === 'split'
                  ? 'bg-indigo-600 text-white font-medium shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Columns className="w-3 h-3 text-indigo-300" />
              <span>Split</span>
            </button>
            <button
              id="btn-mobile-tab-preview"
              type="button"
              onClick={() => setActiveTabMobile('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                activeTabMobile === 'preview'
                  ? 'bg-indigo-600 text-white font-medium shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3 h-3 text-emerald-400" />
              <span>3D</span>
            </button>
          </div>

          <div className="hidden md:flex items-center bg-slate-950 p-0.5 rounded-md border border-slate-800">
            <button
              id="btn-ratio-50-50"
              type="button"
              onClick={() => {
                setFullscreenPane('none');
                setSplitRatio('50-50');
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                fullscreenPane === 'none' && splitRatio === '50-50'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split 50% Chat / 50% 3D Preview"
            >
              50 / 50
            </button>
            <button
              id="btn-ratio-40-60"
              type="button"
              onClick={() => {
                setFullscreenPane('none');
                setSplitRatio('40-60');
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                fullscreenPane === 'none' && splitRatio === '40-60'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Wide 3D Preview (40% Chat / 60% Preview)"
            >
              40 / 60
            </button>
            <button
              id="btn-ratio-60-40"
              type="button"
              onClick={() => {
                setFullscreenPane('none');
                setSplitRatio('60-40');
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                fullscreenPane === 'none' && splitRatio === '60-40'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Wide Chat (60% Chat / 40% Preview)"
            >
              60 / 40
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-focus-chat"
              type="button"
              onClick={() => setFullscreenPane(fullscreenPane === 'chat' ? 'none' : 'chat')}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                fullscreenPane === 'chat'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={fullscreenPane === 'chat' ? 'Restore Split View' : 'Maximize Chat'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              id="btn-focus-preview"
              type="button"
              onClick={() => setFullscreenPane(fullscreenPane === 'preview' ? 'none' : 'preview')}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                fullscreenPane === 'preview'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title={fullscreenPane === 'preview' ? 'Restore Split View' : 'Maximize 3D Preview'}
            >
              <Box className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-2 min-h-0 overflow-hidden">
        <div
          className={`${getChatWidthClass()} ${
            activeTabMobile === 'preview' ? 'hidden lg:flex' : 'flex'
          } ${
            activeTabMobile === 'split' ? 'h-1/2 lg:h-full' : 'h-full'
          } flex-col min-h-0 overflow-hidden rounded-lg`}
        >
          <AIChat
            messages={messages}
            currentPlan={currentPlan}
            stage={stage}
            isGenerating={isGenerating}
            onSendMessage={onSendMessage}
            onApprovePlan={onApprovePlan}
          />
        </div>

        <div
          className={`${getPreviewWidthClass()} ${
            activeTabMobile === 'chat' ? 'hidden lg:flex' : 'flex'
          } ${
            activeTabMobile === 'split' ? 'h-1/2 lg:h-full' : 'h-full'
          } flex-col min-h-0 overflow-hidden rounded-lg border border-slate-800`}
        >
          <Web3DPreview elements={previewElements} />
        </div>
      </div>
    </div>
  );
}
