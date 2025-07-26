export default [{
  name: "my_anime_list_search",
  description: "digunakan untuk mencari informasi anime, manga, people, clubs dan characters pada situs my anime list.",
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description: "query pencarian my anime list"
      },
      type: {
        type: "STRING",
        description: "tipe informasi yang ingin dicari, contohnya: anime, manga, people, characters, clubs"
      },
      limit: {
        type: "INTEGER",
        description: "limit jumlah data yang akan ditampilkan"
      }
    },
    required: ["query", "type"]
  },
  gemini: async({ plugins, params }) => {
    try {
      return await new Promise(async(resolve, reject) => {
        plugins.malSearch(params)
          .then(resolve)
          .catch(e => reject(e.message));
      })
    } catch (e) {
      return { status: false, message: e };
    }
  },
  code: async({ client, remote, m, amira, logs, alertMessage }) => {
    try {
      m.reply(amira.answer);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]