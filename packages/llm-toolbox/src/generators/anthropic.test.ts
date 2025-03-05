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
            nullable: false,
          },
          {
            name: "days",
            type: "number",
            description: "The number of days in the forecast",
            nullable: true,
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

  it("should handle nested object parameters", () => {
    const toolMetadata: ToolMetadata[] = [
      {
        name: "createUser",
        description: "Create a new user",
        parameters: [
          {
            name: "user",
            type: "object",
            description: "User information",
            nullable: false,
            isObject: true,
            properties: {
              name: {
                name: "name",
                type: "string",
                description: "User's name",
                nullable: false
              },
              age: {
                name: "age",
                type: "number",
                description: "User's age",
                nullable: true
              },
              address: {
                name: "address",
                type: "object",
                description: "User's address",
                nullable: true,
                isObject: true,
                properties: {
                  street: {
                    name: "street",
                    type: "string",
                    description: "Street address",
                    nullable: false
                  },
                  city: {
                    name: "city",
                    type: "string", 
                    description: "City",
                    nullable: false
                  }
                }
              }
            }
          }
        ],
        returnType: "object",
      },
    ];

    const schema = generateAnthropicSchema(toolMetadata);
    
    expect(schema.tools[0].input_schema.properties.user).toEqual({
      type: "object",
      description: "User information",
      properties: {
        name: {
          type: "string",
          description: "User's name"
        },
        age: {
          type: "number",
          description: "User's age" 
        },
        address: {
          type: "object",
          description: "User's address",
          properties: {
            street: {
              type: "string",
              description: "Street address"
            },
            city: {
              type: "string",
              description: "City"
            }
          },
          required: ["street", "city"]
        }
      },
      required: ["name"]
    });
  });
});
