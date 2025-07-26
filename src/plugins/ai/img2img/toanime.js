import zmo from "./../../../libs/scrapers/zmo.js";
import cdn from "./../../../utils/cdn.js";

export default [{
  name: "toanime",
  code: async(image) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!Buffer.isBuffer(image)) return reject("invalid image input!");
        const file = await cdn.upload({ content: image });
        if(!file.status) return reject("failed while uploading file!");
        zmo.convert(
          file.data.url,
          "b0f801c098264535a8c3529bbd22e74a",
          "f1b42d55aa57482ab8fb0a92acc1ccfb"
        ).then(res => {
          if(!res.success) return reject("failed generating image!");
          resolve({
            status: true, 
            image: res.images[0].image
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
}]