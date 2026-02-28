const fs = require('fs');
const path = require('path');

const MODULES_DIR = path.resolve(__dirname, '..', 'css', 'modules');
const CSS_DIR = path.resolve(__dirname, '..', 'css');

// Helper: extract all class selectors from CSS content
function extractClasses(css) {
  const classes = new Set();
  const regex = /\.([a-zA-Z_-][a-zA-Z0-9_-]*(?:\\:[a-zA-Z0-9_-]+)*(?:\\\/[0-9]+)?)/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    classes.add(match[1].replace(/\\\\/g, '\\'));
  }
  return classes;
}

// Helper: extract CSS custom properties
function extractCustomProperties(css) {
  const props = new Set();
  const regex = /--([a-zA-Z0-9-]+)/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    props.add(`--${match[1]}`);
  }
  return props;
}

// Load all module content
function loadAllCSS() {
  const files = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.css'));
  return files.map(f => ({
    name: f,
    content: fs.readFileSync(path.join(MODULES_DIR, f), 'utf8')
  }));
}

describe('CSS Module Structure', () => {
  const modules = loadAllCSS();

  test('all expected modules exist', () => {
    const expected = [
      'base.css', 'typography.css', 'layout.css', 'forms.css',
      'components.css', 'navigation.css', 'utilities.css',
      'animations.css', 'states.css'
    ];
    const actual = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.css'));
    expected.forEach(mod => {
      expect(actual).toContain(mod);
    });
  });

  test('noir.css imports all modules', () => {
    const entry = fs.readFileSync(path.join(CSS_DIR, 'noir.css'), 'utf8');
    const imports = [...entry.matchAll(/@import\s+["']modules\/([^"']+)["'];/g)]
      .map(m => m[1]);
    const moduleFiles = fs.readdirSync(MODULES_DIR).filter(f => f.endsWith('.css'));
    moduleFiles.forEach(mod => {
      expect(imports).toContain(mod);
    });
  });

  test('no module is empty', () => {
    modules.forEach(({ name, content }) => {
      expect(content.trim().length).toBeGreaterThan(50);
    });
  });

  test('no module contains syntax errors (unmatched braces)', () => {
    modules.forEach(({ name, content }) => {
      // Remove strings and comments
      const cleaned = content
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/"[^"]*"/g, '')
        .replace(/'[^']*'/g, '');
      const opens = (cleaned.match(/\{/g) || []).length;
      const closes = (cleaned.match(/\}/g) || []).length;
      expect({ module: name, opens, closes }).toEqual(
        expect.objectContaining({ opens: closes })
      );
    });
  });
});

describe('CSS Custom Properties (Design Tokens)', () => {
  const baseCSS = fs.readFileSync(path.join(MODULES_DIR, 'base.css'), 'utf8');

  test('defines background color tokens', () => {
    expect(baseCSS).toContain('--noir-bg-primary');
    expect(baseCSS).toContain('--noir-bg-secondary');
    expect(baseCSS).toContain('--noir-bg-tertiary');
    expect(baseCSS).toContain('--noir-bg-elevated');
  });

  test('defines text color tokens', () => {
    expect(baseCSS).toContain('--noir-text-primary');
    expect(baseCSS).toContain('--noir-text-secondary');
    expect(baseCSS).toContain('--noir-text-muted');
    expect(baseCSS).toContain('--noir-text-inverse');
  });

  test('defines accent color tokens', () => {
    expect(baseCSS).toContain('--noir-accent:');
    expect(baseCSS).toContain('--noir-accent-hover');
    expect(baseCSS).toContain('--noir-accent-subtle');
    expect(baseCSS).toContain('--noir-accent-warm');
  });

  test('defines semantic color tokens', () => {
    ['success', 'warning', 'error', 'info'].forEach(color => {
      expect(baseCSS).toContain(`--noir-${color}:`);
      expect(baseCSS).toContain(`--noir-${color}-subtle`);
    });
  });

  test('defines spacing scale tokens', () => {
    [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].forEach(n => {
      expect(baseCSS).toContain(`--noir-space-${n}:`);
    });
  });

  test('defines typography tokens', () => {
    expect(baseCSS).toContain('--noir-font-sans');
    expect(baseCSS).toContain('--noir-font-mono');
    ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].forEach(size => {
      expect(baseCSS).toContain(`--noir-text-${size}:`);
    });
  });

  test('defines border radius tokens', () => {
    ['none', 'sm', 'md', 'lg', 'xl', 'full'].forEach(size => {
      expect(baseCSS).toContain(`--noir-radius-${size}:`);
    });
  });

  test('defines shadow tokens', () => {
    ['sm', 'md', 'lg', 'xl', 'glow'].forEach(size => {
      expect(baseCSS).toContain(`--noir-shadow-${size}:`);
    });
  });

  test('defines z-index tokens', () => {
    ['tooltip', 'dropdown', 'sticky', 'overlay', 'modal', 'toast'].forEach(layer => {
      expect(baseCSS).toContain(`--noir-z-${layer}:`);
    });
  });

  test('defines transition tokens', () => {
    ['fast', 'base', 'slow'].forEach(speed => {
      expect(baseCSS).toContain(`--noir-transition-${speed}:`);
    });
  });

  test('light theme overrides exist', () => {
    expect(baseCSS).toContain('[data-theme="light"]');
    expect(baseCSS).toContain('color-scheme: light');
  });

  test('auto theme (prefers-color-scheme) exists', () => {
    expect(baseCSS).toContain('prefers-color-scheme: light');
  });
});

describe('Utility Classes Existence', () => {
  const layoutCSS = fs.readFileSync(path.join(MODULES_DIR, 'layout.css'), 'utf8');
  const typographyCSS = fs.readFileSync(path.join(MODULES_DIR, 'typography.css'), 'utf8');
  const utilitiesCSS = fs.readFileSync(path.join(MODULES_DIR, 'utilities.css'), 'utf8');
  const statesCSS = fs.readFileSync(path.join(MODULES_DIR, 'states.css'), 'utf8');
  const animationsCSS = fs.readFileSync(path.join(MODULES_DIR, 'animations.css'), 'utf8');

  test('display utilities exist', () => {
    ['block', 'inline-block', 'inline', 'flex', 'inline-flex', 'grid', 'hidden'].forEach(cls => {
      expect(layoutCSS).toContain(`.${cls}`);
    });
  });

  test('flexbox utilities exist', () => {
    ['flex-row', 'flex-col', 'flex-wrap', 'flex-1', 'flex-auto', 'flex-none'].forEach(cls => {
      expect(layoutCSS).toContain(`.${cls}`);
    });
  });

  test('justify/align utilities exist', () => {
    ['justify-start', 'justify-end', 'justify-center', 'justify-between'].forEach(cls => {
      expect(layoutCSS).toContain(`.${cls}`);
    });
    ['items-start', 'items-end', 'items-center', 'items-stretch'].forEach(cls => {
      expect(layoutCSS).toContain(`.${cls}`);
    });
  });

  test('grid utilities exist', () => {
    [1, 2, 3, 4, 5, 6, 12].forEach(n => {
      expect(layoutCSS).toContain(`.grid-cols-${n}`);
    });
    [1, 2, 3, 4, 5, 6].forEach(n => {
      expect(layoutCSS).toContain(`.col-span-${n}`);
    });
  });

  test('spacing utilities exist', () => {
    // padding: p-0 through p-8 all exist
    [0, 1, 2, 3, 4, 5, 6, 8].forEach(n => {
      expect(layoutCSS).toContain(`.p-${n}`);
    });
    // margin: m-0 through m-4 exist, then m-6, m-8 (no m-5)
    [0, 1, 2, 3, 4, 6, 8].forEach(n => {
      expect(layoutCSS).toContain(`.m-${n}`);
    });
  });

  test('fractional width utilities exist', () => {
    expect(layoutCSS).toContain('.w-1\\/2');
    expect(layoutCSS).toContain('.w-1\\/3');
    expect(layoutCSS).toContain('.w-2\\/3');
    expect(layoutCSS).toContain('.w-1\\/4');
    expect(layoutCSS).toContain('.w-3\\/4');
  });

  test('typography size utilities exist', () => {
    ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl'].forEach(cls => {
      expect(typographyCSS).toContain(`.${cls}`);
    });
  });

  test('font weight utilities exist', () => {
    ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'].forEach(cls => {
      expect(typographyCSS).toContain(`.${cls}`);
    });
  });

  test('text color utilities exist', () => {
    ['text-primary', 'text-secondary', 'text-muted', 'text-accent'].forEach(cls => {
      expect(typographyCSS).toContain(`.${cls}`);
    });
  });

  test('transform utilities exist', () => {
    expect(utilitiesCSS).toContain('.rotate-90');
    expect(utilitiesCSS).toContain('.scale-105');
    expect(utilitiesCSS).toContain('.translate-x-full');
  });

  test('hover state variants exist', () => {
    expect(statesCSS).toContain('hover\\:bg-accent');
    expect(statesCSS).toContain('hover\\:text-primary');
    expect(statesCSS).toContain('hover\\:shadow-lg');
  });

  test('focus state variants exist', () => {
    expect(statesCSS).toContain('focus\\:ring');
    expect(statesCSS).toContain('focus\\:border-accent');
    expect(statesCSS).toContain('focus\\:outline-none');
  });

  test('animation utilities exist', () => {
    ['animate-fade-in', 'animate-slide-up', 'animate-pulse', 'animate-spin', 'animate-bounce'].forEach(cls => {
      expect(animationsCSS).toContain(`.${cls}`);
    });
  });

  test('reduced motion media query exists', () => {
    expect(animationsCSS).toContain('prefers-reduced-motion: reduce');
  });
});

describe('Responsive Variants', () => {
  const layoutCSS = fs.readFileSync(path.join(MODULES_DIR, 'layout.css'), 'utf8');

  test('all 4 breakpoints are defined', () => {
    expect(layoutCSS).toContain('min-width: 576px');  // sm
    expect(layoutCSS).toContain('min-width: 768px');  // md
    expect(layoutCSS).toContain('min-width: 1024px'); // lg
    expect(layoutCSS).toContain('min-width: 1280px'); // xl
  });

  test.each(['sm', 'md', 'lg', 'xl'])('%s breakpoint has display utilities', (bp) => {
    expect(layoutCSS).toContain(`.${bp}\\:block`);
    expect(layoutCSS).toContain(`.${bp}\\:hidden`);
    expect(layoutCSS).toContain(`.${bp}\\:flex`);
    expect(layoutCSS).toContain(`.${bp}\\:grid`);
  });

  test.each(['sm', 'md', 'lg', 'xl'])('%s breakpoint has grid utilities', (bp) => {
    expect(layoutCSS).toContain(`.${bp}\\:grid-cols-1`);
    expect(layoutCSS).toContain(`.${bp}\\:grid-cols-2`);
    expect(layoutCSS).toContain(`.${bp}\\:grid-cols-3`);
  });

  test.each(['sm', 'md', 'lg', 'xl'])('%s breakpoint has gap utilities', (bp) => {
    expect(layoutCSS).toContain(`.${bp}\\:gap-4`);
    expect(layoutCSS).toContain(`.${bp}\\:gap-6`);
  });

  test.each(['sm', 'md', 'lg', 'xl'])('%s breakpoint has fractional widths', (bp) => {
    expect(layoutCSS).toContain(`.${bp}\\:w-1\\/2`);
    expect(layoutCSS).toContain(`.${bp}\\:w-1\\/3`);
  });
});

describe('Component Classes', () => {
  const componentsCSS = fs.readFileSync(path.join(MODULES_DIR, 'components.css'), 'utf8');
  const navigationCSS = fs.readFileSync(path.join(MODULES_DIR, 'navigation.css'), 'utf8');
  const formsCSS = fs.readFileSync(path.join(MODULES_DIR, 'forms.css'), 'utf8');

  test('button variants exist', () => {
    ['btn', 'btn-primary', 'btn-secondary', 'btn-ghost', 'btn-warm', 'btn-danger'].forEach(cls => {
      expect(componentsCSS).toContain(`.${cls}`);
    });
  });

  test('button sizes exist', () => {
    ['btn-sm', 'btn-lg', 'btn-icon'].forEach(cls => {
      expect(componentsCSS).toContain(`.${cls}`);
    });
  });

  test('card components exist', () => {
    ['card', 'card-hover', 'card-header', 'card-body', 'card-footer'].forEach(cls => {
      expect(componentsCSS).toContain(`.${cls}`);
    });
  });

  test('badge variants exist', () => {
    ['badge', 'badge-accent', 'badge-success', 'badge-error', 'badge-info'].forEach(cls => {
      expect(componentsCSS).toContain(`.${cls}`);
    });
  });

  test('alert variants exist', () => {
    ['alert', 'alert-success', 'alert-warning', 'alert-error', 'alert-info'].forEach(cls => {
      expect(componentsCSS).toContain(`.${cls}`);
    });
  });

  test('modal uses dialog element', () => {
    expect(componentsCSS).toContain('.modal::backdrop');
    expect(componentsCSS).toContain('.modal[open]');
  });

  test('navigation components exist', () => {
    ['navbar', 'navbar-brand', 'navbar-nav', 'navbar-link'].forEach(cls => {
      expect(navigationCSS).toContain(`.${cls}`);
    });
  });

  test('sidebar components exist', () => {
    ['sidebar', 'sidebar-link', 'sidebar-header', 'sidebar-section'].forEach(cls => {
      expect(navigationCSS).toContain(`.${cls}`);
    });
  });

  test('tabs components exist', () => {
    expect(navigationCSS).toContain('.tabs');
    expect(navigationCSS).toContain('.tab');
    expect(navigationCSS).toContain('.tabs-pill');
  });

  test('form components exist', () => {
    ['input', 'textarea', 'select', 'checkbox', 'radio', 'toggle', 'range'].forEach(cls => {
      expect(formsCSS).toContain(`.${cls}`);
    });
  });

  test('form validation states exist', () => {
    expect(formsCSS).toContain('.input-success');
    expect(formsCSS).toContain('.input-error');
    expect(formsCSS).toContain('.form-error');
    expect(formsCSS).toContain('.form-success');
  });
});

describe('Theme System', () => {
  const baseCSS = fs.readFileSync(path.join(MODULES_DIR, 'base.css'), 'utf8');

  test('dark theme is the default (:root)', () => {
    // :root and [data-theme="dark"] share the same block
    expect(baseCSS).toMatch(/:root[\s\S]*?\{[\s\S]*?--noir-bg-primary:\s*#0a0a0a/);
  });

  test('light theme defines lighter backgrounds', () => {
    const lightSection = baseCSS.match(/\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
    expect(lightSection).not.toBeNull();
    expect(lightSection[1]).toContain('#f8f8f8');
  });

  test('dark and light themes define different accent colors', () => {
    // Dark accent
    expect(baseCSS).toMatch(/:root[\s\S]*?--noir-accent:\s*#e84545/);
    // Light accent
    const lightSection = baseCSS.match(/\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
    expect(lightSection[1]).toContain('#d63031');
  });

  test('reduced-motion is respected for scroll-behavior', () => {
    expect(baseCSS).toContain('prefers-reduced-motion: no-preference');
    expect(baseCSS).toContain('scroll-behavior: smooth');
  });

  test('focus-visible outline is defined', () => {
    expect(baseCSS).toContain(':focus-visible');
    expect(baseCSS).toContain('outline: 2px solid');
  });
});

describe('Design Tokens - Complete Coverage', () => {
  const baseCSS = fs.readFileSync(path.join(MODULES_DIR, 'base.css'), 'utf8');

  // Extract the dark theme block (:root, [data-theme="dark"])
  const darkMatch = baseCSS.match(/:root,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
  const darkBlock = darkMatch ? darkMatch[1] : '';

  describe('Background tokens (4)', () => {
    test.each([
      '--noir-bg-primary',
      '--noir-bg-secondary',
      '--noir-bg-tertiary',
      '--noir-bg-elevated',
    ])('%s is defined in dark theme', (token) => {
      expect(darkBlock).toContain(token);
    });
  });

  describe('Text tokens (4)', () => {
    test.each([
      '--noir-text-primary',
      '--noir-text-secondary',
      '--noir-text-muted',
      '--noir-text-inverse',
    ])('%s is defined in dark theme', (token) => {
      expect(darkBlock).toContain(token);
    });
  });

  describe('Accent tokens (5)', () => {
    test.each([
      ['--noir-accent', '#e84545'],
      ['--noir-accent-hover', '#ff5252'],
      ['--noir-accent-subtle', 'rgba(232, 69, 69, 0.15)'],
      ['--noir-accent-warm', '#f97316'],
      ['--noir-accent-warm-hover', '#fb923c'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Border tokens (3)', () => {
    test.each([
      ['--noir-border:', '#2a2a2a'],
      ['--noir-border-hover', '#3a3a3a'],
      ['--noir-border-focus', 'var(--noir-accent)'],
    ])('%s is defined in dark theme', (token, value) => {
      const checkToken = token.replace(/:$/, '');
      expect(darkBlock).toContain(checkToken);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Semantic color tokens (8)', () => {
    test.each([
      ['--noir-success:', '#22c55e'],
      ['--noir-success-subtle', 'rgba(34, 197, 94, 0.15)'],
      ['--noir-warning:', '#eab308'],
      ['--noir-warning-subtle', 'rgba(234, 179, 8, 0.15)'],
      ['--noir-error:', '#ef4444'],
      ['--noir-error-subtle', 'rgba(239, 68, 68, 0.15)'],
      ['--noir-info:', '#3b82f6'],
      ['--noir-info-subtle', 'rgba(59, 130, 246, 0.15)'],
    ])('%s is defined with value %s', (token, value) => {
      const checkToken = token.replace(/:$/, '');
      expect(darkBlock).toContain(checkToken);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Spacing tokens (13)', () => {
    test.each([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24])(
      '--noir-space-%i is defined in dark theme',
      (n) => {
        expect(darkBlock).toContain(`--noir-space-${n}:`);
      }
    );
  });

  describe('Font family tokens (2)', () => {
    test.each([
      ['--noir-font-sans', '"Inter"'],
      ['--noir-font-mono', '"JetBrains Mono"'],
    ])('%s is defined in dark theme', (token, contains) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(contains);
    });
  });

  describe('Text size tokens (9)', () => {
    test.each([
      ['--noir-text-xs', '0.75rem'],
      ['--noir-text-sm', '0.875rem'],
      ['--noir-text-base', '1rem'],
      ['--noir-text-lg', '1.125rem'],
      ['--noir-text-xl', '1.25rem'],
      ['--noir-text-2xl', '1.5rem'],
      ['--noir-text-3xl', '1.875rem'],
      ['--noir-text-4xl', '2.25rem'],
      ['--noir-text-5xl', '3rem'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(`${token}:`);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Leading tokens (3)', () => {
    test.each([
      ['--noir-leading-tight', '1.25'],
      ['--noir-leading-normal', '1.5'],
      ['--noir-leading-relaxed', '1.75'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Font weight tokens (5)', () => {
    test.each([
      ['--noir-font-light', '300'],
      ['--noir-font-normal', '400'],
      ['--noir-font-medium', '500'],
      ['--noir-font-semibold', '600'],
      ['--noir-font-bold', '700'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Border radius tokens (6)', () => {
    test.each([
      ['--noir-radius-none', '0'],
      ['--noir-radius-sm', '0.25rem'],
      ['--noir-radius-md', '0.5rem'],
      ['--noir-radius-lg', '0.75rem'],
      ['--noir-radius-xl', '1rem'],
      ['--noir-radius-full', '9999px'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(`${token}:`);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Shadow tokens (5)', () => {
    test.each([
      '--noir-shadow-sm',
      '--noir-shadow-md',
      '--noir-shadow-lg',
      '--noir-shadow-xl',
      '--noir-shadow-glow',
    ])('%s is defined in dark theme', (token) => {
      expect(darkBlock).toContain(`${token}:`);
    });
  });

  describe('Transition tokens (3)', () => {
    test.each([
      ['--noir-transition-fast', '150ms ease'],
      ['--noir-transition-base', '250ms ease'],
      ['--noir-transition-slow', '400ms ease'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(value);
    });
  });

  describe('Z-index tokens (6)', () => {
    test.each([
      ['--noir-z-tooltip', '50'],
      ['--noir-z-dropdown', '100'],
      ['--noir-z-sticky', '200'],
      ['--noir-z-overlay', '300'],
      ['--noir-z-modal', '400'],
      ['--noir-z-toast', '500'],
    ])('%s is defined with value %s', (token, value) => {
      expect(darkBlock).toContain(token);
      expect(darkBlock).toContain(value);
    });
  });

  test('color-scheme is set to dark in root', () => {
    expect(darkBlock).toContain('color-scheme: dark');
  });

  test('total of 76 custom properties are defined in dark theme', () => {
    const customProps = [...darkBlock.matchAll(/--noir-[a-zA-Z0-9-]+\s*:/g)];
    expect(customProps.length).toBe(76);
  });
});

describe('Cross-Theme Consistency', () => {
  const baseCSS = fs.readFileSync(path.join(MODULES_DIR, 'base.css'), 'utf8');

  // Extract the light theme block
  const lightMatch = baseCSS.match(/\[data-theme="light"\]\s*\{([\s\S]*?)\}/);
  const lightBlock = lightMatch ? lightMatch[1] : '';

  // Extract the auto theme block
  const autoMatch = baseCSS.match(/prefers-color-scheme:\s*light\)[\s\S]*?\{[\s\S]*?:root:not\(\[data-theme\]\)\s*\{([\s\S]*?)\}/);
  const autoBlock = autoMatch ? autoMatch[1] : '';

  test('light theme overrides all visual tokens', () => {
    const visualTokens = [
      '--noir-bg-primary', '--noir-bg-secondary', '--noir-bg-tertiary', '--noir-bg-elevated',
      '--noir-text-primary', '--noir-text-secondary', '--noir-text-muted', '--noir-text-inverse',
      '--noir-accent:', '--noir-accent-hover', '--noir-accent-subtle', '--noir-accent-warm:', '--noir-accent-warm-hover',
      '--noir-border:', '--noir-border-hover',
      '--noir-shadow-sm', '--noir-shadow-md', '--noir-shadow-lg', '--noir-shadow-xl', '--noir-shadow-glow',
    ];
    visualTokens.forEach(token => {
      // Remove trailing colon for checking
      const checkToken = token.replace(/:$/, '');
      expect(lightBlock).toContain(checkToken);
    });
  });

  test('auto theme block matches light theme block', () => {
    // Both should define the same set of overrides
    const lightVars = [...lightBlock.matchAll(/--noir-([a-zA-Z0-9-]+)/g)].map(m => m[1]).sort();
    const autoVars = [...autoBlock.matchAll(/--noir-([a-zA-Z0-9-]+)/g)].map(m => m[1]).sort();
    expect(autoVars).toEqual(lightVars);
  });

  test('light theme does NOT override spacing tokens (they are theme-independent)', () => {
    expect(lightBlock).not.toContain('--noir-space-');
  });

  test('light theme does NOT override typography tokens (they are theme-independent)', () => {
    expect(lightBlock).not.toContain('--noir-text-xs');
    expect(lightBlock).not.toContain('--noir-font-sans');
    expect(lightBlock).not.toContain('--noir-leading-');
  });

  test('light theme does NOT override radius tokens', () => {
    expect(lightBlock).not.toContain('--noir-radius-');
  });

  test('light theme does NOT override transition tokens', () => {
    expect(lightBlock).not.toContain('--noir-transition-');
  });

  test('light theme does NOT override z-index tokens', () => {
    expect(lightBlock).not.toContain('--noir-z-');
  });

  test('light and dark themes use different background colors', () => {
    expect(lightBlock).toContain('#f8f8f8');
    expect(baseCSS).toMatch(/:root[\s\S]*?--noir-bg-primary:\s*#0a0a0a/);
  });

  test('light and dark themes use different accent colors', () => {
    expect(lightBlock).toContain('#d63031');
    expect(baseCSS).toMatch(/:root[\s\S]*?--noir-accent:\s*#e84545/);
  });

  test('color-scheme is correctly set for both themes', () => {
    expect(baseCSS).toContain('color-scheme: dark');
    expect(lightBlock).toContain('color-scheme: light');
  });
});
