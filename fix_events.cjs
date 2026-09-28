const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/onClick="[^"]*"/g, '');
code = code.replace(/onSubmit="[^"]*"/g, '');
code = code.replace(/onChange="[^"]*"/g, '');
code = code.replace(/onsubmit=/g, 'onSubmit=');
fs.writeFileSync('src/App.tsx', code);
console.log('Removed all string event handlers');
