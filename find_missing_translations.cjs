const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

let keys = new Set();
walkDir('resources/js', (filePath) => {
    if(filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let regex1 = /__\(\s*'([^']+)'\s*\)/g;
        let regex2 = /__\(\s*"([^"]+)"\s*\)/g;
        let m;
        while((m = regex1.exec(content)) !== null) keys.add(m[1]);
        while((m = regex2.exec(content)) !== null) keys.add(m[1]);
    }
});

let idPath = 'lang/id.json';
let idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));

let missing = [];
keys.forEach(k => {
    if(!idData[k]) {
        missing.push(k);
    }
});

fs.writeFileSync('missing_translations.json', JSON.stringify(missing, null, 2));
console.log(`Found ${missing.length} missing translations.`);
