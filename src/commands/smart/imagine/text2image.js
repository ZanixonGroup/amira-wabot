import cdn from "./../../../utils/cdn.js";

export default [{
  name: "imagine_text_to_image",
  description: "buatkan saya teks menjadi gambar dengan model ai text to image",
  parameters: {
    type: "OBJECT",
    properties: {
      prompt: {
        type: "STRING",
        description: "input prompt gambar dalam bahasa inggris"
      }
    },
    required: ["prompt"]
  },
  gemini: async({ plugins, params }) => {
    try {
      return await new Promise(async(resolve, reject) => {
        plugins.text2image(params.prompt).then(async res => {
          if(!res.status) return reject(res.message);
          const media = await cdn.upload({ content: res.image });
          res.prompt = `\`${params.prompt}\``
          res.image = media.data.url;
          console.log(res)
          resolve(res)
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  },
  code: async({ client, remote, m, amira, logs, alertMessage }) => {
    try {
      if(!amira.data.image) return m.reply(amira.answer)
      client.sendMedia(remote, amira.data.image, m, {
        caption: amira.answer,
        mimetype: "image/png"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]