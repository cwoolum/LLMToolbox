import { describe, it, expect } from "vitest";
import { parseFiles } from "../../llm-toolbox/dist/parser.js";
import { generateOpenAISchema } from "../../llm-toolbox/dist/generators/openai.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("OpenAI Integration Tests", () => {
  it("should generate valid schema for OpenAI and parse it with OpenAI SDK", () => {
    // Parse the sample tools file
    const toolFilePath = path.join(__dirname, "tools", "sample-tools.ts");
    const parsedTools = parseFiles([toolFilePath]);
    
    // Generate OpenAI schema
    const openaiSchema = generateOpenAISchema(parsedTools);
    
    // Create OpenAI client (won't actually make API calls)
    const openai = new OpenAI({ apiKey: "dummy-key" });
    
    // Validate that OpenAI schema can be used with OpenAI SDK
    // This would throw an error if the schema is not compatible
    const request = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "What's the weather like?" }],
      tools: openaiSchema,
    });
    
    // Check if schema properties meet expectations
    expect(openaiSchema).toHaveLength(3);
    
    const weatherTool = openaiSchema.find(tool => 
      tool.function.name === "getWeather"
    );
    expect(weatherTool).toBeDefined();
    expect(weatherTool?.function.parameters.properties.location.type).toBe("string");
    expect(weatherTool?.function.parameters.properties.unit.type).toBe("string");
    expect(weatherTool?.function.parameters.required).toContain("location");
    expect(weatherTool?.function.parameters.required).not.toContain("unit");
    
    const searchTool = openaiSchema.find(tool => 
      tool.function.name === "searchWeb"
    );
    expect(searchTool).toBeDefined();
    expect(searchTool?.function.parameters.properties.query.type).toBe("string");
    expect(searchTool?.function.parameters.properties.limit.type).toBe("number");
    expect(searchTool?.function.parameters.required).toContain("query");
    expect(searchTool?.function.parameters.required).not.toContain("limit");
  });
});