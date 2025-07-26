import cobalt from "./../../libs/scrapers/cobalt.js";
import axios from "axios";
import FormData from "form-data";

export default [{
  name: "tiktokdl",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url input!");
        const form = new FormData()
        form.append("url", url.split("?")[0])
        form.append("count", "12")
        form.append("hd", "1")
        axios.post("https://tikwm.com/api/", form, {
          headers: {
            ...form.getHeaders()
          }
        }).then(res => {
          const data = res.data;
          if(data.msg !== "success") return reject("failed fetch data");
          if(!data?.data) return reject("failed fetch data");
          const meta = data?.data;
          resolve({
            status: true,
            result: {
              type: (meta.images ? "image" : (meta.play ? "video" : "unknown")),
              id: meta.id,
              region: meta.region,
              metadata: {
                title: meta.title,
                duration: meta.duration + "s",
                size: {
                  original: Math.floor(meta.size / 1048576).toFixed(2) + " MB",
                  hd: Math.floor(meta.hd_size / 1048576).toFixed(2) + " MB"
                },
                music: {
                  id: meta.music_info.id,
                  title: meta.music_info.title,
                  author: meta.music_info.author
                }
              },
              media: {
                ...(meta.images ? { images: meta.images } : {}),
                ...(meta.images ? {} : (meta.play ? { video: meta.play } : {})),
                ...(meta.music ? { audio: meta.music } : {}),
              }
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false,
        errors: e
      }
    }
  }
}]
