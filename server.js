const express = require('express');
const request = require('request-promise');
const app = express();

const apiKey = <INSERT_API_KEY_HERE>;

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
};


var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('listening on port ' + port)
});

app.get('/', (req, res) => {
    response.sendFile(__dirname + '/index.html');
});

app.get('/duplicates', asyncMiddleware(async (req, res) => {
    var destinyApiHeader = { 'x-api-key': apiKey };
    var destinyAPIUrl = "http://www.bungie.net/Platform/Destiny2/4/Account/4611686018467492848/Stats/";

    let destinyOptions = { url: destinyAPIUrl, headers: destinyApiHeader };
    let body = await request.get(destinyOptions);
    let destinyJson = JSON.parse(body);

    res.json(destinyJson);
}));