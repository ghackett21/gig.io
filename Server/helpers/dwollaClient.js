var dwolla = require('dwolla-v2');

/* Dwolla keys */
var appKey = "b36FS5lRd58OASDZ6E9eMH9Cej5SgC63THvHDkgVVDC4czmBDG";
var secretKey = "8gu99HObZ61VZt8Mz7CGEQyK42BcedKDsjO5I7Y0D493uSPfTf";

/* Dwolla client */
var client = new dwolla.Client({
    key: appKey,
    secret: secretKey,
    environment: 'sandbox'
});

/* Dwolla access token */
// TODO - this expires after 60 minutes
var appToken = new client.Token({
    access_token: 'bjurpNytS0V8dRushU7OewUZdvnU6Tklut9q3K9eHizXUZZdm2',
    refresh_token: ""
});

module.exports = appToken;
        