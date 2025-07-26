export default [{
  tag: "main",
  name: "menu",
  command: ["menu"],
  code: async({ client, m, remote, sender, Commands, MessageBuilder, prefix, upperFirst, facemoji, alertMessage, logs }) => {
    try {
      let listCommand = "";
      let commandCategory = {}
      Array.from(Commands.values()).map(d => {
        commandCategory[d.tag] = Array.from(Commands.values()).filter(cmd => cmd.tag === d.tag);
      });
      let commandTags = Object.keys(commandCategory).filter(d => d !== "hidden");
      for(let tag of commandTags.sort()) {
        let commands = commandCategory[tag];
        if(commands) {
          let filteredCommand = commands.filter(d => !d.disable.status).map(cmd => {
            let isPremium = cmd.options.isPremium ? "🄿" : "";
            return `> ▹ ${prefix + cmd.command[0]} ${isPremium}`;
          })
          let list = filteredCommand.sort();
          listCommand += `✿ 🜺「 *${upperFirst(tag)}* 」\n`;
          listCommand += list.join("\n") + "\n";
          listCommand += `✿・─────────────・✿\n\n`;
        }
      }
      const message = new MessageBuilder()
        .setStyle(1)
        .setText(`Halo kak @${sender.split("@")[0]}, Amira disini ${facemoji.joy}

${listCommand}`)
        .setMentions([sender])
        .build()
      client.sendMessage(remote, message, { quoted: m });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]