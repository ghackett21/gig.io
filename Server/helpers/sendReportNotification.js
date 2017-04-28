var nodemailer = require('nodemailer');
/**
 * Send Notification to User
 * Params <Email to send to, Message to Send, Subject>
 */

module.exports = function(reportee, type, callback) {
	//post title and winning bid
	//posters username
	var msg, email;
	msg = "Hello, " + reportee.Username +", We are contacting you to let you know that a report was recently filed against you.\nThe given reason was : " + type + ".\nThe case will be reviewed shortly.\nBest\n- Gig.io Team\n";
	email = reportee.EmailAddress;

	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gigdotio@gmail.com',
            pass: 'geofffff'
        }
    });

	console.log(msg);
	var mailOptions = {
		from: 'gigdotio@gmail.com', // sender address
		to: email, 					// list of receivers
		subject: "Gig.io Report Notification", 
		text: msg
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
		    return console.log(error);
		}
		console.log('Message sent: ' + info.response);
		return callback(0);
	});

	
}
