import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('24h');
  const [playgroundPrompt, setPlaygroundPrompt] = useState("How do I change my password?");
  const [playgroundResult, setPlaygroundResult] = useState<any>(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  
  const [logs, setLogs] = useState<any[]>([]);
  const [logFilter, setLogFilter] = useState<'all' | 'hit' | 'miss'>('all');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  
  const [stats, setStats] = useState({
    totalRequests: 0,
    cacheHits: 0,
    cacheHitRate: 0,
    totalCostSavedUSD: 0,
    avgHitLatencyMs: 0,
    avgMissLatencyMs: 0,
    chartData: []
  });

  const fetchOverview = () => {
    fetch('http://localhost:5000/api/overview')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStats(data);
      })
      .catch(err => console.error("Could not fetch real stats:", err));
  };

  const fetchLogs = () => {
    fetch('http://localhost:5000/api/logs?limit=20')
      .then(res => res.json())
      .then(data => {
        if (data.data) setLogs(data.data);
      })
      .catch(err => console.error("Could not fetch logs:", err));
  };

  useEffect(() => {
    fetchOverview();
    fetchLogs();
  }, []);

  const handleFlushCache = async () => {
    try {
      await fetch('http://localhost:5000/api/cache', { method: 'DELETE' });
      fetchOverview();
      fetchLogs();
    } catch (err) {
      console.error("Failed to flush cache:", err);
      alert("Failed to connect to the backend server. Is it running on port 5000?");
    } finally {
      setIsClearModalOpen(false);
    }
  };

  const submitQuery = async (queryPrompt: string) => {
    if (!queryPrompt.trim()) return;
    setPlaygroundPrompt(queryPrompt);
    setPlaygroundLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{ role: 'user', content: queryPrompt }]
        })
      });
      const data = await res.json();
      setPlaygroundResult(data);
      
      fetchOverview();
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handlePlaygroundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(playgroundPrompt);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  });
  
  const getBtnClass = (active) => active 
    ? "px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 transition-colors" 
    : "px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-800 border border-transparent transition-colors";

  const circumference = 2 * Math.PI * 38;
  const hitDash = (stats.cacheHitRate / 100) * circumference;

  const filteredLogs = logs.filter(log => {
    if (logFilter === 'hit') return log.cacheHit;
    if (logFilter === 'miss') return !log.cacheHit;
    return true;
  });

  return (
    <div className={`font-sans min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200 theme-transition flex flex-col ${isDark ? "bg-[#0b0f17] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      

  
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

        
        <button id="clearCacheBtn" onClick={() => setIsClearModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 hover:border-rose-700/60 rounded-lg transition-all active:scale-95">
          <i data-lucide="trash-2" className="w-3.5 h-3.5"></i>
          <span className="hidden sm:inline">Clear Cache</span>
        </button>

        
        <button id="themeToggleBtn" onClick={() => setIsDark(!isDark)} className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg transition-colors" title="Toggle dark/light mode">
          <i data-lucide="sun" className="w-4 h-4 hidden dark:block text-amber-300"></i>
          <i data-lucide="moon" className="w-4 h-4 block dark:hidden text-slate-700"></i>
        </button>

        
        <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg md:hidden">
          <i data-lucide="menu" id="mobileMenuIcon" className="w-4 h-4"></i>
        </button>
      </div>
    </div>

    
    <div id="mobileNavDrawer" className={`${isMobileNavOpen ? "" : "hidden"} md:hidden pt-3 mt-3 border-t border-slate-800 flex flex-col gap-2 pb-1 text-sm font-medium`}>
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

  
  <div id="clearCacheModal" className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 ${isClearModalOpen ? 'flex' : 'hidden'} items-center justify-center p-4`}>
    <div className="bg-[#111726] border border-rose-900/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-950/60 border border-rose-800/40 rounded-xl text-rose-400 shrink-0">
          <i data-lucide="alert-triangle" className="w-6 h-6"></i>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Flush Semantic Cache?</h3>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            This will immediately purge all <span className="font-mono text-cyan-400 font-semibold">{stats.cacheHits}</span> vectorized prompt embeddings in the cluster. Cache hit rate will drop to 0% until warm.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={() => setIsClearModalOpen(false)} className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors">
          Cancel
        </button>
        <button onClick={handleFlushCache} className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-lg shadow-rose-900/30 flex items-center gap-2">
          <i data-lucide="trash-2" className="w-4 h-4"></i> Flush Cache Now
        </button>
      </div>
    </div>
  </div>

  
  <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

    {/* Header Block */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-2 border-b border-slate-800/60">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 dark:bg-cyan-950/60 bg-cyan-100 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
            <i data-lucide="cpu" className="w-3.5 h-3.5"></i> Edge Semantic Proxy
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-500">Embedding model: text-embedding-3-small (Cosine 0.90 threshold)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Observability & Savings Dashboard</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Intercepting inbound LLM queries, computing semantic similarity vector matches, and returning cached responses in &lt;15ms.
        </p>
      </div>
      <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
        <button onClick={() => setTimeframe('24h')} className={getBtnClass(timeframe === '24h')}>24 Hours</button>
        <button onClick={() => setTimeframe('7d')} className={getBtnClass(timeframe === '7d')}>7 Days</button>
        <button onClick={() => setTimeframe('30d')} className={getBtnClass(timeframe === '30d')}>30 Days</button>
        <button onClick={() => setTimeframe('all')} className={`${getBtnClass(timeframe === 'all')} hidden sm:block`}>All Time</button>
      </div>
    </div>

    
    
    <section id="analytics" aria-label="Key Performance Metrics">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        
        <div className="relative overflow-hidden rounded-2xl bg-[#111726] border border-slate-800/90 p-5 shadow-lg hover:border-slate-700/80 transition-all hover:shadow-glow-cyan group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <i data-lucide="message-square" className="w-5 h-5"></i>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              <i data-lucide="trending-up" className="w-3 h-3"></i> +18.4%
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Inquiries</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span id="statTotalInquiries" className="text-3xl font-extrabold text-white font-mono tracking-tight">{stats.totalRequests.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-mono">reqs</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-mono">24h volume curve</span>
            <div className="flex items-end gap-1 h-5 w-24">
              <span className="w-1.5 bg-cyan-500/40 rounded-t h-[40%]"></span>
              <span className="w-1.5 bg-cyan-500/40 rounded-t h-[65%]"></span>
              <span className="w-1.5 bg-cyan-500/50 rounded-t h-[55%]"></span>
              <span className="w-1.5 bg-cyan-500/60 rounded-t h-[80%]"></span>
              <span className="w-1.5 bg-cyan-500/70 rounded-t h-[70%]"></span>
              <span className="w-1.5 bg-cyan-500/90 rounded-t h-[90%]"></span>
              <span className="w-1.5 bg-cyan-400 rounded-t h-[100%]"></span>
            </div>
          </div>
        </div>

        
        <div className="relative overflow-hidden rounded-2xl bg-[#111726] border border-slate-800/90 p-5 shadow-lg hover:border-slate-700/80 transition-all hover:shadow-glow-emerald group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <i data-lucide="zap" className="w-5 h-5"></i>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              <i data-lucide="arrow-up-right" className="w-3 h-3"></i> +3.2% vs avg
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Semantic Hit Rate</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span id="statHitRate" className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">{stats.cacheHitRate.toFixed(1)}%</span>
              <span className="text-xs text-slate-400 font-mono">{stats.cacheHits.toLocaleString()} hits</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-emerald-400">Hits ({stats.cacheHitRate.toFixed(1)}%)</span>
              <span className="text-amber-400">Misses ({(100 - stats.cacheHitRate).toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-l-full" style={{ width: `${stats.cacheHitRate}%` }}></div>
              <div className="bg-amber-500/80 h-full rounded-r-full" style={{ width: `${100 - stats.cacheHitRate}%` }}></div>
            </div>
          </div>
        </div>

        
        <div className="relative overflow-hidden rounded-2xl bg-[#111726] border border-slate-800/90 p-5 shadow-lg hover:border-slate-700/80 transition-all hover:shadow-glow-emerald group">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <i data-lucide="badge-dollar-sign" className="w-5 h-5"></i>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
              Estimated API Cost
            </span>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Cost Saved</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span id="statDollarSaved" className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">${stats.totalCostSavedUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              <span className="text-xs text-slate-400 font-mono">USD</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-mono">Tokens bypassed:</span>
            <span className="font-mono text-slate-200 font-semibold text-[11px]">74.1M Tokens</span>
          </div>
        </div>

        
        <div className="relative overflow-hidden rounded-2xl bg-[#111726] border border-slate-800/90 p-5 shadow-lg hover:border-slate-700/80 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <div className="h-10 w-10 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <i data-lucide="gauge" className="w-5 h-5"></i>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 font-semibold">
              {stats.avgHitLatencyMs > 0 ? (stats.avgMissLatencyMs / stats.avgHitLatencyMs).toFixed(1) : 0}x Faster
            </span>
          </div>

          <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">Avg Roundtrip Latency</div>

          
          <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cache Hit
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{Math.round(stats.avgHitLatencyMs)}<span className="text-xs font-normal text-emerald-400/80">ms</span></div>
              <span className="text-[10px] text-slate-500 font-mono">Redis Vector</span>
            </div>

            
            <div className="flex flex-col pl-2 border-l border-slate-800">
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Cache Miss
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{Math.round(stats.avgMissLatencyMs)}<span className="text-xs font-normal text-amber-400/80">ms</span></div>
              <span className="text-[10px] text-slate-500 font-mono">Groq / OpenAI</span>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>P99 Hit: 18ms</span>
            <span className="text-slate-500">P99 Miss: 1,840ms</span>
          </div>
        </div>

      </div>
    </section>

    
    
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Latency and Ratio Visualizations">

      
      <div className="lg:col-span-2 rounded-2xl bg-[#111726] border border-slate-800/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="timer" className="w-4 h-4 text-cyan-400"></i>
              Real-Time Latency Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Observed response duration across last 12 sampling windows (ms)</p>
          </div>

          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
              <span className="text-slate-300">Cache Hit (10–18ms)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
              <span className="text-slate-300">Cache Miss (720–1150ms)</span>
            </div>
          </div>
        </div>

        
        <div className="relative w-full h-64 sm:h-72 mt-4 select-none">
          {stats.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="hitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="missGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25}/>
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#1e293b" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} tickLine={false} axisLine={false} minTickGap={20} />
                <YAxis stroke="#1e293b" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(value) => `${value}ms`} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  itemStyle={{ fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="missLatency" name="Upstream LLM" stroke="#f59e0b" strokeWidth={2.5} dot={false} activeDot={{ r: 4.5, fill: '#f59e0b', stroke: '#111726', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="hitLatency" name="Cache Hit" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4.5, fill: '#10b981', stroke: '#111726', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">Waiting for telemetry stream...</div>
          )}
        </div>
      </div>

      
      <div className="rounded-2xl bg-[#111726] border border-slate-800/90 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <i data-lucide="pie-chart" className="w-4 h-4 text-cyan-400"></i>
              Hit vs Miss Ratio
            </h3>
            <span className="text-xs font-mono text-slate-400">24H Window</span>
          </div>

          
          <div className="relative w-48 h-48 mx-auto my-5 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              
              <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
              
              <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="12" fill="transparent"
                      strokeDasharray={`${circumference}`} strokeDashoffset="0" strokeLinecap="butt" />
              
              <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12.5" fill="transparent"
                      strokeDasharray={`${hitDash} ${circumference}`} strokeDashoffset="0" strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>

            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-black text-white font-mono tracking-tight">{stats.cacheHitRate.toFixed(1)}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">Hit Efficiency</span>
            </div>
          </div>
        </div>

        
        <div className="space-y-2 pt-3 border-t border-slate-800/60 font-mono text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-200 font-medium">Cache Hits</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold">{stats.cacheHits.toLocaleString()}</span>
              <span className="text-slate-500 text-[10px] ml-1">({stats.cacheHitRate.toFixed(1)}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-amber-950/20 border border-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="text-slate-200 font-medium">Cache Misses</span>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-bold">{(stats.totalRequests - stats.cacheHits).toLocaleString()}</span>
              <span className="text-slate-500 text-[10px] ml-1">({(100 - stats.cacheHitRate).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    
    
    <section id="playground" className="rounded-2xl bg-gradient-to-b from-[#111726] to-[#0c101a] border border-slate-800/90 p-5 sm:p-7 shadow-2xl space-y-6" aria-label="Interactive Semantic Gateway Playground">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center gap-2">
              <i data-lucide="play" className="w-4 h-4 text-cyan-400 fill-cyan-400"></i>
              Semantic Matching Playground
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Test prompt equivalence against active vector embeddings. Click the demo chips below to simulate a Miss followed by a Hit!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono text-slate-400">Cosine Threshold:</span>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-cyan-950/60 border border-cyan-800 text-cyan-300 rounded-md">0.90 similarity</span>
        </div>
      </div>

      
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">
          Semantic Pair Quick-Tests (Click sequentially to test cache):
        </label>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => submitQuery("How do I reset my password?")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 transition-all hover:border-amber-500/50 group active:scale-95">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-mono text-amber-300/90">[Step 1: First Query]</span>
            <span>&ldquo;How do I reset my password?&rdquo;</span>
            <i data-lucide="arrow-right" className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform"></i>
          </button>

          
          <button onClick={() => submitQuery("How do I change my password?")}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 transition-all hover:border-emerald-500/50 group active:scale-95">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-emerald-300/90">[Step 2: Semantic Match]</span>
            <span>&ldquo;How do I change my password?&rdquo;</span>
            <i data-lucide="arrow-right" className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform"></i>
          </button>

          
          <button onClick={() => submitQuery("Explain quantum computing simply")}
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 transition-all hover:border-cyan-500/50 group active:scale-95">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>&ldquo;Explain quantum computing simply&rdquo;</span>
          </button>
        </div>
      </div>

      
      <form id="playgroundForm" onSubmit={handlePlaygroundSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-slate-900/90 border border-slate-700/80 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 p-2 gap-2 shadow-inner transition-all">
          <div className="pl-3 pr-2 py-2 flex items-center gap-2 text-cyan-400 shrink-0">
            <i data-lucide="terminal" className="w-5 h-5"></i>
          </div>
          <input id="promptInput" type="text"
                 placeholder="Type or paste any user prompt..."
                 value={playgroundPrompt}
                 onChange={(e) => setPlaygroundPrompt(e.target.value)}
                 disabled={playgroundLoading}
                 className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-2 py-2 font-mono" />
          
          <div className="flex items-center gap-2 justify-end shrink-0 pt-1 sm:pt-0">
            <button type="button" onClick={() => setPlaygroundPrompt("")} className="p-2 text-slate-400 hover:text-slate-200 transition-colors" title="Clear input">
              <i data-lucide="x" className="w-4 h-4"></i>
            </button>
            <button type="submit" id="sendPromptBtn"
                    disabled={playgroundLoading}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-500 hover:from-cyan-500 hover:to-sky-400 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-cyan-900/30 transition-all active:scale-95">
              <span>{playgroundLoading ? 'Sending...' : 'Send Query'}</span>
              <i data-lucide="send" className="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </form>

      
      {playgroundResult && (
      <div id="responseContainer" className="rounded-2xl border transition-all duration-300">
        <div id="activeResponseCard" className="rounded-2xl bg-[#0e1424] border border-emerald-500/40 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span id="responseStatusBadge" className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${playgroundResult.x_promptshield?.cache_hit ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-400 shadow-glow-emerald' : 'bg-amber-950/80 border border-amber-500 text-amber-400 shadow-glow-amber'}`}>
                <span className={`w-2 h-2 rounded-full ${playgroundResult.x_promptshield?.cache_hit ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                <span>{playgroundResult.x_promptshield?.cache_hit ? 'CACHE HIT' : 'CACHE MISS'}</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-white">{(playgroundResult.x_promptshield?.similarity_score * 100 || 0).toFixed(1)}% similarity</span>
              </span>

              <span id="responseMetricsBadge" className={`inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full ${playgroundResult.x_promptshield?.cache_hit ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-800/40' : 'text-amber-300 bg-amber-950/40 border border-amber-800/40'}`}>
                <i data-lucide="zap" className={`w-3 h-3 ${playgroundResult.x_promptshield?.cache_hit ? 'text-emerald-400' : 'text-amber-400'}`}></i>
                <strong className="font-bold">{playgroundResult.x_promptshield?.latency_ms?.toFixed(1) || 0}ms</strong> ({playgroundResult.x_promptshield?.cache_hit ? 'Redis cluster' : 'Groq upstream'})
                {playgroundResult.x_promptshield?.cache_hit && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">${playgroundResult.x_promptshield?.cost_saved_usd?.toFixed(5)} saved</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
                <i data-lucide="shield-alert" className="w-3.5 h-3.5 text-slate-400"></i>
                <span>PII Detected: <strong className={playgroundResult.x_promptshield?.pii_detected ? "text-rose-400 font-normal" : "text-emerald-400 font-normal"}>{playgroundResult.x_promptshield?.pii_detected ? 'Yes (Redacted)' : 'None'}</strong></span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Synthesized Gateway Payload</div>
            <div id="responseTextPayload" className="text-sm text-slate-200 leading-relaxed bg-[#0b0f17] border border-slate-800/90 rounded-xl p-4 font-sans selection:bg-cyan-500/20 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {playgroundResult.choices?.[0]?.message?.content || JSON.stringify(playgroundResult, null, 2)}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/60 gap-2">
            <div className="flex items-center gap-4">
              <span>Vector Distance: <strong className="text-emerald-400 font-bold">{(1 - (playgroundResult.x_promptshield?.similarity_score || 0)).toFixed(3)}</strong> (Cosine)</span>
              <span>Tokens Served: <strong className="text-slate-200">{playgroundResult.usage?.total_tokens || 0} tok</strong></span>
            </div>
            {playgroundResult.x_promptshield?.cache_hit && (
              <div className="flex items-center gap-2 text-slate-500">
                <i data-lucide="check-check" className="w-3.5 h-3.5 text-emerald-400"></i>
                <span>Zero LLM API egress billed</span>
              </div>
            )}
          </div>

        </div>
      </div>
      )}
    </section>

    
    
    <section className="rounded-2xl bg-[#111726] border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-4" aria-label="Real-time Prompt Inquiries Stream">
      
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <i data-lucide="list-filter" className="w-4 h-4 text-cyan-400"></i>
            Live Semantic Inquiries Stream
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Continuous stream of inbound prompts, similarity vectors, and latency benchmarks</p>
        </div>

        
        <div className="flex items-center gap-2">
          <button onClick={() => setLogFilter('all')} className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${logFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>All ({logs.length})</button>
          <button onClick={() => setLogFilter('hit')} className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${logFilter === 'hit' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Hits Only</button>
          <button onClick={() => setLogFilter('miss')} className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${logFilter === 'miss' ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40' : 'bg-slate-900 text-slate-500 border border-slate-800'}`}>Misses Only</button>
        </div>
      </div>

      
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse" id="requestsTable">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">Inbound Prompt</th>
              <th className="py-3 px-3">Gateway Status</th>
              <th className="py-3 px-3">Similarity</th>
              <th className="py-3 px-3">Latency</th>
              <th className="py-3 px-3">$ Saved</th>
              <th className="py-3 px-3">PII Check</th>
              <th className="py-3 px-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-slate-300" id="tableBody">
            {filteredLogs.map(log => (
              <tr key={log._id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="py-3 px-3 max-w-xs truncate font-sans text-white" title={log.prompt}>
                  &ldquo;{log.prompt}&rdquo;
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${log.cacheHit ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${log.cacheHit ? 'bg-emerald-400' : 'bg-amber-400'}`}></span> {log.cacheHit ? 'HIT' : 'MISS'}
                  </span>
                </td>
                <td className={`py-3 px-3 ${log.cacheHit ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                  {(log.similarityScore * 100).toFixed(1)}%
                </td>
                <td className={`py-3 px-3 font-semibold ${log.cacheHit ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {log.latencyMs}ms
                </td>
                <td className={`py-3 px-3 ${log.cacheHit ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                  {log.cacheHit ? `+$${log.costSavedUSD.toFixed(5)}` : '$0.00'}
                </td>
                <td className="py-3 px-3">
                  {log.piiDetected ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">PII Filtered</span>
                  ) : (
                    <span className="text-slate-400">Clean</span>
                  )}
                </td>
                <td className="py-3 px-3 text-right text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500 italic">No inquiries found matching this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      
      
      <div className="block md:hidden space-y-3" id="mobileCardsContainer">
        {filteredLogs.map(log => (
          <div key={log._id} className="rounded-xl bg-[#0c101a] border border-slate-800 p-3.5 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${log.cacheHit ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${log.cacheHit ? 'bg-emerald-400' : 'bg-amber-400'}`}></span> CACHE {log.cacheHit ? 'HIT' : 'MISS'}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
            </div>
            <p className="text-xs font-sans text-white font-medium line-clamp-2">
              &ldquo;{log.prompt}&rdquo;
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Similarity</span>
                <span className={log.cacheHit ? "text-emerald-400 font-bold" : "text-slate-400"}>{(log.similarityScore * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Latency</span>
                <span className={log.cacheHit ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>{log.latencyMs}ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Saved</span>
                <span className={log.cacheHit ? "text-emerald-400 font-bold" : "text-slate-500"}>{log.cacheHit ? `+$${log.costSavedUSD.toFixed(5)}` : '$0.00'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing {filteredLogs.length} of {stats.totalRequests} logged requests</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed text-xs">Previous</button>
          <button className="px-2.5 py-1 rounded bg-cyan-600 text-white font-bold text-xs">1</button>
          <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-400 text-xs">2</button>
          <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-400 text-xs">3</button>
          <span className="px-1 text-slate-600">...</span>
          <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-400 text-xs">916</button>
          <button className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white text-slate-300 text-xs">Next</button>
        </div>
      </div>

    </section>

  </main>

  
  <footer className="border-t border-slate-800/80 bg-[#080c14] py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs font-mono text-slate-500">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <i data-lucide="shield" className="w-4 h-4 text-cyan-500"></i>
        <span className="text-slate-400 font-semibold">PromptShield Gateway</span>
        <span>— Low-Latency Semantic Caching for Enterprise LLMs</span>
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <span>API Latency SLA: 99.9%</span>
        <span>•</span>
        <span>Redis Vector Cluster</span>
        <span>•</span>
        <a href="#playground" className="text-cyan-400 hover:underline">Launch Inspector</a>
      </div>
    </div>
  </footer>

  
  

    </div>
  );
}