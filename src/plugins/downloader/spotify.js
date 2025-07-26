import spotify from "./../../libs/scrapers/spotify.js";
import axios from "axios";

async function getToken() {
  try {
    let clientId = 'b03f39bd2d974942bace4b3ea2bbfe2d';
    let clientSecret = '1402e726024b4bd38c87a5f779d62aa0';
    return await new Promise(async(resolve, reject) => {
      axios.post(`https://accounts.spotify.com/api/token`, null, {
        params: {
          grant_type: 'client_credentials'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        }
      }).then(res => {
        const data = res.data;
        resolve({
          status: true,
          data
        })
      })
    })
  } catch (e) {
    return { status: false, message: e };
  }
}

export default [{
  name: "spotiMeta",
  code: async (url, type) => {
  try {
    return await new Promise(async(resolve, reject) => {
      spotify.metadata(url).then(async data => {
        if(!data.success) return reject(data.errors);
        return resolve({
          status: true,
          result: data.result
        })
      }).catch(err => reject(err))
    })
  } catch (e) {
    return { status: false, message: e };
  }
}
}, {
  name: "spotiDown",
  code: async(trackId) => {
    try {
      return await new Promise(async(resolve, reject) => {
        spotify.download(trackId).then(async data => {
          if(!data.success) reject(data.errors);
          resolve({
            status: true,
            result: data.result
          })
        }).catch(reject);
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}, {
  name: "spotiSearch",
  code: async(query) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!query) reject("undefined reading query");
        const token = (await getToken())?.data?.access_token;
        axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=50&offset=0&include_external=audio`, {
          headers: {
            'authority': 'api.spotify.com',
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'authorization': 'Bearer ' + token,
            'origin': 'https://developer.spotify.com/',
            'referer': 'https://developer.spotify.com/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
          }
        }).then(res => {
          const data = res.data;
          if(!data.tracks.items) reject("content not found");
          const tracks = data.tracks.items.map(d => {
            return {
              type: d.type,
              url: d.external_urls.spotify,
              details: {
                id: d.id,
                name: d.name,
                uri: d.uri,
                artists: d.artists.map(d => {return {name: d.name, profile: d.external_urls.spotify}}),
                thumbnail: d.album.images[0].url
              }
            }
          })
          resolve({
            status: true,
            tracks
          })
        }).catch(reject);
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]