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
async function loadCommandsRegex(commandsDirectory, logs) {
  try {
    const directory = path.join(__dirname, "..", commandsDirectory);
    const files = glob.sync(`${directory}/**/*.js`);
    files.forEach(async (file) => {
      const baseCommand = await import(file);
      const commands = baseCommand.default;
      if(!commands) return; // close when command file is no code!
      for(let command of commands) {
        if(!command?.command) return logs ? console.log(global.clock.info, "[ERROR]".danger, "Command error:".warn,"\n", `Undefined command trigger at path "${file}" location, please fix it to load the command!`.danger) : null;
        //if(!(command?.command instanceof RegExp)) return console.log("Bukan regex");
        const options = {
          tag: command?.tag ? command?.tag : "other",
          name: command?.name,
          command: command?.command,
          options: {
            isAdmin: command?.options?.isAdmin ? command?.options?.isAdmin : false,
            isBotAdmin: command?.options?.isBotAdmin ? command?.options?.isBotAdmin : false,
            isPremium: command?.options?.isPremium ? command?.options?.isPremium : false,
            isOwner: command?.options?.isOwner ? command?.options?.isOwner : false,
            isBot: command?.options?.isBot ? command?.options?.isBot : false,
            isGroup: command?.options?.isGroup ? command?.options?.isGroup : false,
            isPrivate: command?.options?.isPrivate ? command?.options?.isPrivate : false,
            nonPrefix: command?.options?.nonPrefix ? command?.options?.nonPrefix : false,
          },  
          disable: {
            status: command?.disable?.status ? command?.disable?.status : false,
            message: command?.disable?.message ? command?.disable?.message : "Perintah ini saat ini sedang dinonaktifkan!",
          },
          cooldown: {
            status: command?.cooldown?.status ? command?.cooldown?.status : false,
            duration: command?.cooldown?.duration ? command?.cooldown?.duration : 0,
            message: command?.cooldown?.message ? command?.cooldown?.message : "Harap tunggu *_{time}_* untuk menjalankan perintah ini lagi!"
          },
          limit: {
          	status: command?.limit?.status ? command?.limit?.status : false,
            usage: command?.limit?.usage ? command?.limit?.usage : 1
          },
          code: command?.code ? command?.code : () => {},
          location: file
        };
        console.log(options)
        Commands.set(command?.command, options);
      }
    });
    return Commands;
  } catch (e) {
    console.log(global.clock.info, "[Error]".danger, "Something error on commands handler:".warn,
      "\n", util.format(e).danger);
  }
}

export default loadCommandsRegex;