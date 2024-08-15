const axios = require('axios');

async function getSession(bearerToken, agent, userAgent) {
  const options = {
    method: 'POST',
    url: 'https://auth.fifa.com/davinci/policy/025406bd7e3293fa700abaab6d8224e5/start',
    headers: {
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      authorization: `Bearer ${bearerToken}`, // Use the Bearer token here
      'cache-control': 'no-cache',
      'content-length': '0',
      'content-type': 'application/json',
      origin: 'https://auth.fifa.com',
      'origin-cookies': '{}',
      pragma: 'no-cache',
      priority: 'u=1, i',
      referer: 'https://auth.fifa.com/as/authorize?response_type=code&response_mode=form_post&client_id=51dcafd9-c39a-43d9-8e91-fafac25c436f&scope=openid&lang=en&redirect_uri=https%3A%2F%2Fwww.fifa.com&campaign=Fifacom-Web-ROIFWC2026ROI',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent': userAgent
    },
    httpsAgent: agent
  };

  try {
    const response = await axios.request(options);
    const sessionID = response.data.interactionId
    const sessionToken = response.data.interactionToken

    return { sessionID, sessionToken };
  } catch (error) {
    return null
  }
}


module.exports = { getSession };