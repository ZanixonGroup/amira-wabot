import axios from 'axios';
import FormData from 'form-data';
import { v4 as uuid } from "uuid";
import cdn from "./../../utils/cdn.js";

function string(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default [{
  name: "text2image",
  code: async (prompt) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" };
      return new Promise((resolve, reject) => {
        if(!prompt) return reject({ status: false, message: "undefined reading prompt" });
        const form = new FormData();
        form.append('prompt', prompt);
        form.append('output_format', 'bytes');
        form.append('user_profile_id', 'null');
        form.append('anonymous_user_id', uuid());
        form.append('request_timestamp', Date.now().toString());
        form.append('user_is_subscribed', 'false');
        form.append('client_id', string(43));
      
        // Mengirim permintaan POST menggunakan axios
        axios.post('https://ai-api.magicstudio.com/api/ai-art-generator', form, {
          responseType: "arraybuffer",
          headers: {
            ...form.getHeaders(),
            authority: "ai-api.magicstudio.com",
            origin: "https://magicstudio.com",
            referer: "https://magicstudio.com/ai-art-generator"
          }
        })
          .then(async res => {
            let image = res.data;
            if(!Buffer.isBuffer(image)) return reject({ status: false, message: "failed generating image" });
            image = (await cdn.upload({ content: image })).data.url;
            if(!image) image = res.data;
            resolve({ status: true, image });
          })
          .catch(error => {
            reject({ status: false, message: error });
          });
      });
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]