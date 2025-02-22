# CLI Tool for Generating Function Metadata Schemas

![Build Status](https://github.com/cwoolum/LLMToolbox/actions/workflows/push.yml/badge.svg)

## Overview

This CLI tool extracts function metadata from TypeScript and JavaScript files and generates schema definitions for AI frameworks like LangChain and AWS Bedrock.

## Features

- Extracts function metadata from TypeScript and JavaScript files
- Generates schema definitions for AI frameworks
- Supports LangChain and AWS Bedrock frameworks
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

## Implementation Matrix

| Framework | Status |
| --------- | ------ |
| LangChain | Not Tested |
| Bedrock   | Alpha Tested |

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## Acknowledgements

We would like to thank all the contributors and the open-source community for their support.

## License

MIT
