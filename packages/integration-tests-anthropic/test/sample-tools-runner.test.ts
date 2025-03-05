import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  buildCliCommand,
  cleanupFiles,
  createTempFile,
  getOutputFilePath,
  runCommand,
  getTestVariantsForFramework,
  getExpectedFunctionNames
} from "@llmtoolbox/test-utils";
import { sampleToolsVariants } from "../src/sample-tools-fixtures.js";

// Get test variants for Anthropic
const testVariants = getTestVariantsForFramework("anthropic");

// Get expected function names for Anthropic
const expectedFunctionNames = getExpectedFunctionNames("anthropic");

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Model name for Anthropic Claude
const modelName = "claude-3-sonnet-20240229";

describe("Sample Tools Runner Integration Tests for Anthropic", () => {
  // Add setup tests to validate key Anthropic Generator functionality
  it("should have proper exports in anthropic.ts", () => {
    // Check that the anthropic generator file exists
    const anthropicFilePath = path.resolve(__dirname, "../../llm-toolbox/src/generators/anthropic.ts");
    expect(fs.existsSync(anthropicFilePath)).toBe(true);

    // Read the file content
    const anthropicFileContent = fs.readFileSync(anthropicFilePath, "utf-8");

    // Check for key exports and functions
    expect(anthropicFileContent).toContain("export function generateAnthropicSchema");
  });

  it("should have CLI support for the anthropic framework", () => {
    // Check that the CLI file exists
    const cliFilePath = path.resolve(__dirname, "../../llm-toolbox/src/cli.ts");
    expect(fs.existsSync(cliFilePath)).toBe(true);

    // Read the file content
    const cliFileContent = fs.readFileSync(cliFilePath, "utf-8");

    // Check that the CLI handles the anthropic framework
    expect(cliFileContent).toContain("anthropic");

    // Check for imports of the anthropic generator
    expect(cliFileContent).toContain("import { generateAnthropicSchema } from");
  });

  sampleToolsVariants.forEach((variant: { name: string; content: string }) => {
    it(`should generate tool config for variant ${variant.name}`, () => {
      // Create a temporary file for the variant
      const tmpFilePath = createTempFile(__dirname, variant.name, variant.content);

      // Output file for the generated tool config
      const outputFilePath = getOutputFilePath(__dirname, variant.name);

      // Build and execute CLI command with model name
      const cliCmd = buildCliCommand(tmpFilePath, outputFilePath, "anthropic", modelName);
      runCommand(cliCmd);

      // Read and validate the generated configuration
      const generatedConfig = fs.readFileSync(outputFilePath, "utf-8");

      // Check for function name
      const expectedFunction = expectedFunctionNames[variant.name] || "";
      expect(generatedConfig).toContain(expectedFunction);

      // Check for Anthropic-specific format
      expect(generatedConfig).toContain("\"tools\":");
      expect(generatedConfig).toContain("\"input_schema\":");
      expect(generatedConfig).toContain(`"model": "${modelName}"`);

      // Instead of type checking, validate the structure of the generated output
      const toolConfig = JSON.parse(generatedConfig.replace("export const toolConfig = ", "").replace(/;$/, ""));

      // Verify the correct structure
      expect(toolConfig).toHaveProperty("tools");
      expect(Array.isArray(toolConfig.tools)).toBe(true);

      // Verify tool properties
      const tool = toolConfig.tools[0];
      expect(tool).toHaveProperty("name");
      expect(tool).toHaveProperty("input_schema");
      expect(tool).toHaveProperty("model");

      // Verify input_schema has the correct properties
      expect(tool.input_schema).toHaveProperty("type", "object");
      expect(tool.input_schema).toHaveProperty("properties");
      expect(tool.input_schema).toHaveProperty("required");

      // Cleanup temporary files
      cleanupFiles([tmpFilePath, outputFilePath]);
    }, 20000);
  });
});