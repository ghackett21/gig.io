/**
 * Send Notification to User
 * Params <Email to send to, Message to Send, Subject>
 */

module.exports = function(req.res) {

	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gigdotio@gmail.com',
            pass: 'geofffff'
        }
    });

	var mailOptions = {
		from: 'gigdotio@gmail.com', // sender address
		to: req.email, 					// list of receivers
		subject: req.subject, 
		text: req.msg
	};

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
		    return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});

	
}

