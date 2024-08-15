const axios = require("axios");

async function getBearer(agent, userAgent) {
    const options = {
        method: 'GET',
        url: 'https://auth.fifa.com/as/authorize',
        params: {
            response_type: 'code',
            response_mode: 'form_post',
            client_id: '51dcafd9-c39a-43d9-8e91-fafac25c436f',
            scope: 'openid',
            lang: 'en',
            redirect_uri: 'https://www.fifa.com',
            campaign: 'Fifacom-Web-ROIFWC2026ROI'
        },
        headers: {
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            priority: 'u=0, i',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': userAgent
        },
        httpsAgent: agent
    };

    try {
        const response = await axios.request(options);
        const bearerToken = await extractAccessToken(response.data);
        return bearerToken;
    } catch (error) {
        return
    }
}

async function extractAccessToken(htmlString) {
    const accessTokenPattern = /"accessToken":"(.*?)","companyId":/;
    const match = htmlString.match(accessTokenPattern);
    
    if (match && match[1]) {
        return match[1];
    } else {
        return null; // or handle the case where the accessToken is not found
    }
}

module.exports = { getBearer };