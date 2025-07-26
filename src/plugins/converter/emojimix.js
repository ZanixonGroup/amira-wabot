import axios from "axios";

export default [{
  name: "emojimix",
  code: async(emoji) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!emoji) return reject("missing emoji!");
        const [left, right] = emoji.split("+");
        axios.get(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(left)}_${encodeURIComponent(right)}`).then(res => {
          const data = res.data;
          if(data.results.length <= 0) return reject("failed");
          resolve({
            status: true,
            emoji: data.results.map(d => d.url)
          })
        }).catch(reject);
      })
    } catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }
}]