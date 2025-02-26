import { Command } from "commander";
import { parseFiles } from "./parser.js";
import { generateLangChainSchema } from "./generators/langchain.js";
import { generateBedrockSchema } from "./generators/bedrock.js";
import { generateAnthropicSchema } from "./generators/anthropic.js";
import * as fs from "fs";

export function runCLI() {
  const program = new Command();
  program
    .requiredOption("-f, --files <paths...>", "File paths to process")
    .requiredOption(
      "-r, --framework <framework>",
      "Framework to generate schema for (langchain, bedrock, or anthropic)",
    )
    .option("-m, --model <model>", "Optional model name")
    .requiredOption("-o, --output <file>", "Output file name")
    .option("--ignore-missing-metadata", "Ignore missing metadata errors", false)
    .option("--debug", "Enable debug mode", false);

  program.parse(process.argv);
  const options = program.opts();
  const files: string[] = options.files;
  const framework = options.framework.toLowerCase();
  const model = options.model;
  const outputFile = options.output;
  const ignoreMissing = options.ignoreMissingMetadata;
  const debug = options.debug;

  console.log("Starting processing...");
  let parsedData = parseFiles(files, ignoreMissing);

  let schema;
  if (framework === "langchain") {
    schema = generateLangChainSchema(parsedData, model);
  } else if (framework === "bedrock") {
    schema = generateBedrockSchema(parsedData, model);
  } else if (framework === "anthropic") {
    schema = generateAnthropicSchema(parsedData, model);
  } else {
    console.error(`Unsupported framework: ${framework}. Supported frameworks: langchain, bedrock, anthropic`);
    process.exit(1);
  }

  fs.writeFileSync(outputFile, `export const toolConfig = ${JSON.stringify(schema, null, 2)}`);
  console.log(`Schema written to ${outputFile}`);

  if (debug) {
    console.log("Generated Schema:");
    console.log(JSON.stringify(schema, null, 2));
  }
}
