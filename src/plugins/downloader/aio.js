import axios from "axios";

export default [{
  name: "aiodl",
  code: async(url) => {
    try {
      if(!url) return { status: false, message: "undefined reading url" };
      return await new Promise(async(resolve, reject) => {
        axios("https://api.cobalt.tools/api/json", {
          method: "OPTIONS",
          headers: {
            "access-control-request-method": "POST",
            "access-control-request-headers": "content-type",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            origin: "https://cobalt.tools",
            referer: "https://cobalt.tools",
          }
        }).then(async res => {
          axios.post("https://api.cobalt.tools/api/json", {
            filenamePattern: "basic",
            isAudioOnly: true,
            url
          }, {
            headers: {
              "access-control-request-method": "POST",
              "access-control-request-headers": "content-type",
              origin: "https://cobalt.tools",
              referer: "https://cobalt.tools",
              "user-agent": "https://cobalt.tools",
              "content-type": "application/json",
              accept: "application/json",
            }
          }).then(res => {
            const data = res.data;
            let audio;
            if(!data?.url) audio = undefined;
            audio = data.url;
            axios.post("https://api.cobalt.tools/api/json", {
              filenamePattern: "basic",
              url
            }, {
              headers: {
                "access-control-request-method": "POST",
                "access-control-request-headers": "content-type",
                origin: "https://cobalt.tools",
                referer: "https://cobalt.tools",
                "user-agent": "https://cobalt.tools",
                "content-type": "application/json",
                accept: "application/json",
              }
            }).then(res => {
              const data = res.data;
              let video;
              if(!data?.url) video = undefined;
              video = data.url;
              if(!audio && !video) reject("failed downloading media!");
              resolve({
                status: true,
                media: {
                  audio,
                  video
                }
              })
            }).catch(reject)
          }).catch(reject)
        }).catch(reject)
      });
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]