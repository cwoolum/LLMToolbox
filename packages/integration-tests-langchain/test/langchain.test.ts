import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const cliPath = path.resolve(__dirname, "../../llm-toolbox/dist/bin/index.js");
const testFilePath = path.resolve(__dirname, "test_file.ts");
const outputFilePath = path.resolve(__dirname, "schema.json");

// Create a temporary test file
fs.writeFileSync(
  testFilePath,
  `/**
   * A test function.
   * @param param a test parameter.
   */
  function testFunc(param: string): string {
    return param;
  }
  `
);

console.log("Test file created at:", testFilePath);
console.log("CLI path:", cliPath);

describe("LangChain Integration Tests", () => {
  it("should generate schema for LangChain", () => {
    try {
      execSync(`node ${cliPath} -f ${testFilePath} -r langchain -o ${outputFilePath} --debug`);
      const schema = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
      expect(schema).toEqual({
        tools: [
          {
            name: "testFunc",
            description: "A test function.",
            parameters: {
              type: "object",
              properties: {
                param: {
                  type: "string",
                  description: "a test parameter.",
                },
              },
              required: ["param"],
            },
            returnType: "string",
          },
        ],
      });
    } catch (error) {
      console.error("Error executing CLI:", error);
      console.error("CLI output:", error.stdout?.toString());
      throw error;
    }
  });
});

// Clean up temporary test file
fs.unlinkSync(testFilePath);
if (fs.existsSync(outputFilePath)) {
  fs.unlinkSync(outputFilePath);
}
