import * as fs from "fs";
import * as path from "path";

/**
 * Configuration interface for LLM Toolbox
 */
export interface LLMToolboxConfig {
  framework?: string;
  model?: string;
  files?: string[];
  output?: string;
  ignoreMissingMetadata?: boolean;
  debug?: boolean;
  validate?: boolean;
}

/**
 * Load configuration from .llmtoolboxrc.json file
 * @param configPath - Optional path to config file, defaults to .llmtoolboxrc.json in current directory
 * @returns Configuration object or empty object if not found
 */
export function loadConfig(configPath?: string): LLMToolboxConfig {
  const defaultPath = path.join(process.cwd(), ".llmtoolboxrc.json");
  const filePath = configPath || defaultPath;

  try {
    if (fs.existsSync(filePath)) {
      const configContent = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(configContent) as LLMToolboxConfig;
    }
  } catch (error) {
    console.warn(`Failed to load config file: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {};
}