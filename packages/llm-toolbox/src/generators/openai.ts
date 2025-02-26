import { ToolMetadata } from "../parser.js";

/**
 * Generate OpenAI function schema from tool metadata
 * @param tools - Array of tool metadata objects
 * @returns Object containing OpenAI function definitions
 */
export function generateOpenAISchema(tools: ToolMetadata[]) {
  return tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: Object.fromEntries(
          tool.parameters.map((param) => [
            param.name,
            {
              type: convertTypeToOpenAI(param.type),
              description: param.description,
            },
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