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

describe("Bedrock Integration Tests", () => {
  it("should generate schema for Bedrock", () => {
    execSync(`node ${cliPath} -f ${testFilePath} -r bedrock -o ${outputFilePath} --debug`);
    const schema = JSON.parse(fs.readFileSync(outputFilePath, "utf-8"));
    expect(schema).toEqual({
      tools: [
        {
          toolSpec: {
            name: "testFunc",
            description: "A test function.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  param: {
                    type: "string",
                    description: "a test parameter.",
                  },
                },
                required: ["param"],
              },
            },
          },
        },
      ],
    });
  });
});

// Clean up temporary test file
fs.unlinkSync(testFilePath);
fs.unlinkSync(outputFilePath);
