export default [{
  tag: "owner",
  name: "restart",
  command: ["restart","rerun","rrun"],
  options: {
    isOwner: true
  },
  code: async({ client, m, logs, alertMessage }) => {
    try {
      m.reply("Restarting bot...").then(() => {
        process.send("reset");
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]