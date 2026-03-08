# Contributing to Cricko API

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/kumarsonu676/cricko-backend.git`
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

```bash
# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm run test
```

## Code Style

- Follow the guidelines in `AGENTS.md`
- Run Prettier before committing:

  ```bash
  npx prettier --write src/
  ```

- Ensure TypeScript compiles without errors

## Commit Messages

Use conventional commits:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: restructure code`
- `test: add tests`
- `chore: maintenance`

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the CHANGELOG if applicable
4. Request review from maintainers

## Questions?

Open an issue for bugs, feature requests, or questions.
