import axios from "axios";
import util from "util";

export default [{
  name: "mixtral",
  code: async (messages) => {
    try {
      if (!messages.length) return { status: false, message: "Undefined reading messages" };
      return await new Promise(async (resolve, reject) => {
        axios.post("https://api.deepinfra.com/v1/chat/completions", {
          messages: [
            {
              role: "system",
              content: "kamu adalah mixtral berbahasa indonesia!"
            },
            {
              role: "user",
              content: message
            }
          ],
          model: "mistralai/Mistral-7B-Instruct-v0.3",
          max_tokens: 2048,
          stream: false
        }).then(res => {
          let data = res.data;
          const answer = data?.choices[0]?.message?.content;
          if(!answer) return reject("failed generating message");
          resolve({
            status: true,
            answer
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: util.format(e) };
    }
  }
}];