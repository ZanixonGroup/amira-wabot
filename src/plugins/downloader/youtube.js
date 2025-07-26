import cobalt from "./../../libs/scrapers/cobalt.js";
import ryzen from "./../../libs/api/ryzen.js";
import axios from "axios";

export default [{
  name: "ytinfo",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url input");
        if(!/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(url)) return reject("invalid youtube url!");
        axios.get(`https://api.flvto.online/@api/search/YouTube/${url}`, {
          headers: {
            origin: "https://yt5s.is",
            referer: "https://yt5s.is/"
          }
        }).then(res => {
          const data = res.data;
          if(!data.items) return reject("failed fetch content");
          resolve({
            status: true,
            data: data.items.map(d => ({
              id: d.id,
              author: d.channelTitle,
              title: d.title,
              thumbnail: d.thumbHigh || d.thumbMedium || d.thumbDefault,
              publish: d.publishedAt,
              duration: d.duration,
              views: d.viewCount
            }))
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }
},{
  name: "ytmp4",
  code: async(url, quality = 720) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url input!");
        if(!/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/.test(url)) return reject("invalid youtube url!");
        ryzen.get("/api/downloader/ytmp4?url=" + url + "&quality=" + quality).then(data => {
          if(!data.success) return reject("failed fetch content");
          return resolve({
            status: true,
            media: data.result.downloadUrl || data.result.url
          })
        }).catch(reject);
      })
    } catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }
},{
  name: "ytmp3",
  code: async function insvidMP3(url) {
    try {
      return await new Promise(async(resolve, reject) => {
        url = url.match('v=([a-zA-Z0-9_-]+)&?')[1] || null;
        if(!url) reject("Missing url input or failed parsing videoId!");
        axios.post("https://ac.insvid.com/converter", {
          id: url,
          fileType: "mp3"
        }, {
          headers: {
            "Origin": "https://ac.insvid.com",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
          }
        }).then(async d => {
          if(!d.data?.link) reject("failed convert video to mp3!");
          resolve({
            success: true,
            media: d.data?.link
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
}]
