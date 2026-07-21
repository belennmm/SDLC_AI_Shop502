import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runTui } from "./tui.js";

const rl = readline.createInterface({ input, output });

try {
  await runTui({
    ask: (message) => rl.question(message),
    write: (message) => console.log(`| ${message}`)
  });
} finally {rl.close();}