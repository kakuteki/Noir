const fs = require('fs');
const path = require('path');

let lightningcss, browserslist;
try {
  lightningcss = require('lightningcss');
  browserslist = require('browserslist');
} catch (e) {
  console.error('Missing dependencies. Run: npm install');
  process.exit(1);
}

const ROOT = path.resolve(__dirname, '..');
const ENTRY = path.join(ROOT, 'css', 'noir.css');
const DIST = path.join(ROOT, 'dist');

// Resolve @import statements
function resolveImports(filePath) {
  const dir = path.dirname(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  return content.replace(/@import\s+["']([^"']+)["'];/g, (match, importPath) => {
    const resolved = path.resolve(dir, importPath);
    if (fs.existsSync(resolved)) {
      return resolveImports(resolved);
    }
    console.warn(`Warning: Cannot resolve ${importPath}`);
    return match;
  });
}

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

const source = resolveImports(ENTRY);
const targets = lightningcss.browserslistToTargets(browserslist('>= 0.5%, last 2 versions, not dead'));

// Unminified build
const unminified = lightningcss.transform({
  filename: 'noir.css',
  code: Buffer.from(source),
  targets,
  drafts: { customMedia: true },
  errorRecovery: true,
});
fs.writeFileSync(path.join(DIST, 'noir.css'), unminified.code);

// Minified build with source map
const minified = lightningcss.transform({
  filename: 'noir.css',
  code: Buffer.from(source),
  minify: true,
  sourceMap: true,
  targets,
  drafts: { customMedia: true },
  errorRecovery: true,
});
fs.writeFileSync(path.join(DIST, 'noir.min.css'), minified.code);
if (minified.map) {
  fs.writeFileSync(path.join(DIST, 'noir.min.css.map'), minified.map);
}

// Print sizes
const unminSize = (fs.statSync(path.join(DIST, 'noir.css')).size / 1024).toFixed(1);
const minSize = (fs.statSync(path.join(DIST, 'noir.min.css')).size / 1024).toFixed(1);
const reduction = (100 - (minified.code.length / unminified.code.length) * 100).toFixed(1);
console.log(`dist/noir.css     ${unminSize} KB`);
console.log(`dist/noir.min.css  ${minSize} KB (${reduction}% smaller)`);
if (minified.map) {
  const mapSize = (fs.statSync(path.join(DIST, 'noir.min.css.map')).size / 1024).toFixed(1);
  console.log(`dist/noir.min.css.map  ${mapSize} KB`);
}
