import { TranslationRecord } from '../types';
import { LANGUAGES } from '../constants';
import { Copy, Check, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function HistoryPanel({ 
  history, 
  onClear, 
  onDelete,
  isConfirmingClear
}: { 
  history: TranslationRecord[]; 
  onClear: () => void;
  onDelete: (id: string) => void;
  isConfirmingClear: boolean;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getLangName = (code: string) => {
    if (code === 'auto') return 'Auto';
    return LANGUAGES.find(l => l.code === code)?.name || code;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {}
  };

  if (!history || history.length === 0) return null;

  // Show up to 9 most recent translations
  const recentHistory = [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 9);

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 mb-8 relative z-10">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-800 dark:text-zinc-100 tracking-tight">
          <Clock className="w-5 h-5 text-indigo-500" />
          Recent Translations
        </h3>
        <button 
          onClick={onClear}
          className={`text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
            isConfirmingClear 
              ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700" 
              : "text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
          }`}
        >
           <Trash2 className="w-4 h-4" />
           {isConfirmingClear ? "Click again to confirm" : "Clear"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {recentHistory.map((record) => (
          <div key={record.id} className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-none flex flex-col gap-4 transition-all hover:scale-[1.02] hover:bg-white dark:hover:bg-zinc-900 group">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
              <div className="flex items-center gap-1.5 text-indigo-600/90 dark:text-indigo-400">
                <span>{getLangName(record.sourceLang)}</span>
                <span className="text-zinc-300 dark:text-zinc-600">→</span>
                <span>{getLangName(record.targetLang)}</span>
              </div>
              <span className="text-zinc-400/80 dark:text-zinc-500/80">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            
            <div className="flex-1 mt-1">
              <p className="text-zinc-500 dark:text-zinc-400 text-[15px] line-clamp-2 md:line-clamp-3 mb-2 font-medium">
                {record.sourceText}
              </p>
              <p className="text-zinc-800 dark:text-zinc-100 font-semibold text-[15px] leading-relaxed line-clamp-2 md:line-clamp-4">
                {record.translatedText}
              </p>
            </div>
            
            <div className="flex flex-row-reverse items-center justify-between mt-2 pt-4 border-t border-zinc-100/80 dark:border-zinc-800/80">
              <div className="flex gap-2">
                <button 
                  onClick={() => onDelete(record.id)}
                  className="text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-500/20 p-2.5 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => copyToClipboard(record.translatedText, record.id)}
                  className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-zinc-50 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 p-2.5 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  title="Copy Translation"
                >
                  {copiedId === record.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
