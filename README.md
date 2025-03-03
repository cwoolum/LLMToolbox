# LLM Toolbox - Function Schema Generator

![Build Status](https://github.com/cwoolum/LLMToolbox/actions/workflows/push.yml/badge.svg)

## Overview

LLM Toolbox is a powerful CLI tool that extracts function metadata from TypeScript and JavaScript files and generates schema definitions for various AI frameworks including LangChain, AWS Bedrock, Anthropic, and OpenAI.

## Features

- Extracts function metadata from TypeScript and JavaScript files
- Generates schema definitions for multiple AI frameworks
- Interactive CLI mode with user-friendly interface
- Configuration file support (.llmtoolboxrc.json)
- Schema validation to ensure framework compliance
- Plugin system for custom framework extensions
- Cross-platform support via Node.js

## Installation

```sh
npm install -g llm-toolbox
```

## Usage

### CLI Mode
```sh
llm-toolbox -f <file.ts> -r <framework> -o <output.json> [options]
```

### Interactive Mode
```sh
llm-toolbox -i
```

### Configuration File
Create a `.llmtoolboxrc.json` file in your project root:
```json
{
  "framework": "openai",
  "files": ["src/tools/**/*.ts"],
  "output": "openai-schema.js",
  "debug": true,
  "validate": true
}
```

### Parameters:

- `-f, --files <paths...>`: One or more file paths to parse.
- `-r, --framework <framework>`: Target framework (`langchain`, `bedrock`, `anthropic`, or `openai`).
- `-o, --output <file>`: Output file to save the generated schema.
- `-m, --model <model>`: Optional model name for the framework.
- `-i, --interactive`: Run in interactive mode with user-friendly prompts.
- `-c, --config <path>`: Path to a custom config file.
- `--ignore-missing-metadata`: Continue even if metadata is missing.
- `--debug`: Print the generated schema to the console.
- `--validate`: Validate generated schema against framework specifications.

## Examples

```sh
# Generate LangChain schema
llm-toolbox -f src/tools.ts -r langchain -o langchain-schema.js --debug

# Generate Bedrock schema with model
llm-toolbox -f src/tools.ts -r bedrock -o bedrock-schema.js -m claude-3-sonnet

# Generate Anthropic schema with validation
llm-toolbox -f src/tools.ts -r anthropic -o anthropic-schema.js -m claude-3-opus-20240229 --validate

# Generate OpenAI schema
llm-toolbox -f src/tools.ts -r openai -o openai-schema.js

# Run in interactive mode
llm-toolbox -i

# Use a custom config file
llm-toolbox -c ./configs/openai.json
```

## Supported Frameworks and Models

| Framework | Supported Models |
| --------- | ---------------- |
| LangChain | N/A              |
| Bedrock   | Claude, Claude 3 family, Nova |
| Anthropic | Claude 3 family  |
| OpenAI    | GPT-3.5, GPT-4 family |

## Implementation Matrix

| Framework | Status      | Schema Validation |
| --------- | ----------- | ---------------- |
| LangChain | Alpha       | Not Implemented  |
| Bedrock   | Beta        | Not Implemented  |
| Anthropic | Beta        | Implemented      |
| OpenAI    | Beta        | Implemented      |

## Plugin System

LLM Toolbox supports a plugin system for adding custom framework generators. To create a plugin:

1. Create a `.js` file in the `plugins` directory
2. Export a default object with the following structure:

```js
export default {
  name: "My Custom Framework",
  framework: "custom",
  description: "Support for My Custom LLM Framework",
  generate: (tools, options) => {
    // Transform tools into your framework's schema format
    return { /* your schema here */ };
  }
};
```

3. Use your plugin with: `llm-toolbox -f tools.ts -r custom -o custom-schema.js`

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Acknowledgements

We would like to thank all the contributors and the open-source community for their support.

## License

MIT
