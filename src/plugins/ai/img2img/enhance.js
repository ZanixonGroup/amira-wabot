import fasturl from "./../../../libs/api/fastapi.js"
import cdn from "./../../../utils/cdn.js";

export default [{
  name: "enhance", 
  code: async (image, multi = 2, nime) => {
    return await new Promise(async (resolve, reject) => {
      fasturl.get("/aiimage/superscale", {
        params: {
          imageUrl: (await cdn.upload({ content: image }))?.data?.url,
          resize: multi,
          anime: Boolean(nime)
        }
      }).then(resolve)
      .catch(reject)
    })
  }
}]