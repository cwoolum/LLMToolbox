import { ToolMetadata } from "../parser.js";

export function generateBedrockSchema(tools: ToolMetadata[], model?: string) {
  return {
    functions: tools.map((tool) => ({
      functionName: tool.name,
      functionDescription: tool.description,
      functionParameters: {
        type: "object",
        properties: Object.fromEntries(
          tool.parameters.map((param) => [
            param.name,
            {
              type: param.type,
              description: param.description,
            },
          ])
        ),
        required: tool.parameters.map((param) => param.name),
      },
      functionReturnType: tool.returnType,
      ...(model ? { model } : {}),
    })),
  };
}
