import axios from "axios";

export default [{
  name: "groq",
  code: async(options) => {
    try {
      return await new Promise(async(resolve, reject) => {
        axios.post("https://api.groq.com/openai/v1/chat/completions", options, {
          headers: {
            authorization: "Bearer "
          }
        }).then(async res => {
          const data = res.data;
          if(data?.error) return reject(data.error.message || "failed get response");
          const answer = data.choices[0].message.content;
          return resolve({
            success: true,
            result: {
              answer,
              ...data
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
}]
