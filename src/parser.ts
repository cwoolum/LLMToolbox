import { Project, JSDoc } from "ts-morph";

export interface ParameterMetadata {
  name: string;
  type: string;
  description: string;
  defaultValue?: string;
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
    const sourceFile = project.addSourceFileAtPath(filePath);
    const functions = sourceFile.getFunctions();

    for (const func of functions) {
      const name = func.getName();
      if (!name) continue;

      const jsDocs = func.getJsDocs();
      const description = jsDocs.length > 0 ? jsDocs[0].getComment()?.trim() : undefined;
      if (!description && !ignoreMissing) {
        throw new Error(`Missing function description for "${name}" in ${filePath}`);
      }

      const returnType = func.getReturnType().getText();
      if (!returnType && !ignoreMissing) {
        throw new Error(`Missing return type for function "${name}" in ${filePath}`);
      }

      const parameters = func.getParameters();
      const paramsMeta: ParameterMetadata[] = parameters.map(param => {
        const paramName = param.getName();
        const paramType = param.getType().getText();
        // Use getComment() to retrieve the parameter description from the JSDoc tag
        const paramDescription = jsDocs
          .flatMap(doc => doc.getTags())
          .find(tag => tag.getTagName() === "param" && tag.getText().includes(paramName))
          ?.getComment()?.trim();

        if (!paramDescription && !ignoreMissing) {
          throw new Error(`Missing JSDoc @param description for parameter "${paramName}" in function "${name}"`);
        }

        return {
          name: paramName,
          type: paramType,
          description: paramDescription || "",
        };
      });

      tools.push({ name, description: description || "", parameters: paramsMeta, returnType });
    }
  }

  return tools;
}