/*
    Baileys loadCommands by github.com/ZTRdiamond
    ------------------------------------------------------
    Source: https://github.com/ZanixonGroup/amira-bot-base
    | Don't delete this credit!
*/

import "./../config.js";
import * as glob from "glob";
import path from "path";
import util from "util";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const Commands = new Map();
async function SmartCommands(commandsDirectory, logs) {
  try {
    const directory = path.join(__dirname, "..", commandsDirectory);
    const files = glob.sync(`${directory}/**/*.js`);
    let geminiFunctions = []
    let cmds = {};
    files.forEach(async (file) => {
      const baseCommand = await import(file);
      const commands = baseCommand.default;
      if(!commands) return; // close when command file is no code!
      for(let command of commands) {
        const head = {
          name: command.name,
          description: command.description,
          parameters: {
            type: "OBJECT",
            properties: {
              ...(command.parameters.properties || { optional: { type: "STRING", description: "this parameter is optional, you can't use this" }})
            },
            required: command.parameters.required || []
          }
        }
        const code = {
          name: command.name, 
          options: {
            credits: command?.options?.credits || 0
          },
          gemini: command.gemini || (async() => {}),
          code: command.code || (async() => {})
        }
        geminiFunctions.push(head);
        cmds[command.name] = code;
      }
      Commands.set("cmds", cmds)
      Commands.set("funcs", geminiFunctions)
    });
    return Commands;
  } catch (e) {
    console.log(global.clock.info, "[Error]".danger, "Something error on commands handler:".warn,
      "\n", util.format(e).danger);
  }
}

export default SmartCommands;