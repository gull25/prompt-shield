const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/style="display: none;"/g, 'style={{display: "none"}}');
code = code.replace(/style="display: none"/g, 'style={{display: "none"}}');
code = code.replace(/onclick=/g, 'onClick=');
code = code.replace(/onchange=/g, 'onChange=');
fs.writeFileSync('src/App.tsx', code);
console.log('Fixed style and onclick');
