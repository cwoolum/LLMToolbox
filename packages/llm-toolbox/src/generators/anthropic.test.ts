import { describe, it, expect } from "vitest";
import { generateAnthropicSchema } from "./anthropic.js";
import { ToolMetadata } from "../parser.js";

describe("Anthropic Generator", () => {
  it("should generate a valid Anthropic schema with required and optional parameters", () => {
    const toolMetadata: ToolMetadata[] = [
      {
        name: "getWeather",
        description: "Get the weather forecast for a location",
        parameters: [
          {
            name: "location",
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
            nullable: false
          },
          {
            name: "days",
            type: "number",
            description: "The number of days in the forecast",
            nullable: true
          },
        ],
        returnType: "string",
      },
    ];

    const schema = generateAnthropicSchema(toolMetadata);

    expect(schema).toEqual({
      tools: [
        {
          name: "getWeather",
          description: "Get the weather forecast for a location",
          input_schema: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "The city and state, e.g. San Francisco, CA",
              },
              days: {
                type: "number",
                description: "The number of days in the forecast",
              },
            },
            required: ["location"],
          },
        },
      ],
    });
  });

  it("should add model information when provided", () => {
    const toolMetadata: ToolMetadata[] = [
      {
        name: "getWeather",
        description: "Get the weather forecast for a location",
        parameters: [
          {
            name: "location",
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
        ],
        returnType: "string",
      },
    ];

    const schema = generateAnthropicSchema(toolMetadata, "claude-3-opus-20240229");

    expect(schema.tools[0]).toHaveProperty("model", "claude-3-opus-20240229");
  });
});