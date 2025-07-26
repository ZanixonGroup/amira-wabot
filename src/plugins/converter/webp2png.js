import axios from "axios";
import FormData from "form-data";

export default [{
  name: "webp2png",
  code: async(buffer) => {
    try {
      if(!buffer) return { status: false, message: "undefined reading buffer" };
      return await new Promise(async(resolve, reject) => {
        const form = new FormData();
        form.append("file", buffer, {
          filename: Date.now() + ".webp",
          contentType: "image/webp"
        });
        axios.post("https://api.magicstudio.com/studio/upload/file/", form, {
          headers: form.getHeaders()
        }).then(res => {
          const url = res.data?.url;
          if(!url) reject("failed while uploading image");
          axios.get("https://api.magicstudio.com/studio/tools/change-format/?image_url=" + url + "&new_format=png").then(res => {
            const image = res.data?.converted_image_url;
            if(!image) reject("failed while converting image");
            resolve({
              status: true,
              image
            })
          }).catch(reject)
        }).catch(reject)
      });
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]