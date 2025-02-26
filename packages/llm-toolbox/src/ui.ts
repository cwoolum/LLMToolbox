// @ts-ignore - Missing types for inquirer ESM version
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import { ToolMetadata } from "./parser.js";
import * as fs from "fs";

/**
 * Interactive UI options
 */
export interface InteractiveOptions {
  files: string[];
  framework: string;
  model?: string;
  output: string;
  ignoreMissingMetadata: boolean;
  debug: boolean;
  validate: boolean;
}

/**
 * Run the interactive UI to collect user options
 * @returns User selected options
 */
export async function runInteractiveUI(): Promise<InteractiveOptions> {
  console.log(chalk.blue.bold("\n📦 LLM Toolbox - Interactive Mode\n"));

  // Get framework
  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Select target framework:",
      choices: [
        { name: "LangChain", value: "langchain" },
        { name: "AWS Bedrock", value: "bedrock" },
        { name: "Anthropic", value: "anthropic" },
        { name: "OpenAI", value: "openai" }
      ]
    }
  ]);

  // Get model if necessary
  let model;
  if (framework === "bedrock" || framework === "anthropic") {
    const modelChoices = framework === "bedrock" 
      ? [
          { name: "Claude (Anthropic)", value: "claude" },
          { name: "Claude 3 Sonnet", value: "claude-3-sonnet" },
          { name: "Claude 3 Opus", value: "claude-3-opus" },
          { name: "Nova (Anthropic)", value: "nova" },
          { name: "Other (specify)", value: "other" }
        ]
      : [
          { name: "Claude 3 Opus", value: "claude-3-opus-20240229" },
          { name: "Claude 3 Sonnet", value: "claude-3-sonnet-20240229" },
          { name: "Claude 3 Haiku", value: "claude-3-haiku-20240307" },
          { name: "Other (specify)", value: "other" }
        ];

    const { modelChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "modelChoice",
        message: "Select model:",
        choices: modelChoices
      }
    ]);

    if (modelChoice === "other") {
      const { customModel } = await inquirer.prompt([
        {
          type: "input",
          name: "customModel",
          message: "Enter model name:"
        }
      ]);
      model = customModel;
    } else {
      model = modelChoice;
    }
  }

  // Get files
  const { filePattern } = await inquirer.prompt([
    {
      type: "input",
      name: "filePattern",
      message: "Enter files to process (comma-separated):",
      validate: (input: string) => {
        return input.trim() !== "" || "At least one file must be specified";
      },
      transformer: (input: string) => {
        return input.split(",").map((f: string) => f.trim()).filter(Boolean).join(", ");
      }
    }
  ]);
  
  const files = filePattern.split(",").map((f: string) => f.trim()).filter(Boolean);

  // Check if files exist
  const nonExistingFiles = files.filter((file: string) => !fs.existsSync(file));
  if (nonExistingFiles.length > 0) {
    console.warn(chalk.yellow(`Warning: The following files don't exist: ${nonExistingFiles.join(", ")}`));
    
    const { proceed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message: "Do you want to proceed anyway?",
        default: false
      }
    ]);
    
    if (!proceed) {
      process.exit(0);
    }
  }

  // Get output file
  const { output } = await inquirer.prompt([
    {
      type: "input",
      name: "output",
      message: "Enter output file path:",
      default: `${framework}-schema.js`,
      validate: (input: string) => {
        return input.trim() !== "" || "Output file must be specified";
      }
    }
  ]);

  // Additional options
  const { options } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "options",
      message: "Select additional options:",
      choices: [
        { name: "Ignore missing metadata", value: "ignoreMissingMetadata" },
        { name: "Enable debug mode", value: "debug" },
        { name: "Validate schema", value: "validate" }
      ]
    }
  ]);

  // Create final options object
  return {
    framework,
    model,
    files,
    output,
    ignoreMissingMetadata: options.includes("ignoreMissingMetadata"),
    debug: options.includes("debug"),
    validate: options.includes("validate")
  };
}

/**
 * Display a spinner while a process is running
 * @param message - Message to display
 * @param callback - Function to execute
 * @returns Result of the callback
 */
export async function withSpinner<T>(message: string, callback: () => Promise<T>): Promise<T> {
  const spinner = ora(message).start();
  
  try {
    const result = await callback();
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}

/**
 * Display the parsed tools metadata
 * @param tools - Array of tool metadata
 */
export function displayParsedTools(tools: ToolMetadata[]): void {
  console.log(chalk.green(`\n✓ Found ${tools.length} tool${tools.length !== 1 ? "s" : ""}:`));
  
  for (const tool of tools) {
    console.log(`\n${chalk.cyan("❯")} ${chalk.bold(tool.name)}`);
    console.log(`  ${chalk.dim(tool.description)}`);
    
    if (tool.parameters.length > 0) {
      console.log(`  ${chalk.yellow("Parameters:")}`);
      for (const param of tool.parameters) {
        const required = !param.nullable ? chalk.red(" (required)") : "";
        console.log(`    - ${param.name}: ${chalk.blue(param.type)}${required}`);
        console.log(`      ${chalk.dim(param.description)}`);
      }
    } else {
      console.log(`  ${chalk.yellow("Parameters:")} None`);
    }
    
    console.log(`  ${chalk.yellow("Returns:")} ${chalk.blue(tool.returnType || "void")}`);
  }
}