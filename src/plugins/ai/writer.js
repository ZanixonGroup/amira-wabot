import ChatLLM from "./../../libs/scrapers/ChatLLM.js";

export default [{
  name: "writer",
  code: async(prompt) => {
    try {
    if(!prompt) return { status: false, message: "undefined reading prompt" };
    return await new Promise((resolve, reject) => {
      ChatLLM.completions({
        messages: [
          {
            role: "system",
            content: "kamu saat ini adalah model asisten multi bahasa, ikuti bahasa yang sama dengan input text, tugas kamu adalah melakukan improvisasi pada input text yang diberikan, berikan jawaban langsung pada poin konten nya, berfikirlah sesuai konteks input text yang diberikan, berikan jawaban konten nya saja dan tidak perlu menambahkan penjelasan atau panduan lainnya."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4096,
        temperature: 0.3,
        top_p: 0.7,
        top_k: 30
      }).then(res => {
        if(!res.success) return reject("failed get response from chatgpt");
        resolve({ status: true, content: res.result.answer });
      }).catch(reject)
    })
  } catch(e) {
    return { status: false, message: e };
  }
  }
}]