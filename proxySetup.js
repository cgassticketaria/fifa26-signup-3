const { HttpsProxyAgent } = require('https-proxy-agent');
const { getAccountByEmail } = require('./routines');

async function getProxies(email, user, pwd, ip, port) {
    try {
        // Call the function to retrieve data using the provided email
        //const accountData = await getAccountByEmail(email);

        // Extracting proxy information
        // const proxyInfo = {
        //     ip: accountData.proxy.ip,
        //     port: accountData.proxy.port,
        //     user: accountData.proxy.user,
        //     pwd: accountData.proxy.pwd
        // };

        // Constructing proxy link
        // const proxyLink = `http://${proxyInfo.user}:${proxyInfo.pwd}@${proxyInfo.ip}:${proxyInfo.port}`;
        const proxyLink = `http://${user}:${pwd}@${ip}:${port}`;

        const agent = new HttpsProxyAgent(proxyLink); 

        return agent;
    } catch (error) {
        console.log("proxy error for: ", email)
        return undefined;
        // throw new Error('Error fetching proxies: ' + error.message);
        // console.log(email)
        // return undefined;
    }
}

module.exports = { getProxies };