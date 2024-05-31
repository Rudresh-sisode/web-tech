// Node.js + Express server
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3001;

app.get('/fetch-image', async (req, res) => {
  const token = ""; // your token here
  const inputTxt = req.query.input; // assuming input is passed as a query parameter

  const response = await fetch('url', {
    headers: { Authorization: `Bearer ${token}` },
    method: 'post',
    body: JSON.stringify({ "input": inputTxt })
  });

  const result = await response.blob();
  res.send(result);
});