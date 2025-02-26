import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { sampleToolsVariants } from "../src/sample-tools-fixtures.js";
import { 
  buildCliCommand, 
  cleanupFiles,
  createTempFile, 
  createTypeCheckFile,
  getOutputFilePath, 
  runCommand, 
  runTypeCheck 
} from "@llmtoolbox/test-utils";

// Mapping of variant name to expected function name
const expectedFunctionNames: Record<string, string> = {
  variant1: "testFunc",
  variant2: "add",
  variant3: "helloWorld",
};

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("Sample Tools Runner Integration Tests for Bedrock", () => {
  sampleToolsVariants.forEach((variant: { name: string; content: string }) => {
    it(`should generate tool config for variant ${variant.name}`, () => {
      // Create a temporary file for the variant
      const tmpFilePath = createTempFile(__dirname, variant.name, variant.content);

      // Output file for the generated tool config
      const outputFilePath = getOutputFilePath(__dirname, variant.name);

      // Build and execute CLI command
      const cliCmd = buildCliCommand(tmpFilePath, outputFilePath, "bedrock");
      runCommand(cliCmd);

      // Read and validate the generated configuration
      const generatedConfig = fs.readFileSync(outputFilePath, "utf-8");
      const expectedFunction = expectedFunctionNames[variant.name] || "";
      expect(generatedConfig).toContain(expectedFunction);

      // Validate type compatibility with ToolConfiguration from AWS SDK
      const typeCheckFilePath = createTypeCheckFile(
        __dirname,
        variant.name,
        'import { ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";',
        'ToolConfiguration'
      );
      
      // Run TypeScript compiler for type checking
      runTypeCheck(typeCheckFilePath);

      // Cleanup temporary files
      cleanupFiles([tmpFilePath, outputFilePath, typeCheckFilePath]);
    }, 20000);
  });
});