import axios from "axios";

class Spotify {
  constructor(){
    this.baseUrl = "https://api.spotifydown.com";
    
    // api instance
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 100 * 1000,
      headers: {
        origin: "https://spotifydown.com",
        referer: "https://spotifydown.com/"
      }
    });
  }
  
  parseUrl(url) {
    if(!url) throw "missing url";
    const parsed = url.match(/https?:\/\/open\.spotify\.com\/(intl-[a-zA-Z0-9-]+\/)?(track|user|artist|album|playlist)\/([a-zA-Z0-9]+)/);
    if(!parsed[3]) throw "failed parse url";
    return parsed[3];
  }

  urlType(url) {
    if(!url) throw "missing url";
    const parsed = url.match(/https?:\/\/open\.spotify\.com\/(intl-[a-zA-Z0-9-]+\/)?(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if(!parsed[2]) throw "failed parse url";
    return parsed[2]
  }
  
  async metadata(url) {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url!");
        if(!/(www|http:|https:)+[^\s]+[\w]/.test(url)) return reject("invalid url input");
        const urlType = this.urlType(url);
        const urlId = this.parseUrl(url);
        this.api.get(`/metadata/${urlType}/${urlId}`).then(async res => {
          const data = res.data;
          if(!data.success) return reject("failed fetch metadata!");
          let tracks = [{
            id: data.id,
            title: data.title, 
            artists: data.artists,
            album: data.album,
            releaseDate: data.releaseDate
          }];
          if(urlType === "playlist" || urlType === "album") {
            await this.api.get(`/trackList/${urlType}/${urlId}`).then(async res => {
              const data = res.data;
              if(!data.success) return reject("failed while fetching playlist metdata");
              tracks = data.trackList;
              return;
            }).catch(reject)
          }
          resolve({
            success: true,
            result: {
              type: urlType,
              artists: data.artists,
              title: data.title,
              cover: data.cover,
              releaseDate: data.releaseDate,
              tracks
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false, 
        errors: e
      }
    }
  }
  
  async download(id) {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!id) return reject("missing track id input");
        this.api.get(`/download/${id}`).then(async res => {
          const data = res.data;
          if(!data.success) return reject("failed fetch media");
          resolve({
            success: true,
            result: {
              id: data.metadata.id,
              title: data.metadata.title, 
              artists: data.metadata.artists,
              album: data.metadata.album,
              cover: data.metadata.cover,
              releaseDate: data.metadata.releaseDate,
              download: data.link
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
  
  async auto(url) {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing input url");
        if(!/(www|http:|https:)+[^\s]+[\w]/.test(url)) return reject("invalid url input");
        this.metadata(url).then(async meta => {
          if(!meta.success) return reject(meta.errors);
          const tracks = await Promise.all(meta.result.tracks.map(async d => {
            const downloaded = await this.download(d.id);
            if(!downloaded.success) return;
            return downloaded.result;
          }))
          resolve({
            success: true,
            result: {
              ...meta.result,
              tracks: tracks.filter(d => typeof d === "object")
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
}

export default new Spotify();