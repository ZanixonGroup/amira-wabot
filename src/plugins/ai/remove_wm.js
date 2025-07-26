import axios from "axios";
import FormData from "form-data";

export default [{
  name: "removeWm",
  code: async(buffer) => {
    try {
      if(!buffer) return { status: false, message: "undefined reading buffer" };
      return await new Promise(async (resolve, reject) => {
        const form = new FormData();
        form.append("image", buffer, {
          filename: Date.now() + ".jpeg",
          contentType: "image/jpeg"
        });
  
        // upload image
        axios.post('https://api.imggen.ai/guest-upload', form, { headers: form.getHeaders() }).then(async tmp => {
          if(!tmp.data?.image?.url) return reject("remove text image failed at uploading image into AI service");
          tmp.data.image.url = "https://api.imggen.ai" + tmp?.data?.image?.url;
          const payload = { image: tmp?.data?.image };
  
          // request
          axios.post("https://api.imggen.ai/guest-watermark-remover", payload).then(async res => {
            const data = res.data;
            if(!data?.watermark_removed_image) return reject("failed remove watermark image");
            resolve({
              status: true,
              image: "https://api.imggen.ai" + data.watermark_removed_image
            });
          }).catch(reject);
        }).catch(reject);
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]