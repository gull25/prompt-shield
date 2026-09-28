const fs = require('fs');
let html = fs.readFileSync('react-ui.html', 'utf8');
let bodyMatch = html.match(/<body.*?>(.*)<\/body>/s);
let content = bodyMatch ? bodyMatch[1] : '';
content = content.replace(/<script.*?<\/script>/gs, '');

const appCode = `import { useEffect } from "react";
export default function App() {
  useEffect(() => {
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
  });
  return (
    <div className="flex flex-col min-h-screen">
      ${content}
    </div>
  );
}`;

fs.writeFileSync('src/App.tsx', appCode);
console.log('Wrote App.tsx');
