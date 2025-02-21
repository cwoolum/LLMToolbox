import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import { sampleToolsVariants } from "../src/sample-tools-fixtures";

// Mapping of variant name to expected function name
const expectedFunctionNames: Record<string, string> = {
  variant1: "testFunc",
  variant2: "add",
  variant3: "helloWorld"
};

describe("Sample Tools Runner Integration Tests", () => {
  sampleToolsVariants.forEach(variant => {
    it(`should generate tool config for variant ${variant.name}`, () => {
      // Create a temporary file for the variant
      const tmpFilePath = path.join(__dirname, `temp-${variant.name}.ts`);
      fs.writeFileSync(tmpFilePath, variant.content);

      // Output file for the generated tool config
      const outputFilePath = path.join(__dirname, `generated-tool-config-${variant.name}.ts`);
      
      // Construct CLI command using relative paths (assuming cwd: integration-tests-bedrock/test)
      const cliCmd = `npx tsx ../llm-toolbox/src/bin/index.ts -f ${tmpFilePath} -r bedrock -o ${outputFilePath}`;

      // Execute the CLI command
      execSync(cliCmd, { stdio: 'inherit' });

      // Read and validate the generated configuration
      const generatedConfig = fs.readFileSync(outputFilePath, 'utf-8');
      const expectedFunction = expectedFunctionNames[variant.name] || "";
      expect(generatedConfig).toContain(expectedFunction);

      // Validate type compatibility with ToolConfiguration from @aws-sdk/client-bedrock-runtime
      const typeCheckFilePath = path.join(__dirname, `temp-type-check-${variant.name}.ts`);
      const typeCheckFileContent = `
import { ToolConfiguration } from "@aws-sdk/client-bedrock-runtime";
import { toolConfig } from "./generated-tool-config-${variant.name}";

const testConfig: ToolConfiguration = toolConfig;
console.log('Type check passed for variant: ${variant.name}');
`;
      fs.writeFileSync(typeCheckFilePath, typeCheckFileContent);
      // Run TypeScript compiler for type checking
      execSync(`npx tsc ${typeCheckFilePath} --noEmit`, { stdio: 'inherit' });
      fs.unlinkSync(typeCheckFilePath);

      // Cleanup temporary files
      fs.unlinkSync(tmpFilePath);
      fs.unlinkSync(outputFilePath);
    }, 20000);
  });
});
