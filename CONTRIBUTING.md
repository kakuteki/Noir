# Contributing to Noir

Thank you for your interest in contributing to Noir CSS Framework!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Noir.git`
3. Create a branch: `git checkout -b feat/your-feature`
4. Open `index.html` in your browser to preview changes

## Project Structure

```
css/
├── noir.css              # Entry point (imports all modules)
└── modules/
    ├── base.css          # Variables, reset, theme
    ├── typography.css    # Font utilities
    ├── layout.css        # Grid, flex, spacing, responsive
    ├── forms.css         # Form elements
    ├── components.css    # UI components
    ├── navigation.css    # Nav components
    ├── utilities.css     # Transform utilities
    └── animations.css    # Animation utilities
```

## Guidelines

### CSS Conventions

- Use CSS custom properties (variables) defined in `base.css`
- Follow the `--noir-` prefix for all custom properties
- Use BEM-inspired flat class names (e.g., `.card-header`, `.btn-primary`)
- Add responsive variants using the `sm:`, `md:`, `lg:`, `xl:` prefix pattern

### Adding a New Utility

1. Add the class to the appropriate module file
2. Use existing CSS variables where possible
3. Add responsive variants if applicable
4. Update `reference.html` with the new class

### Adding a New Component

1. Add styles to `components.css` (or `navigation.css` for nav-related)
2. Add a demo to `index.html`
3. Update `reference.html`
4. Update `CHANGELOG.md`

## Commit Messages

- Write in Japanese or English
- Use descriptive messages explaining the change
- Reference issue numbers when applicable

## Pull Requests

1. Keep PRs focused on a single change
2. Update documentation if adding new features
3. Ensure dark and light themes both work
4. Test across major browsers (Chrome, Firefox, Safari, Edge)

## Reporting Issues

Use [GitHub Issues](https://github.com/kakuteki/Noir/issues) to report bugs or suggest features.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
