# AGENTS.md

## Project Overview

Shop 502 Cart TUI is a JavaScript and Node.js proof of concept for managing an anonymous shopping cart through a terminal interface.

The application requests the user's name, accepts commands using the format `<product-id> <quantity>`, updates the cart in memory, displays validation or business errors, and ends the session with `bye`.

Main files:

- `src/cart.js`: cart business logic.
- `src/parser.js`: command validation and parsing.
- `src/tui.js`: testable conversational flow.
- `src/index.js`: terminal entry point.
- `tests/`: unit and integration tests.
- `docs/specification.md`: functional rules and acceptance criteria.

## Commands

Install dependencies:

```bash
npm ci
```

Run the application:

```bash
npm start
```

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run coverage
```

Build the distributable:

```bash
npm run build
```

Before opening a Pull Request, run tests, coverage and build.

## Coding Guidelines

- Use ECMAScript modules with `import` and `export`.
- Include the `.js` extension in local imports.
- Keep cart logic, parsing and terminal interaction separated.
- Use small functions with clear names and one responsibility.
- Validate input before modifying cart state.
- Preserve product IDs as strings, including leading zeroes.
- Avoid unnecessary dependencies and duplicated logic.
- Update tests and documentation when behavior or user-facing messages change.
- Do not place business logic directly in `src/index.js`.

## Testing Instructions

Use Vitest for unit and integration tests.

- Test every new business rule.
- Test successful and rejected cart operations.
- Confirm rejected operations do not modify cart state.
- Add integration tests for changes to the TUI flow.
- Use meaningful assertions instead of only checking that code executes.
- Maintain at least 80% coverage for lines, functions, statements and branches.
- Do not disable or bypass failing CI checks.

## Security Standards

- Never commit secrets, tokens, credentials or personal data.
- Do not commit `.env` files, logs, `node_modules`, coverage reports or build outputs.
- Validate all terminal input before using it.
- Do not execute user input as code or shell commands.
- Review new dependencies before adding them.
- Keep the application local and in memory; do not add persistence or external services unless explicitly requested.

## Agent Workflow

Before changing code:

1. Read this file and `docs/specification.md`.
2. Inspect the existing implementation and tests.
3. Make the smallest reasonable change.
4. Add or update tests.
5. Run `npm test`, `npm run coverage` and `npm run build`.
6. Work on a separate branch and submit changes through a Pull Request to `main`.