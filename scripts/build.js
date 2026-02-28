const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ENTRY = path.join(ROOT, 'css', 'noir.css');
const DIST = path.join(ROOT, 'dist');

// Read entry file and resolve @import statements
function resolveImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);

  return content.replace(/@import\s+["']([^"']+)["']\s*;/g, (match, importPath) => {
    const fullPath = path.join(dir, importPath);
    return fs.readFileSync(fullPath, 'utf8');
  });
}

// Simple CSS minification (no dependencies)
function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')       // Remove comments
    .replace(/\s+/g, ' ')                    // Collapse whitespace
    .replace(/\s*([{}:;,>~+])\s*/g, '$1')   // Remove space around symbols
    .replace(/;}/g, '}')                     // Remove last semicolon in block
    .replace(/^\s+/, '')                     // Trim start
    .replace(/\s+$/, '')                     // Trim end
    .trim();
}

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// Build
const full = resolveImports(ENTRY);
const min = minify(full);

fs.writeFileSync(path.join(DIST, 'noir.css'), full, 'utf8');
fs.writeFileSync(path.join(DIST, 'noir.min.css'), min, 'utf8');

const fullSize = Buffer.byteLength(full, 'utf8');
const minSize = Buffer.byteLength(min, 'utf8');
const ratio = ((1 - minSize / fullSize) * 100).toFixed(1);

console.log(`dist/noir.css     ${(fullSize / 1024).toFixed(1)} KB`);
console.log(`dist/noir.min.css  ${(minSize / 1024).toFixed(1)} KB (${ratio}% smaller)`);
