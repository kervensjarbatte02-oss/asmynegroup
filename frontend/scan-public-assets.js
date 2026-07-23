const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd());
const publicDir = path.join(root, 'public');
function glob(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) return glob(full);
    return [path.relative(publicDir, full).replace(/\\/g, '/')];
  });
}
const publicFiles = new Set(glob(publicDir));
const publicLower = new Map([...publicFiles].map(p => [p.toLowerCase(), p]));
const codeFiles = [];
function walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) walk(full);
    else if (/\.(js|jsx|ts|tsx)$/.test(d.name)) codeFiles.push(full);
  }
}
walk(path.join(root, 'src'));
const regex = /(?:src=|poster=|href=|backgroundImage:\s*|url\()\s*(?:"|')?\s*(\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|mp4|svg|webp|gif))\s*(?:"|')?/gi;
const missing = [];
const caseMismatch = [];
for (const file of codeFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = regex.exec(content)) !== null) {
    const url = m[1];
    if (!url.startsWith('/') || url.startsWith('/api') || url.startsWith('/mailto:') || url.startsWith('/tel:') || url.startsWith('/http') || url.startsWith('/https') || url.startsWith('/_next')) continue;
    const clean = url.slice(1);
    if (!clean) continue;
    if (!publicFiles.has(clean)) {
      if (publicLower.has(clean.toLowerCase())) {
        caseMismatch.push({ file: path.relative(root, file), url, actual: publicLower.get(clean.toLowerCase()) });
      } else {
        missing.push({ file: path.relative(root, file), url });
      }
    }
  }
}
console.log(`public files: ${publicFiles.size}`);
console.log(`case mismatches: ${caseMismatch.length}`);
caseMismatch.forEach(m => console.log(`CASE ${m.file} -> ${m.url} actual /${m.actual}`));
console.log(`missing refs: ${missing.length}`);
missing.forEach(m => console.log(`MISS ${m.file} -> ${m.url}`));
