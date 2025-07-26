import axios from "axios";
import util from "util";

export default [{
  name: "nijiJourney",
  code: async(prompt) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" }
      return await new Promise(async(resolve, reject) => {
        const match = prompt.match(/--ar (\d+:\d+)/);
        const ar = match ? match[1] : "4:7";
        const aspectRatio = {
          "1:1": "1:1",
          "9:7": "9:7",
          "7:9": "7:9",
          "19:13": "19:13",
          "13:19": "13:19",
          "7:4": "7:4",
          "4:7": "4:7",
          "12:5": "12:5",
          "5:12": "5:12"
        };
        axios.get(global.api.samir.base + "/niji?prompt=" + prompt + "&resolution=" + (aspectRatio[ar] || "4:7"), {
          responseType: "arraybuffer"
        }).then(res => {
          const data = res.data;
          if(!Buffer.isBuffer(data)) reject("failed generate image!");
          resolve({
            status: true,
            image: data
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: util.format(e) }
    }
  }
}]