import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { expect } from "vitest";

/**
 * Interface for test variant
 */
export interface TestVariant {
  name: string;
  content: string;
}

/**
 * Interface for command execution error
 */
interface CommandError extends Error {
  stdout?: Buffer;
  stderr?: Buffer;
}

/**
 * Executes a command and returns its output as a string
 * @param command Command to execute
 * @returns Command output as a string
 */
export function runCommand(command: string): string {
  try {
    const output = execSync(command, { stdio: "pipe" });
    return output.toString();
  } catch (error) {
    const cmdError = error as CommandError;
    if (cmdError.stdout) {
      console.error(`Command stdout: ${cmdError.stdout.toString()}`);
    }
    if (cmdError.stderr) {
      console.error(`Command stderr: ${cmdError.stderr.toString()}`);
    }
    throw error;
  }
}

/**
 * Creates a temporary file for testing
 * @param dir Directory to create the file in
 * @param variantName Name of the test variant
 * @param content Content to write to the file
 * @returns Path to the created file
 */
export function createTempFile(dir: string, variantName: string, content: string): string {
  const filePath = path.join(dir, `temp-${variantName}.ts`);
  fs.writeFileSync(filePath, content);
  return filePath;
}

/**
 * Creates an output file path
 * @param dir Directory to create the file in
 * @param variantName Name of the test variant
 * @returns Path for the output file
 */
export function getOutputFilePath(dir: string, variantName: string): string {
  return path.join(dir, `generated-tool-config-${variantName}.ts`);
}

/**
 * Builds the CLI command for the LLM Toolbox
 * @param inputFile Path to the input file
 * @param outputFile Path to the output file
 * @param framework Framework name
 * @param model Optional model name
 * @returns CLI command string
 */
export function buildCliCommand(
  inputFile: string,
  outputFile: string, 
  framework: string,
  model?: string
): string {
  const baseDir = path.dirname(inputFile);
  const cliPath = path.resolve(baseDir, "../../llm-toolbox/src/bin/index.ts");
  
  let modelFlag = "";
  if (model) {
    modelFlag = `-m ${model}`;
  }
  
  return `npx tsx ${cliPath} -f ${inputFile} -r ${framework} -o ${outputFile} ${modelFlag}`;
}

/**
 * Creates a type checking file for a specific framework
 * @param dir Directory to create the file in
 * @param variantName Name of the test variant
 * @param importStatement Import statement for the framework type
 * @param typeName Type name to check against
 * @returns Path to the created type checking file
 */
export function createTypeCheckFile(
  dir: string, 
  variantName: string, 
  importStatement: string, 
  typeName: string
): string {
  const typeCheckFilePath = path.join(dir, `temp-type-check-${variantName}.ts`);
  const typeCheckFileContent = `
${importStatement}
import { toolConfig } from "./generated-tool-config-${variantName}.js";

const testConfig: ${typeName} = toolConfig;
console.log('Type check passed for variant: ${variantName}');
`;
  fs.writeFileSync(typeCheckFilePath, typeCheckFileContent);
  return typeCheckFilePath;
}

/**
 * Performs type checking on a file
 * @param filePath Path to the file to type check
 */
export function runTypeCheck(filePath: string): void {
  // Pass TypeScript compiler options directly on the command line
  const command = `npx tsc ${filePath} --noEmit --skipLibCheck --target ES2022 --module NodeNext --moduleResolution NodeNext --esModuleInterop`;
  runCommand(command);
}

/**
 * Cleans up temporary files
 * @param filePaths Paths to files to delete
 */
export function cleanupFiles(filePaths: string[]): void {
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

/**
 * Validates that a generated schema matches expected structure
 * @param schema The parsed schema object
 * @param expectedFunction Expected function name
 * @param frameworkValidation Framework-specific validation function
 */
export function validateSchema(
  schema: any, 
  expectedFunction: string,
  frameworkValidation: (schema: any) => void
): void {
  // Common validations
  expect(schema).toBeDefined();
  
  // Check for function name
  const schemaString = JSON.stringify(schema);
  expect(schemaString).toContain(expectedFunction);
  
  // Framework-specific validation
  frameworkValidation(schema);
}