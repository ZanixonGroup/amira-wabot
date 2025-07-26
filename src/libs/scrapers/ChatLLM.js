import axios from "axios";

const ChatLLM = {
  completions: async(params) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!params.messages) return reject("missing messages input!");
        axios.post("", {
          model: "qwen-max-latest",
          messages: params.messages,
          ...params
        }, {
          headers: {
            'Authorization': '',
            'Content-Type': 'application/json'
          }
        }).then(res => {
          const data = res.data;
          if(data.status !== 200) return reject(data?.error || "failed generating response!");
          return resolve({
            success: true,
            result: {
              answer: data.result
            }
          })
        }).catch(e => reject(e.response.data || e.response || e.message))
      })
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
}

export default ChatLLM;
