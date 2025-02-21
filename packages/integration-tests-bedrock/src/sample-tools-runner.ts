// filepath: c:\Users\slick\source\repos\LLMToolbox\packages\integration-tests-bedrock\src\sample-tools-runner.ts
import { sampleToolsVariants } from "./sample-tools-fixtures";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const runTestForVariant = (variant: { name: string; content: string }) => {
  // Create a temporary file for the fixture variant
  const tmpFilePath = path.join(__dirname, `temp-${variant.name}.ts`);
  fs.writeFileSync(tmpFilePath, variant.content);
  const outputFilePath = path.join(__dirname, `generated-tool-config-${variant.name}.ts`);
  console.log(`Running test for variant: ${variant.name}`);
  try {
    // Construct CLI command to generate tool config
    // Adjusting relative paths: __dirname is integration-tests-bedrock/src
    const cliCmd = `npx tsx ../../llm-toolbox/src/bin/index.ts -f ${tmpFilePath} -r ${variant.name} -o ${outputFilePath}`;
    execSync(cliCmd, { stdio: 'inherit' });
    // Read and log the generated configuration
    const generatedConfig = fs.readFileSync(outputFilePath, 'utf-8');
    console.log(`Test for variant ${variant.name} passed.`);
    console.log('Generated config:');
    console.log(generatedConfig);
  } catch (error) {
    console.error(`Test for variant ${variant.name} failed.`);
    console.error(error);
  } finally {
    // Cleanup temporary files
    if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
    if (fs.existsSync(outputFilePath)) fs.unlinkSync(outputFilePath);
  }
};

// Run tests for all variants
sampleToolsVariants.forEach(variant => runTestForVariant(variant));
