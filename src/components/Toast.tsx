import React, { useEffect } from 'react';
import { useAudio } from '../context/AudioContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useAudio();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 3200);

    return () => clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 text-white text-xs font-medium rounded-xl border border-white/10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      <span>{toastMessage}</span>
      <button
        onClick={clearToast}
        className="p-1 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
