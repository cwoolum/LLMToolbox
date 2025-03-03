/**
 * Interface for schema validators
 */
export interface SchemaValidator {
  /**
   * Validate schema against framework specifications
   * @param schema - Generated schema to validate
   * @returns Validation result with success flag and any error messages
   */
  validate(schema: unknown): ValidationResult;
}

/**
 * Result of schema validation
 */
export interface ValidationResult {
  /**
   * Whether the schema is valid
   */
  valid: boolean;
  /**
   * Error messages if validation failed
   */
  errors?: string[];
}

/**
 * Base validator with common validation logic
 */
export abstract class BaseValidator implements SchemaValidator {
  /**
   * Validate schema against framework specifications
   * @param schema - Generated schema to validate  
   * @returns Validation result
   */
  validate(schema: unknown): ValidationResult {
    try {
      return this.validateSchema(schema);
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  /**
   * Framework-specific validation logic to be implemented by child classes
   */
  protected abstract validateSchema(schema: unknown): ValidationResult;
}