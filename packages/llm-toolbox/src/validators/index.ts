import { SchemaValidator } from "./validator.js";
import { AnthropicValidator } from "./anthropic.js";
import { OpenAIValidator } from "./openai.js";

/**
 * Get schema validator for a specific framework
 * @param framework - Framework name (anthropic, openai, etc.)
 * @returns Appropriate validator for the framework, or undefined if not supported
 */
export function getValidator(framework: string): SchemaValidator | undefined {
  const validators: Record<string, SchemaValidator> = {
    anthropic: new AnthropicValidator(),
    openai: new OpenAIValidator(),
    // Add more validators as they are implemented
  };

  return validators[framework.toLowerCase()];
}

export * from "./validator.js";
export * from "./anthropic.js";
export * from "./openai.js";