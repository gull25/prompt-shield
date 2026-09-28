import { useState } from "react";
import { Terminal, Send, GitMerge, CheckCheck, X } from "lucide-react";

export function Playground() {
  const [prompt, setPrompt] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSimulate = () => {
    if (!prompt) return;
    setShowModal(true);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <>
      <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative mt-6 sm:mt-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 sm:mb-5 font-sans flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          Semantic Match Simulator
        </h3>
        
        <div className="max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <input 
                type="text" 
                placeholder="Type a prompt to test semantic cache matching..." 
                className="w-full bg-[#0b0f17] border border-slate-800 text-slate-200 text-sm sm:text-base rounded-xl pl-4 pr-16 py-3 sm:py-3.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 min-h-[44px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-medium text-slate-500 bg-slate-800/50 rounded border border-slate-700/50">⌘</kbd>
                <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-[10px] font-medium text-slate-500 bg-slate-800/50 rounded border border-slate-700/50">Enter</kbd>
              </div>
            </div>
            <button 
              onClick={handleSimulate}
              disabled={!prompt}
              className="w-full sm:w-auto min-h-[44px] px-6 sm:px-8 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_-3px_rgba(14,165,233,0.4)] hover:shadow-[0_0_20px_-3px_rgba(14,165,233,0.6)] group disabled:opacity-50 disabled:shadow-none"
            >
              <span>Simulate</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-slate-500 hidden sm:block">Try:</span>
            {["I need help resetting my password", "What is the latest API version?", "How do I create a new project?"].map((example, i) => (
              <button 
                key={i}
                onClick={() => setPrompt(example)}
                className="text-[10px] sm:text-xs font-medium text-slate-400 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg px-2 sm:px-3 py-1.5 transition-colors min-h-[44px] sm:min-h-auto text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-[#0b0f17] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-[#111726]">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 live-pulse"></span>
                Gateway Response Simulator
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              {isSimulating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm text-slate-400 font-mono">Calculating vector distance...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Incoming */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Incoming Request</div>
                    <div className="text-sm text-slate-300 font-medium bg-[#111726] p-3 rounded-lg border border-slate-800 break-words">
                      "{prompt}"
                    </div>
                  </div>
                  
                  {/* Match logic */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-mono text-slate-400 bg-slate-900/60 p-3 sm:p-3 rounded-xl border border-slate-800/80 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
                    <GitMerge className="w-4 h-4 text-cyan-400 shrink-0 hidden sm:block ml-2" />
                    <span className="break-words sm:ml-2">Matched prompt semantic centroid: <span className="text-slate-200 underline decoration-cyan-500/50 decoration-wavy block sm:inline mt-1 sm:mt-0 leading-relaxed">"How do I reset my account password?"</span></span>
                  </div>
                  
                  {/* Result */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-mono">Synthesized Gateway Payload</div>
                    <div className="text-sm text-slate-200 leading-relaxed bg-[#111726] border border-slate-800 rounded-xl p-4 sm:p-5 font-sans shadow-inner">
                      To change or reset your password, navigate to <strong className="text-cyan-300">Account Settings &rarr; Security</strong>, click on "Update Password", enter your current authorization secret, and provide your new password (minimum 12 characters).
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            {!isSimulating && (
              <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#111726] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs font-mono text-slate-400">
                  <span>Vector Distance: <strong className="text-emerald-400 font-bold">0.036</strong></span>
                  <span>Tokens Served: <strong className="text-slate-200">142 tok</strong></span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Zero LLM API egress billed</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
