import { describe, it, expect } from "vitest";
import { generateLangChainSchema } from "./langchain.js";
import { ToolMetadata } from "../parser.js";

describe("generateLangChainSchema", () => {
  it("should generate schema for a single tool", () => {
    const tools: ToolMetadata[] = [
      {
        name: "testFunc",
        description: "A test function.",
        parameters: [
          {
            name: "param",
            type: "string",
            description: "a test parameter.",
          },
        ],
        returnType: "string",
      },
    ];

    const schema = generateLangChainSchema(tools);

    expect(schema).toEqual({
      tools: [
        {
          name: "testFunc",
          description: "A test function.",
          parameters: {
            type: "object",
            properties: {
              param: {
                type: "string",
                description: "a test parameter.",
              },
            },
            required: ["param"],
          },
          returnType: "string",
        },
      ],
    });
  });

  it("should generate schema for multiple tools with nullable parameters", () => {
    const tools: ToolMetadata[] = [
      {
        name: "testFunc1",
        description: "First test function.",
        parameters: [
          {
            name: "param1",
            type: "string",
            description: "first parameter.",
            nullable: false,
          },
        ],
        returnType: "string",
      },
      {
        name: "testFunc2",
        description: "Second test function.",
        parameters: [
          {
            name: "param2",
            type: "number",
            description: "second parameter.",
            nullable: true,
          },
          {
            name: "param3",
            type: "string",
            description: "third parameter.",
            nullable: false,
          },
        ],
        returnType: "number",
      },
    ];

    const schema = generateLangChainSchema(tools);

    expect(schema).toEqual({
      tools: [
        {
          name: "testFunc1",
          description: "First test function.",
          parameters: {
            type: "object",
            properties: {
              param1: {
                type: "string",
                description: "first parameter.",
              },
            },
            required: ["param1"],
          },
          returnType: "string",
        },
        {
          name: "testFunc2",
          description: "Second test function.",
          parameters: {
            type: "object",
            properties: {
              param2: {
                type: "number",
                description: "second parameter.",
              },
              param3: {
                type: "string",
                description: "third parameter.",
              },
            },
            required: ["param3"],
          },
          returnType: "number",
        },
      ],
    });
  });

  it("should generate schema with a specified model", () => {
    const tools: ToolMetadata[] = [
      {
        name: "testFunc",
        description: "A test function.",
        parameters: [
          {
            name: "param",
            type: "string",
            description: "a test parameter.",
          },
        ],
        returnType: "string",
      },
    ];

    const schema = generateLangChainSchema(tools, "testModel");

    expect(schema).toEqual({
      tools: [
        {
          name: "testFunc",
          description: "A test function.",
          parameters: {
            type: "object",
            properties: {
              param: {
                type: "string",
                description: "a test parameter.",
              },
            },
            required: ["param"],
          },
          returnType: "string",
          model: "testModel",
        },
      ],
    });
  });
  
  it("should handle nested object parameters", () => {
    const tools: ToolMetadata[] = [
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

    const schema = generateLangChainSchema(tools);
    
    expect(schema.tools[0].parameters.properties.user).toEqual({
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
