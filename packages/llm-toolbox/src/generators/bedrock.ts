import { ToolMetadata } from "../parser.js";

export function generateBedrockSchema(tools: ToolMetadata[], model?: string) {
  return {
    tools: tools.map((tool) => ({
      toolSpec: {
        name: tool.name,
        description: tool.description,
        inputSchema: {
          json: {
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
        },
        ...(model ? { model } : {}),
      },
    })),
  };
}
