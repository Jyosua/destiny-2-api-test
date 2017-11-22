const express = require('express');
const request = require('request-promise');
const app = express();
const fs = require('fs');
var http = require('http');
var https = require('https');

const apiKey = <API_KEY>;

// OAuth2 Config
const oauth2 = require('simple-oauth2').create({
  client: {
    id: <CLIENT_ID>,
    secret: <CLIENT_SECRET>,
  },
  auth: {
    tokenHost: 'https://www.bungie.net',
    tokenPath: '/platform/app/oauth/token/',
    authorizePath: '/en/oauth/authorize',
  },
});

const authorizationUri = oauth2.authorizationCode.authorizeURL({
  /*redirect_uri: 'https://localhost:3001/callback',*/
  state: '3(#5/!~',
});

// Endpoint for login
app.get('/auth', (req, res) => {
  console.log(authorizationUri);
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', (req, res) => {
  const code = req.query.code;
  const options = {
    code,
  };

  console.log('callback reached');
  oauth2.authorizationCode.getToken(options, (error, result) => {
    if (error) {
      console.error('Access Token Error', error.message);
      return res.json('Authentication failed');
    }

    console.log('The resulting token: ', result);
    const token = oauth2.accessToken.create(result);

    return res
      .status(200)
      .json(token);
  });
});

app.get('/success', (req, res) => {
  res.send('it worked?');
});

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
};

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

var port = process.env.PORT || 3000;

http.createServer(app).listen(port);
https.createServer(options, app).listen(3001);

/*app.listen(port, function() {
    console.log('listening on port ' + port)
});*/

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/duplicates', asyncMiddleware(async (req, res) => {
    var destinyApiHeader = { 'x-api-key': apiKey };
    var destinyAPIUrl = "http://www.bungie.net/Platform/Destiny2/4/Account/4611686018467492848/Stats/";

    let destinyOptions = { url: destinyAPIUrl, headers: destinyApiHeader };
    let body = await request.get(destinyOptions);
    let destinyJson = JSON.parse(body);

    res.json(destinyJson);
}));