import { useState } from 'react';
import { LANGUAGES } from '../constants';
import { translateText } from '../services/gemini';
import { Copy, Volume2, ArrowRightLeft, Loader2, Check, Trash2 } from 'lucide-react';
import type { TranslationRecord } from '../types';

interface TranslatorProps {
  onTranslationComplete: (record: TranslationRecord) => void;
}

export default function Translator({ onTranslationComplete }: TranslatorProps) {
  const [sourceLang, setSourceLang] = useState<string>('auto');
  const [targetLang, setTargetLang] = useState<string>('es');
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [copied, setCopied] = useState<boolean>(false);
  
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    setError(null);
    setIsTranslating(true);
    
    try {
      const sourceName = sourceLang === 'auto' ? 'Auto Detect' : LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang;
      const targetName = LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
      
      const result = await translateText(sourceText, sourceName, targetName);
      setTranslatedText(result);
      
      const newRecord: TranslationRecord = {
        id: Date.now().toString(),
        sourceText,
        translatedText: result,
        sourceLang,
        targetLang,
        timestamp: Date.now()
      };
      onTranslationComplete(newRecord);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred during translation.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang !== 'auto') {
      const tempLang = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(tempLang);
      
      const tempText = sourceText;
      setSourceText(translatedText);
      setTranslatedText(tempText);
    }
  };

  const copyToClipboard = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const playTTS = (text: string, lang: string) => {
    if (!text) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'auto' ? 'en' : lang; // Fallback to en if auto
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}
      <div className="bg-white/70 dark:bg-[#111111]/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/60 dark:border-white/5 overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Top Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-black/20 p-3 md:p-4 gap-3">
          
          <div className="flex-1 px-2">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full md:max-w-[220px] bg-transparent font-bold text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-0 rounded-lg px-2 py-1.5 cursor-pointer appearance-none transition-colors border-none"
            >
              <option value="auto" className="bg-white dark:bg-zinc-900">Auto Detect</option>
              {LANGUAGES.map(l => (
                <option key={`source-${l.code}`} value={l.code} className="bg-white dark:bg-zinc-900">{l.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center -my-2 md:my-0 z-10 px-2 py-1 md:py-0">
            <button
              onClick={handleSwap}
              disabled={sourceLang === 'auto'}
              className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-white/5 rounded-full p-3 hover:bg-white dark:hover:bg-zinc-700 transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed group text-zinc-600 dark:text-zinc-400"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-all duration-500" />
            </button>
          </div>

          <div className="flex-1 px-2 text-right">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full md:max-w-[280px] bg-transparent font-bold text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-0 rounded-lg px-2 py-1.5 cursor-pointer appearance-none transition-colors border-none"
              dir="auto"
            >
              {LANGUAGES.map(l => (
                <option key={`target-${l.code}`} value={l.code} className="bg-white dark:bg-zinc-900">{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-white/5 relative">
          
          {/* Source Area */}
          <div className="flex flex-col relative bg-transparent group h-[300px] md:h-[360px]">
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Type or paste text..."
              className="flex-1 w-full resize-none bg-transparent p-6 md:p-8 outline-none text-2xl md:text-3xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 font-medium"
              dir="auto"
            />
            {sourceText && (
              <button 
                onClick={() => setSourceText('')}
                className="absolute top-6 right-6 text-zinc-300 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                title="Clear text"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            
            {/* Source Footer */}
            <div className="flex items-center justify-between p-6 mt-auto">
               <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
                 <button onClick={() => playTTS(sourceText, sourceLang)} className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-30" disabled={!sourceText} title="Listen">
                   <Volume2 className="w-6 h-6" />
                 </button>
               </div>
               <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                 {sourceText.length} characters
               </div>
            </div>
          </div>

          {/* Target Area */}
          <div className="flex flex-col relative bg-indigo-50/30 dark:bg-zinc-900/40 h-[300px] md:h-[360px]">
            {isTranslating && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-black/40 backdrop-blur-sm transition-all duration-300">
                 <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
              </div>
            )}
            <textarea
              readOnly
              value={translatedText}
              placeholder="Translation will appear here..."
              className="flex-1 w-full resize-none bg-transparent p-6 md:p-8 outline-none text-2xl md:text-3xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-300 dark:placeholder-zinc-700 font-medium"
              dir="auto"
            />
            
            {/* Target Footer */}
            <div className="flex items-center justify-between p-6 mt-auto">
               <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500">
                 <button onClick={() => playTTS(translatedText, targetLang)} className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-30" disabled={!translatedText} title="Listen">
                   <Volume2 className="w-6 h-6" />
                 </button>
                 <button onClick={copyToClipboard} className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors disabled:opacity-30" disabled={!translatedText} title="Copy translation">
                   {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                 </button>
               </div>
            </div>
          </div>

        </div>

      </div>
      
      <div className="flex justify-center mt-8 relative z-20">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="relative group overflow-hidden rounded-full p-[2px] disabled:opacity-60 disabled:cursor-not-allowed transform transition-all active:scale-95"
        >
          {/* Animated Gradient Border */}
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:opacity-100 opacity-80 animate-spin-slow rounded-full blur-[2px]" />
          
          <div className="relative bg-white dark:bg-black px-12 py-4 rounded-full flex items-center gap-3 transition-all group-hover:bg-opacity-0">
             {isTranslating ? (
               <Loader2 className="w-5 h-5 animate-spin text-indigo-500 group-hover:text-white" />
             ) : null}
             <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:text-white group-hover:bg-none transition-all text-xl tracking-wide">
               {isTranslating ? 'Translating...' : 'Translate text'}
             </span>
          </div>
        </button>
      </div>
    </div>
  );
}
