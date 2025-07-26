import axios from "axios";

async function html2text(url) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!url) return reject("invalid url");
      axios.get(`https://www.w3.org/services/html2txt?url=${url}&nonums=on`).then(res => {
       let data = res.data;
        if(!data) return reject("failed converting webpage");
        data = data
        resolve({
          status: true,
          data
        })
      }).catch(reject)
    })
  } catch (e) {
    return { status: false, message: e }
  }
}

async function page2text(url) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!url) return reject("invalid url");
      axios.post(`https://thetextconverter.com/convert-webpage-to-text-process.php`,
      `url=${url}`).then(res => {
       let data = res.data;
        if(!data) return reject("failed converting webpage");
        data = data.replace(/<(.|\n)*?>/gm, "")
        resolve({
          status: true,
          data
        })
      }).catch(reject)
    })
  } catch (e) {
    return { status: false, message: e }
  }
}

export default [{
  name: "halodocSearch",
  code: async(query) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!query) return reject("can't reading query!");
        const parsedHtml = await html2text(`https://www.halodoc.com/artikel/search/${encodeURIComponent(query)}`);
        if(!parsedHtml.status) return reject("failed at parsing webpage!");
        const textRaw = parsedHtml.data.replace(/^[\s\S]*?(?=Filter menurut)/, "");
        const urlMatch = [...textRaw.matchAll(/https:\/\/www\.halodoc\.com\/artikel\/[^\s]+/gm)].map(d => d[0]).filter(d => d.length > 45).filter(d => !/\/search\//.test(d))
        const titleMatch = urlMatch.map(d => d.replace(/https:\/\/www\.halodoc\.com\/artikel\//, "").replaceAll("-", " "))
        const final = urlMatch.map((url, index) => ({
          title: titleMatch[index],
          url
        }))
        resolve({
          status: true,
          data: final
        })
      })
    } catch (e) {
      return { status: false, message: e }
    }
  }
},{
  name: "halodocGetArticle",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("invalid url!");
        if(!url.startsWith("https://www.halodoc.com/artikel")) return reject("invalid article url!");
        const parsedHtml = await page2text(url);
        if(!parsedHtml.status) return reject("failed at parsing webpage!");
        resolve({
          status: true,
          data: parsedHtml.data
        })
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]