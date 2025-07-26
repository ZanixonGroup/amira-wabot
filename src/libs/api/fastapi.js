import axios from "axios";

const fastapi = axios.create({
  baseURL: "https://fastrestapis.fasturl.cloud",
  timeout: 120000,
  headers: {
    "User-Agent": "Postify/1.0.0"
  }
});

class FastAPI {
  constructor(){
  }
  
  async get(endpoint, options = {}) {
    try {
      return await new Promise((resolve, reject) => {
        if(typeof options !== "object") return reject("invalid options type input");
        fastapi.get(endpoint, options).then(res => {
          const data = res.data;
          resolve({
            code: res?.status || 200,
            success: true,
            result: data.result
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        code: e?.response?.status || 500,
        success: false,
        errors: e?.response?.data.error || e.message || e
      }
    }
  }
  
  async post(endpoint, body = {}, options = {}) {
    try {
      return await new Promise((resolve, reject) => {
        fastapi.post(endpoint, body, options).then(res => {
          const data = res.data;
          resolve({
            code: res?.status || 200,
            success: true,
            result: data.result
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        code: e?.response?.status || 500,
        success: false,
        errors: e?.response?.data.error || e.message || e
      }
    }
  }
}

export default new FastAPI();