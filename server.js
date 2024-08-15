const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { getBearer } = require('./getBearer');
const { getSession } = require('./getSession');
const { requestOtp } = require('./requestOtp');
const { submitProfile } = require('./signup');
const { getProxies } = require('./proxySetup');
const { submitOtp } = require('./submitOtp');
const { generateHeader } = require('./headerGen');
const { pullAccountList, pullProxyList } = require('./db');
const axios = require('axios');

const app = express();
const accountFilePath = path.join(__dirname, 'accounts.json');
const csvFilePath = path.join(__dirname, 'outputs', 'signed_up_emails.csv');

app.use(express.json());

const receivedCodes = [];

app.post('/fifa26', async (req, res) => {
    const { email, code } = req.body;

    const existingEntry = receivedCodes.find(entry => entry.email === email);

    if (existingEntry) {
        existingEntry.code = code;
    } else {
        receivedCodes.push({ email, code });
    }

    res.status(200).send('Received post');
});

app.get('/fifa26', async (req, res) => {
    signup();
    res.status(200).send('starting signup');
});

app.get('/accountList', async (req, res) => {
    try {
        const accountList = await pullAccountList();
        res.status(200).json(accountList);  // Send the accountList as a JSON response
    } catch (error) {
        res.status(500).send('Error fetching account list');
    }
});

app.get('/proxyList', async (req, res) => {
    try {
        const proxyList = await pullProxyList();
        res.status(200).json(proxyList);  // Send the accountList as a JSON response
    } catch (error) {
        res.status(500).send('Error fetching account list');
    }
});


async function writeEmailToCSV(email) {
    const csvContent = `${email}\n`;
    await fs.appendFile(csvFilePath, csvContent);
}

async function readExistingEmails() {
    try {
        const data = await fs.readFile(csvFilePath, 'utf8');
        return data.split('\n').filter(email => email);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function handleSignup(account, signedUpEmails, proxies) {
    const { name, email } = account;
    const [firstName, lastName] = name.split(' ');

    if (signedUpEmails.includes(email)) {
        return;
    }


    const { user, pwd, ip, port } = proxies[await getRandomNumber(0, proxies.length - 1)];
    const agent = await getProxies(email, user, pwd, ip, port);
    const userAgent = await generateHeader();

    try {
        const bearer = await getBearer(agent, userAgent);
        await new Promise(resolve => setTimeout(resolve, 100));

        const sessionResponse  = await getSession(bearer, agent, userAgent);

        const { sessionID, sessionToken } = sessionResponse || {};
        if (!sessionID || !sessionToken) {
            console.log(`No sessionID or sessionToken for ${email}`);
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 100));

        const otpStatus1 = await requestOtp(sessionID, sessionToken, email, agent, userAgent);

        if (otpStatus1 == "200") {
            let code;
            for (let i = 0; i < 10; i++) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const receivedCodeEntry = receivedCodes.find(entry => entry.email === email);
                if (receivedCodeEntry) {
                    code = receivedCodeEntry.code;
                    break;
                }
            }

            if (!code) {
                console.error(`Error: No code received for ${email}`);
                return;
            }


            const otpStatus2 = await submitOtp(sessionID, sessionToken, code, email, agent, userAgent);


            if (otpStatus2 == "200") {
                const day = await getRandomNumber(1, 30);
                const month = await getRandomNumber(1, 12);
                const year = await getRandomNumber(1980, 2000);

                const signupStatus = await submitProfile(sessionID, sessionToken, firstName, lastName, email, day, month, year, agent, userAgent);

                if (signupStatus == "200") {
                    console.log(`Signup complete for ${email}`);
                    signedUpEmails.push(email);
                    await writeEmailToCSV(email);
                } else {
                    handleSignup(account, signedUpEmails, proxies)
                }
            } else {
                console.error(`OTP submission failed for ${email} with status: ${otpStatus2}`);
            }
        } else {
            console.error(`OTP request failed for ${email} with status: ${otpStatus1}`);
        }
    } catch (error) {
        console.error(`Error processing account ${email}:`);
    }
}


async function signup() {
    const signedUpEmails = await readExistingEmails();
    try {
        const responseAccount = await axios.get('https://premium-pig-enough.ngrok-free.app/accountList');
        const accountList = responseAccount.data; // Assuming the response is the accountList
        const responseProxy = await axios.get('https://premium-pig-enough.ngrok-free.app/proxyList');
        const proxyList = responseProxy.data; // Assuming the response is the proxyList

        for (let i = 0; i < accountList.length; i += 50) { // Reduced batch size
            const batch = accountList.slice(i, i + 50);

            await Promise.all(batch.map(account => handleSignup(account, signedUpEmails, proxyList)));
        }

        console.log("Finished signups");
    } catch (error) {
        console.error('Error fetching account list server.js:', error);
    }
}

async function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/download-output', (req, res) => {
    const filePath = path.join(__dirname, 'outputs', 'signed_up_emails.csv');
    res.download(filePath, 'output.csv', (err) => {
        if (err) {
            console.error('Error sending the file:', err);
            res.status(500).send('Error downloading the file');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

