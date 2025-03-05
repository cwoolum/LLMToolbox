import { Project } from "ts-morph";
import path from "path";
import fs from "fs";
import { debugMode } from "./config.js";

export interface ParameterMetadata {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
  nullable?: boolean;
  properties?: Record<string, ParameterMetadata>; // For nested object types
  isObject?: boolean;
}

export interface ToolMetadata {
  name: string;
  description: string;
  parameters: ParameterMetadata[];
  returnType: string;
}

export function parseFiles(files: string[], ignoreMissing: boolean): ToolMetadata[] {
  const project = new Project({
    compilerOptions: { allowJs: true, checkJs: false },
  });
  let tools: ToolMetadata[] = [];

  for (const filePath of files) {
    const standardizedFilePath = path.resolve(process.cwd(), filePath);
    console.log("Standardized file path:", standardizedFilePath);
    if (!fs.existsSync(standardizedFilePath)) {
      throw new Error(`File not found: ${standardizedFilePath}`);
    }
    const sourceFile = project.addSourceFileAtPath(standardizedFilePath);
    const functions = sourceFile.getFunctions();

    for (const func of functions) {
      const name = func.getName();
      if (!name) continue;
      
      // Skip functions that are not exported
      if (!func.isExported()) {
        if (debugMode) {
          console.log(`Skipping non-exported function "${name}" in ${filePath}`);
        }
        continue;
      }

      const jsDocs = func.getJsDocs();
      const description = jsDocs.length > 0 ? jsDocs[0].getComment()?.toString().trim() : undefined;
      if (!description && !ignoreMissing) {
        throw new Error(`Missing function description for "${name}" in ${filePath}`);
      }

      const returnType = func.getReturnType().getText();
      if (!returnType && !ignoreMissing) {
        throw new Error(`Missing return type for function "${name}" in ${filePath}`);
      }

      const parameters = func.getParameters();
      const paramsMeta: ParameterMetadata[] = parameters.map((param) => {
        const paramName = param.getName();
        const paramType = param.getType();
        const paramTypeText = paramType.getText();
        const paramDescription = jsDocs
          .flatMap((doc) => doc.getTags())
          .find((tag) => tag.getTagName() === "param" && tag.getText().includes(paramName))
          ?.getComment()
          ?.toString()
          .trim();

        if (!paramDescription && !ignoreMissing) {
          throw new Error(`Missing JSDoc @param description for parameter "${paramName}" in function "${name}"`);
        }

        // Check if parameter is optional or has a default value
        const isOptional = param.isOptional();
        const hasQuestionToken = param.getQuestionTokenNode() !== undefined;
        const hasInitializer = param.getInitializer() !== undefined;
        const hasNullableType = paramTypeText.includes(" | null") || paramTypeText.includes("null |");
        
        // Check if this is an object type with properties
        const isObject = paramType.isObject() && !paramType.getText().startsWith("Array") && 
                        !paramType.getText().startsWith("Map") && !paramType.getText().startsWith("Set");
        
        // Parse nested properties for object types
        const properties: Record<string, ParameterMetadata> = {};
        
        if (isObject) {
          const typeSymbol = paramType.getSymbol();
          if (typeSymbol) {
            const declaration = typeSymbol.getDeclarations()[0];
            if (declaration) {
              // Try to get properties from type declaration
              const members = paramType.getProperties();
              for (const member of members) {
                const memberName = member.getName();
                const memberType = member.getValueDeclaration()?.getType();
                const memberTypeText = memberType?.getText() || "any";
                
                properties[memberName] = {
                  name: memberName,
                  type: memberTypeText,
                  description: "", // We don't have JSDoc for nested properties
                  nullable: member.isOptional(),
                  isObject: memberType?.isObject() || false
                };
              }
            }
          }
        }
        
        return {
          name: paramName,
          type: paramTypeText,
          description: paramDescription || "",
          nullable: isOptional || hasQuestionToken || hasInitializer || hasNullableType,
          ...(hasInitializer && { defaultValue: param.getInitializer()?.getText() }),
          ...(isObject && { isObject: true }),
          ...(Object.keys(properties).length > 0 && { properties }),
        };
      });

      tools.push({ name, description: description || "", parameters: paramsMeta, returnType });
    }
  }

  return tools;
}
