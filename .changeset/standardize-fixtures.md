---
'@llmtoolbox/test-utils': minor
'llm-toolbox': minor
'integration-tests-anthropic': patch
'integration-tests-bedrock': patch
'integration-tests-openai': patch
---

Add centralized test fixture system and improve object type handling in parsers.

- Create shared test fixtures with framework-specific variants in test-utils
- Enhance parser to correctly handle nested object properties and complex TypeScript types
- Add support for distinguishing between object types and primitive types
- Improve property type detection and metadata extraction
- Standardize testing approach across OpenAI, Anthropic, and Bedrock frameworks
- Fix type handling for complex generics and interfaces