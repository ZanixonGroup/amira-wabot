import axios from "axios";

const ACCOUNT_ID = "";
const API_TOKEN = "";

async function flux(prompt) {
  try {
    const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`, {
      prompt
    }, {
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    
    if(!response.data?.success) throw new Error(response.data?.result.errors);
    const image = Buffer.from(response.data?.result.image, "base64");
    return {
      success: true,
      image
    }
  } catch (e) {
    return {
      success: false,
      errors: e
    }
  }
}

export default flux;
