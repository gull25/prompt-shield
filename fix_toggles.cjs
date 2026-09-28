const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add imports and state variables
code = code.replace(
  /import { useEffect } from "react";\nexport default function App\(\) {/g, 
  `import { useEffect, useState } from "react";\nexport default function App() {\n  const [isDark, setIsDark] = useState(true);\n  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);\n\n  useEffect(() => {\n    if (isDark) {\n      document.documentElement.classList.add("dark");\n    } else {\n      document.documentElement.classList.remove("dark");\n    }\n  }, [isDark]);`
);

// Fix the main wrapper class
code = code.replace(
  /<div className="bg-\[#0b0f17\] text-slate-100 font-sans min-h-screen antialiased selection:bg-cyan-500\/30 selection:text-cyan-200 theme-transition flex flex-col">/g, 
  '<div className={`font-sans min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200 theme-transition flex flex-col ${isDark ? "bg-[#0b0f17] text-slate-100" : "bg-slate-50 text-slate-900"}`}>'
);

// Theme toggle button
code = code.replace(
  /<button id="themeToggleBtn"  className="p-2 text-slate-400/g, 
  '<button id="themeToggleBtn" onClick={() => setIsDark(!isDark)} className="p-2 text-slate-400'
);

// Mobile menu toggle button
code = code.replace(
  /<button  className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg md:hidden">/g, 
  '<button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg md:hidden">'
);

// Mobile Nav drawer visibility
code = code.replace(
  /<div id="mobileNavDrawer" className="hidden md:hidden/g, 
  '<div id="mobileNavDrawer" className={`${isMobileNavOpen ? "" : "hidden"} md:hidden'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed toggle states');
