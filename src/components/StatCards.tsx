import { Zap, Database, Activity, Clock } from "lucide-react";

export function StatCards() {
  const stats = [
    {
      title: "Cache Hit Rate",
      value: "82.4%",
      trend: "+4.2%",
      trendUp: true,
      icon: <Zap className="w-5 h-5 text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />,
      iconBg: "bg-cyan-500/10",
      iconBorder: "border-cyan-500/20",
      gradient: "from-cyan-500/20",
      trendColor: "text-emerald-400"
    },
    {
      title: "Tokens Saved",
      value: "14.2M",
      trend: "+1.1M",
      trendUp: true,
      icon: <Database className="w-5 h-5 text-emerald-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />,
      iconBg: "bg-emerald-500/10",
      iconBorder: "border-emerald-500/20",
      gradient: "from-emerald-500/20",
      trendColor: "text-emerald-400"
    },
    {
      title: "Gateway Requests",
      value: "34,291",
      trend: "-12%",
      trendUp: false,
      icon: <Activity className="w-5 h-5 text-indigo-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />,
      iconBg: "bg-indigo-500/10",
      iconBorder: "border-indigo-500/20",
      gradient: "from-indigo-500/20",
      trendColor: "text-rose-400"
    },
    {
      title: "Avg Latency",
      value: "42ms",
      trend: "-14ms",
      trendUp: true, // visually positive
      icon: <Clock className="w-5 h-5 text-fuchsia-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />,
      iconBg: "bg-fuchsia-500/10",
      iconBorder: "border-fuchsia-500/20",
      gradient: "from-fuchsia-500/20",
      trendColor: "text-emerald-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-[#111726] border border-slate-800/80 rounded-2xl p-4 sm:p-5 hover:bg-[#161f33] transition-colors theme-transition group cursor-pointer relative overflow-hidden">
          {/* Subtle gradient hover effect */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.gradient} to-transparent opacity-0 group-hover:opacity-10 transition-opacity rounded-full blur-2xl -mr-10 -mt-10`}></div>
          
          <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">
              {stat.title}
            </span>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${stat.iconBg} border ${stat.iconBorder} flex items-center justify-center relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-tr ${stat.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              {stat.icon}
            </div>
          </div>
          <div className="flex items-baseline gap-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 font-sans tracking-tight">
              {stat.value}
            </h2>
            <span className={`text-xs sm:text-sm font-medium ${stat.trendColor}`}>
              {stat.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
