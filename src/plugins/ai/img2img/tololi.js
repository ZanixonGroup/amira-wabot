import zmo from "./../../../libs/scrapers/zmo.js";
import cdn from "./../../../utils/cdn.js";

export default [{
  name: "tololi",
  code: async(image) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!Buffer.isBuffer(image)) return reject("invalid image input!");
        const file = await cdn.upload({ content: image });
        if(!file.status) return reject("failed while uploading file!");
        zmo.convert(
          file.data.url,
          "86a695cb502b48448eb7a9c5d8160528",
          "99762ccfea0c4c9096ab62c243d4ffab"
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