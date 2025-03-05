import { ToolMetadata, ParameterMetadata } from "../parser.js";

export function generateAnthropicSchema(tools: ToolMetadata[], model?: string) {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: "object",
        properties: Object.fromEntries(
          tool.parameters.map((param) => [
            param.name,
            createParameterSchema(param)
          ]),
        ),
        required: tool.parameters.filter((param) => !param.nullable).map((param) => param.name),
      },
      ...(model ? { model } : {}),
    })),
  };
}

/**
 * Creates Anthropic schema for a parameter, handling nested types
 * @param param - Parameter metadata
 * @returns Anthropic schema for the parameter
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
  
  // Convert basic types
  let typeStr = "string";
  if (param.type === "number") typeStr = "number";
  if (param.type === "boolean") typeStr = "boolean";
  if (param.type.includes("[]") || param.type.startsWith("Array<")) typeStr = "array";
  if (param.type === "object" || param.type === "Record<string, any>") typeStr = "object";
  
  // Handle basic types
  return {
    type: typeStr,
    description: param.description,
  };
}
