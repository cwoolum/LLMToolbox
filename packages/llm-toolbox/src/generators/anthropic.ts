import { ToolMetadata } from "../parser.js";

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
            {
              type: param.type,
              description: param.description,
            },
          ])
        ),
        required: tool.parameters.filter(param => !param.nullable).map(param => param.name),
      },
      ...(model ? { model } : {}),
    })),
  };
}