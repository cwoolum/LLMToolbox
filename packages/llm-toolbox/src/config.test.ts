import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadConfig } from "./config.js";
import * as fs from "fs";
import * as path from "path";

vi.mock("fs");
vi.mock("path");

describe("Config Loader", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should load config file if it exists", () => {
    const mockConfig = {
      framework: "openai",
      files: ["src/tools.ts"],
      output: "output.json",
      debug: true,
    };

    vi.mocked(path.join).mockReturnValueOnce("/path/to/.llmtoolboxrc.json");
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(mockConfig));

    const config = loadConfig();
    expect(config).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith("/path/to/.llmtoolboxrc.json");
    expect(fs.readFileSync).toHaveBeenCalledWith("/path/to/.llmtoolboxrc.json", "utf-8");
  });

  it("should use custom config path if provided", () => {
    const mockConfig = { framework: "anthropic" };
    const customPath = "/custom/path/config.json";

    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    vi.mocked(fs.readFileSync).mockReturnValueOnce(JSON.stringify(mockConfig));

    const config = loadConfig(customPath);
    expect(config).toEqual(mockConfig);
    expect(fs.existsSync).toHaveBeenCalledWith(customPath);
    expect(fs.readFileSync).toHaveBeenCalledWith(customPath, "utf-8");
  });

  it("should return empty object if config file doesn't exist", () => {
    vi.mocked(path.join).mockReturnValueOnce("/path/to/.llmtoolboxrc.json");
    vi.mocked(fs.existsSync).mockReturnValueOnce(false);

    const config = loadConfig();
    expect(config).toEqual({});
    expect(fs.existsSync).toHaveBeenCalledWith("/path/to/.llmtoolboxrc.json");
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });

  it("should handle JSON parsing errors", () => {
    vi.mocked(path.join).mockReturnValueOnce("/path/to/.llmtoolboxrc.json");
    vi.mocked(fs.existsSync).mockReturnValueOnce(true);
    vi.mocked(fs.readFileSync).mockReturnValueOnce("invalid json");

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    
    const config = loadConfig();
    expect(config).toEqual({});
    expect(consoleSpy).toHaveBeenCalled();
    expect(fs.existsSync).toHaveBeenCalledWith("/path/to/.llmtoolboxrc.json");
    expect(fs.readFileSync).toHaveBeenCalledWith("/path/to/.llmtoolboxrc.json", "utf-8");
  });
});