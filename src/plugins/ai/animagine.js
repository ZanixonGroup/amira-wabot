import axios from "axios";
import util from "util";

export default [{
  name: "animagine",
  code: async(prompt, ratio = "1:1", qualitytag = "3") => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" }
      const response = await axios.get(global.api.samir.base + "/animagine?prompt=" + prompt + "&resolution=" + ratio + "&qualitytag=" + qualitytag, {
        responseType: "arraybuffer"
      });
      const data = response.data;
      return { status: true, data }
    } catch (e) {
      return { status: false, message: util.format(e) }
    }
  }
}]