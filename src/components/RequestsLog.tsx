import { useState } from "react";
import { X } from "lucide-react";

const requestsData = [
  { id: 1, prompt: "Translate 'Hello World' to French", status: "HIT", score: 0.98, latency: "12ms", saved: "18", time: "Just now" },
  { id: 2, prompt: "Explain quantum computing in simple terms for a 5 year old", status: "MISS", score: 0.42, latency: "840ms", saved: "0", time: "2m ago" },
  { id: 3, prompt: "What is the capital of Japan?", status: "HIT", score: 1.00, latency: "8ms", saved: "12", time: "5m ago" },
  { id: 4, prompt: "Write a python script to parse JSON files in a directory", status: "HIT", score: 0.89, latency: "45ms", saved: "340", time: "12m ago" },
  { id: 5, prompt: "Summarize the plot of Inception", status: "MISS", score: 0.61, latency: "1.2s", saved: "0", time: "18m ago" },
];

export function RequestsLog() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const StatusBadge = ({ status }: { status: string }) => {
    const isHit = status === "HIT";
    return (
      <span className={`px-2 py-1 ${isHit ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'} border rounded text-[10px] font-mono font-medium min-h-[24px] sm:min-h-auto inline-flex items-center justify-center`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative mt-6 sm:mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-100 font-sans tracking-tight">Recent Requests</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search prompts..." 
              className="flex-1 sm:w-64 bg-[#0b0f17] border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 min-h-[44px] sm:min-h-[auto] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
        
        {/* Desktop Table View (md and up) */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider w-[40%]">Prompt</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Latency</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tokens Saved</th>
                <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {requestsData.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="py-4 pr-4">
                    <button 
                      onClick={() => setSelectedPrompt(req.prompt)}
                      className="text-sm text-slate-300 font-medium group-hover:text-cyan-400 transition-colors truncate max-w-[300px] lg:max-w-[400px] text-left block focus:outline-none min-h-[24px]"
                    >
                      {req.prompt}
                    </button>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-4 text-sm text-slate-300 font-mono">{req.score.toFixed(2)}</td>
                  <td className="py-4 text-sm text-slate-300 font-mono">{req.latency}</td>
                  <td className="py-4 text-sm text-emerald-400 font-mono">{req.saved}</td>
                  <td className="py-4 text-sm text-slate-500">{req.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (below md) */}
        <div className="md:hidden flex flex-col divide-y divide-slate-800/50 -mx-4 sm:-mx-5">
          {requestsData.map((req) => (
            <div key={req.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <button 
                    onClick={() => setSelectedPrompt(req.prompt)}
                    className="text-sm text-slate-300 font-medium hover:text-cyan-400 transition-colors text-left block focus:outline-none truncate w-full min-h-[24px]"
                  >
                    {req.prompt}
                  </button>
                </div>
                <StatusBadge status={req.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-2 pt-2 border-t border-slate-800/30">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Score</span>
                  <span className="text-slate-300 font-mono">{req.score.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Latency</span>
                  <span className="text-slate-300 font-mono">{req.latency}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Saved</span>
                  <span className="text-emerald-400 font-mono">{req.saved}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Time</span>
                  <span className="text-slate-500">{req.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Prompt Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedPrompt(null)}></div>
          <div className="relative w-full max-w-md bg-[#111726] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-[#111726]">
              <h3 className="text-sm font-semibold text-slate-200">Full Prompt</h3>
              <button 
                onClick={() => setSelectedPrompt(null)}
                className="text-slate-400 hover:text-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl break-words font-mono text-sm text-slate-200 leading-relaxed max-h-[60vh] overflow-y-auto">
                {selectedPrompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
