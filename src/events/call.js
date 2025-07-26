import Func from "./../libs/function.js";

export default {
  name: "call",
  code: async (json) => {
    if(!global.bot.antiCall) return;
    for (const id of json) {
      if (id.status == "offer") {
        if (id.isGroup == false) {
          await global.client.sendMessage(id.from, {
            text: `Telpon dibatalkan oleh program otomatis, saat ini nomor kamu telah diblokir oleh amira secara otomatis.`,
            mentions: [id.from]
          });
          await global.client.rejectCall(id.id, id.from);
          await Func.sleep(8000)
          await global.client.updateBlockStatus(id.from, "block");
        } else {
          await global.client.rejectCall(id.id, id.from);
        }
      }
    }
  }
}