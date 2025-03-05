import { ToolMetadata, ParameterMetadata } from "../parser.js";

export function generateLangChainSchema(tools: ToolMetadata[], model?: string) {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: Object.fromEntries(
          tool.parameters.map((param) => [
            param.name,
            createParameterSchema(param)
          ]),
        ),
        required: tool.parameters.filter((param) => !param.nullable).map((param) => param.name),
      },
      returnType: tool.returnType,
      ...(model ? { model } : {}),
    })),
  };
}

/**
 * Creates LangChain schema for a parameter, handling nested types
 * @param param - Parameter metadata
 * @returns LangChain schema for the parameter
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
  
  // Determine type string based on TypeScript type
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
