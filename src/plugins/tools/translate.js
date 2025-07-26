import { translate } from "@vitalets/google-translate-api";

export default [{
  name: "translate",
  code: async(text, target_lang) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!text) return reject("missing text input!");
        if(!target_lang) return reject("missing target_lang input!");
        translate(text, { to: target_lang }).then(res => {
          resolve({
            status: true,
            ...res
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