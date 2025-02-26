import { Command } from "commander";
import { parseFiles } from "./parser.js";
import { generateLangChainSchema } from "./generators/langchain.js";
import { generateBedrockSchema } from "./generators/bedrock.js";
import { generateAnthropicSchema } from "./generators/anthropic.js";
import { generateOpenAISchema } from "./generators/openai.js";
import { loadConfig } from "./config.js";
import { getValidator } from "./validators/index.js";
import { runInteractiveUI, withSpinner, displayParsedTools } from "./ui.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

export async function runCLI() {
  // Load config file if exists
  const configFile = loadConfig();
  
  const program = new Command();
  program
    .option("-f, --files <paths...>", "File paths to process")
    .option(
      "-r, --framework <framework>",
      "Framework to generate schema for (langchain, bedrock, anthropic, or openai)",
    )
    .option("-m, --model <model>", "Optional model name")
    .option("-o, --output <file>", "Output file name")
    .option("--ignore-missing-metadata", "Ignore missing metadata errors", false)
    .option("--debug", "Enable debug mode", false)
    .option("-c, --config <path>", "Path to config file")
    .option("--validate", "Validate schema against framework specifications", false)
    .option("-i, --interactive", "Run in interactive mode", false);

  program.parse(process.argv);
  const cliOptions = program.opts();
  
  // Interactive mode
  if (cliOptions.interactive) {
    const interactiveOptions = await runInteractiveUI();
    // Merge with any defaults from config file
    Object.assign(cliOptions, interactiveOptions);
  }
  
  // Load config from specified path if provided
  const configFromPath = cliOptions.config ? loadConfig(cliOptions.config) : {};
  
  // Merge configs with CLI options taking precedence
  const options = {
    ...configFile,
    ...configFromPath,
    ...cliOptions
  };
  
  // Validate required options
  if (!options.files || options.files.length === 0) {
    console.error("No input files specified. Use --files option or config file.");
    process.exit(1);
  }
  
  if (!options.framework) {
    console.error("No framework specified. Use --framework option or config file.");
    process.exit(1);
  }
  
  if (!options.output) {
    console.error("No output file specified. Use --output option or config file.");
    process.exit(1);
  }
  
  const files: string[] = options.files;
  const framework = options.framework.toLowerCase();
  const model = options.model;
  const outputFile = options.output;
  const ignoreMissing = options.ignoreMissingMetadata;
  const debug = options.debug || false;
  const shouldValidate = options.validate || false;

  console.log(chalk.blue("Starting processing..."));
  
  // Parse files with spinner
  let parsedData;
  try {
    parsedData = await withSpinner("Parsing input files...", async () => {
      return parseFiles(files, !!ignoreMissing);
    });
    
    if (debug) {
      displayParsedTools(parsedData);
    }
  } catch (error) {
    console.error(chalk.red(`Error parsing files: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }

  let schema;
  try {
    schema = await withSpinner(`Generating schema for ${framework}...`, async () => {
      if (framework === "langchain") {
        return generateLangChainSchema(parsedData, model);
      } else if (framework === "bedrock") {
        return generateBedrockSchema(parsedData, model);
      } else if (framework === "anthropic") {
        return generateAnthropicSchema(parsedData, model);
      } else if (framework === "openai") {
        return generateOpenAISchema(parsedData);
      } else {
        throw new Error(`Unsupported framework: ${framework}. Supported frameworks: langchain, bedrock, anthropic, openai`);
      }
    });
  } catch (error) {
    console.error(chalk.red(`Error generating schema: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }

  // Validate schema if requested
  if (shouldValidate) {
    const validator = getValidator(framework);
    
    if (validator) {
      try {
        await withSpinner(`Validating schema for ${framework}...`, async () => {
          const validationResult = validator.validate(schema);
          
          if (!validationResult.valid) {
            const errorMessages = validationResult.errors?.join('\n  • ') || '';
            throw new Error(`Schema validation failed:\n  • ${errorMessages}`);
          }
          return true;
        });
      } catch (error) {
        console.error(chalk.red(`${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
      }
    } else {
      console.warn(chalk.yellow(`No validator available for ${framework}, skipping validation.`));
    }
  }

  // Write schema to file
  try {
    await withSpinner(`Writing schema to ${outputFile}...`, async () => {
      fs.writeFileSync(outputFile, `export const toolConfig = ${JSON.stringify(schema, null, 2)}`);
      return true;
    });
  } catch (error) {
    console.error(chalk.red(`Error writing schema: ${error instanceof Error ? error.message : String(error)}`));
    process.exit(1);
  }

  if (debug) {
    console.log(chalk.cyan("\nGenerated Schema:"));
    console.log(chalk.gray(JSON.stringify(schema, null, 2)));
  }
  
  console.log(chalk.green(`\n✓ Successfully generated ${framework} schema!`));
}
