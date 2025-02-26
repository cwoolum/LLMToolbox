import { describe, it, expect } from "vitest";
import { generateBedrockSchema } from "./bedrock.js";
import { ToolMetadata } from "../parser.js";

describe("generateBedrockSchema", () => {
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

    const schema = generateBedrockSchema(tools);

    expect(schema).toEqual({
      tools: [
        {
          toolSpec: {
            name: "testFunc",
            description: "A test function.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  param: {
                    type: "string",
                    description: "a test parameter.",
                  },
                },
                required: ["param"],
              },
            },
          },
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
            nullable: false
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
            nullable: true
          },
          {
            name: "param3",
            type: "boolean",
            description: "third parameter.",
            nullable: false
          },
        ],
        returnType: "number",
      },
    ];

    const schema = generateBedrockSchema(tools);

    expect(schema).toEqual({
      tools: [
        {
          toolSpec: {
            name: "testFunc1",
            description: "First test function.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  param1: {
                    type: "string",
                    description: "first parameter.",
                  },
                },
                required: ["param1"],
              },
            },
          },
        },
        {
          toolSpec: {
            name: "testFunc2",
            description: "Second test function.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  param2: {
                    type: "number",
                    description: "second parameter.",
                  },
                  param3: {
                    type: "boolean",
                    description: "third parameter.",
                  },
                },
                required: ["param3"],
              },
            },
          },
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

    const schema = generateBedrockSchema(tools, "testModel");

    expect(schema).toEqual({
      tools: [
        {
          toolSpec: {
            name: "testFunc",
            description: "A test function.",
            inputSchema: {
              json: {
                type: "object",
                properties: {
                  param: {
                    type: "string",
                    description: "a test parameter.",
                  },
                },
                required: ["param"],
              },
            },
            model: "testModel",
          },
        },
      ],
    });
  });
});
