export default [{
  name: "google_search",
  description: `digunakan untuk mencari informasi secara real time dari internet melalui google search, buat rangkuman dari hasil data pencarian lalu buat data url dan judul yang kamu dapat menjadi list!`,
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description: "query pencarian google"
      }
    },
    required: ["query"]
  },
  gemini: async({ plugins, params }) => {
    try {
      const res = await plugins.googleSearch(params.query)
      const search = res.data.map(d => ({
          title: d.title,
          description: d.description,
          source_url: d.url
      }));
      let sourceList = "\n\n";
      let count = 1;
      res.data.map(d => {
        sourceList += `${count}. ${d.title} - ${d.url}\n`;
        count++
      })
      return { search, sourceList }
    } catch (e) {
      return { status: false, message: e };
    }
  },
  code: async({ client, remote, m, amira, logs, alertMessage }) => {
    try {
      if(amira.answer?.length <= 0) return;
      m.reply(amira.answer)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]