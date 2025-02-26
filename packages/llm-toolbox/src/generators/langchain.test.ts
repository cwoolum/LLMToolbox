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
            type: "string",
            description: "third parameter.",
            nullable: false
          }
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
});
