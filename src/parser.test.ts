import path from "path";
import { fileURLToPath } from "url";

import assert from "assert";
import fs from "fs";
import test from "node:test";
import { parseFiles } from "./parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test for parser

test("parse function with JSDoc", () => {
  // Create a temporary file with a sample function containing JSDoc comments
  const tempFilePath = path.join(__dirname, "temp_test_file.js");

  fs.writeFileSync(
    tempFilePath,
    `/**
     * A test function.
     * @param param a test parameter.
     */
    function testFunc(param) {
      return param;
    }
    `
  );

  // Parse the temporary file
  const tools = parseFiles([tempFilePath], true);

  // Validate the parsed output
  assert.strictEqual(tools.length, 1, "Expected one tool to be parsed");
  const tool = tools[0];
  assert.strictEqual(tool.name, "testFunc", "Function name should be testFunc");
  assert.strictEqual(
    tool.description,
    "A test function.",
    "Description mismatch"
  );
  assert.strictEqual(tool.parameters.length, 1, "Expected one parameter");
  assert.strictEqual(
    tool.parameters[0].name,
    "param",
    "Parameter name mismatch"
  );
  assert.strictEqual(
    tool.parameters[0].description,
    "a test parameter.",
    "Parameter description mismatch"
  );

  // Clean up temporary file
  fs.unlinkSync(tempFilePath);
});
