import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GamePlan, ChatAttachment } from '../types';
import {
  Send,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  Loader2,
  Brain,
  ChevronDown,
  ChevronRight,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Copy,
  Check,
  Code,
  Zap,
  HelpCircle,
  Wand2
} from 'lucide-react';

interface AIChatProps {
  messages: ChatMessage[];
  currentPlan: GamePlan | null;
  stage: number;
  isGenerating: boolean;
  onSendMessage: (prompt: string, attachments?: ChatAttachment[]) => void;
  onApprovePlan: (plan: GamePlan) => void;
  onOpenCodeInEditor?: (filePath: string) => void;
  onClearChat?: () => void;
}

export function AIChat({
  messages,
  currentPlan,
  stage,
  isGenerating,
  onSendMessage,
  onApprovePlan,
  onOpenCodeInEditor,
  onClearChat
}: AIChatProps) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const processFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    fileList.forEach(file => {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image/');

      if (isImage) {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAttachments(prev => [
            ...prev,
            {
              id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: file.name,
              type: 'image',
              mimeType: file.type || 'image/png',
              data: result,
              size: file.size
            }
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAttachments(prev => [
            ...prev,
            {
              id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              name: file.name,
              type: 'file',
              mimeType: file.type || 'text/plain',
              data: result,
              size: file.size
            }
          ]);
        };
        reader.readAsText(file);
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      processFiles(e.clipboardData.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputPrompt.trim() && attachments.length === 0) || isGenerating) return;

    onSendMessage(inputPrompt.trim(), attachments);
    setInputPrompt('');
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const samplePrompts = [
    { label: 'Anime Simulator', text: 'Create an anime training simulator where players hit punch dummies, earn power, rebirth, and buy upgrades.' },
    { label: 'Daily Quests', text: 'Add a server-authoritative daily quest and streak reward system in Luau.' },
    { label: 'Demon Boss Dummy', text: 'Add a Demon World Boss dummy with 5,000 HP, health bar, and combat rewards.' },
    { label: 'Mobile Touch HUD', text: 'Design mobile-friendly touch controls and responsive ScreenGui layouts.' },
    { label: 'Explain DataStores', text: 'How do I safely save and load player leaderstats with DataStoreService and retry pcalls?' }
  ];

  const renderMessageContent = (content: string, msgId: string) => {
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textSegment = content.slice(lastIndex, match.index);
        segments.push(
          <div key={`text-${lastIndex}`} className="space-y-1 whitespace-pre-wrap leading-relaxed">
            {textSegment}
          </div>
        );
      }

      const lang = match[1] || 'luau';
      const code = match[2].trim();
      const codeId = `${msgId}-${match.index}`;
      const isCopied = copiedIndex === codeId;

      segments.push(
        <div key={`code-${codeId}`} className="my-2.5 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden font-mono text-[11px] shadow-sm">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-cyan-400">
              <Code className="w-3.5 h-3.5" />
              <span>{lang || 'Luau'}</span>
            </span>
            <button
              id={`btn-copy-code-${codeId}`}
              type="button"
              onClick={() => handleCopyCode(code, codeId)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[10px]"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3 overflow-x-auto text-slate-200 text-[11.5px] leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      segments.push(
        <div key={`text-${lastIndex}`} className="space-y-1 whitespace-pre-wrap leading-relaxed">
          {content.slice(lastIndex)}
        </div>
      );
    }

    return segments;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative ${
        isDragging ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-950/20' : ''
      }`}
    >
      {isDragging && (
        <div className="absolute inset-0 z-40 bg-indigo-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white border-2 border-dashed border-indigo-400 m-2 rounded-lg pointer-events-none">
          <ImageIcon className="w-12 h-12 text-indigo-300 animate-bounce mb-2" />
          <p className="text-sm font-bold">Drop your image or Luau scripts here</p>
          <p className="text-xs text-indigo-300">Fast vision & file multimodal analysis</p>
        </div>
      )}

      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Roblox AI Assistant</h3>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono font-bold">Vision + Fast Luau</span>
            </div>
            <p className="text-[11px] text-slate-400">Freeform Chat, Script Analysis & Full Experience Architect</p>
          </div>
        </div>

        {onClearChat && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow transition-colors"
            title="Start New Chat"
          >
            <Sparkles className="w-3.5 h-3.5" />
            New Chat
          </button>
        )}
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

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'ml-auto justify-end' : 'mr-auto'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-md bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`rounded-lg p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white max-w-2xl shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 w-full shadow-sm'
              }`}
            >
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-2.5 flex flex-wrap gap-2">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-1.5 rounded-md bg-black/30 border border-white/10 text-[11px]"
                    >
                      {att.type === 'image' ? (
                        <img
                          src={att.data}
                          alt={att.name}
                          onClick={() => setPreviewImage(att.data)}
                          className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-90 border border-white/20 transition-opacity"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-cyan-300 shrink-0" />
                      )}
                      <div className="min-w-0 pr-1">
                        <div className="font-semibold truncate max-w-[120px]">{att.name}</div>
                        {att.size && (
                          <div className="text-[9px] opacity-70">
                            {(att.size / 1024).toFixed(1)} KB
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.sender === 'ai' && (msg.thinking || msg.isThinking) && (
                <div className="mb-3">
                  {(() => {
                    const isThinkingExpanded = expandedThinking[msg.id] !== undefined
                      ? expandedThinking[msg.id]
                      : (msg.isThinking || !msg.content);

                    return (
                      <>
                        <button
                          type="button"
                          id={`btn-toggle-thinking-${msg.id}`}
                          onClick={() => toggleThinking(msg.id)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-950/90 hover:bg-slate-950 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {msg.isThinking ? (
                              <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
                              </div>
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            )}
                            <span className="flex items-center gap-1.5 font-semibold text-indigo-200 shrink-0">
                              <Brain className="w-3.5 h-3.5 text-indigo-400" />
                              {msg.isThinking ? 'Reasoning Live…' : 'Thought Process'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-indigo-400/80 group-hover:text-indigo-300 shrink-0 ml-2">
                            <span>{isThinkingExpanded ? 'Hide' : 'View'}</span>
                            {isThinkingExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </button>

                        {isThinkingExpanded && (
                          <div className="mt-1.5 p-2.5 rounded-md bg-slate-950 border border-slate-800/90 text-[11px] text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                            {msg.thinking || 'Synthesizing Luau architecture and logic...'}
                            {msg.isThinking && (
                              <span className="inline-block w-1.5 h-3 bg-indigo-400 ml-1 animate-pulse align-middle" />
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {msg.content ? (
                <div className="space-y-2">
                  {renderMessageContent(msg.content, msg.id)}
                  {msg.isStreaming && (
                    <span className="inline-block w-2 h-3.5 bg-indigo-400 ml-1 animate-pulse align-middle" />
                  )}
                </div>
              ) : msg.isThinking ? (
                <div className="text-slate-400 italic text-[11px] flex items-center gap-1.5 py-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>Synthesizing response...</span>
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
                      <div className="text-[11px] font-semibold text-cyan-300 mb-1">Remotes:</div>
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
                      <button
                        key={path}
                        type="button"
                        onClick={() => onOpenCodeInEditor?.(path)}
                        className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono transition-colors text-left"
                        title="Click to view in Editor"
                      >
                        {path}
                      </button>
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
              <span>AI is generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-900/95 border-t border-slate-800 shrink-0">
        {messages.length <= 2 && (
          <div className="mb-2">
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Quick Prompt Suggestions:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {samplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputPrompt(item.text)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition-colors border border-slate-700/60 shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                {att.type === 'image' ? (
                  <img src={att.data} alt={att.name} className="w-6 h-6 object-cover rounded" />
                ) : (
                  <FileText className="w-4 h-4 text-cyan-400" />
                )}
                <span className="truncate max-w-[120px] font-mono text-[11px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,.lua,.luau,.txt,.json,.md"
            className="hidden"
          />

          <div className="flex gap-1 shrink-0 pb-1">
            <button
              id="btn-chat-attach-file"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isGenerating}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Attach Images or Luau script files"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="input-ai-prompt"
              rows={1}
              placeholder="Chat freely with AI, paste screenshots, ask Luau scripting questions, or describe a Roblox game..."
              value={inputPrompt}
              onChange={adjustTextareaHeight}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={isGenerating}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none max-h-40 leading-relaxed"
            />
          </div>

          <button
            id="btn-send-ai-prompt"
            type="submit"
            disabled={(!inputPrompt.trim() && attachments.length === 0) || isGenerating}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 pb-2 h-9"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-slate-700 object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-white hover:bg-rose-600 transition-colors shadow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
