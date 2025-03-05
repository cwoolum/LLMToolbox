# LLMToolbox Development Guidelines

## Build Commands
- Build all packages: `npm run build`
- Build specific package: `cd packages/llm-toolbox && npm run build`
- Start CLI: `cd packages/llm-toolbox && npm run start`
- Run all tests: `npm run test`
- Run package tests: `cd packages/llm-toolbox && npm run test`
- Run specific test: `cd packages/llm-toolbox && npx vitest <test-file-path>`
- Run tests in watch mode: `cd packages/llm-toolbox && npm run test:watch`

## Code Style
- Use TypeScript with strict mode enabled
- 2-space indentation, double quotes for strings
- Use semicolons at end of statements
- camelCase for variables/functions, PascalCase for interfaces/types
- Always include file extensions in imports (.js)
- Prefer named imports with curly braces
- Add explicit return type annotations on functions
- JSDoc required for all functions with @param tags for parameters
- Early returns with guard clauses for error handling
- Use descriptive error messages with context

## Important Node.js Module Setup
- All packages use ES modules (`"type": "module"` in package.json)
- When importing from relative paths, always use .js extension (e.g., `import { foo } from "./bar.js"`)
- TypeScript is configured with `"moduleResolution": "NodeNext"` for proper ESM support
- Add type annotations for parameters in callbacks to prevent TS errors

## Supported Frameworks
- LangChain: Compatible with LangChain's tool schema format
- Bedrock: Compatible with AWS Bedrock tool schema format
- Anthropic: Compatible with Anthropic TypeScript SDK tool schema format

## Committing changes

Befor committing changes, you always need to create a changeset file. Changeset files should follow this format:
```
---
'package-name': major|minor|patch
---

Description of the changes in clear, concise language.
```
Rules:
1. Use semantic versioning rules to determine if changes are major, minor, or patch
2. Write clear, specific descriptions that explain what changed and why
3. Multiple packages can be listed if needed
4. The description should be written in present tense