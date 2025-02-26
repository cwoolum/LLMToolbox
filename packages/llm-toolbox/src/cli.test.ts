import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runCLI } from "./cli.js";
import { parseFiles } from "./parser.js";
import { generateLangChainSchema } from "./generators/langchain.js";
import { generateBedrockSchema } from "./generators/bedrock.js";
import { generateAnthropicSchema } from "./generators/anthropic.js";
import { generateOpenAISchema } from "./generators/openai.js";
import { loadConfig } from "./config.js";
import * as fs from "fs";
import chalk from "chalk";
import { withSpinner, displayParsedTools } from "./ui.js";

// Mock dependencies
vi.mock("./parser.js", () => ({
  parseFiles: vi.fn().mockReturnValue([{ name: "testTool", description: "test", parameters: [] }]),
}));
vi.mock("./generators/langchain.js", () => ({ generateLangChainSchema: vi.fn() }));
vi.mock("./generators/bedrock.js", () => ({ generateBedrockSchema: vi.fn() }));
vi.mock("./generators/anthropic.js", () => ({ generateAnthropicSchema: vi.fn() }));
vi.mock("./generators/openai.js", () => ({ generateOpenAISchema: vi.fn() }));
vi.mock("./config.js", () => ({ loadConfig: vi.fn().mockReturnValue({}) }));
vi.mock("fs", () => ({ writeFileSync: vi.fn() }));
vi.mock("./ui.js", () => ({
  runInteractiveUI: vi.fn().mockResolvedValue({ 
    files: ["test.ts"], 
    framework: "langchain", 
    output: "output.json",
    ignoreMissingMetadata: false,
    debug: false,
    validate: false
  }),
  withSpinner: vi.fn().mockImplementation((msg, cb) => cb()),
  displayParsedTools: vi.fn()
}));
vi.mock("chalk", () => ({
  default: {
    blue: vi.fn().mockReturnValue("blue"),
    red: vi.fn().mockReturnValue("red"),
    green: vi.fn().mockReturnValue("green"),
    yellow: vi.fn().mockReturnValue("yellow"),
    cyan: vi.fn().mockReturnValue("cyan"),
    gray: vi.fn().mockReturnValue("gray")
  }
}));

// Mock process.exit to prevent tests from exiting
const mockExit = vi.spyOn(process, "exit").mockImplementation((code) => { 
  throw new Error(`Process exit with code ${code}`); 
});

// Mock console.error and console.log
const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

// Save original process.argv
const originalArgv = process.argv;

describe("CLI", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore process.argv after each test
    process.argv = originalArgv;
  });

  it("should generate schema for LangChain framework", async () => {
    // Set up CLI arguments for LangChain
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "langchain",
      "--output", "output.json"
    ];

    // Mock the schema generator to return a test schema
    vi.mocked(generateLangChainSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();

    // Verify parseFiles was called with correct arguments
    expect(parseFiles).toHaveBeenCalledWith(["test.ts"], false);
    
    // Verify correct schema generator was called
    expect(generateLangChainSchema).toHaveBeenCalled();
    expect(generateBedrockSchema).not.toHaveBeenCalled();
    expect(generateAnthropicSchema).not.toHaveBeenCalled();
    expect(generateOpenAISchema).not.toHaveBeenCalled();
    
    // Verify file was written
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "output.json",
      expect.stringContaining("export const toolConfig = ")
    );
  });

  it("should generate schema for Bedrock framework with model", async () => {
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "bedrock",
      "--model", "claude-3-sonnet",
      "--output", "output.json"
    ];

    // Mock the schema generator to return a test schema
    vi.mocked(generateBedrockSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();
    
    // Verify correct schema generator was called with model
    expect(generateBedrockSchema).toHaveBeenCalledWith(
      expect.anything(), 
      "claude-3-sonnet"
    );
    
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should generate schema for Anthropic framework", async () => {
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "anthropic",
      "--output", "output.json"
    ];

    // Mock the schema generator
    vi.mocked(generateAnthropicSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();
    
    // Verify correct schema generator was called
    expect(generateAnthropicSchema).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should generate schema for OpenAI framework", async () => {
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "openai",
      "--output", "output.json"
    ];

    // Mock the schema generator
    vi.mocked(generateOpenAISchema).mockReturnValueOnce([]);

    // Run CLI
    await runCLI();
    
    // Verify correct schema generator was called
    expect(generateOpenAISchema).toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it("should exit with error for unsupported framework", async () => {
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "unsupported",
      "--output", "output.json"
    ];

    // Run CLI should throw error due to mock exit
    await expect(runCLI()).rejects.toThrow();
    
    // Since we're mocking chalk, just verify that console.error was called
    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should load config from file", async () => {
    // Mock config file with some settings
    vi.mocked(loadConfig).mockReturnValueOnce({ 
      framework: "anthropic",
      model: "claude-3-opus"
    });

    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--output", "output.json"
    ];

    // Mock the schema generator
    vi.mocked(generateAnthropicSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();
    
    // Should use framework from config
    expect(generateAnthropicSchema).toHaveBeenCalledWith(
      expect.anything(), 
      "claude-3-opus"
    );
  });

  it("should override config with CLI options", async () => {
    // Mock config file with some settings
    vi.mocked(loadConfig).mockReturnValueOnce({ 
      framework: "anthropic",
      model: "claude-3-opus"
    });

    // Override with CLI options
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "bedrock",
      "--output", "output.json"
    ];

    // Mock the schema generator
    vi.mocked(generateBedrockSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();
    
    // Should use framework from CLI
    expect(generateBedrockSchema).toHaveBeenCalledWith(
      expect.anything(), 
      "claude-3-opus"
    );
    expect(generateAnthropicSchema).not.toHaveBeenCalled();
  });

  it("should enable debug mode", async () => {
    process.argv = [
      "node", "index.js",
      "--files", "test.ts",
      "--framework", "langchain",
      "--output", "output.json",
      "--debug"
    ];

    // Mock the schema generator
    vi.mocked(generateLangChainSchema).mockReturnValueOnce({ tools: [] });

    // Run CLI
    await runCLI();
    
    // Verify console.log was called multiple times (we don't check the exact message
    // because we're mocking chalk which affects the output)
    expect(mockConsoleLog).toHaveBeenCalled();
    // Check that we had at least 3 calls to console.log
    expect(mockConsoleLog.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});