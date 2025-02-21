import { ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { toolConfig } from "./generated-tool-config";

const command = new ConverseCommand({
  modelId: "modelId",
  toolConfig,
});
