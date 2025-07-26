import jikan from "@mateoaranda/jikanjs";

export default [{
  name: "malSearch",
  code: async({query, type = "anime", limit = 10, params = {}}) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!query) return reject("undefined reading query");
        let data = await jikan.search(type, query, limit, params);
        resolve({
          status: true,
          data
        })
      })
    } catch (e) {
      return { status: false, message: e }
    }
  }
}]