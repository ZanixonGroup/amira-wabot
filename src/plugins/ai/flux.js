import flux from "./../../libs/scrapers/ai/txt2img/flux.js";

export default [{
  name: "flux",
  code: async(prompt) => {
    try {
      return await new Promise(async(resolve, reject) => {
        flux(prompt).then(res => {
          if(!res.success) return reject("failed generating image");
          return resolve({
            status: true,
            image: res.image
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