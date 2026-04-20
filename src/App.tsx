/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Translator from './components/Translator';
import HistoryPanel from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { TranslationRecord } from './types';
import { Moon, Sun, Globe2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [history, setHistory] = useLocalStorage<TranslationRecord[]>('translation_history', []);
  const [isDark, setIsDark] = useLocalStorage<boolean>('theme_dark', false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleTranslationComplete = (record: TranslationRecord) => {
    setHistory(prev => [record, ...prev]);
  };

  const handleClearHistory = () => {
    if (showClearConfirm) {
      setHistory([]);
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  const handleDeleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen transition-colors duration-500 relative font-sans selection:bg-indigo-500/30">
      
      {/* Premium Full-Screen Ambient Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full">
        {/* Light Mode Mesh */}
        <div className="absolute inset-0 bg-zinc-50 dark:opacity-0 transition-opacity duration-500" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 dark:opacity-0 animate-blob" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 dark:opacity-0 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 dark:opacity-0 animate-blob animation-delay-4000" />

        {/* Dark Mode Mesh */}
        <div className="absolute inset-0 bg-black opacity-0 dark:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[120px] opacity-0 dark:opacity-100 animate-blob" />
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/30 rounded-full mix-blend-screen filter blur-[120px] opacity-0 dark:opacity-100 animate-blob animation-delay-4000" />
      </div>

      {/* Floating Glass Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center p-4 md:p-6 pointer-events-none">
        <div className="max-w-5xl w-full flex items-center justify-between bg-white/70 dark:bg-black/50 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 shadow-sm rounded-2xl px-5 py-3 pointer-events-auto transition-all">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25">
               <Globe2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Lingo<span className="font-light text-zinc-500 dark:text-zinc-400">AI</span></h1>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors focus:ring-2 focus:ring-indigo-500/40"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-12 md:pt-40 md:pb-24">
        
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-6 border border-indigo-100 dark:border-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Next-Gen AI Translation</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 tracking-tight mb-6 drop-shadow-sm pb-1"
          >
            Speak Any Language.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            Break down global barriers instantly with real-time, highly accurate neural machine translation across 15+ major languages.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Translator onTranslationComplete={handleTranslationComplete} />
        </motion.div>

        <HistoryPanel 
          history={history} 
          onClear={handleClearHistory} 
          onDelete={handleDeleteItem}
          isConfirmingClear={showClearConfirm}
        />
        
      </main>
    </div>
  );
}
