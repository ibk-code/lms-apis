const axios = require('axios');

const url =
  process.env.NODE_ENV === 'development'
    ? process.env.vtpass_testurl
    : process.env.vtpass_liveurl;

const token = Buffer.from(
  'aidigbe@econnectnp.com:econnectNPLTD2020',
  'utf8'
).toString('base64');
const request = axios.create({
  baseURL: 'https://sandbox.vtpass.com/api',
  //   timeout: 1000,
  headers: {
    Authorization: `Basic ${token}`,
  },
});

module.exports = request;
