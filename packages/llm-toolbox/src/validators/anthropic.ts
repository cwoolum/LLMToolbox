import { BaseValidator, ValidationResult } from "./validator.js";

/**
 * Validator for Anthropic tool schemas
 */
export class AnthropicValidator extends BaseValidator {
  /**
   * Validate schema against Anthropic tool specifications
   * @param schema - Generated Anthropic schema to validate
   * @returns Validation result
   */
  protected validateSchema(schema: unknown): ValidationResult {
    // Check if schema is an object
    if (!schema || typeof schema !== "object") {
      return {
        valid: false,
        errors: ["Schema must be an object"]
      };
    }

    const errors: string[] = [];
    const anthropicSchema = schema as Record<string, any>;

    // Check if tools property exists and is an array
    if (!Array.isArray(anthropicSchema.tools)) {
      errors.push("Schema must have a 'tools' property that is an array");
      return { valid: false, errors };
    }

    // Validate each tool
    for (const [index, tool] of anthropicSchema.tools.entries()) {
      // Check required tool properties
      if (!tool.name) errors.push(`Tool at index ${index} missing required 'name' property`);
      if (!tool.description) errors.push(`Tool at index ${index} missing required 'description' property`);
      if (!tool.input_schema) errors.push(`Tool at index ${index} missing required 'input_schema' property`);

      // Validate input_schema
      if (tool.input_schema) {
        if (tool.input_schema.type !== "object") {
          errors.push(`Tool at index ${index} has invalid input_schema.type. Expected 'object', got '${tool.input_schema.type}'`);
        }

        // Validate properties
        if (!tool.input_schema.properties || typeof tool.input_schema.properties !== "object") {
          errors.push(`Tool at index ${index} missing or invalid 'properties' in input_schema`);
        }

        // If required exists, it must be an array
        if (tool.input_schema.required !== undefined && !Array.isArray(tool.input_schema.required)) {
          errors.push(`Tool at index ${index} has invalid 'required' property in input_schema. Expected array.`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}