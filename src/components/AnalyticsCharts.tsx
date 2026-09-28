export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Area Chart Container */}
      <div className="lg:col-span-2 bg-[#111726] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-cyan-500/10 transition-colors duration-700"></div>
        <h3 className="text-sm font-semibold text-slate-300 mb-6 font-sans flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Traffic & Cache Performance
        </h3>
        
        {/* Responsive Custom SVG Container */}
        <div className="h-[200px] sm:h-[260px] lg:h-[320px] w-full relative">
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradientEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Grid Lines */}
              <g stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4">
                <line x1="0" y1="50" x2="800" y2="50" />
                <line x1="0" y1="125" x2="800" y2="125" />
                <line x1="0" y1="200" x2="800" y2="200" />
                <line x1="0" y1="275" x2="800" y2="275" />
              </g>

              {/* Data Layers */}
              {/* Fallback Misses */}
              <path d="M0,275 L100,240 L200,260 L300,180 L400,220 L500,150 L600,210 L700,250 L800,275 L800,300 L0,300 Z" fill="url(#gradientEmerald)" />
              <path d="M0,275 L100,240 L200,260 L300,180 L400,220 L500,150 L600,210 L700,250 L800,275" fill="none" stroke="#34d399" strokeWidth="3" filter="url(#glow)" />
              
              {/* Cache Hits */}
              <path d="M0,250 L100,180 L200,220 L300,90 L400,140 L500,40 L600,120 L700,190 L800,220 L800,300 L0,300 Z" fill="url(#gradientCyan)" />
              <path d="M0,250 L100,180 L200,220 L300,90 L400,140 L500,40 L600,120 L700,190 L800,220" fill="none" stroke="#22d3ee" strokeWidth="4" filter="url(#glow)" className="group-hover:stroke-white transition-colors duration-300" />
            </svg>
          </div>
          
          {/* X Axis Labels */}
          <div className="absolute bottom-0 w-full flex justify-between text-[10px] sm:text-xs text-slate-500 font-mono transform translate-y-6">
            <span>00:00</span>
            <span className="hidden sm:inline">04:00</span>
            <span>08:00</span>
            <span className="hidden sm:inline">12:00</span>
            <span>16:00</span>
            <span className="hidden sm:inline">20:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>

      {/* Pie Chart Container */}
      <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative group overflow-hidden">
        <h3 className="text-sm font-semibold text-slate-300 mb-6 font-sans flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          Resolution Source
        </h3>
        <div className="h-[200px] sm:h-[260px] lg:h-[320px] w-full flex items-center justify-center relative">
          <svg className="w-full h-full transform -rotate-90 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
            {/* Fallback Ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#34d399" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="210" className="group-hover:stroke-emerald-300 transition-colors" />
            {/* Cache Ring */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="44" className="group-hover:stroke-cyan-300 transition-colors" />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">82%</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Hits</span>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="text-xs sm:text-sm text-slate-300">Semantic Hits</span>
            </div>
            <span className="text-xs sm:text-sm font-mono text-slate-100">82.4%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-xs sm:text-sm text-slate-300">LLM Fallback</span>
            </div>
            <span className="text-xs sm:text-sm font-mono text-slate-100">17.6%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
