const axios = require('axios');
require('dotenv').config();

const getAccountByEmail = async (email) => {
  try {
    const response = await axios.get(`https://messi.plessinc.com/api/info/${email}`, {
      headers: {
        "x-api-key": process.env.MESSI_API_KEY,
      },
    });

    if (response.status !== 200) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching account:", error);
    return null;
  }
};

module.exports = { getAccountByEmail };
