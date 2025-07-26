import axios from "axios";
import FormData from "form-data";

export default [{
  name: "pinsdl",
  code: async(url) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!url) return reject("missing url input!");
        if(!/https?:\/\/(www\.)?(pinterest\.(com|co\.[a-z]{2,3})|pin\.it)\/(\w+|pin\/\d+)/i.test(url)) return reject("invalid pinterest url!");
        const form = new FormData();
        form.append("action", "pinterest_action");
        form.append("pinterest", "is_private_video=&pinterest_video_url=" + url);
        axios.post("https://pintodown.com/wp-admin/admin-ajax.php", form, {
          headers: {
            ...form.getHeaders(),
            origin: "https://pintodown.com",
            referer: "https://pintodown.com/"
          }
        }).then(res => {
          const data = res.data;
          if(!data?.success) return reject(data?.message);
          if(!(data.data?.video || data.data?.image)) return reject("failed fetch media!")
          resolve({
            status: true,
            media: data.data?.video || data.data?.image || null
          })
        }).catch(reject);
      })
    } catch (e) {
      return {
        status: false,
        error: e
      }
    }
  }
}]