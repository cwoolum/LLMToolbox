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
      functions: [
        {
          functionName: "testFunc",
          functionDescription: "A test function.",
          functionParameters: {
            type: "object",
            properties: {
              param: {
                type: "string",
                description: "a test parameter.",
              },
            },
            required: ["param"],
          },
          functionReturnType: "string",
        },
      ],
    });
  });

  it("should generate schema for multiple tools", () => {
    const tools: ToolMetadata[] = [
      {
        name: "testFunc1",
        description: "First test function.",
        parameters: [
          {
            name: "param1",
            type: "string",
            description: "first parameter.",
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
          },
        ],
        returnType: "number",
      },
    ];

    const schema = generateBedrockSchema(tools);

    expect(schema).toEqual({
      functions: [
        {
          functionName: "testFunc1",
          functionDescription: "First test function.",
          functionParameters: {
            type: "object",
            properties: {
              param1: {
                type: "string",
                description: "first parameter.",
              },
            },
            required: ["param1"],
          },
          functionReturnType: "string",
        },
        {
          functionName: "testFunc2",
          functionDescription: "Second test function.",
          functionParameters: {
            type: "object",
            properties: {
              param2: {
                type: "number",
                description: "second parameter.",
              },
            },
            required: ["param2"],
          },
          functionReturnType: "number",
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
      functions: [
        {
          functionName: "testFunc",
          functionDescription: "A test function.",
          functionParameters: {
            type: "object",
            properties: {
              param: {
                type: "string",
                description: "a test parameter.",
              },
            },
            required: ["param"],
          },
          functionReturnType: "string",
          model: "testModel",
        },
      ],
    });
  });
});
