const baileys = (await import("@whiskeysockets/baileys")).default;
const { proto } = baileys;
const { generateWAMessageFromContent } = baileys;
const { generateWAMessageContent } = baileys;

export default [{
  name: "test",
  tag: "hidden",
  command: ["test"],
  options: {
    isOwner: true,
  },
  code: async({ client, remote, sender, m, text, plugins, quoted, MessageCollector }) => {
    try {
      const media = await quoted.download();
      client.sendMedia(sender, media, m, {
        caption: text || ""
      })
    } catch (e) {
      m.reply(e)
    }
  }
}]
