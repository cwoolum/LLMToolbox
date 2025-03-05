---
'@llmtoolbox/test-utils': minor
'@llmtoolbox/llm-toolbox': minor
'@llmtoolbox/integration-tests-anthropic': patch
'@llmtoolbox/integration-tests-bedrock': patch
'@llmtoolbox/integration-tests-openai': patch
---

Add centralized test fixture system and improve object type handling in parsers.

- Create shared test fixtures with framework-specific variants in test-utils
- Enhance parser to correctly handle nested object properties and complex TypeScript types
- Add support for distinguishing between object types and primitive types
- Improve property type detection and metadata extraction
- Standardize testing approach across OpenAI, Anthropic, and Bedrock frameworks
- Fix type handling for complex generics and interfaces