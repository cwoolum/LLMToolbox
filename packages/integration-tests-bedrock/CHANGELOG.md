# integration-tests-bedrock

## 1.0.1

### Patch Changes

- Add centralized test fixture system and improve object type handling in parsers. (by [@cwoolum](https://github.com/cwoolum) in [#10](https://github.com/cwoolum/LLMToolbox/pull/10))

  - Create shared test fixtures with framework-specific variants in test-utils
  - Enhance parser to correctly handle nested object properties and complex TypeScript types
  - Add support for distinguishing between object types and primitive types
  - Improve property type detection and metadata extraction
  - Standardize testing approach across OpenAI, Anthropic, and Bedrock frameworks
  - Fix type handling for complex generics and interfaces

- Updated dependencies [[`a998fda`](https://github.com/cwoolum/LLMToolbox/commit/a998fda53eacd3aa872182dab2a4dd0fb85f7b0b)]:
  - @llmtoolbox/test-utils@0.1.0
  - llm-toolbox@0.4.0
