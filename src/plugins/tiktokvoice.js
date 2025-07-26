import axios from "axios";

export default [{
  name: "tiktokVoice",
  code: async(text, voice = "id_001") => {
    try {
      if(!text) return { status: false, message: "undefined reading text!" };
      return await new Promise(async(resolve, reject) => {
        axios.post("https://tiktok-tts.weilbyte.dev/api/generate", {
          text,
          voice
        }, { responseType: "arraybuffer" }).then(res => {
          const buffer = res.data;
          if(!Buffer.isBuffer(buffer)) return reject("failed generating voice!");
          return resolve({
            status: true,
            sound: buffer
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]