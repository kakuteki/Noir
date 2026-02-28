const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CSS_DIR = path.join(ROOT, 'css');
const MODULES_DIR = path.join(CSS_DIR, 'modules');

describe('Build System', () => {
  // Run build before all tests
  beforeAll(() => {
    execSync('node scripts/build.js', { cwd: ROOT, stdio: 'pipe' });
  });

  describe('Build Output', () => {
    test('dist directory exists', () => {
      expect(fs.existsSync(DIST)).toBe(true);
    });

    test('noir.css is generated', () => {
      expect(fs.existsSync(path.join(DIST, 'noir.css'))).toBe(true);
    });

    test('noir.min.css is generated', () => {
      expect(fs.existsSync(path.join(DIST, 'noir.min.css'))).toBe(true);
    });

    test('noir.min.css.map is generated', () => {
      expect(fs.existsSync(path.join(DIST, 'noir.min.css.map'))).toBe(true);
    });

    test('minified file is smaller than unminified', () => {
      const fullSize = fs.statSync(path.join(DIST, 'noir.css')).size;
      const minSize = fs.statSync(path.join(DIST, 'noir.min.css')).size;
      expect(minSize).toBeLessThan(fullSize);
    });

    test('minified file is at least 15% smaller', () => {
      const fullSize = fs.statSync(path.join(DIST, 'noir.css')).size;
      const minSize = fs.statSync(path.join(DIST, 'noir.min.css')).size;
      const reduction = (1 - minSize / fullSize) * 100;
      expect(reduction).toBeGreaterThan(15);
    });

    test('source map is valid JSON', () => {
      const mapContent = fs.readFileSync(path.join(DIST, 'noir.min.css.map'), 'utf8');
      const map = JSON.parse(mapContent);
      expect(map).toHaveProperty('version');
      expect(map).toHaveProperty('mappings');
    });
  });

  describe('Import Resolution', () => {
    test('entry file css/noir.css exists', () => {
      expect(fs.existsSync(path.join(CSS_DIR, 'noir.css'))).toBe(true);
    });

    test('all @import targets exist', () => {
      const entry = fs.readFileSync(path.join(CSS_DIR, 'noir.css'), 'utf8');
      const imports = [...entry.matchAll(/@import\s+["']([^"']+)["'];/g)];
      expect(imports.length).toBeGreaterThan(0);

      imports.forEach(match => {
        const importPath = path.resolve(CSS_DIR, match[1]);
        expect(fs.existsSync(importPath)).toBe(true);
      });
    });

    test('dist/noir.css contains all module content', () => {
      const distContent = fs.readFileSync(path.join(DIST, 'noir.css'), 'utf8');
      const moduleFiles = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.css'));

      moduleFiles.forEach(file => {
        // Extract the first CSS selector from each module as a fingerprint
        const moduleContent = fs.readFileSync(path.join(MODULES_DIR, file), 'utf8');
        const selectorMatch = moduleContent.match(/^(\.[a-zA-Z][\w-]*)/m);
        if (selectorMatch) {
          expect(distContent).toContain(selectorMatch[1]);
        }
      });
    });

    test('dist/noir.css has no @import statements', () => {
      const distContent = fs.readFileSync(path.join(DIST, 'noir.css'), 'utf8');
      expect(distContent).not.toMatch(/@import\s+["']/);
    });
  });

  describe('CSS Validity', () => {
    test('dist/noir.css is not empty', () => {
      const size = fs.statSync(path.join(DIST, 'noir.css')).size;
      expect(size).toBeGreaterThan(1000);
    });

    test('dist/noir.min.css is not empty', () => {
      const size = fs.statSync(path.join(DIST, 'noir.min.css')).size;
      expect(size).toBeGreaterThan(1000);
    });

    test('dist/noir.css contains no merge conflict markers', () => {
      const content = fs.readFileSync(path.join(DIST, 'noir.css'), 'utf8');
      expect(content).not.toContain('<<<<<<<');
      expect(content).not.toContain('>>>>>>>');
      expect(content).not.toContain('=======');
    });

    test('dist/noir.min.css contains no merge conflict markers', () => {
      const content = fs.readFileSync(path.join(DIST, 'noir.min.css'), 'utf8');
      expect(content).not.toContain('<<<<<<<');
      expect(content).not.toContain('>>>>>>>');
    });

    test('lightningcss can parse the output without errors', () => {
      const lightningcss = require('lightningcss');
      const code = fs.readFileSync(path.join(DIST, 'noir.css'));
      expect(() => {
        lightningcss.transform({
          filename: 'noir.css',
          code,
          errorRecovery: false,
        });
      }).not.toThrow();
    });
  });
});
