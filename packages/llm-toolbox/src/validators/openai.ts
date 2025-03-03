import { BaseValidator, ValidationResult } from "./validator.js";

/**
 * Validator for OpenAI function schema
 */
export class OpenAIValidator extends BaseValidator {
  /**
   * Validate schema against OpenAI function specifications
   * @param schema - Generated OpenAI schema to validate
   * @returns Validation result
   */
  protected validateSchema(schema: unknown): ValidationResult {
    // Check if schema is an array
    if (!Array.isArray(schema)) {
      return {
        valid: false,
        errors: ["OpenAI schema must be an array of function definitions"]
      };
    }

    const errors: string[] = [];

    // Validate each function definition
    for (const [index, item] of schema.entries()) {
      // Check if item is an object
      if (!item || typeof item !== "object") {
        errors.push(`Item at index ${index} must be an object`);
        continue;
      }

      const func = item as Record<string, any>;

      // Validate type property
      if (func.type !== "function") {
        errors.push(`Item at index ${index} must have type 'function', got '${func.type}'`);
      }

      // Check if function property exists
      if (!func.function || typeof func.function !== "object") {
        errors.push(`Item at index ${index} must have a 'function' property that is an object`);
        continue;
      }

      // Validate function properties
      const functionDef = func.function;

      // Check required properties
      if (!functionDef.name) {
        errors.push(`Function at index ${index} missing required 'name' property`);
      }

      if (!functionDef.parameters || typeof functionDef.parameters !== "object") {
        errors.push(`Function at index ${index} missing required 'parameters' property or is not an object`);
      } else {
        // Validate parameters object
        const params = functionDef.parameters;

        // Check parameters has correct type
        if (params.type !== "object") {
          errors.push(`Function at index ${index} has invalid parameters.type. Expected 'object', got '${params.type}'`);
        }

        // Check properties exist and is an object
        if (!params.properties || typeof params.properties !== "object") {
          errors.push(`Function at index ${index} missing or invalid 'properties' object in parameters`);
        }

        // If required exists, it must be an array
        if (params.required !== undefined && !Array.isArray(params.required)) {
          errors.push(`Function at index ${index} has invalid 'required' property in parameters. Expected array.`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}