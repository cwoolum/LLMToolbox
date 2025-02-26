import { ToolMetadata } from "./parser.js";
import * as fs from "fs";
import * as path from "path";

/**
 * Plugin interface for framework generators
 */
export interface GeneratorPlugin {
  /**
   * Name of the plugin
   */
  name: string;
  
  /**
   * Framework ID (e.g., "openai", "langchain")
   */
  framework: string;
  
  /**
   * Description of the plugin
   */
  description: string;
  
  /**
   * Generate schema for the plugin's framework
   * @param tools - Array of tool metadata
   * @param options - Optional generation options
   * @returns Generated schema
   */
  generate: (tools: ToolMetadata[], options?: Record<string, any>) => any;
}

/**
 * Plugin registry for managing generator plugins
 */
export class PluginRegistry {
  private plugins: Map<string, GeneratorPlugin> = new Map();
  
  /**
   * Register a new plugin
   * @param plugin - Plugin to register
   */
  register(plugin: GeneratorPlugin): void {
    this.plugins.set(plugin.framework.toLowerCase(), plugin);
  }
  
  /**
   * Get a plugin by framework ID
   * @param framework - Framework ID
   * @returns Plugin for the framework, or undefined if not found
   */
  getPlugin(framework: string): GeneratorPlugin | undefined {
    return this.plugins.get(framework.toLowerCase());
  }
  
  /**
   * Get all registered plugins
   * @returns Array of all plugins
   */
  getPlugins(): GeneratorPlugin[] {
    return Array.from(this.plugins.values());
  }
  
  /**
   * Generate schema using a plugin
   * @param framework - Framework ID
   * @param tools - Array of tool metadata
   * @param options - Optional generation options
   * @returns Generated schema
   */
  generate(framework: string, tools: ToolMetadata[], options?: Record<string, any>): any {
    const plugin = this.getPlugin(framework);
    if (!plugin) {
      throw new Error(`No plugin registered for framework: ${framework}`);
    }
    
    return plugin.generate(tools, options);
  }
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new PluginRegistry();

/**
 * Load plugins from a directory
 * @param dirPath - Directory path to load plugins from
 * @returns Number of plugins loaded
 */
export async function loadPlugins(dirPath: string): Promise<number> {
  if (!fs.existsSync(dirPath)) {
    return 0;
  }
  
  const pluginFiles = fs.readdirSync(dirPath).filter(file => 
    file.endsWith('.js') && !file.endsWith('.test.js')
  );
  
  let loadedCount = 0;
  
  for (const file of pluginFiles) {
    try {
      const module = await import(path.join(dirPath, file));
      if (module.default && typeof module.default === 'object' && module.default.framework && module.default.generate) {
        pluginRegistry.register(module.default);
        loadedCount++;
      }
    } catch (error) {
      console.warn(`Failed to load plugin from ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return loadedCount;
}