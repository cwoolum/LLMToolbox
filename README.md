# CLI Tool for Generating Function Metadata Schemas

![Build Status](https://github.com/cwoolum/LLMToolbox/actions/workflows/push.yml/badge.svg)

## Overview

This CLI tool extracts function metadata from TypeScript and JavaScript files and generates schema definitions for AI frameworks like LangChain, AWS Bedrock, and Anthropic.

## Features

- Extracts function metadata from TypeScript and JavaScript files
- Generates schema definitions for AI frameworks
- Supports LangChain, AWS Bedrock, and Anthropic frameworks
- Command-line interface for easy usage

## Installation

```sh
npm install -g llm-toolbox
```

## Usage

```sh
cli-tool -f <file.ts> -r <framework> -o <output.json> [options]
```

### Required Parameters:

- `-f, --files <paths...>`: One or more file paths to parse.
- `-r, --framework <framework>`: Target framework (`langchain`, `bedrock`, or `anthropic`).
- `-o, --output <file>`: Output file to save the generated schema.

### Optional Parameters:

- `-m, --model <model>`: Optional model name for the framework.
- `--ignore-missing-metadata`: Continue even if metadata is missing.
- `--debug`: Print the generated schema to the console.

## Examples

```sh
# Generate LangChain schema
cli-tool -f src/tools.ts -r langchain -o langchain-schema.json --debug

# Generate Bedrock schema
cli-tool -f src/tools.ts -r bedrock -o bedrock-schema.json -m claude-3-sonnet

# Generate Anthropic schema
cli-tool -f src/tools.ts -r anthropic -o anthropic-schema.json -m claude-3-opus-20240229
```

## Supported Frameworks and Models

| Framework | Supported Models |
| --------- | ---------------- |
| LangChain | N/A              |
| Bedrock   | Claude, Nova     |
| Anthropic | Claude 3 family  |

## Implementation Matrix

| Framework | Status |
| --------- | ------ |
| LangChain | Not Tested |
| Bedrock   | Alpha Tested |
| Anthropic | Alpha |

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Acknowledgements

We would like to thank all the contributors and the open-source community for their support.

## License

MIT
