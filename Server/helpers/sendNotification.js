var nodemailer = require('nodemailer');
var deletePostHelper = require('./../posts/deletePostHelper');
/**
 * Send Notification to User
 * Params <Email to send to, Message to Send, Subject>
 */

module.exports = function(req, poster, state, callback) {
	var emails = [];
	var msg;
	if(req[0] == undefined){
		console.log("undef");
		return 1;
	}
	if(req[0].NumberOfBids == 0){
		console.log("no bids");
		deletePostHelper(req[0].Pid, callback);
		return 1;
	}else{
		if(state == 0){
			msg = "Hello, " + req[0].Username +", We are contacting you to let you know the auction for the Post: " + req[0].P_Title + ", just ended and unfortunately you did not win.\n\n Better luck next time!\n - Gig.io Team\n";
		}else if(state == 1){
			msg = "Congratulations, "+ req[0].Username +", you won an auction!\n\nPost title: " + req[0].P_Title + ".\nFor the amount of : $" + req[0].Amount + "\nYou can contact the poster, " + poster[0].Username + ", to decide on a time at: " + poster[0].EmailAddress + "\n\nWe thank you for your support of our service,\nGig.io Team\n";
		}
	}

	for(var i = 0; i < req.length; i++){
		emails.push(req[i].EmailAddress);
	}
	

	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gigdotio@gmail.com',
            pass: 'geofffff'
        }
    });

	var mailOptions = {
		from: 'gigdotio@gmail.com', // sender address
		to: emails, 					// list of receivers
		subject: "Gig.io Bid Notification", 
		text: msg
	};
	if(emails.length > 0){
		transporter.sendMail(mailOptions, function(error, info){
			if(error){
				return console.log(error);
			}
			console.log('Message sent: ' + info.response);
		});
	}


	
}

