import { exec } from "child_process";
import { readFileSync } from "fs";
import { promisify } from "util";
import { describe, it, expect } from "vitest";

const execAsync = promisify(exec);

describe("Generate Tool Config Integration Test", () => {
  it("should generate the tool config file correctly", async () => {
    const command =
      "npx tsx ../llm-toolbox/src/bin/index.ts -f src/sample-tools.ts -r bedrock -o src/generated-tool-config.ts";

    // Run the generation command
    await execAsync(command);

    // Read the generated file
    const generatedConfig = readFileSync(
      "src/generated-tool-config.ts",
      "utf-8"
    );

    // Validate the content of the generated file
    expect(generatedConfig).toContain("testFunc");
    expect(generatedConfig).toContain("A test function with a return type.");

    // Compile the TypeScript file to ensure it's valid
    await execAsync("npx tsc src/bedrock-call.ts");
  }, 20000);
});
