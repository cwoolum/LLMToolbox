# CLI Tool for Generating Function Metadata Schemas

![Build Status](https://github.com/cwoolum/LLMToolbox/actions/workflows/build-and-test.yml/badge.svg)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/cwoolum/your-gist-id/raw/coverage.json)

## Overview

This CLI tool extracts function metadata from TypeScript and JavaScript files and generates schema definitions for AI frameworks like LangChain and AWS Bedrock.

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
- `-r, --framework <framework>`: Target framework (`langchain` or `bedrock`).
- `-o, --output <file>`: Output file to save the generated schema.

### Optional Parameters:

- `-m, --model <model>`: Optional model name for the framework.
- `--ignore-missing-metadata`: Continue even if metadata is missing.
- `--debug`: Print the generated schema to the console.

## Example

```sh
cli-tool -f src/tools.ts -r langchain -o schema.json --debug
```

## Supported Frameworks and Models

| Framework | Supported Models |
| --------- | ---------------- |
| LangChain | N/A              |
| Bedrock   | Claude, Nova     |

## License

MIT
