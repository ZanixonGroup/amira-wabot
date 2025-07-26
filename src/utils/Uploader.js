// import fetch from "node-fetch";
import crypto from "crypto";
import FormData from "form-data";
import {
    fileTypeFromBuffer
} from "file-type";
import axios from "axios";
import fakeUserAgent from "fake-useragent";
import cdn from "./cdn.js"

class Uploader {
//     async telegraph(buffer) {
// 
//         try {
//             const {
//                 ext
//             } = await fileTypeFromBuffer(buffer);
//             const form = await createFormData(buffer, "file", ext);
//             const res = await fetch("https://telegra.ph/upload", {
//                 method: "POST",
//                 body: form
//             });
//             const img = await res.json();
//             if (img.error) throw img.error;
//             return `https://telegra.ph${img[0].src}`;
//         } catch (error) {
//             handleErrorResponse(error, spinner);
//         }
//     }
// 
//     async uploadPomf2(buffer) {
//         try {
//             const {
//                 ext
//             } = await fileTypeFromBuffer(buffer) || {};
//             const form = await createFormData(buffer, "files[]", ext);
//             const res = await fetch("https://pomf2.lain.la/upload.php", {
//                 method: "POST",
//                 body: form
//             });
//             const json = await res.json();
//             if (!json.success) throw json;
//             return json.files[0].url;
//         } catch (error) {
//             handleErrorResponse(error, spinner);
//         }
//     }
// 
//     async uploadToDiscdn(content) {
//         try {
//             const {
//                 ext,
//                 mime
//             } = await fileTypeFromBuffer(content) || {};
//             const formData = await createFormData(content, "files[0]", ext);
//             const res = await fetch("https://d
//                 headers: {
//                     Authorization: "Bot "
//                 },
//                 body: formData,
//             });
//             return await res.json();
//         } catch (error) {
//             handleErrorResponse(error, spinner);
//         }
//     }

    async aemt(buffer) {
      try {
        if(!buffer) return { status: false, message: "undefined reading buffer" };
        return await new Promise(async (resolve, reject) => {
          const { mime, ext } = await fileTypeFromBuffer(buffer);
          const form = new FormData();
          form.append("file", buffer, "amira-" + Date.now() + `.${ext}`);
          axios.post("https://widipe.com/api/upload.php", form, {
            headers: {
              ...form.getHeaders()
            }
          }).then(res => {
            const data = res.data;
            if(!data.status) return reject("failed uploading media");
            return resolve({
              status: true,
              url: data.result.url
            })
          }).catch(reject)
        })
      } catch (e) {
        return { status: false, message: e };
      }
    }

    async sazumi(buffer) {
      try {
        if(!buffer) return { status: false, message: "undefined reading buffer" };
        return await new Promise(async (resolve, reject) => {
          const { mime, ext } = await fileTypeFromBuffer(buffer);
          const form = new FormData();
          form.append("fileInput", buffer, {
            filename: "amira-" + Date.now() + `.${ext}`,
            contentType: `${mime}/${ext}`
          });
          axios.post("https://cdn.sazumi.moe/upload", form, {
            headers: {
              ...form.getHeaders()
            }
          }).then(res => {
            const file = res.data;
            if(file.status !== "success") return reject("failed uploading file!");
            return resolve({
              status: true,
              url: file.url_response
            })
          })
        })
      } catch (e) {
        return { status: false, message: e };
      }
    }
    
    async itzpire(buffer) {
      try {
        if(!buffer) return { status: false, message: "undefined reading buffer" };
        return await new Promise(async (resolve, reject) => {
          const { mime, ext } = await fileTypeFromBuffer(buffer);
          const form = new FormData();
          form.append("file", buffer, {
            filename: Date.now() + `.${ext}`,
            contentType: `${mime}/${ext}`
          });
          axios.post("https://itzpire.com/tools/upload", form, {
            headers: {
              ...form.getHeaders()
            }
          }).then(async res => {
            const data = res.data;
            if(data?.status !== "success") return reject("failed uploading media");
            return resolve({
              status: true,
              url: data?.fileInfo?.downloadUrl
            })
          }).catch(reject)
        })
      } catch (e) {
        return { status: false, message: e };
      }
    }
    
    async cdn(buffer) {
      try {
        return await cdn.upload({ content: buffer });
      } catch (e) {
        return { status: false, message: e }
      }
    }
}

export {
    Uploader
};
