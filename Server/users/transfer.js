var appToken = require('./../helpers/dwollaClient');

module.exports = function(req, res) {
    console.log("transfer");

    var callback = function(result) {
        if (result < 0) {
            res.json({"Response": "transfer failed"});
        } else {
            res.json({"Response": "transfer successful"}); 
        }
    }

    if (req.body.dest == undefined || req.body.amount == undefined
            || req.body.src == undefined) {
        console.log("tranfser: undefined args");
        callback(-1);
    } else {
        transfer(req.body, callback);
    }
}

function transfer(info, callback) {

    console.log(info.dest);
    console.log(info.amount);
    console.log(info.src);

    var destLink = "https://api-sandbox.dwolla.com/funding-sources/" + info.dest;
    var srcLink = "https://api-sandbox.dwolla.com/funding-sources/" + info.src;
    var requestBody = {
        _links: {
            source: {
                href: srcLink
            },
            destination: {
                href: destLink
            }
        },
        amount: {
            currency: 'USD',
            value: info.amount
        }
    };
    
    appToken.post('transfers', requestBody).then(res => res.headers.get('location'));

    return callback(0);
}
