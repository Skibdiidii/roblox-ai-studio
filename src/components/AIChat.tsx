import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GamePlan } from '../types';
import { Send, Bot, User, Sparkles, CheckCircle2, ArrowRight, Loader2, PlayCircle, Layers, Brain, ChevronDown, ChevronRight } from 'lucide-react';

interface AIChatProps {
  messages: ChatMessage[];
  currentPlan: GamePlan | null;
  stage: number;
  isGenerating: boolean;
  onSendMessage: (prompt: string) => void;
  onApprovePlan: (plan: GamePlan) => void;
}

export function AIChat({
  messages,
  currentPlan,
  stage,
  isGenerating,
  onSendMessage,
  onApprovePlan
}: AIChatProps) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleThinking = (msgId: string) => {
    setExpandedThinking(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isGenerating) return;
    onSendMessage(inputPrompt.trim());
    setInputPrompt('');
  };

  const samplePrompts = [
    'Create an anime simulator where players train by attacking dummies, earn power, buy upgrades, rebirth, and climb leaderboards.',
    'Add quests and a daily reward streak.',
    'Add a Demon Boss dummy that has 5000 HP and attacks players.',
    'Make the UI mobile friendly with larger action buttons.',
    'Add a rebirth system with 2.5x exponential power multipliers.'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Game Generator</h3>
            <p className="text-[11px] text-slate-400">Luau Architecture & Roblox Game Designer</p>
          </div>
        </div>

        {stage < 4 && currentPlan && (
          <button
            id="btn-approve-plan-header"
            onClick={() => onApprovePlan(currentPlan)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve & Generate Files</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`rounded-lg p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white max-w-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 w-full'
              }`}
            >
              {msg.sender === 'ai' && (msg.thinking || msg.isThinking) && (
                <div className="mb-3">
                  <button
                    type="button"
                    id={`btn-toggle-thinking-${msg.id}`}
                    onClick={() => toggleThinking(msg.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-950/90 hover:bg-slate-950 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {msg.isThinking ? (
                        <div className="relative flex items-center justify-center w-2.5 h-2.5">
                          <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                        </div>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span className="flex items-center gap-1.5 font-semibold text-indigo-200">
                        <Brain className="w-3.5 h-3.5 text-indigo-400" />
                        {msg.isThinking ? 'Thinking…' : 'Thought Process'}
                      </span>
                      {msg.isThinking && (
                        <span className="text-[10px] text-indigo-400/80 font-mono animate-pulse">
                          (reasoning live)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-indigo-400/80 group-hover:text-indigo-300">
                      <span>{expandedThinking[msg.id] ? 'Hide thinking' : 'View thinking'}</span>
                      {expandedThinking[msg.id] ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </button>

                  {expandedThinking[msg.id] && (
                    <div className="mt-1.5 p-2.5 rounded-md bg-slate-950 border border-slate-800/90 text-[11px] text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {msg.thinking || 'Reasoning about Luau architecture and game systems...'}
                      {msg.isThinking && (
                        <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-1 animate-pulse align-middle" />
                      )}
                    </div>
                  )}
                </div>
              )}

              {msg.content ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : msg.isThinking ? (
                <div className="text-slate-400 italic text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>Generating response...</span>
                </div>
              ) : null}

              {msg.plan && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300 text-sm">{msg.plan.title}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-[10px] text-indigo-400 font-mono">
                      {msg.plan.genre}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
                    <div className="text-[11px] font-semibold text-slate-300 mb-1">Gameplay Loop:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                      {msg.plan.gameplayLoop.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <div className="text-[11px] font-semibold text-amber-300 mb-1">Systems:</div>
                      {msg.plan.gameSystems.map((s, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300">
                          • <strong>{s.name}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60">
                      <div className="text-[11px] font-semibold text-cyan-300 mb-1">Remotes & Storage:</div>
                      <div className="text-[11px] text-slate-300">
                        {msg.plan.remotes.map(r => r.name).join(', ')}
                      </div>
                    </div>
                  </div>

                  {stage < 4 && (
                    <div className="pt-2">
                      <button
                        id="btn-approve-plan-message"
                        onClick={() => onApprovePlan(msg.plan!)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Game Plan & Build Files</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {msg.modifiedFiles && msg.modifiedFiles.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="font-semibold text-slate-300 mb-1">Modified Files:</div>
                  <div className="flex flex-wrap gap-1">
                    {msg.modifiedFiles.map(path => (
                      <span key={path} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-mono">
                        {path}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && !messages.some(m => m.isStreaming || m.isThinking) && (
          <div className="flex gap-3 mr-auto">
            <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse text-indigo-400" />
              <span>AI is generating Roblox Luau code and architecture...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        {messages.length <= 2 && (
          <div className="mb-2">
            <div className="text-[11px] text-slate-400 font-medium mb-1.5">Try a prompt:</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputPrompt(p)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors border border-slate-700/60"
                >
                  {p.length > 42 ? p.substring(0, 42) + '...' : p}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            id="input-ai-prompt"
            type="text"
            placeholder={
              stage < 3
                ? "Describe your game idea (e.g. 'Create an anime simulator...')"
                : "Ask AI to modify your game (e.g. 'Add quests', 'Add a boss dummy', 'Make UI mobile friendly')..."
            }
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            id="btn-send-ai-prompt"
            type="submit"
            disabled={!inputPrompt.trim() || isGenerating}
            className="px-3.5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
