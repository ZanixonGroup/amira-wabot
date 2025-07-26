export default [{
  tag: "owner",
  name: "shutdown",
  command: ["shutdown", "kill"],
  options: {
    isOwner: true
  },
  code: async({ client, m, logs, alertMessage }) => {
    try {
      m.reply("Shutdown bot...").then(() => {
        process.send("kill");
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]