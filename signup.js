const axios = require("axios");

async function submitProfile(interactionid, interactiontoken, firstname, lastname, email, day, month, year, agent, userAgent) {
    const options = {
      method: 'POST',
      url: 'https://auth.fifa.com/davinci/connections/867ed4363b2bc21c860085ad2baa817d/capabilities/customHTMLTemplate',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        interactionid: interactionid,
        interactiontoken: interactiontoken,
        origin: 'https://auth.fifa.com',
        'origin-cookies': '%7B%7D',
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
        id: 'x6y3519xfp',
        nextEvent: {
          constructType: 'skEvent',
          eventName: 'continue',
          params: [],
          eventType: 'post',
          postProcess: {}
        },
        parameters: {
          buttonType: 'form-submit',
          buttonValue: 'frmProfile',
          firstname: firstname,
          lastname: lastname,
          email: email,
          country: 'USA',
          phone: '',
          zip: '',
          gender: 'male',
          day: `${day}`,
          month: `${month}`,
          year: `${year}`,
          DOB: `${await dob(day, month, year)}`,
          preferredLanguage: 'en-GB',
          affiliation: '',
          corp_company: '',
          corp_groupsize: '1',
          corp_budgetrange: '',
          corp_accneeded: '',
          c_search: '',
          corp_suppcountry: '',
          fan_groupsize: '1',
          fan_budgetrange: '',
          fan_accneeded: '',
          f_search: '',
          fan_suppcountry: '',
          other_details: '',
          ROIHFWC26: '{"affiliation":"","corp_company":"","corp_groupsize":"1","corp_budgetrange":"","corp_prefhl_1":"","corp_prefhl_2":"","corp_prefhl_3":"","corp_prefhl_4":"","corp_prefhl_5":"","corp_accneeded":"","corp_suppcountry":"","fan_groupsize":"1","fan_budgetrange":"","fan_prefhl_1":"","fan_prefhl_2":"","fan_prefhl_3":"","fan_prefhl_4":"","fan_prefhl_5":"","fan_accneeded":"","fan_suppcountry":"","other_details":"","form_language":"en"}',
          ROIcheckbox: true,
          TandC: true
        },
        eventName: 'continue'
      },
      httpsAgent: agent,
    };
  
    try {
      const response = await axios.request(options);
      return response.status;
    } catch (error) {
      console.log("Failed signup, will retry for: ", email)
      return 400;
    }
}

async function dob(d, m, y) {
    const day = d < 10 ? `0${d}` : d;
    const month = m < 10 ? `0${m}` : m;

    return (`${y}-${month}-${day}`);
}

module.exports = { submitProfile };