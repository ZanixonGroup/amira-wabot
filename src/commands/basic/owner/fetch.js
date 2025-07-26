import axios from "axios";
import util from "util";

export default [{
  tag: "owner",
  name: "getfile",
  command: ["getfile"],
  options: {
    isOwner: true
  },
  disable: {
    status: false
  },
  code: async({ client, m, remote, quoted, text, Func, fetchBuffer = Func.fetchBuffer, fetchJson = Func.fetchJson, logs, alertMessage }) => {
    try {
      if(!/^https?:\/\//.test(text)) return m.reply("Berikan input *URL* yang valid!");
      let url = new URL(text);
      await client.sendMedia(remote, url, m);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.error(import.meta.url, e);
    }
  }
}]