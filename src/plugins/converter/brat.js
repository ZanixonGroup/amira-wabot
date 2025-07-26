import ezgif from "ezgif-node";
import axios from "axios";
import cdn from "./../../utils/cdn.js";

async function brat(text, animate = false) {
  try {
    return await new Promise((resolve, reject) => {
      if(!text) return reject("missing text input");
      if(animate) {
        axios.get("https://brat.caliphdev.com/api/brat/animate?text=" + encodeURIComponent(text), {
          responseType: "arraybuffer"
        }).then(async res => {
          const buffer = res.data;
          const image = await ezgif.convert({
            type: "gif-webp",
            file: buffer,
            filename: "brat-" + Date.now() + ".gif"
          }).catch(reject)
          if(!image) return reject("failed generate animated brat");
          return resolve({
            success: true,
            image
          })
        }).catch(reject)
      } else {
        axios.get("https://brat.caliphdev.com/api/brat?text=" + encodeURIComponent(text), {
          responseType: "arraybuffer"
        }).then(async res => {
          const buffer = res.data;
          const image = await ezgif.convert({
            type: "png-webp",
            file: buffer,
            filename: "brat-" + Date.now() + ".png"
          }).catch(reject)
          if(!image) return reject("failed generate brat");
          return resolve({
            success: true,
            image
          })
        }).catch(reject)
      }
    })
  } catch (e) {
    return {
      success: false,
      errors: e
    }
  }
}

export default [{
  name: "brat",
  code: async(text, animated) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!text) return reject("missing text input");
        brat(text, animated).then(data => {
          console.log(data)
          if(!data.success) return reject(data.errors || "failed creating brat sticker");
          return resolve({
            status: true,
            image: data.image
          });
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