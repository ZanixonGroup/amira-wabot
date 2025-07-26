export default [{
  name: "halodoc_search_article",
  description: `digunakan untuk mencari data tentang gejala atau penyakit yang ditanyakan oleh pengguna, hasil akan menampilkan beberapa informasi artikel yang kemungkinan serupa dengan yang dijelaskan pengguna. tampilkan hasil menjadi list dengan format "*1. {title}* - {url}\n\n"`,
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description: "query pencarian artikel halodoc"
      }
    },
    required: ["query"]
  },
  gemini: async({ plugins, params }) => {
    try {
      return await new Promise(async(resolve, reject) => {
        const halodoc = await plugins.halodocSearch(params.query);
        if(!halodoc.status) return reject("failed get result!")
        resolve(halodoc)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  },
  code: async({ client, remote, m, amira, logs, alertMessage }) => {
    try {
      m.reply(amira.answer)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
},{
  name: "halodoc_get_article",
  description: `digunakan untuk mendapatkan metadata halaman artikel halodoc, olah informasi bagian yang penting dan perlu saja.. lalu tampilkan informasi tersebut dengan penyampaian yang informatif.`,
  parameters: {
    type: "OBJECT",
    properties: {
      url: {
        type: "STRING",
        description: "url halaman artikel halodoc"
      }
    },
    required: ["url"]
  },
  gemini: async({ plugins, params }) => {
    try {
      return await new Promise(async(resolve, reject) => {
        const halodoc = await plugins.halodocGetArticle(params.url);
        if(!halodoc.status) return reject(halodoc.message)
        resolve(halodoc)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  },
  code: async({ client, remote, m, amira, logs, alertMessage }) => {
    try {
      m.reply(amira.answer)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]