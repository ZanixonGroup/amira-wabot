import axios from "axios";

export default [{
  name: "stickerTelegram",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url.match(/(https:\/\/t.me\/addstickers\/)/gi)) return reject("Maaf kak, link sticker telegram tidak valid");
        const packName = url.replace("https://t.me/addstickers/", "");
        axios.get(`https://api.telegram.org/bot7534841830:AAHzfGHYti9y9SitVLRqHtOYxR-JUnQiivg/getStickerSet?name=${encodeURIComponent(packName)}`, {
          headers: {
            userAgent: "GoogleBot"
          }
        }).then(async res => {
          const data = res.data;
          if(!data.ok) return reject("Maaf kak, amira gagal mendownload sticker nya")
          const fetchImage = async(fileId) => (await axios.get(`https://api.telegram.org/bot7534841830:AAHzfGHYti9y9SitVLRqHtOYxR-JUnQiivg/getFile?file_id=${fileId}`)).data;
          const media = await Promise.all(data.result.stickers.map(async d => {
            const image = await fetchImage(d.file_id);
            return `https://api.telegram.org/file/bot7534841830:AAHzfGHYti9y9SitVLRqHtOYxR-JUnQiivg/${image.result.file_path}`;
          }))
          resolve({
            status: true,
            media
          })
        }).catch(e => {
          reject("Maaf kak, amira gagal mendownload sticker nya")
          return console.error("Error at stickerTelegram plugin:", e)
        })
      })
    } catch (e) {
      return {
        status: false,
        error: e
      }
    }
  }
}]