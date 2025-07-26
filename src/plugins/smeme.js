import axios from "axios";
import { Uploader } from "./../utils/Uploader.js";
const up = new Uploader();

export default [{
  name: "smeme",
  code: async(top, bottom, buffer) => {
    try {
      if(!buffer) return { status: false, message: "undefined reading buffer" };
      return await new Promise(async(resolve, reject) => {
        const image = await up.cdn(buffer);
        if(!image.status) return reject("failed while uploading image");
        axios.post("https://api.memegen.link/templates/custom", {
          background: image.data.url,
          text: [
            top,
            bottom
          ],
          font: "impact",
          redirect: true
        }, {
          responseType: "arraybuffer"
        }).then(res => {
          if(!Buffer.isBuffer(res.data)) return reject("failed while creating image");
          resolve({
            status: true,
            image: res.data
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]