# llm-toolbox

## 0.4.2

### Patch Changes

- Add GitHub Releases creation when packages are published. (in [`3c4225b`](https://github.com/cwoolum/LLMToolbox/commit/3c4225ba88de58801bc76c34f289b1fddf3a0a96))

## 0.4.1

### Patch Changes

- Fix parser to correctly handle destructured function parameters. (by [@cwoolum](https://github.com/cwoolum) in [#12](https://github.com/cwoolum/LLMToolbox/pull/12))

## 0.4.0

### Minor Changes

- Add centralized test fixture system and improve object type handling in parsers. (by [@cwoolum](https://github.com/cwoolum) in [#10](https://github.com/cwoolum/LLMToolbox/pull/10))

  - Create shared test fixtures with framework-specific variants in test-utils
  - Enhance parser to correctly handle nested object properties and complex TypeScript types
  - Add support for distinguishing between object types and primitive types
  - Improve property type detection and metadata extraction
  - Standardize testing approach across OpenAI, Anthropic, and Bedrock frameworks
  - Fix type handling for complex generics and interfaces

## 0.3.1

### Patch Changes

- Fix CI/CD flows (by [@cwoolum](https://github.com/cwoolum) in [#8](https://github.com/cwoolum/LLMToolbox/pull/8))

## 0.3.0

### Minor Changes

- Add support for OpenAI (by [@cwoolum](https://github.com/cwoolum) in [#6](https://github.com/cwoolum/LLMToolbox/pull/6))

## 0.2.0

### Minor Changes

- Add support for the Anthropic SDK (by [@cwoolum](https://github.com/cwoolum) in [#2](https://github.com/cwoolum/LLMToolbox/pull/2))

## 0.1.3

### Patch Changes

- Add in changesets for automated versioning (by [@cwoolum](https://github.com/cwoolum) in [`7d88730`](https://github.com/cwoolum/LLMToolbox/commit/7d887306859b9036f1c545958caee73d0be73e80))
