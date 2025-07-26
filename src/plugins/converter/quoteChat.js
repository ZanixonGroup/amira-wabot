import axios from "axios"


export default [{
  name: "quotlyChat",
  code: async(ctx) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!ctx?.sender) return reject("sender message not found!");
        let payload = {
          type: "quote",
          format: "png",
          backgroundColor: "#FFFFFF",
          width: 512,
          height: 768,
          scale: 2,
          messages: [{
            entities: [],
            avatar: true,
            from: {
              id: 1,
              name: ctx.sender.name, 
              photo: {
                url: ctx.sender.avatar || "https://telegra.ph/file/1e22e45892774893eb1b9.jpg"
              }
            },
            text: ctx.sender.text || "",
            ...(ctx.reply ? { replyMessage: {
              name: ctx.reply.name,
              text: ctx.reply.text || "",
              chatId: Math.floor(Math.random() * 9999999)
            }} : {}),
            ...(ctx.media ? { media: {
              url: ctx.media
            }} : {})
          }]
        };
        axios.post("https://bot.lyo.su/quote/generate", payload, {
          headers: {
            contentType: "application/json"
          }
        }).then(res => {
          let data = res.data;
          if(!data.ok) return reject("failed creating quotly chat!")
          data.result.image = Buffer.from(data.result.image, "base64");
          resolve({
            status: true,
            data: data.result
          })
        }).catch(reject)
      });
    } catch (e) {
      return { status: false, message: e }
    }
  }
}]