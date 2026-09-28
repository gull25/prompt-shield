import { useEffect } from 'react';

export function TopNav() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
<header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0b0f17]/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      
      <div className="flex items-center gap-3 sm:gap-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 p-[1px] shadow-glow-cyan flex items-center justify-center">
            <div className="h-full w-full bg-[#0d131f] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <i data-lucide="shield-check" className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors"></i>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">Prompt<span className="text-cyan-400">Shield</span></span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider font-mono bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 rounded">Gateway v1.4</span>
            </div>
          </div>
        </a>

        <div className="h-5 w-[1px] bg-slate-800 hidden md:block"></div>

        
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-semibold">Gateway Online</span>
          <span className="hidden lg:inline text-emerald-500/70 font-mono text-[10px] pl-1 border-l border-emerald-800/60">us-east-1 (Groq + Claude 3.5)</span>
        </div>
      </div>

      
      <div className="flex items-center gap-2 sm:gap-3">
        
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
          <i data-lucide="activity" className="w-3.5 h-3.5 text-cyan-400"></i>
          <span>Sampling 10,480 reqs/hr</span>
        </div>

        
        <button id="clearCacheBtn" onclick="triggerClearCacheModal()" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 hover:border-rose-700/60 rounded-lg transition-all active:scale-95">
          <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
          <span className="hidden sm:inline">Clear Cache</span>
        </button>

        
        <button id="themeToggleBtn" onclick="toggleTheme()" className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors" title="Toggle dark/light mode">
          <i data-lucide="sun" className="w-4 h-4 hidden dark:block text-amber-300"></i>
          <i data-lucide="moon" className="w-4 h-4 block dark:hidden text-slate-700"></i>
        </button>

        
        <button onclick="toggleMobileNav()" className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg md:hidden">
          <i data-lucide="menu" id="mobileMenuIcon" className="w-4 h-4"></i>
        </button>
      </div>
    </div>

    
    <div id="mobileNavDrawer" className="hidden md:hidden pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2 pb-1 text-sm font-medium">
      <div className="flex items-center justify-between py-1 px-2 text-xs text-slate-400 font-mono">
        <span>Active Upstream: Groq / Anthropic</span>
        <span className="text-emerald-400 font-bold">12ms avg hit</span>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <a href="#analytics" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs">
          <i data-lucide="bar-chart-3" className="w-3.5 h-3.5 text-cyan-400"></i> Overview
        </a>
        <a href="#playground" className="flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs">
          <i data-lucide="terminal" className="w-3.5 h-3.5 text-cyan-400"></i> Live Tester
        </a>
      </div>
    </div>
  </header>
    </>
  );
}
