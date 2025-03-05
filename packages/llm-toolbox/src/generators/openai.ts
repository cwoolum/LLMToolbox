import { ToolMetadata, ParameterMetadata } from "../parser.js";

/**
 * Generate OpenAI function schema from tool metadata
 * @param tools - Array of tool metadata objects
 * @returns Object containing OpenAI function definitions
 */
export function generateOpenAISchema(tools: ToolMetadata[]) {
  return tools.map((tool) => ({
    type: "function" as const, // Use 'as const' to make TypeScript infer the literal type
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: Object.fromEntries(
          tool.parameters.map((param) => [
            param.name,
            createParameterSchema(param)
          ])
        ),
        required: tool.parameters
          .filter((param) => !param.nullable)
          .map((param) => param.name),
      },
    },
  }));
}

/**
 * Creates OpenAI schema for a parameter, handling nested types
 * @param param - Parameter metadata
 * @returns OpenAI schema for the parameter
 */
function createParameterSchema(param: ParameterMetadata): Record<string, any> {
  // Handle nested object types
  if (param.isObject && param.properties) {
    return {
      type: "object",
      description: param.description,
      properties: Object.fromEntries(
        Object.entries(param.properties).map(([propName, propData]: [string, ParameterMetadata]) => [
          propName,
          createParameterSchema(propData)
        ])
      ),
      required: Object.entries(param.properties)
        .filter(([_, propData]: [string, ParameterMetadata]) => !propData.nullable)
        .map(([propName]) => propName)
    };
  } 
  
  // Handle basic types
  return {
    type: convertTypeToOpenAI(param.type),
    description: param.description,
  };
}

/**
 * Convert TypeScript types to OpenAI schema types
 * @param type - TypeScript type as string
 * @returns OpenAI schema compatible type
 */
function convertTypeToOpenAI(type: string): string {
  const typeMap: Record<string, string> = {
    string: "string",
    number: "number",
    boolean: "boolean",
    any: "object",
    object: "object",
    array: "array",
    // Add more type mappings as needed
  };

  return typeMap[type.toLowerCase()] || "string";
}