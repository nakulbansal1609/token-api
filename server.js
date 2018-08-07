const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
  const fs = require('fs');

const port = process.env.PORT || 8080;
const app = express();

var fetchToken = () => {
  try {
    var stringToken = fs.readFileSync('tokenNumber.json');
    return JSON.parse(stringToken);
  }
  catch (e) {
    console.log("File open error");
    return [];
  }
}

var saveToken = (tokenValue) => {
  token = {currentToken: tokenValue};
  fs.writeFileSync('tokenNumber.json', JSON.stringify(token))
};
var tokenValue = 0;
var token = fetchToken();
if (token.currentToken) {
  tokenValue = parseInt(token.currentToken);
}

//app.use((req, res, next) => {
//  var now = new Date().toString();
//  var logs = `${now}: ${req.method}: ${req.url}`;
//  console.log(logs);
//  next();
//});

app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send({hi: 'there'});
});

app.get('/api/getCurrentToken', (req, res, next) => {
  res.status(200).send({currentToken: tokenValue});
});

app.get('/api/nextToken', (req, res) => {
  tokenValue++;
  saveToken(tokenValue);
  res.status(200).send({newToken: tokenValue});
});

app.get('/api/prevToken', (req, res) => {
  if (tokenValue > 1) {
    tokenValue--;
    saveToken(tokenValue);
  }
  res.status(200).send({newToken: tokenValue});
});

app.get('/api/resetToken', (req, res) => {
  tokenValue = 0;
  saveToken(tokenValue);
  res.status(200).send({newToken: tokenValue});
});



app.listen(port, () => {
  console.log(`The server is running on port ${port}`)
});
