const axios = require("axios");

async function requestOtp(interactionId, interactionToken, email, agent, userAgent) {

    try {
      const options = {
        method: 'POST',
        url: 'https://auth.fifa.com/davinci/connections/867ed4363b2bc21c860085ad2baa817d/capabilities/customHTMLTemplate',
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          interactionid: interactionId,
          interactiontoken: interactionToken,
          origin: 'https://auth.fifa.com',
          'origin-cookies': '%7B%7D',
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
        data: {
          id: 'cmfjs4dd1s',
          nextEvent: {
            constructType: 'skEvent',
            eventName: 'continue',
            params: [],
            eventType: 'post',
            postProcess: {}
          },
          parameters: {
            buttonType: 'form-submit',
            buttonValue: 'frmSendOTP',
            email: email
          },
          eventName: 'continue'
        },
        httpsAgent: agent
      };
  
      const response = await axios.request(options);
      return response.status;
    } catch (error) {
      console.error(error);
      throw error; // Optionally rethrow the error if needed
    }

}

module.exports = { requestOtp };