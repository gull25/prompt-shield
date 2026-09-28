const fs = require('fs');

let html = fs.readFileSync('react-ui.html', 'utf8');

// The file has a <header>...</header> and a <main>...</main>.
// Let's extract the header and main blocks.
const topNavMatch = html.match(/<header.*?<\/header>/s);
const mainMatch = html.match(/<main.*?<\/main>/s);

if (!topNavMatch || !mainMatch) {
  console.log("Could not find header or main tags");
  process.exit(1);
}

let topNav = topNavMatch[0];
let mainContent = mainMatch[0];

// In the HTML, icons are `<i data-lucide="icon-name" className="..."></i>`.
// Lucide react doesn't work like this. We need to convert it.
// Or we can just include the lucide `<script>` in index.html and let it run `lucide.createIcons()` in a useEffect!
// That is actually 100x easier and guarantees it works perfectly like the original!
// In fact, the original file had: `<script src="https://unpkg.com/lucide@latest"></script>` and `lucide.createIcons()` at the bottom.
// We can just keep using `<i>` tags and call `lucide.createIcons()` in a useEffect in App.tsx!

function wrapComponent(name, content) {
  return `import { useEffect } from 'react';

export function ${name}() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
${content}
    </>
  );
}
`;
}

fs.writeFileSync('src/components/TopNav.tsx', wrapComponent('TopNav', topNav));

// The mainContent has 4 major sections:
// 1. Stats grid: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// 2. Charts: <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
// 3. Playground: <div className="bg-[#111726] border border-slate-800/80 rounded-2xl p-6 shadow-xl mb-8 relative overflow-hidden">
// 4. Stream table: <div className="bg-[#111726] border border-slate-800/80 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">

const blocks = mainContent.split(/(?=<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">|<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">|<div className="bg-\[#111726\] border border-slate-800\/80 rounded-2xl p-6 shadow-xl mb-8 relative overflow-hidden">|<div className="bg-\[#111726\] border border-slate-800\/80 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">)/);

// blocks[0] is just <main ...> and the Header section
// blocks[1] is Stats
// blocks[2] is Charts
// blocks[3] is Playground
// blocks[4] is Stream table (which includes the closing </main>)

let headerBlock = blocks[0]; // "Observability & Savings Dashboard" text area
let statCards = blocks[1];
let analyticsCharts = blocks[2];
let playground = blocks[3];
let streamTable = blocks[4].replace('</main>', ''); // remove </main>
let footer = html.match(/<footer.*?<\/footer>/s)[0];

fs.writeFileSync('src/components/StatCards.tsx', wrapComponent('StatCards', statCards));
fs.writeFileSync('src/components/AnalyticsCharts.tsx', wrapComponent('AnalyticsCharts', analyticsCharts));
fs.writeFileSync('src/components/Playground.tsx', wrapComponent('Playground', playground));
fs.writeFileSync('src/components/RequestsLog.tsx', wrapComponent('RequestsLog', streamTable));

const appTsx = `import { useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { StatCards } from './components/StatCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { Playground } from './components/Playground';
import { RequestsLog } from './components/RequestsLog';

function App() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <div className="bg-[#0b0f17] text-slate-100 font-sans min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200 theme-transition flex flex-col">
      <TopNav />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                <i data-lucide="cpu" className="w-3.5 h-3.5"></i> Edge Semantic Proxy
              </span>
              <span className="text-xs font-mono text-slate-500">Embedding model: text-embedding-3-small (Cosine 0.90 threshold)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Observability & Savings Dashboard</h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Intercepting inbound LLM queries, computing semantic similarity vector matches, and returning cached responses in &lt;15ms.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors">24 Hours</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">7 Days</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">30 Days</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">All Time</button>
          </div>
        </div>

        <StatCards />
        <AnalyticsCharts />
        <Playground />
        <RequestsLog />
      </main>
      ${footer}
    </div>
  );
}
export default App;
`;

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Successfully extracted all components!");
