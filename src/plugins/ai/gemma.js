import axios from "axios";
import util from "util";

export default [{
  name: "gemma",
  code: async (messages) => {
    try {
      if (!messages.length) return { status: false, message: "Undefined reading messages" };
      const baseUrl = "https://api.acloudapp.com";
      const bearer = `Bearer sk-9jL26pavtzAHk9mdF0A5AeAfFcE1480b9b06737d9eC62c1e`;
      const response = await axios.post(baseUrl + "/v1/chat/completions", {
        model: "gemma-7b-it",
        messages
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": bearer
        }
      });
      const data = response.data;
      return { status: true, data };
    } catch (e) {
      return { status: false, message: util.format(e) };
    }
  }
}];