import React, { useState, useEffect, useRef } from 'react';
import { PATCH_NOTES } from '../data/patchNotes';
import { Sparkles, X, ChevronUp, ChevronDown, Check, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface PatchNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatchNotesModal({ isOpen, onClose }: PatchNotesModalProps) {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoScroll) {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      return;
    }

    scrollIntervalRef.current = window.setInterval(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
          el.scrollTop = 0;
        } else {
          el.scrollTop += 1.5;
        }
      }
    }, 40);

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [autoScroll]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden text-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">What's New — Update Patch Notes</h2>
              <p className="text-xs text-slate-400">Roblox AI Studio Changelog & Release Notes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-patch-auto-scroll"
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-colors border ${
                autoScroll
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Auto-Scroll through historical versions"
            >
              {autoScroll ? <ArrowDownCircle className="w-3.5 h-3.5 text-indigo-400 animate-bounce" /> : <ArrowDownCircle className="w-3.5 h-3.5" />}
              <span>{autoScroll ? 'Auto-Scrolling' : 'Auto Scroll'}</span>
            </button>

            <button
              id="btn-patch-modal-close"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 text-xs divide-y divide-slate-800/80"
        >
          {PATCH_NOTES.map((patch, idx) => (
            <div key={patch.version} className={idx === 0 ? '' : 'pt-6'}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                    {patch.version}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{patch.date}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      patch.tag === 'Major'
                        ? 'bg-purple-950 text-purple-300 border border-purple-800'
                        : patch.tag === 'Feature'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {patch.tag}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-slate-100 mb-2">{patch.title}</h3>

              <div className="space-y-1.5 mb-3">
                {patch.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/70 p-3 rounded-md border border-slate-800 text-slate-400 text-[11px] leading-relaxed space-y-1">
                {patch.details.map((detail, dIdx) => (
                  <p key={dIdx}>• {detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Scroll up or down to inspect earlier versions.
          </span>
          <button
            id="btn-patch-modal-confirm"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow"
          >
            Got it, Let's Build!
          </button>
        </div>
      </div>
    </div>
  );
}
