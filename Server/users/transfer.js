var appToken = require('./../helpers/dwollaClient');
var connection = require('./../helpers/connection');

module.exports = function(req, res) {
    console.log("transfer");

    var callback = function(result) {
        if (result < 0) {
            res.json({"Response": "transfer failed"});
        } else {
            res.json({"Response": "transfer successful"}); 
        }
    }

    console.log("transfer postId: " + req.body.postId);

    /*
    if (req.body.dest == undefined || req.body.amount == undefined
            || req.body.src == undefined) {
        console.log("tranfser: undefined args");
        callback(-1);
    } else {
        transfer(req.body, callback);
    }
    */

    transfer(req.body, callback);
}

function transfer(info, callback) {

    /* Make sure the post PayState is 0 */
    var selectPayState = 'SELECT PayState FROM POSTING WHERER Pid=' + info.postId;

    connection.query(selectPayState, function(err, rows) {
        if (err) {
            console.log("Transfer: error getting PayState: " + err);
            return callback(-2);
        }
        else if (rows[0].PayState > 0) {
            console.log("Payment already completed for this post.");
            return callback(-3);
        }
        else {
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

            /* udpate payState of post */

            var updatePayState = "UPDATE Posting SET PayState=1 WHERE Pid=" + info.postId;

            connection.query(updatePayState, function(err, rows) {
                if (err) {
                    console.log("Transfer: error updating pay state: " + err);
                    return callback(-2);
                }
                else {
                    console.log("Transfer successful");
                    return callback(0);
                }
            });
        }
    });
}
