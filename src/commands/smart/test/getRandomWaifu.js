export default [{
  name: "get_random_waifu",
  description: "mengirimkan gambar waifu atau neko ke saya",
  parameters: {
    properties: {
      type: {
        type: "STRING",
        description: "type of image, waifu or neko image."
      }
    },
    required: ["type"]
  },
  gemini: async({ axios, params }) => {
    try {
      return await new Promise(async(resolve, reject) => {
        axios.get("https://api.waifu.pics/sfw/" + (params.type || "waifu")).then(res => {
          const data = res.data;
          if(!data.url) return reject(`failed get ${params.type} image`);
          resolve({
            status: true,
            url: data.url
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e }
    }
  },
  code: async({ client, remote, m, amira }) => {
    await client.sendMedia(remote, amira.data.url, m, {
      caption: amira.answer
    })
  }
}]