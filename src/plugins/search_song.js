import axios from "axios"

export default [{
  name: "searchSong",
  code: async function(query) {
    try {
    if(!query) return { status: false, message: "undefined reading query" };
    return await new Promise(async(resolve, reject) => {
      axios.get(`https://songsear.ch/api/search?q=` + query).then(res => {
        const data = res.data;
        if(!data.results) reject("failed fetch data");
        const result = data.results.map(d => {
          return {
            name: d.name,
            artist: {
              name: d.artist.name,
              image: d?.image?.url
            },
            score: d.score
          }
        })
        resolve({
          status: true,
          result
        })
      })
    })
  } catch (e) {
    return { status: false, message: e }
  }
  }
}]