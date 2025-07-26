import { format } from "util";
import axios from "axios";
import yts from "yt-search";
import fbdl from "fb-downloader-scrapper";
import { TwitterDL } from "twitter-downloader";

export default [{
  name: "ytsearch",
  code: async(query) => {
    try {
      if(!query) return { status: false, message: "undefined reading query" };
      return await new Promise(async(resolve, reject) => {
        yts(query, async(err, data) => {
          if(err != null) return reject(format(err));
          const result = [];
          data.all.filter(d => d.type === "video").map(d => {
            result.push({
              type: "video",
              url: d.url,
              thumbnail: d.thumbnail,
              title: d.title,
              description: d.description,
              channel: d.author,
              views: d.views,
              duration: d.timestamp,
              uploadDate: d.ago
            })
          })
          resolve({ status: true, data: result });
        })
      })
    } catch (e) {
      return { status: false, message: format(e) }
    }
  }
},{
  name: "fbdl",
  code: async(url) => {
    try {
      if(!url) return { status: false, message: "undefined reading url" };
      return await new Promise(async(resolve, reject) => {
        fbdl(url).then(async res => {
          resolve({ status: true, data: res });
        }).catch(err => reject(format(err)));
      })
    } catch (e) {
      return { status: false, message: format(e) }
    }
  }
},{
  name: "twdl",
  code: async(url) => {
    try {
      if(!url) return { status: false, message: "undefined reading url" };
      return await new Promise(async(resolve, reject) => {
        TwitterDL(url).then(async res => {
          if(res?.status == "error") return reject(res.message);
          resolve({ status: true, data: res.result });
        }).catch(err => reject(format(err)));
      })
    } catch (e) {
      return { status: false, message: format(e) }
    }
  }
}]