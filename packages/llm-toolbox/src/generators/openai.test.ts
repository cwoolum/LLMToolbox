import { describe, it, expect } from "vitest";
import { generateOpenAISchema } from "./openai.js";
import { ToolMetadata } from "../parser.js";

describe("OpenAI Generator", () => {
  it("should generate a valid OpenAI function schema with required and optional parameters", () => {
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

    const schema = generateOpenAISchema(toolMetadata);

    expect(schema).toEqual([
      {
        type: "function",
        function: {
          name: "getWeather",
          description: "Get the weather forecast for a location",
          parameters: {
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
      },
    ]);
  });

  it("should convert various types to OpenAI compatible types", () => {
    const toolMetadata: ToolMetadata[] = [
      {
        name: "testTypes",
        description: "Test various parameter types",
        parameters: [
          {
            name: "stringParam",
            type: "string",
            description: "String parameter",
            nullable: false,
          },
          {
            name: "numberParam",
            type: "number",
            description: "Number parameter",
            nullable: false,
          },
          {
            name: "booleanParam",
            type: "boolean",
            description: "Boolean parameter",
            nullable: false,
          },
          {
            name: "objectParam",
            type: "object",
            description: "Object parameter",
            nullable: false,
          },
          {
            name: "anyParam",
            type: "any",
            description: "Any parameter",
            nullable: false,
          },
          {
            name: "unknownParam",
            type: "unknownType",
            description: "Unknown parameter",
            nullable: false,
          },
        ],
        returnType: "string",
      },
    ];

    const schema = generateOpenAISchema(toolMetadata);
    const properties = schema[0].function.parameters.properties;

    expect(properties.stringParam.type).toBe("string");
    expect(properties.numberParam.type).toBe("number");
    expect(properties.booleanParam.type).toBe("boolean");
    expect(properties.objectParam.type).toBe("object");
    expect(properties.anyParam.type).toBe("object");
    expect(properties.unknownParam.type).toBe("string"); // Default to string for unknown types
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

    const schema = generateOpenAISchema(toolMetadata);
    
    expect(schema[0].function.parameters.properties.user).toEqual({
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