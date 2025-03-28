import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import fs from "fs";
import { parseFiles } from "./parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test for parser

describe("Parser Tests", () => {
  it("should parse function with JSDoc", { timeout: 10000 }, () => {
    // Create a temporary file with a sample function containing JSDoc comments
    const tempFilePath = path.join(__dirname, "temp_test_file.js");

    fs.writeFileSync(
      tempFilePath,
      `/**
       * A test function.
       * @param param a test parameter.
       */
      export function testFunc(param) {
        return param;
      }
      `,
    );

    // Parse the temporary file
    const tools = parseFiles([tempFilePath], true);

    // Validate the parsed output
    expect(tools.length).toBe(1);
    const tool = tools[0];
    expect(tool.name).toBe("testFunc");
    expect(tool.description).toBe("A test function.");
    expect(tool.parameters.length).toBe(1);
    expect(tool.parameters[0].name).toBe("param");
    expect(tool.parameters[0].description).toBe("a test parameter.");

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
  });

  // Test for a function with multiple parameters and JSDoc comments
  it("should parse function with multiple parameters", () => {
    const tempFilePath = path.join(__dirname, "temp_test_file_multiple_params.js");

    fs.writeFileSync(
      tempFilePath,
      `/**
       * A test function with multiple parameters.
       * @param param1 first parameter.
       * @param param2 second parameter.
       */
      export function testFunc(param1, param2) {
        return param1 + param2;
      }
      `,
    );

    const tools = parseFiles([tempFilePath], true);

    expect(tools.length).toBe(1);
    const tool = tools[0];
    expect(tool.name).toBe("testFunc");
    expect(tool.description).toBe("A test function with multiple parameters.");
    expect(tool.parameters.length).toBe(2);
    expect(tool.parameters[0].name).toBe("param1");
    expect(tool.parameters[0].description).toBe("first parameter.");
    expect(tool.parameters[1].name).toBe("param2");
    expect(tool.parameters[1].description).toBe("second parameter.");

    fs.unlinkSync(tempFilePath);
  });

  // Test for a function with a return type and JSDoc comments
  it("should parse function with return type", () => {
    const tempFilePath = path.join(__dirname, "temp_test_file_return_type.js");

    fs.writeFileSync(
      tempFilePath,
      `/**
       * A test function with a return type.
       * @returns {number} The result.
       */
      export function testFunc() {
        return 42;
      }
      `,
    );

    const tools = parseFiles([tempFilePath], true);

    expect(tools.length).toBe(1);
    const tool = tools[0];
    expect(tool.name).toBe("testFunc");
    expect(tool.description).toBe("A test function with a return type.");
    expect(tool.returnType).toBe("number");

    fs.unlinkSync(tempFilePath);
  });

  // Test for a function with destructured parameters
  it("should parse function with destructured parameters", () => {
    const tempFilePath = path.join(__dirname, "temp_test_file_destructured_params.js");

    fs.writeFileSync(
      tempFilePath,
      `/**
       * Reads a file from the given path.
       * @param filePath - Path to the file to read.
       * @returns {Promise<string | undefined>} The file contents or undefined if there was an error.
       */
      export async function getFile({
        filePath
      }: {
        filePath: string;
      }): Promise<string | undefined> {
        try {
          return "file content";
        } catch (error) {
          return undefined;
        }
      }
      `,
    );

    const tools = parseFiles([tempFilePath], true);

    expect(tools.length).toBe(1);
    const tool = tools[0];
    expect(tool.name).toBe("getFile");
    expect(tool.parameters.length).toBe(1);
    
    // The parameter itself should have properties
    expect(tool.parameters[0].isObject).toBe(true);
    expect(tool.parameters[0].properties).toBeDefined();
    
    // The 'filePath' property should be defined in the properties object
    expect(tool.parameters[0].properties?.filePath).toBeDefined();
    expect(tool.parameters[0].properties?.filePath.name).toBe("filePath");
    expect(tool.parameters[0].properties?.filePath.type).toBe("string");

    fs.unlinkSync(tempFilePath);
  });

  // Test for a function without JSDoc comments
  it("should throw error for function without JSDoc", () => {
    const tempFilePath = path.join(__dirname, "temp_test_file_no_jsdoc.js");

    fs.writeFileSync(
      tempFilePath,
      `
      export function testFunc(param) {
        return param;
      }
      `,
    );

    expect(() => parseFiles([tempFilePath], false)).toThrow("Missing function description");

    fs.unlinkSync(tempFilePath);
  });
});
