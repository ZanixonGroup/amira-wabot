import * as google from "google-sr";

export default [{
  name: "googleSearch",
  code: async(query) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!query) return reject("query must be filled!")
        const opt = {
          query,
          resultTypes: [google.OrganicResult],
          requestConfig: {
            params: {
              safe: "active"
            }
          }
        }
        const data = await google.search(opt);
        if(data.length < 1) return reject("can't data with that query!");
        return resolve({
          status: true,
          data
        })
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]