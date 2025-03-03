#!/usr/bin/env node

import { runCLI } from "../cli.js";

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

runCLI();
